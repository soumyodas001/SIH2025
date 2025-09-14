// Get the signup form
const signupForm = document.getElementById('signupForm');

if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form values
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Basic validation
        if (!fullName || !email || !password || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }

        // Name validation (at least 2 words)
        if (fullName.trim().split(' ').filter(word => word.length > 0).length < 2) {
            alert('Please enter your full name (first and last name)');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Password validation (at least 8 characters, 1 uppercase, 1 lowercase, 1 number)
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            alert('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
            return;
        }

        // Password confirmation
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            // Here you would typically make an API call to your backend to create the account
            // For now, we'll just simulate a successful signup
            console.log('Signup attempt with:', { fullName, email });
            
            // Redirect to login page after successful signup
            alert('Account created successfully! Please login.');
            window.location.href = 'login.html';
            
        } catch (error) {
            console.error('Signup error:', error);
            alert('Signup failed. Please try again.');
        }
    });
}
