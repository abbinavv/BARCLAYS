// Wait for the DOM to fully load before executing the script
document.addEventListener('DOMContentLoaded', () => {
    // Select all buttons with the class 'card'
    const buttons = document.querySelectorAll('button.card');

    // Check if buttons are found to avoid errors
    if (buttons.length === 0) {
        console.warn('No buttons with class "card" found on the page.');
        return;
    }

    // Function to redirect to the /analyze page
    const redirectToAnalyzePage = () => {
        try {
            // Redirect to the /analyze page in the same tab
            window.location.href = '/analyze';
        } catch (error) {
            // Log any errors that occur during redirection
            console.error('Error redirecting to /analyze page:', error);
            // Alert the user if redirection fails
            alert('Unable to redirect to the analysis page. Please try again.');
        }
    };

    // Add a click event listener to each button to trigger redirection
    buttons.forEach(button => {
        button.addEventListener('click', redirectToAnalyzePage);
    });
});