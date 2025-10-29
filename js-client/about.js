// Counter animation on scroll
const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute("data-target");
        let count = 0;
        const increment = target / 200;

        const updateCounter = () => {
          count += increment;
          if (count < target) {
            counter.innerText = Math.ceil(count);
            requestAnimationFrame(updateCounter);
          } else {
            counter.innerText = target;
          }
        };
        updateCounter();

        observer.unobserve(counter); // stop observing once animated
      }
    });
  },
  { threshold: 0.5 }
); // animate when 50% visible

counters.forEach((counter) => {
  counterObserver.observe(counter);
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document
      .querySelector(this.getAttribute("href"))
      .scrollIntoView({ behavior: "smooth" });
  });
});

// Mobile menu toggle
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

// this will close mobile menu when any of the link is clicked
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