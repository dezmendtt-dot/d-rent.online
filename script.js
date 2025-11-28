// Client-side form behaviour: validation, email sending and JSON download
(function(){
  const form = document.getElementById('tenantForm');
  const submitBtn = document.getElementById('submitBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const message = document.getElementById('formMessage');

  // Initialize EmailJS
  // You need to:
  // 1. Sign up at https://www.emailjs.com/
  // 2. Create an email service (Gmail, Outlook, etc.)
  // 3. Create an email template
  // 4. Get your Public Key, Service ID, and Template ID
  // 5. Replace the values below with your actual credentials
  const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'n2ATLSP3qh58FeGwI', // Replace with your EmailJS Public Key
    SERVICE_ID: 'service_8vzhtfr', // Replace with your EmailJS Service ID
    TEMPLATE_ID: 'template_v7nqu69', // Replace with your EmailJS Template ID
    TO_EMAIL: 'Atresodawit19@gmail.com' // Recipient email
  };

  // Initialize EmailJS (only if credentials are set)
  if (EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  }

  function showMessage(text, ok = true){
    message.classList.remove('hidden');
    message.textContent = text;
    message.style.background = ok ? '#e6f4ea' : '#fdecea';
    message.style.color = ok ? '#0b5f2d' : '#8a1f17';
    message.style.border = ok ? '1px solid #c6eed1' : '1px solid #f2c0bd';
  }

  function collectFormData(){
    const data = {};
    
    // Collect all form fields explicitly
    const fields = [
      'fullName', 'dob', 'phone', 'email', 'nationality',
      'currentAddress', 'timeAtAddress', 'reasonForMoving',
      'timeInSalford', 'longTerm', 'stayDetails',
      'employmentStatus', 'occupation', 'timeInRole', 'income', 'proof',
      'moveInDate', 'lengthOfStay', 'parking', 'specialNeeds',
      'landlordRef', 'charRef',
      'smoke', 'pets', 'petsDetails', 'anythingElse'
    ];
    
    // Get text inputs, textareas, selects
    fields.forEach(fieldName => {
      const field = form.querySelector(`[name="${fieldName}"]`);
      if (field) {
        if (field.type === 'radio') {
          // For radio buttons, get the checked one
          const checked = form.querySelector(`[name="${fieldName}"]:checked`);
          data[fieldName] = checked ? checked.value : '';
        } else {
          data[fieldName] = field.value || '';
        }
      } else {
        data[fieldName] = '';
      }
    });
    
    // Also use FormData as backup to catch any we might have missed
    const fm = new FormData(form);
    for(const [k,v] of fm.entries()){
      if (v && v.trim() !== '') {
        data[k] = v;
      }
    }
    
    // Debug: log collected data
    console.log('Collected Form Data:', data);
    
    return data;
  }

  function formatValue(value) {
    if (!value || value.toString().trim() === '') {
      return 'Not provided';
    }
    return value.toString().trim();
  }

  function formatEmailContent(data) {
    let content = 'Hi Dez,\n\n';
    content += 'A form has been submitted. Please reach out to the potential tenant in 24 hours.\n\n';
    content += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    content += 'TENANT PRE-SCREENING FORM SUBMISSION\n';
    content += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
    
    content += '━━━ SECTION 1: PERSONAL INFORMATION ━━━\n';
    content += `Q: Full name\nA: ${formatValue(data.fullName)}\n\n`;
    content += `Q: Date of birth\nA: ${formatValue(data.dob)}\n\n`;
    content += `Q: Phone number\nA: ${formatValue(data.phone)}\n\n`;
    content += `Q: Email address\nA: ${formatValue(data.email)}\n\n`;
    content += `Q: Nationality\nA: ${formatValue(data.nationality)}\n\n`;
    
    content += '━━━ SECTION 2: CURRENT LIVING SITUATION ━━━\n';
    content += `Q: Current address\nA: ${formatValue(data.currentAddress)}\n\n`;
    content += `Q: How long have you lived at your current address?\nA: ${formatValue(data.timeAtAddress)}\n\n`;
    content += `Q: Reason for moving\nA: ${formatValue(data.reasonForMoving)}\n\n`;
    
    content += '━━━ SECTION 3: CONNECTION TO SALFORD / GREATER MANCHESTER ━━━\n';
    content += `Q: How long have you been living in Salford / Greater Manchester (if applicable)?\nA: ${formatValue(data.timeInSalford)}\n\n`;
    content += `Q: Are you planning to stay in the area long-term?\nA: ${formatValue(data.longTerm)}\n\n`;
    content += `Q: If yes, please provide details\nA: ${formatValue(data.stayDetails)}\n\n`;
    
    content += '━━━ SECTION 4: EMPLOYMENT & FINANCIAL DETAILS ━━━\n';
    content += `Q: Employment status\nA: ${formatValue(data.employmentStatus)}\n\n`;
    content += `Q: Occupation / Employer (or University/College)\nA: ${formatValue(data.occupation)}\n\n`;
    content += `Q: How long have you been in your current job/course?\nA: ${formatValue(data.timeInRole)}\n\n`;
    content += `Q: Approximate monthly income\nA: ${formatValue(data.income)}\n\n`;
    content += `Q: Able to provide proof of income or guarantor if required?\nA: ${formatValue(data.proof)}\n\n`;
    
    content += '━━━ SECTION 5: ACCOMMODATION NEEDS ━━━\n';
    content += `Q: Preferred move-in date\nA: ${formatValue(data.moveInDate)}\n\n`;
    content += `Q: How long are you looking to stay?\nA: ${formatValue(data.lengthOfStay)}\n\n`;
    content += `Q: Do you require parking?\nA: ${formatValue(data.parking)}\n\n`;
    content += `Q: Any special accommodation needs?\nA: ${formatValue(data.specialNeeds)}\n\n`;
    
    content += '━━━ SECTION 6: REFERENCES ━━━\n';
    content += `Q: Previous landlord reference available?\nA: ${formatValue(data.landlordRef)}\n\n`;
    content += `Q: Employer / Character reference available?\nA: ${formatValue(data.charRef)}\n\n`;
    
    content += '━━━ SECTION 7: ADDITIONAL DETAILS ━━━\n';
    content += `Q: Do you smoke?\nA: ${formatValue(data.smoke)}\n\n`;
    content += `Q: Do you have pets?\nA: ${formatValue(data.pets)}\n\n`;
    content += `Q: If yes, please specify\nA: ${formatValue(data.petsDetails)}\n\n`;
    content += `Q: Anything else you would like to mention?\nA: ${formatValue(data.anythingElse)}\n\n`;
    
    content += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    content += `Submission Date: ${new Date().toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })}\n`;
    content += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
    content += 'Best regards,\nD-tenant';
    
    return content;
  }

  function formatEmailHTML(data) {
    let html = '<html><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">';
    html += '<h2 style="color: #0b63ff; border-bottom: 2px solid #0b63ff; padding-bottom: 10px;">NEW TENANT PRE-SCREENING FORM SUBMISSION</h2>';
    
    html += '<div style="margin: 20px 0;">';
    html += '<h3 style="color: #555; background: #f0f0f0; padding: 8px; margin-top: 20px;">Section 1: Personal Information</h3>';
    html += '<table style="width: 100%; border-collapse: collapse;">';
    html += `<tr><td style="padding: 8px; font-weight: bold; width: 200px;">Full Name:</td><td style="padding: 8px;">${formatValue(data.fullName)}</td></tr>`;
    html += `<tr><td style="padding: 8px; font-weight: bold;">Date of Birth:</td><td style="padding: 8px;">${formatValue(data.dob)}</td></tr>`;
    html += `<tr><td style="padding: 8px; font-weight: bold;">Phone Number:</td><td style="padding: 8px;">${formatValue(data.phone)}</td></tr>`;
    html += `<tr><td style="padding: 8px; font-weight: bold;">Email Address:</td><td style="padding: 8px;">${formatValue(data.email)}</td></tr>`;
    html += `<tr><td style="padding: 8px; font-weight: bold;">Nationality:</td><td style="padding: 8px;">${formatValue(data.nationality)}</td></tr>`;
    html += '</table></div>';
    
    html += '<div style="margin: 20px 0;">';
    html += '<h3 style="color: #555; background: #f0f0f0; padding: 8px; margin-top: 20px;">Section 2: Current Living Situation</h3>';
    html += '<table style="width: 100%; border-collapse: collapse;">';
    html += `<tr><td style="padding: 8px; font-weight: bold; width: 200px;">Current Address:</td><td style="padding: 8px; white-space: pre-wrap;">${formatValue(data.currentAddress)}</td></tr>`;
    html += `<tr><td style="padding: 8px; font-weight: bold;">Time at Current Address:</td><td style="padding: 8px;">${formatValue(data.timeAtAddress)}</td></tr>`;
    html += `<tr><td style="padding: 8px; font-weight: bold;">Reason for Moving:</td><td style="padding: 8px; white-space: pre-wrap;">${formatValue(data.reasonForMoving)}</td></tr>`;
    html += '</table></div>';
    
    html += '<div style="margin: 20px 0;">';
    html += '<h3 style="color: #555; background: #f0f0f0; padding: 8px; margin-top: 20px;">Section 3: Connection to Salford / Greater Manchester</h3>';
    html += '<table style="width: 100%; border-collapse: collapse;">';
    html += `<tr><td style="padding: 8px; font-weight: bold; width: 200px;">Time in Salford/GM:</td><td style="padding: 8px;">${formatValue(data.timeInSalford)}</td></tr>`;
    html += `<tr><td style="padding: 8px; font-weight: bold;">Planning to Stay Long-term:</td><td style="padding: 8px;">${formatValue(data.longTerm)}</td></tr>`;
    html += `<tr><td style="padding: 8px; font-weight: bold;">Long-term Stay Details:</td><td style="padding: 8px; white-space: pre-wrap;">${formatValue(data.stayDetails)}</td></tr>`;
    html += '</table></div>';
    
    html += '<div style="margin: 20px 0;">';
    html += '<h3 style="color: #555; background: #f0f0f0; padding: 8px; margin-top: 20px;">Section 4: Employment & Financial Details</h3>';
    html += '<table style="width: 100%; border-collapse: collapse;">';
    html += `<tr><td style="padding: 8px; font-weight: bold; width: 200px;">Employment Status:</td><td style="padding: 8px;">${formatValue(data.employmentStatus)}</td></tr>`;
    html += `<tr><td style="padding: 8px; font-weight: bold;">Occupation / Employer:</td><td style="padding: 8px;">${formatValue(data.occupation)}</td></tr>`;
    html += `<tr><td style="padding: 8px; font-weight: bold;">Time in Current Job/Course:</td><td style="padding: 8px;">${formatValue(data.timeInRole)}</td></tr>`;
    html += `<tr><td style="padding: 8px; font-weight: bold;">Monthly Income:</td><td style="padding: 8px;">${formatValue(data.income)}</td></tr>`;
    html += `<tr><td style="padding: 8px; font-weight: bold;">Proof of Income/Guarantor:</td><td style="padding: 8px;">${formatValue(data.proof)}</td></tr>`;
    html += '</table></div>';
    
    html += '<div style="margin: 20px 0;">';
    html += '<h3 style="color: #555; background: #f0f0f0; padding: 8px; margin-top: 20px;">Section 5: Accommodation Needs</h3>';
    html += '<table style="width: 100%; border-collapse: collapse;">';
    html += `<tr><td style="padding: 8px; font-weight: bold; width: 200px;">Preferred Move-in Date:</td><td style="padding: 8px;">${formatValue(data.moveInDate)}</td></tr>`;
    html += `<tr><td style="padding: 8px; font-weight: bold;">Length of Stay:</td><td style="padding: 8px;">${formatValue(data.lengthOfStay)}</td></tr>`;
    html += `<tr><td style="padding: 8px; font-weight: bold;">Parking Required:</td><td style="padding: 8px;">${formatValue(data.parking)}</td></tr>`;
    html += `<tr><td style="padding: 8px; font-weight: bold;">Special Needs:</td><td style="padding: 8px; white-space: pre-wrap;">${formatValue(data.specialNeeds)}</td></tr>`;
    html += '</table></div>';
    
    html += '<div style="margin: 20px 0;">';
    html += '<h3 style="color: #555; background: #f0f0f0; padding: 8px; margin-top: 20px;">Section 6: References</h3>';
    html += '<table style="width: 100%; border-collapse: collapse;">';
    html += `<tr><td style="padding: 8px; font-weight: bold; width: 200px;">Previous Landlord Reference:</td><td style="padding: 8px;">${formatValue(data.landlordRef)}</td></tr>`;
    html += `<tr><td style="padding: 8px; font-weight: bold;">Character Reference:</td><td style="padding: 8px;">${formatValue(data.charRef)}</td></tr>`;
    html += '</table></div>';
    
    html += '<div style="margin: 20px 0;">';
    html += '<h3 style="color: #555; background: #f0f0f0; padding: 8px; margin-top: 20px;">Section 7: Additional Details</h3>';
    html += '<table style="width: 100%; border-collapse: collapse;">';
    html += `<tr><td style="padding: 8px; font-weight: bold; width: 200px;">Smokes:</td><td style="padding: 8px;">${formatValue(data.smoke)}</td></tr>`;
    html += `<tr><td style="padding: 8px; font-weight: bold;">Has Pets:</td><td style="padding: 8px;">${formatValue(data.pets)}</td></tr>`;
    html += `<tr><td style="padding: 8px; font-weight: bold;">Pet Details:</td><td style="padding: 8px;">${formatValue(data.petsDetails)}</td></tr>`;
    html += `<tr><td style="padding: 8px; font-weight: bold;">Additional Notes:</td><td style="padding: 8px; white-space: pre-wrap;">${formatValue(data.anythingElse)}</td></tr>`;
    html += '</table></div>';
    
    html += `<p style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; color: #666; font-size: 0.9em;">Submission Date: ${new Date().toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })}</p>`;
    html += '</body></html>';
    return html;
  }

  function validateRequired(){
    // Basic required checks for key fields
    const requiredIds = ['fullName','dob','phone','email','nationality','currentAddress'];
    for(const id of requiredIds){
      const el = document.getElementById(id);
      if(!el) continue;
      if(!el.value || el.value.trim() === ''){
        el.focus();
        return {ok:false, field:id};
      }
    }
    return {ok:true};
  }

  async function sendEmail(data) {
    // Check if EmailJS is configured
    if (EMAILJS_CONFIG.PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
      // Fallback: use mailto link if EmailJS not configured
      const subject = encodeURIComponent('New Tenant Pre-Screening Form Submission');
      const body = encodeURIComponent(formatEmailContent(data));
      window.location.href = `mailto:${EMAILJS_CONFIG.TO_EMAIL}?subject=${subject}&body=${body}`;
      return { success: true, fallback: true };
    }

    try {
      // Format email content with all form questions and answers in text format
      const emailContent = formatEmailContent(data);
      
      // Debug: Show what we're sending
      console.log('Email Content (first 500 chars):', emailContent.substring(0, 500));
      console.log('Form Data Sample:', {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone
      });
      
      // Build template parameters matching EmailJS template structure
      // The template expects: {{to_email}}, {{from_name}}, {{from_email}}, and {{message}}
      // The {{message}} variable will contain all form questions and answers
      const templateParams = {
        to_email: EMAILJS_CONFIG.TO_EMAIL,
        from_name: data.fullName || 'Tenant Applicant',
        from_email: data.email || 'no-email@provided.com',
        message: emailContent  // Contains all form questions and answers in text format
      };

      console.log('Sending to EmailJS with params:', {
        service_id: EMAILJS_CONFIG.SERVICE_ID,
        template_id: EMAILJS_CONFIG.TEMPLATE_ID,
        to_email: templateParams.to_email,
        message_length: emailContent.length
      });

      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );
      
      console.log('Email sent successfully!');
      return { success: true };
    } catch (error) {
      console.error('EmailJS Error:', error);
      console.error('Error details:', {
        text: error.text,
        message: error.message,
        status: error.status
      });
      return { success: false, error: error.text || error.message };
    }
  }

  form.addEventListener('submit', async function(e){
    e.preventDefault();
    const v = validateRequired();
    if(!v.ok){
      showMessage('Please complete the required field marked with *.', false);
      return;
    }
    // Simple email check
    const email = document.getElementById('email').value;
    if(!/@/.test(email)){
      showMessage('Please enter a valid email address.', false);
      return;
    }
    
    // Disable submit button during processing
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    showMessage('Sending your form, please wait...', true);

    // Collect form data
    const data = collectFormData();
    
    // Send email
    const emailResult = await sendEmail(data);
    
    if (emailResult.success) {
      // Store JSON for download
    window._latestFormJSON = JSON.stringify(data, null, 2);
    downloadBtn.disabled = false;
      
      // Redirect to thank you page
      window.location.href = 'thank-you.html';
    } else {
      // Show error message
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit';
      showMessage('Failed to send form. Please try again or contact us directly.', false);
    }
  });

  downloadBtn.addEventListener('click', function(){
    if(!window._latestFormJSON){
      showMessage('No form data available to download. Please submit the form first.', false);
      return;
    }
    const blob = new Blob([window._latestFormJSON], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tenant_prescreening.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  // Small enhancement: phone input placeholder helper for UK numbers
  const phone = document.getElementById('phone');
  phone.addEventListener('input', function(){
    // allow only digits, spaces, + and ()
    this.value = this.value.replace(/[^0-9 +()\-]/g, '');
  });

})();
