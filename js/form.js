/**
 * Mel Asseraf Website — Contact Form Handler
 * Client-side validation + Formspree submission
 */

(function () {
  'use strict';

  var form = document.querySelector('.contact-form');
  if (!form) return;

  var submitBtn = form.querySelector('button[type="submit"]');
  var submitText = submitBtn ? submitBtn.textContent : 'Send Message';

  form.addEventListener('submit', function (e) {
    // Client-side validation
    var isValid = true;
    var requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(function (field) {
      clearError(field);

      if (!field.value.trim()) {
        showError(field, 'This field is required.');
        isValid = false;
      } else if (field.type === 'email' && !isValidEmail(field.value)) {
        showError(field, 'Please enter a valid email address.');
        isValid = false;
      }
    });

    if (!isValid) {
      e.preventDefault();
      // Focus first error field
      var firstError = form.querySelector('.form__group--error input, .form__group--error textarea, .form__group--error select');
      if (firstError) firstError.focus();
      return;
    }

    // Show loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }
  });

  // Clear errors on input
  form.querySelectorAll('input, textarea, select').forEach(function (field) {
    field.addEventListener('input', function () {
      clearError(this);
    });
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(field, message) {
    var group = field.closest('.form__group');
    if (!group) return;

    group.classList.add('form__group--error');

    var errorEl = group.querySelector('.form__error');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'form__error';
      errorEl.setAttribute('role', 'alert');
      group.appendChild(errorEl);
    }
    errorEl.textContent = message;

    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', errorEl.id || '');
  }

  function clearError(field) {
    var group = field.closest('.form__group');
    if (!group) return;

    group.classList.remove('form__group--error');

    var errorEl = group.querySelector('.form__error');
    if (errorEl) errorEl.remove();

    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
  }

  // Check for Formspree success redirect
  if (window.location.search.includes('success=true')) {
    var formContainer = document.querySelector('.contact-form-container');
    if (formContainer) {
      formContainer.innerHTML =
        '<div class="form-success" style="text-align:center;padding:var(--space-lg) 0;">' +
        '<h3 style="font-family:var(--font-heading);font-size:var(--fs-h2);margin-bottom:var(--space-sm);">Message Sent!</h3>' +
        '<p style="color:var(--color-charcoal-light);">Thank you for reaching out. Chef Mel will get back to you soon.</p>' +
        '</div>';
    }
  }
})();
