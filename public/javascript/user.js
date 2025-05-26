const form = document.getElementById('register');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');


form.addEventListener('submit', (e) => {
    e.preventDefault();
    validateForm();
});

function validateForm() {
    let isFormValid = true; 

    // Validate Username
    if (username.value.trim() === '') {
        setError(username, 'Username cannot be empty');
        isFormValid = false;
    } else if (!isValidUsername(username.value.trim())) {
        setError(username, 'Username is not valid!');
        isFormValid = false;
    } else if (username.value.trim().length < 5 || username.value.trim().length > 15) {
        setError(username, 'Username must have a minimum of 5 characters and a maximum of 15 characters');
        isFormValid = false;
    } else {
        setSuccess(username);
    }

    // Validate Email
    if (email.value.trim() === '') {
        setError(email, 'Email cannot be empty');
        isFormValid = false;
    } else if (!isValidEmail(email.value.trim())) {
        setError(email, 'Email is not valid');
        isFormValid = false;
    } else if (email.value.trim().length < 6 || email.value.trim().length > 50) {
        setError(email, 'Email must have a minimum of 6 characters and a maximum of 50 characters');
        isFormValid = false;
    } else {
        setSuccess(email);
    }

    // Validate Password
    if (password.value.trim() === '') {
        setError(password, 'Password cannot be empty');
        isFormValid = false;
    } else if (password.value.trim().length < 6 || password.value.trim().length > 10) {
        setError(password, 'Password must have a minimum of 6 characters and a maximum of 10 characters!');
        isFormValid = false;
    } else if (!isValidPassword(password.value.trim())) {
        setError(password, 'Password must include at least one uppercase letter, one lowercase letter, and one number.');
        isFormValid = false;
    } else {
        setSuccess(password);
    }

    // If the form is valid, you can submit it or perform any further actions
    if (isFormValid) {
        confirmationMessage.textContent = 'Your form has been submitted successfully!';
        confirmationMessage.style.display = 'block'; // Show the success message

        // Clear the form
        clearForm();
    }
}

// Function to clear the form
function clearForm() {
    form.reset(); // Reset form fields
    confirmationMessage.textContent = ''; // Clear the confirmation message

    // Clear validation states
    [username, email, password].forEach(field => {
        const parent = field.parentElement;
        parent.classList.remove('error', 'success');
        const paragraph = parent.querySelector('p');
        paragraph.textContent = ''; // Clear any error/success messages
    });

    // Reset terms checkbox
    termsCheckbox.checked = false;
}

// Set error function
function setError(element, errorMessage) {
    const parent = element.parentElement;
    parent.classList.add('error');
    parent.classList.remove('success'); // Ensure success class is removed
    const paragraph = parent.querySelector('p');
    paragraph.textContent = errorMessage;

    // Hide check icon and show exclamation icon
    parent.querySelector('.fa-check-circle').style.display = 'none';
    parent.querySelector('.fa-exclamation-circle').style.display = 'inline';
}

// Set success function
function setSuccess(element) {
    const parent = element.parentElement;
    parent.classList.remove('error');
    parent.classList.add('success');
    const paragraph = parent.querySelector('p');
    paragraph.textContent = ''; // Clear the error message

    // Show check icon and hide exclamation icon
    parent.querySelector('.fa-check-circle').style.display = 'inline';
    parent.querySelector('.fa-exclamation-circle').style.display = 'none';
}

// Validation functions
function isValidUsername(username) {
    const regex = /^(?![-_])(?!.*[-_]$)[A-Za-z0-9-_]{5,15}$/; // Updated length to 5-15
    return regex.test(username);
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple regex for email validation
    return re.test(String(email).toLowerCase());
}

function isValidPassword(password) {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const lengthCheck = password.length >= 6 && password.length <= 10;

    return lengthCheck && hasUpperCase && hasLowerCase && hasNumbers; // Return true if it meets all criteria
}

