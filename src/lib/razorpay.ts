import Razorpay from 'razorpay'

/**
 * Razorpay instance — null if keys are not configured.
 * API routes should check for null and return a proper error
 * instead of crashing with "key_id is required".
 */

const keyId = process.env.RAZORPAY_KEY_ID
const keySecret = process.env.RAZORPAY_KEY_SECRET

export const razorpay: Razorpay | null =
  keyId && keySecret
    ? new Razorpay({ key_id: keyId, key_secret: keySecret })
    : null

/** Check if Razorpay is configured for online payments */
export function isRazorpayReady(): boolean {
  return razorpay !== null
}
