// Form elements
const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const subjectInput = document.getElementById('subject');
const messageInput = document.getElementById('message');

// Error display functions
function showError(input, message) {
    const formControl = input.parentElement;
    formControl.className = 'form-control error';
    const small = formControl.querySelector('small');
    if (small) {
        small.innerText = message;
    }
}

function showSuccess(input) {
    const formControl = input.parentElement;
    formControl.className = 'form-control success';
}

// Email validation
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Form event listeners
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        let isValid = true;

        // Name validation
        if (nameInput.value.trim() === '') {
            showError(nameInput, 'Name is required');
            isValid = false;
        } else if (nameInput.value.trim().length < 2) {
            showError(nameInput, 'Name must be at least 2 characters');
            isValid = false;
        } else {
            showSuccess(nameInput);
        }

        // Email validation
        if (emailInput.value.trim() === '') {
            showError(emailInput, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(emailInput.value.trim())) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        } else {
            showSuccess(emailInput);
        }

        // Subject validation
        if (subjectInput.value.trim() === '') {
            showError(subjectInput, 'Subject is required');
            isValid = false;
        } else if (subjectInput.value.trim().length < 5) {
            showError(subjectInput, 'Subject must be at least 5 characters');
            isValid = false;
        } else {
            showSuccess(subjectInput);
        }

        // Message validation
        if (messageInput.value.trim() === '') {
            showError(messageInput, 'Message is required');
            isValid = false;
        } else if (messageInput.value.trim().length < 20) {
            showError(messageInput, 'Message must be at least 20 characters');
            isValid = false;
        } else {
            showSuccess(messageInput);
        }

        // If form is valid, simulate form submission
        if (isValid) {
            // Create a loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<span class="loading loading-spinner"></span> Sending...';
            submitButton.disabled = true;

            // Simulate API call with setTimeout
            setTimeout(() => {
                // Create success alert using DaisyUI
                const alert = document.createElement('div');
                alert.className = 'alert alert-success mt-4';
                alert.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Thank you for your message! We will get back to you soon.</span>
                `;
                
                // Reset form and show success message
                contactForm.reset();
                contactForm.appendChild(alert);
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;

                // Clear all success indicators
                document.querySelectorAll('.form-control').forEach(control => {
                    control.className = 'form-control';
                });
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    alert.remove();
                }, 5000);
            }, 1500); // Simulate 1.5s API delay
        }
    });
}

// Real-time validation
const inputs = [nameInput, emailInput, subjectInput, messageInput];
inputs.forEach(input => {
    if (input) {
        input.addEventListener('input', function() {
            // Clear error state when user starts typing
            const formControl = input.parentElement;
            formControl.className = 'form-control';
            const small = formControl.querySelector('small');
            if (small) small.innerText = '';
        });

        input.addEventListener('blur', function() {
            // Validate on blur
            if (input.value.trim() === '') {
                showError(input, `${input.id.charAt(0).toUpperCase() + input.id.slice(1)} is required`);
            } else {
                switch(input.id) {
                    case 'name':
                        if (input.value.trim().length < 2) {
                            showError(input, 'Name must be at least 2 characters');
                        } else {
                            showSuccess(input);
                        }
                        break;
                    case 'email':
                        if (!isValidEmail(input.value.trim())) {
                            showError(input, 'Please enter a valid email address');
                        } else {
                            showSuccess(input);
                        }
                        break;
                    case 'subject':
                        if (input.value.trim().length < 5) {
                            showError(input, 'Subject must be at least 5 characters');
                        } else {
                            showSuccess(input);
                        }
                        break;
                    case 'message':
                        if (input.value.trim().length < 20) {
                            showError(input, 'Message must be at least 20 characters');
                        } else {
                            showSuccess(input);
                        }
                        break;
                }
            }
        });
    }
});
