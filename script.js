const $ = (id) => document.getElementById(id);

const form = $('regForm');
const successBanner = $('successBanner');
const fields = ['fullName', 'email', 'phone', 'password', 'confirmPassword'];

form.addEventListener('submit', function (e) {
  e.preventDefault();
  return handleSubmit(e);
});

function validateName(value) {
  if (!value || value.trim().length === 0) return 'Full name is required.';
  if (value.trim().length < 5) return 'Name must be at least 5 characters long.';
  return '';
}

function validateEmail(value) {
  if (!value) return 'Email is required.';
  const simpleEmailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!simpleEmailRe.test(value.trim())) return 'Enter a valid email address.';
  return '';
}

function validatePhone(value) {
  if (!value) return 'Phone number is required.';
  const digits = value.replace(/[^0-9]/g, '');
  if (digits.length !== 10) return 'Phone number must contain exactly 10 digits.';
  const banned = ['123456789', '1234567890'];
  if (banned.includes(digits)) return 'Enter a valid phone number.';
  return '';
}

function validatePassword(value, fullName) {
  if (!value) return 'Password is required.';
  if (value.length < 8) return 'Password must be at least 8 characters.';
  if (value.toLowerCase() === 'password') return 'Password cannot be "password".';
  const normalizedName = (fullName || '').replace(/\s+/g, '').toLowerCase();
  const normalizedPassword = value.replace(/\s+/g, '').toLowerCase();
  if (normalizedPassword === normalizedName) return 'Password cannot be same as your name.';
  if (!(/[a-zA-Z]/.test(value) && /[0-9]/.test(value))) {
    return 'Password should include letters and numbers.';
  }
  return '';
}

function validateConfirmPassword(confirmValue, passwordValue) {
  if (!confirmValue) return 'Please confirm your password.';
  if (confirmValue !== passwordValue) return 'Passwords do not match.';
  return '';
}

function showError(fieldId, message) {
  const input = $(fieldId);
  const errEl = $(fieldId + 'Error');
  if (message) {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    errEl.textContent = message;
  } else {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    errEl.textContent = '';
  }
}

function clearAllValidation() {
  fields.forEach(id => {
    const el = $(id);
    if (el) {
      el.classList.remove('is-invalid', 'is-valid');
    }
    const err = $(id + 'Error');
    if (err) err.textContent = '';
  });
  successBanner.style.display = 'none';
}

function validateField(evt) {
  const target = evt.target;
  const id = target.id;
  let error = '';
  const value = target.value;

  if (id === 'fullName') {
    error = validateName(value);
  } else if (id === 'email') {
    error = validateEmail(value);
  } else if (id === 'phone') {
    error = validatePhone(value);
  } else if (id === 'password') {
    const fullNameVal = $('fullName').value;
    error = validatePassword(value, fullNameVal);
  } else if (id === 'confirmPassword') {
    const passwordVal = $('password').value;
    error = validateConfirmPassword(value, passwordVal);
  }

  showError(id, error);
  return !error;
}

function handleSubmit(event) {
  if (event && event.preventDefault) event.preventDefault();

  clearAllValidation();

  const fullNameVal = $('fullName').value.trim();
  const emailVal = $('email').value.trim();
  const phoneVal = $('phone').value.trim();
  const passwordVal = $('password').value;
  const confirmPasswordVal = $('confirmPassword').value;

  const errors = {
    fullName: validateName(fullNameVal),
    email: validateEmail(emailVal),
    phone: validatePhone(phoneVal),
    password: validatePassword(passwordVal, fullNameVal),
    confirmPassword: validateConfirmPassword(confirmPasswordVal, passwordVal)
  };

  Object.keys(errors).forEach(key => {
    showError(key, errors[key]);
  });

  const hasErrors = Object.values(errors).some(v => v && v.length > 0);

  if (hasErrors) {
    const firstInvalid = fields.find(f => errors[f]);
    if (firstInvalid) $(firstInvalid).focus();
    return false;
  }

  successBanner.style.display = 'block';
  successBanner.textContent = 'Form validated successfully. (Client-side checks passed.)';

  const payload = {
    name: fullNameVal,
    email: emailVal,
    phone: phoneVal.replace(/[^0-9]/g, '')
  };
  console.log('Form payload ready to send:', payload);

  return false;
}

window.validateField = validateField;
window.handleSubmit = handleSubmit;