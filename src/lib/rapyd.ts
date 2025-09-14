import crypto from 'crypto-js'

// Rapyd API Configuration
const RAPYD_ACCESS_KEY = process.env.RAPYD_ACCESS_KEY || ''
const RAPYD_SECRET_KEY = process.env.RAPYD_SECRET_KEY || ''
const RAPYD_BASE_URL = process.env.RAPYD_BASE_URL || 'https://sandboxapi.rapyd.net'

export interface RapydPaymentMethod {
  id: string
  type: string
  name: string
  image: string
  category: string
  supported_currencies: string[]
  is_online: boolean
}

export interface RapydPaymentRequest {
  amount: number
  currency: string
  payment_method: string
  customer: string
  description: string
  metadata?: Record<string, any>
}

export interface RapydPaymentResponse {
  id: string
  status: string
  amount: number
  currency: string
  payment_method: string
  redirect_url?: string
  failure_reason?: string
}

// Generate Rapyd signature for API requests
export function generateRapydSignature(
  method: string,
  url: string,
  salt: string,
  timestamp: string,
  body: string = ''
): string {
  const toSign = method.toLowerCase() + url + salt + timestamp + RAPYD_ACCESS_KEY + RAPYD_SECRET_KEY + body
  return crypto.HmacSHA256(toSign, RAPYD_SECRET_KEY).toString()
}

// Generate salt for requests
export function generateSalt(): string {
  return crypto.lib.WordArray.random(12).toString()
}

// Get timestamp
export function getTimestamp(): string {
  return Math.floor(Date.now() / 1000).toString()
}

// Make authenticated request to Rapyd API
export async function makeRapydRequest(
  method: string,
  endpoint: string,
  body: any = null
): Promise<any> {
  const salt = generateSalt()
  const timestamp = getTimestamp()
  const url = `${RAPYD_BASE_URL}${endpoint}`
  const bodyString = body ? JSON.stringify(body) : ''
  
  const signature = generateRapydSignature(method, endpoint, salt, timestamp, bodyString)
  
  const headers = {
    'Content-Type': 'application/json',
    'access_key': RAPYD_ACCESS_KEY,
    'salt': salt,
    'timestamp': timestamp,
    'signature': signature,
  }

  const response = await fetch(url, {
    method,
    headers,
    body: bodyString || undefined,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Rapyd API Error: ${error.status?.message || 'Unknown error'}`)
  }

  return response.json()
}

// Get available payment methods
export async function getPaymentMethods(countryCode: string = 'US'): Promise<RapydPaymentMethod[]> {
  try {
    const response = await makeRapydRequest('GET', `/v1/payment_methods/country?country=${countryCode}`)
    return response.data || []
  } catch (error) {
    console.error('Error fetching payment methods:', error)
    return []
  }
}

// Create a payment
export async function createPayment(paymentData: RapydPaymentRequest): Promise<RapydPaymentResponse> {
  try {
    const response = await makeRapydRequest('POST', '/v1/payments', paymentData)
    return response.data
  } catch (error) {
    console.error('Error creating payment:', error)
    throw error
  }
}

// Get payment status
export async function getPaymentStatus(paymentId: string): Promise<RapydPaymentResponse> {
  try {
    const response = await makeRapydRequest('GET', `/v1/payments/${paymentId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching payment status:', error)
    throw error
  }
}

// Create a customer
export async function createCustomer(customerData: {
  name: string
  email: string
  phone_number?: string
  metadata?: Record<string, any>
}): Promise<any> {
  try {
    const response = await makeRapydRequest('POST', '/v1/customers', customerData)
    return response.data
  } catch (error) {
    console.error('Error creating customer:', error)
    throw error
  }
}

// Create a checkout page
export async function createCheckoutPage(checkoutData: {
  amount: number
  currency: string
  customer: string
  description: string
  complete_payment_url?: string
  error_payment_url?: string
  metadata?: Record<string, any>
}): Promise<{ id: string; redirect_url: string }> {
  try {
    const response = await makeRapydRequest('POST', '/v1/checkout', checkoutData)
    return {
      id: response.data.id,
      redirect_url: response.data.redirect_url
    }
  } catch (error) {
    console.error('Error creating checkout page:', error)
    throw error
  }
}

// Refund a payment
export async function refundPayment(paymentId: string, amount?: number): Promise<any> {
  try {
    const refundData = amount ? { amount } : {}
    const response = await makeRapydRequest('POST', `/v1/payments/${paymentId}/refund`, refundData)
    return response.data
  } catch (error) {
    console.error('Error refunding payment:', error)
    throw error
  }
}

// Webhook signature verification
export function verifyWebhookSignature(
  signature: string,
  salt: string,
  timestamp: string,
  body: string
): boolean {
  const toSign = salt + timestamp + RAPYD_ACCESS_KEY + RAPYD_SECRET_KEY + body
  const expectedSignature = crypto.HmacSHA256(toSign, RAPYD_SECRET_KEY).toString()
  return signature === expectedSignature
}
