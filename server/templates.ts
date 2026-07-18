import type { CancelTokenPayload } from './bookingToken.js'
import { escapeHtml, sanitizeEmailSubject, sanitizeUrl } from '../shared/htmlUtils.js'

export interface BookingPayload {
  client_name: string
  client_email: string
  client_phone: string
  service_type: string
  service_price: string
  appointment_date: string
  appointment_time: string
  therapist_name: string
  special_requests: string
  calendar_link: string
  cancel_link?: string
  duration: string
}

const spaName = "Linda Lue's Massage & Spa"
const spaPhone = '(818) 379-7079'
const spaAddress = '15147 Ventura Blvd, Sherman Oaks, CA 91403'

const baseStyles = `
  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; padding: 24px; }
  .header { background: #2d5a3d; color: #fff; padding: 24px; text-align: center; border-radius: 8px 8px 0 0; }
  .content { background: #f9f9f9; padding: 24px; border: 1px solid #e0e0e0; }
  .section { margin-bottom: 20px; }
  .label { font-weight: bold; color: #2d5a3d; }
  .divider { border-top: 2px solid #2d5a3d; margin: 20px 0; }
  .button { display: inline-block; background: #2d5a3d; color: #fff !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 12px 0; }
  .footer { text-align: center; color: #666; font-size: 14px; padding: 16px; }
`

