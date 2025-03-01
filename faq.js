// Seleccionamos todos los botones de preguntas
const faqQuestions = document.querySelectorAll('.faq-question');

// Agregamos un evento de clic a cada pregunta
faqQuestions.forEach((question) => {
    question.addEventListener('click', () => {
        // Obtenemos la respuesta correspondiente a la pregunta
        const answer = question.nextElementSibling;
        
        // Si la respuesta está oculta, la mostramos
        if (answer.style.display === 'none' || answer.style.display === '') {
            // Cerramos todas las respuestas primero
            document.querySelectorAll('.faq-answer').forEach((ans) => {
                ans.style.display = 'none';
            });
            
            // Ahora mostramos la respuesta correspondiente
            answer.style.display = 'block';
        } else {
            // Si la respuesta ya está abierta, la cerramos
            answer.style.display = 'none';
        }
    });
});
