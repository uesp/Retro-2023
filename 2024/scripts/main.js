// Initialization
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-GY6DBN7NTF');

// Functions

function scrollDown() {
	document.getElementById("intro").scrollIntoView({ behavior: 'smooth'});
}

document.body.addEventListener('scroll', () => {
	const blurDiv = document.getElementById('blur');
	const scrollPosition = document.body.scrollTop || document.documentElement.scrollTop;
	const vh = window.innerHeight; // Viewport height in pixels
	const opacity = Math.min(scrollPosition / (vh/2), 1); // Normalize to 1 vh
	blurDiv.style.opacity = opacity;
});