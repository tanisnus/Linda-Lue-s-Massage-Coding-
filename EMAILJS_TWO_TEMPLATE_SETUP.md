# EmailJS Two-Template Setup Guide

## Overview
The system now uses **2 EmailJS templates** instead of 3:
1. **Client Confirmation Template** - Sends to the customer
2. **Staff Template** - Sends to therapist with shop in Cc (carbon copy)

---

## Template 1: Client Confirmation

### Template Settings
- **Template ID**: `client_template`
- **To Email**: `{{to_email}}`
- **Subject**: `Appointment Confirmation - {{service_type}}`

### Content
Use the client confirmation template from `Updated EMAILJS_SETUP_GUIDE.md`

---

## Template 2: Staff Notification (Therapist + Shop)

### Template Settings
- **Template ID**: `staff_template`
- **To Email**: `{{to_email}}` (therapist's email)
- **Cc**: `{{cc_email}}` (shop's email - **important!**)
- **Subject**: `New Appointment: {{client_name}} - {{appointment_date}} {{appointment_time}}`

### How to Set Up Cc in EmailJS:

1. **In EmailJS Dashboard:**
   - Go to your Staff Template
   - In the right panel, find the **"Cc"** field
   - Enter: `{{cc_email}}`

2. **Why Cc instead of Bcc?**
   - **Cc (Carbon Copy)**: Therapist can see that shop receives a copy (transparency)
   - **Bcc (Blind Copy)**: Shop receives copy but therapist can't see it (privacy)
   - We use **Cc** so therapist knows shop is informed

3. **Result:**
   - Email goes **TO**: Therapist (primary recipient)
   - Email goes **CC**: Shop (receives copy, visible to therapist)

---

## Code Changes

### Updated Files:
- ✅ `src/services/emailService.ts` - Now sends 2 emails instead of 3
- ✅ `.env.example` - Updated environment variables
- ✅ `Updated EMAILJS_SETUP_GUIDE.md` - Updated template instructions

### Environment Variables:
```bash
VITE_EMAILJS_CLIENT_TEMPLATE_ID=your_client_template_id_here
VITE_EMAILJS_STAFF_TEMPLATE_ID=your_staff_template_id_here
```

**Note:** `VITE_EMAILJS_SHOP_TEMPLATE_ID` is no longer needed!

---

## What Happens When Booking is Submitted:

1. **Email 1** → Client receives confirmation email
2. **Email 2** → Therapist receives notification email (shop receives copy in Cc)

Both therapist and shop see the same email content, and therapist knows shop is copied.

---

## Testing

After setup:
1. Submit a test booking
2. Verify client receives email
3. Verify therapist receives email  
4. Verify shop receives email (check therapist's email - shop should be in Cc field)

---

## Troubleshooting

### Shop Not Receiving Email?
- Check that `{{cc_email}}` is in the **Cc** field (not To Email or Bcc)
- Verify `shop_email` is correctly set in `BookingForm.tsx`
- Check spam folder

### Therapist Not Receiving Email?
- Check that `{{to_email}}` is in the **To Email** field
- Verify `therapist_email` is correctly set in `BookingForm.tsx`

### Template ID Mismatch?
- Ensure Template IDs match exactly:
  - `client_template` for client email
  - `staff_template` for staff email

---

## Summary

✅ **2 Templates Total:**
- Client Template → Sends to customer
- Staff Template → Sends to therapist, copies shop (via Cc)

✅ **Key Setting:** Make sure to put `{{cc_email}}` in the **Cc** field of the Staff Template!

