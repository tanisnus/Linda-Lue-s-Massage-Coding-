# EmailJS Setup Guide

## 🚀 **Step 1: Create EmailJS Account**

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## 📧 **Step 2: Set Up Email Service**

1. In your EmailJS dashboard, go to **"Email Services"**
2. Click **"Add New Service"**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. **Copy your Service ID** (you'll need this)

## 🔑 **Step 3: Get Your Public Key**

1. In EmailJS dashboard, go to **"Account"**
2. Find your **Public Key** (starts with "user_")
3. **Copy this key** (you'll need this)

## 📝 **Step 4: Create Email Templates**

Create 3 email templates in EmailJS:

### **Template 1: Client Confirmation Email**
- **Template ID**: `client_template`
- **Subject**: `Appointment Confirmation - {{service_type}}`
- **Content**:
```
Dear {{client_name}},

Thank you for booking your {{service_type}} appointment!

Appointment Details:
- Service: {{service_type}}
- Price: {{service_price}}
- Date: {{appointment_date}}
- Time: {{appointment_time}}
- Therapist: {{therapist_name}}

Special Requests: {{special_requests}}

Add to Google Calendar:
[Yes - Add to Calendar]({{calendar_link}})

We look forward to seeing you!

Best regards,
Linda Lue's Massage & Spa
```

### **Template 2: Therapist Notification Email**
- **Template ID**: `therapist_template`
- **Subject**: `New Appointment - {{appointment_date}}`
- **Content**:
```
Hi {{therapist_name}},

You have a new appointment scheduled:

Client: {{client_name}}
Email: {{client_email}}
Phone: {{client_phone}}
Service: {{service_type}}
Date: {{appointment_date}}
Time: {{appointment_time}}
Price: {{service_price}}

Special Requests: {{special_requests}}

Add to Google Calendar:
[Yes - Add to Calendar]({{calendar_link}})

Please confirm your availability.

Best regards,
Linda Lue's Massage & Spa
```

### **Template 3: Shop Management Email**
- **Template ID**: `shop_template`
- **Subject**: `New Booking - {{client_name}}`
- **Content**:
```
New appointment booking received:

Client: {{client_name}}
Email: {{client_email}}
Phone: {{client_phone}}
Service: {{service_type}}
Date: {{appointment_date}}
Time: {{appointment_time}}
Therapist: {{therapist_name}}
Price: {{service_price}}

Special Requests: {{special_requests}}

Add to Google Calendar:
[Yes - Add to Calendar]({{calendar_link}})

Please update your booking system.

Best regards,
Linda Lue's Massage & Spa
```

## ⚙️ **Step 5: Update Your Code**

Replace these placeholders in your code:

### **In `src/services/emailService.ts`:**
```typescript
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID' // Replace with your actual Service ID
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY' // Replace with your actual Public Key
```

### **In `src/components/BookingForm.tsx`:**
```typescript
// Replace these template IDs with your actual template IDs:
'client_template'    // Your client email template ID
'therapist_template'  // Your therapist email template ID
'shop_template'      // Your shop email template ID
```

## 🎯 **Step 6: Test Your Setup**

1. Fill out the booking form
2. Submit an appointment
3. Check that all 3 emails are sent:
   - Client confirmation email
   - Therapist notification email
   - Shop management email

## 📧 **Email Features:**

✅ **Google Calendar Integration**: All emails include "Add to Calendar" links
✅ **Professional Templates**: Customized for each recipient
✅ **Complete Information**: All booking details included
✅ **One-Click Calendar**: Recipients can add to Google Calendar with one click

## 🔧 **Troubleshooting:**

- **Emails not sending**: Check your Service ID and Public Key
- **Template errors**: Verify template IDs match exactly
- **Calendar links not working**: Check date/time format in the code
- **Missing information**: Ensure all template variables are included

## 💡 **Pro Tips:**

- Test with your own email first
- Use descriptive template names
- Keep templates professional and clear
- Test the Google Calendar links
- Monitor your EmailJS usage (free tier has limits)

Your booking system is now ready to send professional emails with Google Calendar integration! 🎉
