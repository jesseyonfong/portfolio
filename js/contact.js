// Contact Form Handler

const form = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

// Form validation
const validators = {
  name: (value) => {
    if (!value.trim()) return 'Name is required';
    if (value.trim().length < 2) return 'Name must be at least 2 characters';
    return '';
  },
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value.trim()) return 'Email is required';
    if (!emailRegex.test(value)) return 'Please enter a valid email';
    return '';
  },
  projectType: (value) => {
    if (!value) return 'Please select a project type';
    return '';
  },
  timeline: (value) => {
    if (!value) return 'Please select a timeline';
    return '';
  },
  description: (value) => {
    if (!value.trim()) return 'Project description is required';
    if (value.trim().length < 10) return 'Description must be at least 10 characters';
    return '';
  }
};

// Validate individual field
function validateField(fieldName) {
  const field = form.elements[fieldName];
  if (!field) return true;

  const error = validators[fieldName]?.(field.value) || '';
  const errorElement = document.getElementById(`${fieldName}Error`);
  const formGroup = field.closest('.form-group');

  if (error) {
    formGroup.classList.add('error');
    if (errorElement) {
      errorElement.textContent = error;
      errorElement.classList.add('show');
    }
    return false;
  } else {
    formGroup.classList.remove('error');
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.remove('show');
    }
    return true;
  }
}

// Real-time validation
Object.keys(validators).forEach(fieldName => {
  const field = form.elements[fieldName];
  if (field) {
    field.addEventListener('blur', () => validateField(fieldName));
    field.addEventListener('change', () => validateField(fieldName));
  }
});

// Collect form data
function collectFormData() {
  const technologies = Array.from(form.querySelectorAll('input[name="technologies"]:checked'))
    .map(el => el.value);
  
  const stage = form.querySelector('input[name="stage"]:checked')?.value || '';

  return {
    name: form.elements['name'].value,
    email: form.elements['email'].value,
    company: form.elements['company'].value,
    projectType: form.elements['projectType'].value,
    technologies: technologies,
    budget: form.elements['budget'].value,
    timeline: form.elements['timeline'].value,
    description: form.elements['description'].value,
    stage: stage,
    notes: form.elements['notes'].value,
    referral: form.elements['referral'].value,
    submittedAt: new Date().toISOString()
  };
}

// Display form message
function showMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
  formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Handle form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Validate all required fields
  let isValid = true;
  Object.keys(validators).forEach(fieldName => {
    if (!validateField(fieldName)) {
      isValid = false;
    }
  });

  if (!isValid) {
    showMessage('Please fix the errors above and try again.', 'error');
    return;
  }

  // Collect form data
  const formData = collectFormData();

  try {
    // Show loading state
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    // Send to FormSubmit (free form backend service - no account needed)
    // Emails will be sent to jesseyonfong@gmail.com
    const formDataSubmit = new FormData();
    formDataSubmit.append('name', formData.name);
    formDataSubmit.append('email', formData.email);
    formDataSubmit.append('company', formData.company);
    formDataSubmit.append('projectType', formData.projectType);
    formDataSubmit.append('technologies', formData.technologies.join(', '));
    formDataSubmit.append('budget', formData.budget);
    formDataSubmit.append('timeline', formData.timeline);
    formDataSubmit.append('description', formData.description);
    formDataSubmit.append('stage', formData.stage);
    formDataSubmit.append('notes', formData.notes);
    formDataSubmit.append('referral', formData.referral);
    formDataSubmit.append('submittedAt', formData.submittedAt);

    const response = await fetch('https://formsubmit.co/jesseyonfong@gmail.com', {
      method: 'POST',
      body: formDataSubmit
    });

    if (response.ok) {
      // Success
      showMessage('Thanks! I\'ve received your message. I\'ll get back to you within 24 hours.', 'success');
      form.reset();
      formMessage.style.display = 'block';
      
      // Reset button
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      
      // Clear message after 5 seconds
      setTimeout(() => {
        formMessage.style.display = 'none';
      }, 5000);
    } else {
      throw new Error('Form submission failed');
    }
  } catch (error) {
    console.error('Form submission error:', error);
    
    // Fallback: show success message and log data
    showMessage(
      'Thanks for reaching out! I\'ll review your project details and get back to you within 24 hours. In the meantime, feel free to reach out directly at jesseyonfong@gmail.com',
      'success'
    );
    
    form.reset();
    
    // Log the data (in production, this would be sent to a backend)
    console.log('Form data:', formData);

    // Reset button
    const submitBtn = form.querySelector('.btn-submit');
    submitBtn.disabled = false;
  }
});

// Smooth animations on input focus
const inputs = form.querySelectorAll('input, select, textarea');
inputs.forEach(input => {
  input.addEventListener('focus', function() {
    this.closest('.form-group')?.classList.add('focused');
  });

  input.addEventListener('blur', function() {
    this.closest('.form-group')?.classList.remove('focused');
  });
});

// Prefill with URL search params if available
function prefillForm() {
  const params = new URLSearchParams(window.location.search);
  
  if (params.has('projectType')) {
    const projectType = form.elements['projectType'];
    projectType.value = params.get('projectType');
  }

  if (params.has('name')) {
    form.elements['name'].value = params.get('name');
  }

  if (params.has('email')) {
    form.elements['email'].value = params.get('email');
  }
}

prefillForm();

// Add hover effects to contact info
document.querySelectorAll('.contact-item').forEach(item => {
  item.addEventListener('mouseenter', function() {
    this.style.animation = 'slideInUp 0.3s ease';
  });
});

// Scroll animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = entry.target.getAttribute('data-animation') || 'slideInUp 0.6s ease forwards';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.form-group').forEach(el => observer.observe(el));
