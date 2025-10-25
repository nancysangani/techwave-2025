//countdown timer script
const eventDate = new Date("November 15, 2025 09:00:00").getTime(); // 🎯 Set your event date

const timer = setInterval(() => {
  const now = new Date().getTime();
  const distance = eventDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").innerText = days.toString().padStart(2, "0");
  document.getElementById("hours").innerText = hours
    .toString()
    .padStart(2, "0");
  document.getElementById("minutes").innerText = minutes
    .toString()
    .padStart(2, "0");
  document.getElementById("seconds").innerText = seconds
    .toString()
    .padStart(2, "0");

  if (distance < 0) {
    clearInterval(timer);
    document.getElementById("countdown").innerHTML =
      "<span class='text-3xl text-pink-400 font-bold animate-pulse'>The Event Has Started! 🚀</span>";
  }
}, 1000);

//this code is for smooth scrolling effect
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document
      .querySelector(this.getAttribute("href"))
      .scrollIntoView({ behavior: "smooth" });
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
    // Show menu with slide-down animation
    mobileMenu.classList.remove("hidden");
    mobileMenu.classList.remove("mobile-slide-up");
    mobileMenu.classList.add("mobile-slide-down");
  } else {
    // Slide up animation
    mobileMenu.classList.remove("mobile-slide-down");
    mobileMenu.classList.add("mobile-slide-up");

    // Hide menu after animation completes
    mobileMenu.addEventListener("animationend", function hideMenu() {
      mobileMenu.classList.add("hidden");
      mobileMenu.removeEventListener("animationend", hideMenu);
    });
  }
});

// Close mobile menu when a link is clicked
document.querySelectorAll("#mobile-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    // Slide up animation
    mobileMenu.classList.remove("mobile-slide-down");
    mobileMenu.classList.add("mobile-slide-up");

    // Reset hamburger icon
    const spans = menuBtn.querySelectorAll("span");
    spans[0].classList.remove("rotate-45");
    spans[1].classList.remove("opacity-0");
    spans[2].classList.remove("-rotate-45");

    // Hide menu after animation ends
    mobileMenu.addEventListener("animationend", function hideMenu() {
      mobileMenu.classList.add("hidden");
      mobileMenu.removeEventListener("animationend", hideMenu);
    });
  });
});