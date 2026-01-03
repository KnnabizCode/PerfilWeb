// Logica de la pantalla de carga
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    // Esperamos a que termine la animacion
    setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        startTyping(); // Empezamos a escribir cuando carga todo
    }, 2800); // 2.5s de animacion + un poquito mas
});

// Logica del efecto de maquina de escribir
const words = ["Developer 💻", "Vagabundo 🦥", "Gaymer 🎮"];
const typingElement = document.querySelector('.typing-text');
const cursorSpan = document.querySelector('.cursor'); // La barrita que parpadea

// Variables para saber que palabra toca
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function startTyping() {
    typeLoop();
}

function typeLoop() {
    const currentWord = words[wordIndex];
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const pauseTime = 3000; // Esperamos 3 segundos

    // Caso especial: si escribimos "Gaymer", hacemos el truco
    if (currentWord === "Gaymer 🎮" && !isDeleting && charIndex === currentWord.length) {
        // Esperamos un segundo y corregimos la palabra
        setTimeout(() => {
            gaymerCorrection();
        }, 1000);
        return;
    }

    if (isDeleting) {
        typingElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(typeLoop, 500); // Pausa peque before de la siguiente
        } else {
            setTimeout(typeLoop, deleteSpeed);
        }
    } else {
        typingElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentWord.length) {
            // Palabra terminada
            if (currentWord === "Gaymer 🎮") {
                // Truco del programador: llamamos de nuevo para que entre al if especial de arriba
                setTimeout(typeLoop, typeSpeed);
            } else {
                isDeleting = true;
                setTimeout(typeLoop, pauseTime);
            }
        } else {
            setTimeout(typeLoop, typeSpeed);
        }
    }
}

// Animacion especial para cambiar "Gaymer" a "Gamer"
function gaymerCorrection() {
    const cursor = document.querySelector('.cursor');
    cursor.style.display = 'none'; // Ocultamos el cursor normal

    // Pasos para mover el cursor, borrar la Y y arreglarlo
    const steps = [
        { text: "Gaymer |🎮", delay: 250 }, // Movemos a la izquierda
        { text: "Gaymer| 🎮", delay: 250 },
        { text: "Gayme|r 🎮", delay: 250 },
        { text: "Gaym|er 🎮", delay: 250 },
        { text: "Gay|mer 🎮", delay: 250 }, // Llegamos a la Y
        { text: "Ga|mer 🎮", delay: 400 },  // Borramos la Y
        { text: "Gam|er 🎮", delay: 250 },  // Movemos a la derecha
        { text: "Game|r 🎮", delay: 250 },
        { text: "Gamer| 🎮", delay: 250 },
        { text: "Gamer |🎮", delay: 250 },
        { text: "Gamer 🎮|", delay: 250 }   // Final
    ];

    let stepIndex = 0;

    function playSequence() {
        if (stepIndex < steps.length) {
            const step = steps[stepIndex];
            typingElement.innerHTML = step.text;
            stepIndex++;
            setTimeout(playSequence, step.delay);
        } else {
            // Termino la correccion, mostramos "Gamer" bien
            typingElement.textContent = "Gamer 🎮";
            cursor.style.display = 'inline';

            // Esperamos 3 segundos y borramos todo
            setTimeout(() => {
                deleteGamer();
            }, 3000);
        }
    }

    playSequence();
}

function deleteGamer() {
    let text = "Gamer 🎮";
    let index = text.length;

    // Borramos "Gamer" letra por letra
    function deleteStep() {
        if (index > 0) {
            index--;
            typingElement.textContent = text.substring(0, index);
            setTimeout(deleteStep, 50); // Velocidad de borrado
        } else {
            // Todo borrado, seguimos con la siguiente palabra
            isDeleting = false;
            charIndex = 0;
            wordIndex = (wordIndex + 1) % words.length; // Toca 'Developer'
            setTimeout(typeLoop, 500);
        }
    }
    deleteStep();
}

// Control del GIF del avatar
const avatarImg = document.getElementById('avatar-img');
if (avatarImg) {
    avatarImg.addEventListener('mouseenter', () => {
        avatarImg.src = '/assets/avatar/avatar.gif';
    });
    avatarImg.addEventListener('mouseleave', () => {
        avatarImg.src = '/assets/avatar/avatar.png';
    });
}

// Resaltar el enlace activo al hacer scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

const observerOptions = {
    threshold: 0.3 // Se activa cuando se ve el 30% de la seccion
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});
