# Test Cases for Linda Lue's Massage Booking System

## 🔴 HIGH PRIORITY - Critical Functionality

### 1. Therapist Availability Logic (By Day)

#### Test Cases:
- ✅ **Sunday (Day 0)**: Should return ['Linda Lue', 'Sarah Johnson']
- ✅ **Monday (Day 1)**: Should return ['Linda Lue', 'Michael Chen']
- ✅ **Tuesday (Day 2)**: Should return ['Sarah Johnson', 'Emma Wilson']
- ✅ **Wednesday (Day 3)**: Should return ['Linda Lue', 'Michael Chen', 'Emma Wilson']
- ✅ **Thursday (Day 4)**: Should return ['Sarah Johnson', 'Michael Chen']
- ✅ **Friday (Day 5)**: Should return ['Linda Lue', 'Sarah Johnson', 'Michael Chen']
- ✅ **Saturday (Day 6)**: Should return ['Linda Lue', 'Emma Wilson']
- ✅ **Empty date string**: Should return empty array []
- ✅ **Invalid date string**: Should return empty array []
- ✅ **Date parsing**: Should correctly parse date string and extract day of week
- ✅ **Different date formats**: Should handle various valid date formats
- ✅ **Therapist list updates**: When therapist schedule changes, dropdown should reflect new availability
- ✅ **No therapists available**: Edge case if a day has no therapists assigned

### 2. Form Step Validation

#### Step 1: Personal Info Validation
- ✅ **All fields empty**: Should not allow "Next" button to proceed
- ✅ **Name only filled**: Should not allow progression
- ✅ **Email only filled**: Should not allow progression
- ✅ **Phone only filled**: Should not allow progression
- ✅ **Name + Email filled**: Should not allow progression (phone missing)
- ✅ **Name + Phone filled**: Should not allow progression (email missing)
- ✅ **Email + Phone filled**: Should not allow progression (name missing)
- ✅ **All required fields filled**: Should allow progression
- ✅ **Name with only whitespace**: Should not allow progression (trim check)
- ✅ **Email with only whitespace**: Should not allow progression (trim check)
- ✅ **Phone with only whitespace**: Should not allow progression (trim check)
- ✅ **Valid email format**: Should accept valid email addresses
- ✅ **Invalid email format**: Should still block progression (HTML5 validation)
- ✅ **Phone format validation**: Should accept various phone formats
- ✅ **Therapist field optional**: Should not block progression if therapist not selected

#### Step 2: Service Selection Validation
- ✅ **No service selected**: Should not allow progression
- ✅ **Service selected**: Should allow progression
- ✅ **Service selection persists**: Selected service should remain when navigating back
- ✅ **Service price populated**: When service selected, price should be set correctly
- ✅ **Multiple service clicks**: Selecting different services should update selection

#### Step 3: Appointment Validation
- ✅ **No date selected**: Should not allow progression
- ✅ **Date selected, no time**: Should not allow progression
- ✅ **Date selected, no therapist**: Should not allow progression
- ✅ **Time selected, no date**: Should not allow progression
- ✅ **All fields filled**: Should allow progression
- ✅ **Therapist dropdown hidden until date selected**: Should not show therapist dropdown before date selection
- ✅ **Therapist resets on date change**: Changing date should clear therapist selection

#### Step 4: Requests (Optional)
- ✅ **Empty requests**: Should allow progression
- ✅ **Requests filled**: Should allow progression
- ✅ **Very long request text**: Should handle large text input

#### Step 5: Review
- ✅ **All data displayed**: Should show all collected information correctly
- ✅ **Form submission**: Should trigger email sending on submit

### 3. Date Validation

#### Past Date Validation
- ✅ **Today's date**: Should be selectable
- ✅ **Tomorrow's date**: Should be selectable
- ✅ **Yesterday's date**: Should NOT be selectable (disabled)
- ✅ **Date input min attribute**: HTML5 min attribute should prevent past dates
- ✅ **Manually entering past date**: Should be blocked by browser validation
- ✅ **Far future date**: Should be selectable (e.g., 1 year from now)
- ✅ **Date format validation**: Should accept YYYY-MM-DD format

#### Date Edge Cases
- ✅ **Leap year dates**: Should handle February 29 correctly
- ✅ **Year boundaries**: Should handle Dec 31 / Jan 1 correctly
- ✅ **Timezone considerations**: Should handle date selection across timezones
- ✅ **Date picker interaction**: Clicking date picker should show calendar
- ✅ **Date display format**: Should display date in readable format in review step

---

## 🟡 MEDIUM PRIORITY - Important Features

### 4. Email Service Integration

