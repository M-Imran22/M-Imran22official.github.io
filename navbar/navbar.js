// navbar.js
document.addEventListener("DOMContentLoaded", function () {
  fetch("navbar/navbar.html")
    .then((response) => response.text())
    .then((data) => {
      document.querySelector("body").insertAdjacentHTML("afterbegin", data);
    });
});

function toggleMenu() {
  const navLinks = document.querySelector(".nav-links");
  const hamburger = document.querySelector(".hamburger");
  navLinks.classList.toggle("active");
  hamburger.classList.toggle("active");
}

function toggleSidebar() {
  document.querySelector(".notes-side-bar").classList.toggle("open");
}
