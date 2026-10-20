import { NextResponse } from 'next/server';
import { BRAND_TOKENS } from '@/lib/tokens';

export const dynamic = 'force-static';

export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'whatsapp' });
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const {
      to,
      customerName,
      customerPhone,
      bookingNumber,
      pickup,
      drop,
      date,
      time,
      vehicle,
      fare,
      passengers,
      body: customBody,
    } = payload;

    const targetPhone = to || customerPhone || BRAND_TOKENS.phonePrimary;
    const cleanTo = targetPhone.replace(/[^0-9]/g, '');

    if (!cleanTo && !customBody) {
      return NextResponse.json(
        { error: 'Missing destination phone or message body in request payload' },
        { status: 400 }
      );
    }

    // Auto-generate the structured Dhanora Cab booking message if not provided
    const messageBody =
      customBody ||
      [
        `🚖 *NEW CAB BOOKING - DHANORA CAB SERVICE*`,
        `━━━━━━━━━━━━━━━━━━━━━`,
        `🔖 *Booking Ref:* #${bookingNumber || 'DED-' + Math.floor(100000 + Math.random() * 900000)}`,
        `👤 *Passenger Name:* ${customerName || 'Valued Guest'}`,
        `📞 *Contact Phone:* ${customerPhone || targetPhone}`,
        `📍 *Pickup:* ${pickup || 'Dehradun'}`,
        `🏁 *Drop:* ${drop || 'As per itinerary'}`,
        `📅 *Date:* ${date || 'Today'}`,
        `⏰ *Time:* ${time || 'Immediate'}`,
        `🚘 *Vehicle:* ${vehicle || 'Sedan / SUV'}`,
        passengers ? `👥 *Passengers:* ${passengers}` : '',
        fare ? `💰 *Fare:* ${fare}` : '',
        `━━━━━━━━━━━━━━━━━━━━━`,
        `✅ *Status:* Booking Confirmed with Dhanora Cab Service`,
        `📞 *24x7 Helpline:* ${BRAND_TOKENS.phonePrimary}`,
        `🌐 *Website:* https://www.dhanoracabs.com`,
      ]
        .filter(Boolean)
        .join('\n');

    let deliveryMethod = 'simulation';
    let externalSid: string | null = null;

    // 1. Try Twilio if credentials are provided
    if (
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_WHATSAPP_NUMBER
    ) {
      try {
        const Twilio = (await import('twilio')).default;
        const client = Twilio(
          process.env.TWILIO_ACCOUNT_SID,
          process.env.TWILIO_AUTH_TOKEN
        );
        const twilioMsg = await client.messages.create({
          from: process.env.TWILIO_WHATSAPP_NUMBER.startsWith('whatsapp:')
            ? process.env.TWILIO_WHATSAPP_NUMBER
            : `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
          to: `whatsapp:+${cleanTo.length === 10 ? '91' + cleanTo : cleanTo}`,
          body: messageBody,
        });
        deliveryMethod = 'twilio';
        externalSid = twilioMsg.sid;
      } catch (twilioErr) {
        console.error('Twilio WhatsApp error:', twilioErr);
      }
    }

    // 2. Try Meta WhatsApp Cloud API if credentials are provided
    if (
      deliveryMethod === 'simulation' &&
      process.env.WHATSAPP_CLOUD_API_TOKEN &&
      process.env.WHATSAPP_PHONE_NUMBER_ID
    ) {
      try {
        const cloudRes = await fetch(
          `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${process.env.WHATSAPP_CLOUD_API_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              recipient_type: 'individual',
              to: cleanTo.length === 10 ? `91${cleanTo}` : cleanTo,
              type: 'text',
              text: { preview_url: false, body: messageBody },
            }),
          }
        );
        if (cloudRes.ok) {
          const cloudData = await cloudRes.json();
          deliveryMethod = 'meta_cloud_api';
          externalSid = cloudData.messages?.[0]?.id || 'meta-ok';
        }
      } catch (metaErr) {
        console.error('Meta Cloud API error:', metaErr);
      }
    }

    // 3. Webhook forwarding if configured
    if (process.env.WHATSAPP_WEBHOOK_URL) {
      try {
        await fetch(process.env.WHATSAPP_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'whatsapp_booking_dispatch',
            to: cleanTo,
            message: messageBody,
            booking: payload,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (webhookErr) {
        console.error('WhatsApp Webhook forwarding error:', webhookErr);
      }
    }

    // Direct WhatsApp web/deep-link URL for immediate 1-tap client opening
    const directUrl = `https://wa.me/917505800684?text=${encodeURIComponent(
      messageBody
    )}`;

    return NextResponse.json(
      {
        success: true,
        deliveryMethod,
        sid: externalSid,
        bookingNumber: bookingNumber || null,
        messageBody,
        directUrl,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('WhatsApp API Handler error:', error);
    return NextResponse.json(
      { error: error.message ?? 'Unexpected error occurred' },
      { status: 500 }
    );
  }
}
