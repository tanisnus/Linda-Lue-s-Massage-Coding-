# EmailJS Setup Guide for Massage Booking System

## Overview
This guide will help you set up EmailJS to send automated emails to clients, therapists, and the massage store when appointments are booked.

## Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Add Email Service
1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. Note down your **Service ID**

## Step 3: Create Email Templates
Create three email templates in EmailJS:

### Client Confirmation Template
- **Template ID**: `client_template`
- **Subject**: `Appointment Confirmation - {{service_type}}`
- **Content**:
```
Dear {{client_name}},

Your massage appointment has been confirmed!

Appointment Details:
- Service: {{service_type}}
- Price: {{service_price}}
- Date: {{appointment_date}}
- Time: {{appointment_time}}
- Therapist: {{therapist_name}}

Special Requests: {{special_requests}}

📅 Add to Google Calendar: {{calendar_link}}

We look forward to seeing you!

Best regards,
Linda Lue's Massage & Spa
```

### Therapist Notification Template
- **Template ID**: `therapist_template`
- **Subject**: `New Appointment - {{client_name}}`
- **Content**:
```
Hello {{therapist_name}},

You have a new appointment scheduled:

Client Details:
- Name: {{client_name}}
- Email: {{client_email}}
- Phone: {{client_phone}}

Appointment Details:
- Service: {{service_type}}
- Price: {{service_price}}
- Date: {{appointment_date}}
- Time: {{appointment_time}}

Special Requests: {{special_requests}}

📅 Add to Google Calendar: {{calendar_link}}

Please confirm your availability.

Best regards,
Linda Lue's Massage & Spa
```

### Shop Notification Template
- **Template ID**: `shop_template`
- **Subject**: `New Booking - {{client_name}}`
- **Content**:
```
New booking received:

Client: {{client_name}}
Email: {{client_email}}
Phone: {{client_phone}}

Service: {{service_type}} - {{service_price}}
Date: {{appointment_date}} at {{appointment_time}}
Therapist: {{therapist_name}}

Special Requests: {{special_requests}}

📅 Add to Google Calendar: {{calendar_link}}

Booking confirmed and emails sent to client and therapist.
```

## Step 4: Get Your Public Key
1. In EmailJS dashboard, go to "Account" → "General"
2. Copy your **Public Key**

## Step 5: Update Configuration
Update the following files with your EmailJS credentials:

### Update `src/services/emailService.ts`:
```typescript
const EMAILJS_SERVICE_ID = 'your_service_id_here'
const EMAILJS_PUBLIC_KEY = 'your_public_key_here'
```

### Update Email Addresses in `src/components/BookingForm.tsx`:
```typescript
shop_email: 'your-shop-email@domain.com',
therapist_email: 'therapist-email@domain.com'
```

## Step 6: Test the Integration
1. Fill out the booking form
2. Submit the appointment
3. Check that emails are sent to:
   - Client (confirmation with calendar link)
   - Therapist (appointment details)
   - Shop (booking notification)

## Google Calendar Integration
The system automatically generates Google Calendar links that allow users to:
- Add appointments to their calendar
- Set reminders
- View appointment details
- Get location information

## Troubleshooting
- Ensure all template IDs match exactly
- Verify email addresses are correct
- Check EmailJS service limits (free plan has limits)
- Test with different email providers

## Security Notes
- Never expose your EmailJS private keys in client-side code
- Use environment variables for production
- Regularly rotate your API keys
- Monitor email sending limits

## Support
- EmailJS Documentation: https://www.emailjs.com/docs/
- EmailJS Support: support@emailjs.com