#### EmailJS Configuration
- ✅ **Service ID present**: Should have valid EmailJS service ID
- ✅ **Public Key present**: Should have valid EmailJS public key
- ✅ **Template IDs present**: Should have valid client and staff template IDs
- ✅ **Missing environment variables**: Should show helpful error message
- ✅ **Invalid credentials**: Should handle EmailJS authentication errors
- ✅ **Network errors**: Should handle API connection failures gracefully

#### Email Sending - Client Email
- ✅ **Client email sent successfully**: Should send email to client
- ✅ **All placeholders replaced**: Template variables should be filled correctly
- ✅ **Client name in email**: Should appear in subject and body
- ✅ **Service type in email**: Should appear correctly
- ✅ **Appointment details in email**: Date, time, therapist should all be correct
- ✅ **Calendar link generated**: Should create valid Google Calendar link
- ✅ **Special requests in email**: Should appear if provided

#### Email Sending - Staff Email
- ✅ **Staff email sent successfully**: Should send email to therapist and shop (Cc)
- ✅ **Therapist receives email**: To field should be therapist email
- ✅ **Shop receives copy**: Cc field should include shop email
- ✅ **All client info included**: Name, email, phone should be in staff email
- ✅ **Appointment details**: All booking details should be correct
- ✅ **Both emails required**: If one fails, should handle error appropriately

#### Error Handling
- ✅ **EmailJS API errors**: Should display user-friendly error message
- ✅ **Template not found**: Should handle missing template errors
- ✅ **Rate limiting**: Should handle EmailJS quota exceeded errors
- ✅ **Partial failure**: If client email fails but staff succeeds (or vice versa), should handle gracefully
- ✅ **Timeout errors**: Should handle slow API responses
- ✅ **Error message display**: Should show error in UI with technical details expandable

### 5. Form Navigation

#### Forward Navigation
- ✅ **Step 1 → Step 2**: Should navigate when validation passes
- ✅ **Step 2 → Step 3**: Should navigate when service selected
- ✅ **Step 3 → Step 4**: Should navigate when date, time, therapist selected
- ✅ **Step 4 → Step 5**: Should always allow navigation (optional step)
- ✅ **Cannot skip steps**: Should not allow jumping ahead without completing previous steps
- ✅ **Validation blocks navigation**: Invalid step should prevent "Next" button
- ✅ **Progress indicator updates**: Step numbers should reflect current position

#### Backward Navigation
- ✅ **Step 2 → Step 1**: "Previous" button should work
- ✅ **Step 3 → Step 2**: Should navigate back
- ✅ **Step 4 → Step 3**: Should navigate back
- ✅ **Step 5 → Step 4**: Should navigate back
- ✅ **Data persistence**: Going back should preserve entered data
- ✅ **No "Previous" on first step**: Should not show Previous button on Step 1
- ✅ **Service selection persists**: When going back from Step 3, service should still be selected

#### Navigation State
- ✅ **Current step highlighted**: Active step should be visually distinct
- ✅ **Completed steps marked**: Steps before current should show checkmark
- ✅ **Form reset on success**: After successful submission, should reset to Step 1
- ✅ **Form state cleared**: All fields should be empty after successful booking

### 6. Data Formatting

#### Date Formatting
- ✅ **Date display format**: Should format dates consistently (e.g., "Monday, January 15, 2024")
- ✅ **Date in email**: Should format date correctly in email templates
- ✅ **Calendar link date format**: Google Calendar link should use correct ISO format
- ✅ **Date parsing**: Should correctly parse date string from input

#### Time Formatting
- ✅ **Time display**: Should display time consistently (e.g., "10:00 AM - 9:00 PM")
- ✅ **Time in email**: Should format time correctly in email
- ✅ **Calendar link time**: Should convert time to UTC correctly for calendar
- ✅ **Time slot selection**: Selected time should match displayed format

#### Phone Number Formatting
- ✅ **Phone display**: Should display phone number consistently
- ✅ **Phone in email**: Should format phone correctly in email templates
- ✅ **Phone link (tel:)**: Should create clickable phone link correctly

#### Price Formatting
- ✅ **Price display**: Should display prices with dollar sign and decimals
- ✅ **Price in email**: Should format price consistently in emails
- ✅ **Price calculation**: Service prices should match defined prices

#### Name Formatting
- ✅ **Name capitalization**: Should preserve user's name formatting
- ✅ **Special characters**: Should handle names with hyphens, apostrophes, etc.
- ✅ **Name in email subject**: Should appear correctly in email subject line

---

## 🟢 LOW PRIORITY - Nice to Have

### 7. UI Component Rendering

