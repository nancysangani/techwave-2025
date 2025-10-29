document.querySelectorAll(".accordion-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const content = btn.nextElementSibling;
    content.classList.toggle("active");
    btn.querySelector("span").textContent = content.classList.contains("active")
      ? "-"
      : "+";
  });
});

const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

menuBtn.addEventListener("click", () => {
  const spans = menuBtn.querySelectorAll("span");
  spans[0].classList.toggle("rotate-45");
  spans[1].classList.toggle("opacity-0");
  spans[2].classList.toggle("-rotate-45");

  if (mobileMenu.classList.contains("hidden")) {
    mobileMenu.classList.remove("hidden");
    mobileMenu.classList.remove("mobile-slide-up");
    mobileMenu.classList.add("mobile-slide-down");
  } else {
    mobileMenu.classList.remove("mobile-slide-down");
    mobileMenu.classList.add("mobile-slide-up");

    mobileMenu.addEventListener("animationend", function hideMenu() {
      mobileMenu.classList.add("hidden");
      mobileMenu.removeEventListener("animationend", hideMenu);
    });
  }
});

// Close mobile menu when any link is clicked
document.querySelectorAll("#mobile-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("mobile-slide-down");
    mobileMenu.classList.add("mobile-slide-up");

    const spans = menuBtn.querySelectorAll("span");
    spans[0].classList.remove("rotate-45");
    spans[1].classList.remove("opacity-0");
    spans[2].classList.remove("-rotate-45");

    mobileMenu.addEventListener("animationend", function hideMenu() {
      mobileMenu.classList.add("hidden");
      mobileMenu.removeEventListener("animationend", hideMenu);
    });
  });
});

function redirectToRegister() {
  window.location.href = 'index.html?register=open';
}