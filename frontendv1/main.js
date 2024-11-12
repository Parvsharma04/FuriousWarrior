document.querySelector(".menu-toggle").addEventListener("click", function () {
  document.querySelector(".nav-menu").classList.toggle("active");
});

const loginbtn = document.querySelector(".login-btn");
const cart = document.querySelector(".cart");
cart.style.display = "none";
let fullname = localStorage.getItem("fullname");

if (fullname) {
  loginbtn.innerText = "Sign Out";
  cart.style.display = "block";
  loginbtn.addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.removeItem("fullname");
    localStorage.removeItem("email");
    localStorage.removeItem("phone");
    cart.style.display = "none";
    if (loginbtn.innerText === "Sign Out")
      window.location.href = "../frontend/index.html";
  });
} else {
  loginbtn.innerText = "Sign In";
  cart.style.display = "none";
}