#### Progress Indicator
- ✅ **All steps visible**: Should display all 5 steps
- ✅ **Active step highlighted**: Current step should be visually distinct
- ✅ **Completed steps marked**: Previous steps should show checkmark
- ✅ **Step titles display**: Should show correct titles (Personal Info, Service, etc.)
- ✅ **Step descriptions display**: Should show correct descriptions
- ✅ **Responsive layout**: Should adapt to different screen sizes

#### Form Fields
- ✅ **Input fields render**: All required inputs should be visible
- ✅ **Labels display correctly**: All field labels should be present
- ✅ **Required field indicators**: Asterisks (*) should show on required fields
- ✅ **Select dropdowns render**: All select menus should work
- ✅ **Textarea renders**: Special requests textarea should be visible
- ✅ **Date picker works**: Date input should show calendar picker
- ✅ **Time dropdown works**: Time select should show all options

#### Service Selection Grid
- ✅ **All services display**: Should show all available services
- ✅ **Service details visible**: Name, price, duration should all show
- ✅ **Selected service highlighted**: Clicked service should be visually selected
- ✅ **Service grid layout**: Should display in responsive grid
- ✅ **Hover effects**: Services should show hover state

#### Buttons
- ✅ **Next button visible**: Should appear on all steps except last
- ✅ **Previous button visible**: Should appear on all steps except first
- ✅ **Submit button visible**: Should appear on Review step only
- ✅ **Button states**: Disabled state should show when validation fails
- ✅ **Loading state**: Should show "Booking Appointment..." when submitting
- ✅ **Button styling**: Should match design system

#### Status Messages
- ✅ **Success message displays**: Should show after successful booking
- ✅ **Error message displays**: Should show after failed booking
- ✅ **Error details expandable**: Technical details should be in expandable section
- ✅ **Messages disappear**: Should clear messages on form reset

### 8. Style Changes / Visual Testing

#### Responsive Design
- ✅ **Mobile view (480px)**: Should stack cards vertically, adjust font sizes
- ✅ **Tablet view (768px)**: Should maintain 2-column grid, adjust spacing
- ✅ **Desktop view (1024px+)**: Should display full layout
- ✅ **Form fields responsive**: Inputs should be appropriately sized on all screens
- ✅ **Button sizing**: Buttons should be touch-friendly on mobile
- ✅ **Text readability**: Font sizes should be readable on all devices

#### Color and Styling
- ✅ **Card colors**: Should match design (light lavender #f8f7ff)
- ✅ **Purple headings**: Should use correct purple color (#7B2CBF)
- ✅ **Hover effects**: Cards should lift on hover
- ✅ **Focus states**: Inputs should show focus outline
- ✅ **Border radius**: Cards should have rounded corners (12px)
- ✅ **Shadows**: Should have subtle box shadows
- ✅ **Icon sizing**: Icons should be appropriately sized

#### Visual Consistency
- ✅ **Spacing consistent**: Padding and margins should be uniform
- ✅ **Typography**: Font families and weights should match design
- ✅ **Alignment**: Text and elements should be properly aligned
- ✅ **Background color**: Page background should match (#fafafa)
- ✅ **Card layout**: 2x2 grid should be balanced
- ✅ **Gap spacing**: Gap between cards should be consistent (20px)

#### Animations and Transitions
- ✅ **Hover transitions**: Should have smooth 0.3s transitions
- ✅ **Icon scale on hover**: Icons should scale when card is hovered
- ✅ **Card lift effect**: Cards should smoothly lift on hover
- ✅ **Link hover effects**: Links should slide and change color smoothly
- ✅ **No janky animations**: All animations should be smooth (60fps)

---

## 📊 Test Coverage Summary

**Total Test Cases: ~150+**

### Breakdown by Priority:
- 🔴 High Priority: ~50 test cases
- 🟡 Medium Priority: ~60 test cases  
- 🟢 Low Priority: ~40 test cases

### Breakdown by Category:
- Therapist Logic: ~13 tests
- Form Validation: ~35 tests
- Date Validation: ~13 tests
- Email Integration: ~25 tests
- Form Navigation: ~15 tests
- Data Formatting: ~15 tests
- UI Rendering: ~20 tests
- Visual/Styling: ~18 tests

---

## 🎯 Critical Test Scenarios (Must Pass Before Production)

1. ✅ Therapist list changes when date is selected
2. ✅ Past dates cannot be selected
3. ✅ All required fields must be filled before proceeding
4. ✅ Therapist selection resets when date changes
5. ✅ Both client and staff emails are sent successfully
6. ✅ All email placeholders are replaced with actual values
7. ✅ Form validation prevents invalid submissions
8. ✅ Success/error messages display correctly

---

## 📝 Notes

- Some tests may require mocking EmailJS API calls
- Date tests should account for timezone differences
- Form navigation tests should verify data persistence
- Visual tests may require screenshot comparison tools
- Responsive tests should use actual device viewports