function wrapEmail(title: string, body: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>${baseStyles}</style></head>
<body>
  <div class="container">
    <div class="header"><h1 style="margin:0;">${escapeHtml(title)}</h1></div>
    <div class="content">${body}</div>
    <div class="footer">
      <p>${escapeHtml(spaName)}<br>${escapeHtml(spaPhone)}<br>${escapeHtml(spaAddress)}</p>
    </div>
  </div>
</body>
</html>`
}

export function clientConfirmationEmail(data: BookingPayload): { subject: string; html: string } {
  const requests = escapeHtml(data.special_requests || 'None')
  const therapist = escapeHtml(data.therapist_name || 'Not specified')
  const calendarLink = sanitizeUrl(data.calendar_link)
  const cancelLink = data.cancel_link ? sanitizeUrl(data.cancel_link) : '#'

  const body = `
    <p>Dear ${escapeHtml(data.client_name)},</p>
    <p>Thank you for booking with ${escapeHtml(spaName)}! We're excited to provide you with a rejuvenating experience.</p>
    <div class="section">
      <h2 style="color:#2d5a3d;margin-top:0;">Appointment Confirmation</h2>
      <p><span class="label">Service:</span> ${escapeHtml(data.service_type)}</p>
      <p><span class="label">Price:</span> ${escapeHtml(data.service_price)}</p>
      <p><span class="label">Date:</span> ${escapeHtml(data.appointment_date)}</p>
      <p><span class="label">Time:</span> ${escapeHtml(data.appointment_time)}</p>
      <p><span class="label">Therapist:</span> ${therapist}</p>
      <p><span class="label">Special Requests:</span> ${requests}</p>
    </div>
    <a href="${calendarLink}" class="button">Add to Google Calendar</a>
    <div class="divider"></div>
    <div class="section">
      <h3 style="color:#2d5a3d;">Need to Cancel?</h3>
      <p>If your plans change, use the link below to review and confirm cancellation on our website.</p>
      <a href="${cancelLink}" class="button" style="background:#b91c1c;">Cancel Appointment</a>
    </div>
    <div class="divider"></div>
    <div class="section">
      <h3 style="color:#2d5a3d;">Location &amp; Arrival</h3>
      <p>Please arrive 10 minutes early to allow time for check-in and consultation.</p>
      <p><strong>${escapeHtml(spaAddress)}</strong></p>
    </div>
    <div class="section">
      <h3 style="color:#2d5a3d;">Preparation Tips</h3>
      <ul>
        <li>Drink plenty of water before and after your session</li>
        <li>Wear comfortable clothing</li>
        <li>Let us know if you have any concerns before your appointment</li>
      </ul>
    </div>
    <p>If you need to reschedule or have questions, please contact us at ${escapeHtml(spaPhone)}.</p>
    <p>Warm regards,<br>${escapeHtml(spaName)}</p>
  `

  return {
    subject: sanitizeEmailSubject(`Appointment Confirmation - ${data.service_type}`),
    html: wrapEmail('Appointment Confirmed', body),
  }
}

export function staffNotificationEmail(data: BookingPayload): { subject: string; html: string } {
  const requests = escapeHtml(data.special_requests || 'None')
  const therapist = escapeHtml(data.therapist_name || 'Not specified')
  const phone = escapeHtml(data.client_phone || 'Not provided')
  const calendarLink = sanitizeUrl(data.calendar_link)

  const body = `
    <h2 style="color:#2d5a3d;margin-top:0;">New Booking Received</h2>
    <p>A new appointment has been booked through the online booking system.</p>
    <div class="divider"></div>
    <div class="section">
      <h3 style="color:#2d5a3d;">Client Information</h3>
      <p><span class="label">Name:</span> ${escapeHtml(data.client_name)}</p>
      <p><span class="label">Email:</span> ${escapeHtml(data.client_email)}</p>
      <p><span class="label">Phone:</span> ${phone}</p>
    </div>
    <div class="divider"></div>
    <div class="section">
      <h3 style="color:#2d5a3d;">Appointment Details</h3>
      <p><span class="label">Date:</span> ${escapeHtml(data.appointment_date)}</p>
      <p><span class="label">Time:</span> ${escapeHtml(data.appointment_time)}</p>
      <p><span class="label">Service:</span> ${escapeHtml(data.service_type)}</p>
      <p><span class="label">Price:</span> ${escapeHtml(data.service_price)}</p>
      <p><span class="label">Assigned Therapist:</span> ${therapist}</p>
      <p><span class="label">Client Requests:</span> ${requests}</p>
    </div>
    <a href="${calendarLink}" class="button">Add to Google Calendar</a>
    <div class="divider"></div>
    <p><strong>Action Required (Therapist):</strong> Please confirm this appointment time works for your schedule.</p>
    <p><strong>Action Required (Shop):</strong> Please update your booking system and prepare for this appointment.</p>
  `

  return {
    subject: sanitizeEmailSubject(
      `New Appointment: ${data.client_name} - ${data.appointment_date} ${data.appointment_time}`
    ),
    html: wrapEmail('New Booking', body),
  }
}

export function clientCancellationEmail(data: CancelTokenPayload): { subject: string; html: string } {
  const body = `
    <p>Dear ${escapeHtml(data.client_name)},</p>
    <p>Your appointment at ${escapeHtml(spaName)} has been cancelled as requested.</p>
    <div class="section">
      <h2 style="color:#2d5a3d;margin-top:0;">Cancelled Appointment</h2>
      <p><span class="label">Service:</span> ${escapeHtml(data.service_type)}</p>
      <p><span class="label">Date:</span> ${escapeHtml(data.appointment_date)}</p>
      <p><span class="label">Time:</span> ${escapeHtml(data.appointment_time)}</p>
    </div>
    <p>If you would like to book again, visit our website or call us at ${escapeHtml(spaPhone)}.</p>
    <p>Warm regards,<br>${escapeHtml(spaName)}</p>
  `

  return {
    subject: sanitizeEmailSubject(`Appointment Cancelled - ${data.service_type}`),
    html: wrapEmail('Appointment Cancelled', body),
  }
}

export function staffCancellationEmail(data: CancelTokenPayload): { subject: string; html: string } {
  const therapist = escapeHtml(data.therapist_name || 'Not specified')
  const phone = escapeHtml(data.client_phone || 'Not provided')

  const body = `
    <h2 style="color:#2d5a3d;margin-top:0;">Appointment Cancelled by Client</h2>
    <p>A client has cancelled their online booking.</p>
    <div class="divider"></div>
    <div class="section">
      <h3 style="color:#2d5a3d;">Client Information</h3>
      <p><span class="label">Name:</span> ${escapeHtml(data.client_name)}</p>
      <p><span class="label">Email:</span> ${escapeHtml(data.client_email)}</p>
      <p><span class="label">Phone:</span> ${phone}</p>
    </div>
    <div class="divider"></div>
    <div class="section">
      <h3 style="color:#2d5a3d;">Cancelled Appointment</h3>
      <p><span class="label">Date:</span> ${escapeHtml(data.appointment_date)}</p>
      <p><span class="label">Time:</span> ${escapeHtml(data.appointment_time)}</p>
      <p><span class="label">Service:</span> ${escapeHtml(data.service_type)}</p>
      <p><span class="label">Price:</span> ${escapeHtml(data.service_price)}</p>
      <p><span class="label">Therapist:</span> ${therapist}</p>
    </div>
    <p>The calendar event has been removed if calendar integration is enabled.</p>
  `

  return {
    subject: sanitizeEmailSubject(
      `Cancelled: ${data.client_name} - ${data.appointment_date} ${data.appointment_time}`
    ),
    html: wrapEmail('Booking Cancelled', body),
  }
}
