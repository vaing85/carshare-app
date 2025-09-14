import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getPaymentStatus } from '@/lib/rapyd'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const paymentId = searchParams.get('paymentId')

    if (!paymentId) {
      return NextResponse.json(
        { success: false, error: 'Payment ID is required' },
        { status: 400 }
      )
    }

    // Get payment status from Rapyd
    const payment = await getPaymentStatus(paymentId)

    // Update booking status in database
    const booking = await prisma.booking.findFirst({
      where: { 
        paymentId,
        userId: session.user.email
      }
    })

    if (booking) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          status: payment.status === 'CLO' ? 'CONFIRMED' : 
                 payment.status === 'CAN' ? 'CANCELLED' : 'PENDING',
          paymentStatus: payment.status
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        paymentId: payment.id,
        status: payment.status,
        amount: payment.amount / 100, // Convert back from cents
        currency: payment.currency,
        failureReason: payment.failure_reason
      }
    })
  } catch (error) {
    console.error('Error fetching payment status:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch payment status' 
      },
      { status: 500 }
    )
  }
}
