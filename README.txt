Prospective Tenant Pre-Screening Form (HTML/CSS/JS)
Files included:
- index.html     : The form (self-contained layout)
- style.css      : Styling for the form
- script.js      : Client-side validation, email sending, JSON export
- thank-you.html : Confirmation page shown after form submission
- README.txt     : This file

Usage:
1. Unzip the package.
2. Set up EmailJS (see instructions below).
3. Open index.html in any modern browser.
4. Fill the form and click Submit — the form will be emailed to Atresodawit19@gmail.com and redirect to a thank you page.

EmailJS Setup Instructions:
To enable email functionality, you need to configure EmailJS:

1. Sign up for a free account at https://www.emailjs.com/
2. Create an Email Service:
   - Go to "Email Services" in your dashboard
   - Click "Add New Service"
   - Choose your email provider (Gmail, Outlook, etc.)
   - Follow the setup instructions
   - Note your Service ID

3. Create an Email Template (IMPORTANT - This is where form answers appear):
   - Go to "Email Templates" in your dashboard
   - Click "Create New Template"
   - Set the "To Email" field to: {{to_email}}
   - Set the "Subject" field to: {{subject}}
   - In the "Content" field, you MUST include one of these variables to see the form answers:
     
     OPTION A - HTML Format (RECOMMENDED - shows all form answers beautifully):
     From: {{from_name}} ({{from_email}})
     
     {{message_html}}
     
     This will display ALL form answers in a nicely formatted HTML table with sections.
     
     OPTION B - Plain Text (shows all form answers in text format):
     From: {{from_name}} ({{from_email}})
     
     {{message}}
     
     This will display ALL form answers in plain text format.
     
     OPTION C - Raw JSON (if you need the raw data):
     {{form_data}}
   
   IMPORTANT: Make sure you include {{message_html}} or {{message}} in your template,
   otherwise you will only see the template without the actual form answers!
   
   - Make sure the template content type is set to "HTML" if using {{message_html}}
   - Save the template and note your Template ID

4. Get your Public Key:
   - Go to "Account" > "General" in your dashboard
   - Copy your Public Key

5. Update script.js:
   - Open script.js
   - Find the EMAILJS_CONFIG object (around line 12)
   - Replace 'YOUR_PUBLIC_KEY' with your actual Public Key
   - Replace 'YOUR_SERVICE_ID' with your actual Service ID
   - Replace 'YOUR_TEMPLATE_ID' with your actual Template ID

Notes:
- The form will send emails to: Atresodawit19@gmail.com
- If EmailJS is not configured, the form will attempt to use a mailto: link as a fallback
- After successful submission, users are redirected to thank-you.html
- Form data is also available for download as JSON
