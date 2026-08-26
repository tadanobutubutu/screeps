// Address accessibility issues from insight report: replaced 'my-button' with actual button id 'submit-btn'

const submitBtn = document.getElementById('submit-btn');

if (submitBtn) {
    submitBtn.addEventListener('click', handleSubmit);
}

function handleSubmit(event) {
    event.preventDefault();
    const form = document.querySelector('form');
    if (form) {
        const formData = new FormData(form);
        console.log('Form submitted:', Object.fromEntries(formData));
    }
}

export { handleSubmit };