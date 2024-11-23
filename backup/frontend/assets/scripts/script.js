document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('email');
    const emailSignupButton = document.getElementById('emailSignup');

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function updateButtonState() {
        emailSignupButton.disabled = !validateEmail(emailInput.value);
    }

    emailInput.addEventListener('input', updateButtonState);

    // Add animation class to title
    const title = document.querySelector('.title');
    title.classList.add('animate-fade-in');
});
