import { NextRequest, NextResponse } from 'next/server'
import { getPaymentMethods } from '@/lib/rapyd'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const countryCode = searchParams.get('country') || 'US'
    
    const paymentMethods = await getPaymentMethods(countryCode)
    
    return NextResponse.json({
      success: true,
      data: paymentMethods
    })
  } catch (error) {
    console.error('Error fetching payment methods:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch payment methods' 
      },
      { status: 500 }
    )
  }
}
