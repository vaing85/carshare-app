import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/rapyd'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('rapyd-signature')
    const salt = request.headers.get('rapyd-salt')
    const timestamp = request.headers.get('rapyd-timestamp')

    if (!signature || !salt || !timestamp) {
      return NextResponse.json(
        { success: false, error: 'Missing required headers' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    const isValid = verifyWebhookSignature(signature, salt, timestamp, body)
    
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const event = JSON.parse(body)
    const { type, data } = event

    console.log('Rapyd webhook received:', type, data)

    // Handle different webhook events
    switch (type) {
      case 'PAYMENT_COMPLETED':
        await handlePaymentCompleted(data)
        break
      case 'PAYMENT_FAILED':
        await handlePaymentFailed(data)
        break
      case 'PAYMENT_CANCELLED':
        await handlePaymentCancelled(data)
        break
      case 'PAYMENT_REFUNDED':
        await handlePaymentRefunded(data)
        break
      default:
        console.log('Unhandled webhook event:', type)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentCompleted(data: any) {
  try {
    const { id: paymentId, status } = data
    
    // Update booking status
    await prisma.booking.updateMany({
      where: { paymentId },
      data: {
        status: 'CONFIRMED',
        paymentStatus: status
      }
    })

    console.log('Payment completed:', paymentId)
  } catch (error) {
    console.error('Error handling payment completed:', error)
  }
}

async function handlePaymentFailed(data: any) {
  try {
    const { id: paymentId, status, failure_reason } = data
    
    // Update booking status
    await prisma.booking.updateMany({
      where: { paymentId },
      data: {
        status: 'CANCELLED',
        paymentStatus: status,
        notes: `Payment failed: ${failure_reason || 'Unknown reason'}`
      }
    })

    console.log('Payment failed:', paymentId, failure_reason)
  } catch (error) {
    console.error('Error handling payment failed:', error)
  }
}

async function handlePaymentCancelled(data: any) {
  try {
    const { id: paymentId, status } = data
    
    // Update booking status
    await prisma.booking.updateMany({
      where: { paymentId },
      data: {
        status: 'CANCELLED',
        paymentStatus: status
      }
    })

    console.log('Payment cancelled:', paymentId)
  } catch (error) {
    console.error('Error handling payment cancelled:', error)
  }
}

async function handlePaymentRefunded(data: any) {
  try {
    const { id: paymentId, status } = data
    
    // Update booking status
    await prisma.booking.updateMany({
      where: { paymentId },
      data: {
        status: 'REFUNDED',
        paymentStatus: status
      }
    })

    console.log('Payment refunded:', paymentId)
  } catch (error) {
    console.error('Error handling payment refunded:', error)
  }
}
