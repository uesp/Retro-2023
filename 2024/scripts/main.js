// Variables
window.dataLayer = window.dataLayer || [];
const cardContainer = document.querySelector('.card-container');
const card = document.querySelector('.card');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
let isFlipped = false;

// Functions
function gtag(){dataLayer.push(arguments);}
function scrollDown() {
	document.getElementById("intro").scrollIntoView({ behavior: 'smooth'});
}
function openLightbox(image) {
	lightboxImage.src = image.src;
	lightbox.showModal();
}
function closeLightbox() {
    lightbox.classList.add('closing');
    setTimeout(() => {
        lightbox.close();
        lightbox.removeAttribute('open');
        lightbox.classList.remove('closing');
    }, 300); // Match the animation duration
}

// Event Listeners
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
cardContainer.addEventListener('mouseleave', () => {
    if (!isFlipped) {
        card.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }
});
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

document.addEventListener('DOMContentLoaded', () => {
	const title = document.getElementById('title');

	title.addEventListener('mouseover', (event) => {
		event.target.style.pointerEvents = 'none';
		const belowElement = document.elementFromPoint(event.clientX, event.clientY);
		event.target.style.pointerEvents = 'auto';
		if (belowElement) {
			const hoverEvent = new MouseEvent('mouseover', {
				bubbles: true,
				cancelable: true,
				clientX: event.clientX,
				clientY: event.clientY
			});
			belowElement.dispatchEvent(hoverEvent);
		}
	});

	title.addEventListener('click', (event) => {
		event.target.style.pointerEvents = 'none';
		const belowElement = document.elementFromPoint(event.clientX, event.clientY);
		event.target.style.pointerEvents = 'auto';
		if (belowElement) {
			const clickEvent = new MouseEvent('click', {
				bubbles: true,
				cancelable: true,
				clientX: event.clientX,
				clientY: event.clientY
			});
			belowElement.dispatchEvent(clickEvent);
		}
	});
});

// Initialization
gtag('js', new Date());
gtag('config', 'G-GY6DBN7NTF');



window.onbeforeunload = function () {
	window.scrollTo(0, 0);
};