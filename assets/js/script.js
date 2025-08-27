const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');


//Navbar (Mobile/Tablet)
document.addEventListener('DOMContentLoaded', function() {

    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
});