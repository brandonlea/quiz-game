const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

const toggleNavbar = () => {
    navLinks.classList.toggle('active');
}

//Navbar (Mobile/Tablet) Event
hamburger.addEventListener("click", toggleNavbar());

