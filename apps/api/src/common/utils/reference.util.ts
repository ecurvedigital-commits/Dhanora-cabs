import * as crypto from 'crypto';

export class ReferenceUtil {
  static generateBookingNumber(): string {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `BK-${dateStr}-${randomHex}`;
  }

  static generateTripNumber(): string {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `TRIP-${dateStr}-${randomHex}`;
  }

  static generatePaymentNumber(): string {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `PAY-${dateStr}-${randomHex}`;
  }

  static generateInvoiceNumber(): string {
    const year = new Date().getFullYear();
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `INV-${year}-${randomHex}`;
  }

  static generateRefundNumber(): string {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `REF-${dateStr}-${randomHex}`;
  }
}
