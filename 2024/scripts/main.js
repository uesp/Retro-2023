window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-GY6DBN7NTF');

function scrollDown() {
	document.getElementById("intro").scrollIntoView({ behavior: 'smooth'});
}


const cardContainer = document.querySelector('.card-container');
const card = document.querySelector('.card');

let isFlipped = false;

// Tilt effect on mousemove
cardContainer.addEventListener('mousemove', (e) => {
    const rect = cardContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    if (!isFlipped) {
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
});

// Reset tilt effect on mouse leave
cardContainer.addEventListener('mouseleave', () => {
    if (!isFlipped) {
        card.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }
});

// Flip card on click
cardContainer.addEventListener('click', () => {
    isFlipped = !isFlipped;

    if (isFlipped) {
        card.classList.add('flipped');
        // Ensure tilt is disabled after flipping
        card.style.transform = 'rotateY(180deg)';
    } else {
        card.classList.remove('flipped');
        card.style.transform = 'rotateX(0deg) rotateY(0deg)'; // Reset tilt when unflipping
    }
});

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');

function openLightbox(image) {
	lightboxImage.src = image.src;
	lightbox.showModal();
}

lightbox.addEventListener('click', (event) => {
	if (event.target === lightbox) {
		closeLightbox();
	}
});

document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape') {
		closeLightbox();
	}
});

function closeLightbox() {
    lightbox.classList.add('closing');
    setTimeout(() => {
        lightbox.close();
        lightbox.removeAttribute('open');
        lightbox.classList.remove('closing');
    }, 300); // Match the animation duration
}