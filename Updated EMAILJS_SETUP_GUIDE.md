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
Create **two** email templates in EmailJS:



-----------------------------------------------------------------
### Client Confirmation Template
- **Template ID**: `client_template`
- **Subject**: `Appointment Confirmation - {{service_type}}`
- **Content**:
```
Dear {{client_name}},

Thank you for booking with Linda Lue's Massage & Spa! We're excited to provide you with a rejuvenating experience.

📋 APPOINTMENT CONFIRMATION

Service: {{service_type}}
Price: {{service_price}}
Date: {{appointment_date}}
Time: {{appointment_time}}
Therapist: {{therapist_name}}

Special Requests: {{special_requests}}

📅 Add to Your Calendar:
{{calendar_link}}

📍 LOCATION & ARRIVAL
Please arrive 10 minutes early to allow time for check-in and consultation. Our team will ensure you have a relaxing and comfortable experience.

💡 PREPARATION TIPS
- Drink plenty of water before and after your session
- Wear comfortable clothing
- Let us know if you have any concerns or questions before your appointment

If you need to reschedule or have any questions, please contact us as soon as possible. We look forward to serving you!

Warm regards,
Linda Lue's Massage & Spa
[Your Phone Number]
[Your Address]
```


-----------------------------------------------------------------

### Staff Notification Template (Therapist + Shop)
- **Template ID**: `staff_template`
- **Subject**: `New Appointment: {{client_name}} - {{appointment_date}} {{appointment_time}}`
- **Right Panel Settings:**
  - **To Email**: `{{to_email}}` (this will be the therapist's email)
  - **Cc**: `{{cc_email}}` (this will be the shop's email - therapist will see shop receives a copy)
- **Content**:
```
📥 NEW BOOKING RECEIVED

A new appointment has been booked through the online booking system.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 CLIENT INFORMATION
Name: {{client_name}}
Email: {{client_email}}
Phone: {{client_phone}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 APPOINTMENT DETAILS
Date: {{appointment_date}}
Time: {{appointment_time}}
Service: {{service_type}}
Price: {{service_price}}
Assigned Therapist: {{therapist_name}}

📝 CLIENT REQUESTS:
{{special_requests}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 Add to Your Calendar:
{{calendar_link}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ ACTION REQUIRED (Therapist)
Please confirm that this appointment time works for your schedule. If you need to request any changes or have concerns, please contact the shop immediately.

✅ ACTION REQUIRED (Shop)
Please update your booking system and prepare for this appointment.

---
Linda Lue's Massage & Spa
Automated Booking System
```


-----------------------------------------------------------------



## Step 4: Get Your Public Key
1. In EmailJS dashboard, go to "Account" → "General"
2. Copy your **Public Key**
-----------------------------------------------------------------
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

-----------------------------------------------------------------

## Step 6: Test the Integration
1. Fill out the booking form
2. Submit the appointment
3. Check that emails are sent to:
   - **Client** (confirmation email with calendar link)
   - **Therapist** (receives email directly)
   - **Shop** (receives copy via Cc - visible to therapist)

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
