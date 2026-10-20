import * as crypto from 'crypto';

export class SignatureUtil {
  /**
   * Verifies Razorpay Webhook HMAC-SHA256 signature
   * @param rawBody The exact raw body string or Buffer received from the gateway
   * @param signature The x-razorpay-signature header from the gateway
   * @param secret The webhook secret configured in Razorpay dashboard
   */
  static verifyRazorpayWebhookSignature(
    rawBody: string | Buffer,
    signature: string,
    secret: string,
  ): boolean {
    if (!rawBody || !signature || !secret) {
      return false;
    }

    try {
      const bodyString = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8');
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(bodyString)
        .digest('hex');

      const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
      const actualBuffer = Buffer.from(signature, 'utf8');

      if (expectedBuffer.length !== actualBuffer.length) {
        return false;
      }

      return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
    } catch {
      return false;
    }
  }

  /**
   * Verifies Razorpay Payment Checkout response signature
   * signature = HMAC_SHA256(orderId + "|" + paymentId, secret)
   */
  static verifyRazorpayPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string,
    secret: string,
  ): boolean {
    if (!orderId || !paymentId || !signature || !secret) {
      return false;
    }

    try {
      const payload = `${orderId}|${paymentId}`;
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

      const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
      const actualBuffer = Buffer.from(signature, 'utf8');

      if (expectedBuffer.length !== actualBuffer.length) {
        return false;
      }

      return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
    } catch {
      return false;
    }
  }
}
