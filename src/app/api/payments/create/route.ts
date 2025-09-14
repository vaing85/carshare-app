import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createPayment, createCustomer } from '@/lib/rapyd'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { 
      carId, 
      startDate, 
      endDate, 
      totalAmount, 
      currency = 'USD',
      paymentMethod,
      notes = ''
    } = body

    // Validate required fields
    if (!carId || !startDate || !endDate || !totalAmount || !paymentMethod) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get car details
    const car = await prisma.car.findUnique({
      where: { id: carId },
      include: { host: true }
    })

    if (!car) {
      return NextResponse.json(
        { success: false, error: 'Car not found' },
        { status: 404 }
      )
    }

    // Create or get customer
    let customer
    try {
      // Try to find existing customer
      const existingCustomer = await prisma.user.findUnique({
        where: { email: session.user.email }
      })

      if (existingCustomer?.rapydCustomerId) {
        customer = { id: existingCustomer.rapydCustomerId }
      } else {
        // Create new customer in Rapyd
        const customerData = {
          name: session.user.name || session.user.email,
          email: session.user.email,
          metadata: {
            userId: existingCustomer?.id,
            userType: existingCustomer?.isHost ? 'host' : 'renter'
          }
        }
        
        const rapydCustomer = await createCustomer(customerData)
        customer = { id: rapydCustomer.id }

        // Update user with Rapyd customer ID
        if (existingCustomer) {
          await prisma.user.update({
            where: { id: existingCustomer.id },
            data: { rapydCustomerId: rapydCustomer.id }
          })
        }
      }
    } catch (error) {
      console.error('Error creating customer:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create customer' },
        { status: 500 }
      )
    }

    // Create payment in Rapyd
    const paymentData = {
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: currency.toUpperCase(),
      payment_method: paymentMethod,
      customer: customer.id,
      description: `Car rental: ${car.make} ${car.model} (${startDate} to ${endDate})`,
      metadata: {
        carId,
        startDate,
        endDate,
        userId: session.user.email,
        hostId: car.hostId,
        bookingType: 'car_rental'
      }
    }

    const payment = await createPayment(paymentData)

    // Create booking record in database
    const booking = await prisma.booking.create({
      data: {
        carId,
        userId: session.user.email,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalPrice: totalAmount,
        totalAmount,
        status: 'PENDING',
        paymentId: payment.id,
        paymentStatus: payment.status,
        notes
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        paymentId: payment.id,
        status: payment.status,
        redirectUrl: payment.redirect_url,
        bookingId: booking.id
      }
    })
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create payment' 
      },
      { status: 500 }
    )
  }
}
