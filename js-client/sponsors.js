// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Mobile menu toggle
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    const spans = menuBtn.querySelectorAll("span");
    spans[0].classList.toggle("rotate-45");
    spans[1].classList.toggle("opacity-0");
    spans[2].classList.toggle("-rotate-45");

    if (mobileMenu.classList.contains("hidden")) {
      mobileMenu.classList.remove("hidden");
    } else {
      mobileMenu.classList.add("hidden");
    }
  });

  document.querySelectorAll("#mobile-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
      const spans = menuBtn.querySelectorAll("span");
      spans[0].classList.remove("rotate-45");
      spans[1].classList.remove("opacity-0");
      spans[2].classList.remove("-rotate-45");
    });
  });
}

let currentIndex = 0;
let autoAdvanceInterval;

// simple carousel
function loadSponsorsCarousel() {
  const sponsors = JSON.parse(localStorage.getItem("sponsors")) || [];
  console.log("Loading sponsors:", sponsors);

  const track = document.getElementById("carousel-track");
  const indicatorsContainer = document.getElementById("carousel-indicators");
  const noSponsors = document.getElementById("no-sponsors");

  if (!track) {
    console.error("Carousel track not found");
    return;
  }

  // Clear existing content
  track.innerHTML = "";
  if (indicatorsContainer) {
    indicatorsContainer.innerHTML = "";
  }

  // Clear any existing interval
  if (autoAdvanceInterval) {
    clearInterval(autoAdvanceInterval);
  }

  if (sponsors.length === 0) {
    console.log("No sponsors found");
    if (track.parentElement) track.parentElement.classList.add("hidden");
    if (noSponsors) noSponsors.classList.remove("hidden");
    return;
  }

  console.log(`Found ${sponsors.length} sponsors`);

  // Show carousel
  if (track.parentElement) track.parentElement.classList.remove("hidden");
  if (noSponsors) noSponsors.classList.add("hidden");

  sponsors.forEach((sponsor, index) => {
    const carouselItem = document.createElement("div");
    carouselItem.className =
      "carousel-item flex-shrink-0 w-64 h-32 mx-4 flex items-center justify-center bg-white/5 backdrop-blur-md rounded-2xl shadow-lg shadow-purple-900/30 transition-all";
    carouselItem.setAttribute("data-index", index);

    if (sponsor.logo && sponsor.logo.trim() !== "") {
      carouselItem.innerHTML = `
        <div class="flex items-center justify-center w-full h-full p-4">
            <img src="${sponsor.logo}" alt="${sponsor.name}" 
                 class="max-w-full max-h-full w-auto h-auto object-contain opacity-80 hover:opacity-100 transition-opacity">
        </div>
    `;
    } else {
      carouselItem.innerHTML = `
        <div class="text-white font-semibold text-center px-4">
            <div class="text-lg">${sponsor.name}</div>
            <div class="text-sm text-gray-400 mt-1">${
              sponsor.tier || "Partner"
            }</div>
        </div>
    `;
    }

    track.appendChild(carouselItem);
  });

  if (indicatorsContainer) {
    sponsors.forEach((_, index) => {
      const indicator = document.createElement("div");
      indicator.className = `w-3 h-3 rounded-full bg-gray-600 indicator cursor-pointer transition-all ${
        index === 0 ? "active bg-purple-500" : ""
      }`;
      indicator.setAttribute("data-index", index);

      indicator.addEventListener("click", () => {
        currentIndex = index;
        updateCarousel();
      });

      indicatorsContainer.appendChild(indicator);
    });
  }

  // Reset current index
  currentIndex = 0;

  // Initialize carousel after a small delay to ensure DOM is updated
  setTimeout(() => {
    initializeSimpleCarousel();
  }, 100);
}

function initializeSimpleCarousel() {
  const track = document.getElementById("carousel-track");
  const items = document.querySelectorAll(".carousel-item");
  const indicators = document.querySelectorAll(".indicator");

  if (items.length === 0) {
    console.log("No carousel items found");
    return;
  }

  const itemWidth = items[0].offsetWidth + 32;

  function updateCarousel() {
    if (!track) return;

    const offset =
      track.offsetWidth / 2 - itemWidth / 2 - currentIndex * itemWidth;
    track.style.transform = `translateX(${offset}px)`;

    // Update indicators
    indicators.forEach((indicator, index) => {
      if (index === currentIndex) {
        indicator.classList.add("active", "bg-purple-500");
        indicator.classList.remove("bg-gray-600");
      } else {
        indicator.classList.remove("active", "bg-purple-500");
        indicator.classList.add("bg-gray-600");
      }
    });

    // Update item styles
    items.forEach((item, index) => {
      if (index === currentIndex) {
        item.classList.add("scale-105", "opacity-100", "shadow-xl");
        item.classList.remove("scale-95", "opacity-70");
      } else {
        item.classList.add("scale-95", "opacity-70");
        item.classList.remove("scale-105", "opacity-100", "shadow-xl");
      }
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % items.length;
    updateCarousel();
  }

  // Auto-advance only (no manual navigation)
  autoAdvanceInterval = setInterval(nextSlide, 1000);

  // Pause on hover
  if (track) {
    track.addEventListener("mouseenter", () => {
      clearInterval(autoAdvanceInterval);
    });
    track.addEventListener("mouseleave", () => {
      autoAdvanceInterval = setInterval(nextSlide, 2000);
    });
  }

  // Initial update
  updateCarousel();

  // Handle window resize
  window.addEventListener("resize", function () {
    updateCarousel();
  });
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded - initializing sponsors carousel");
  loadSponsorsCarousel();
});

// Reload when storage changes (from my admin panel)
window.addEventListener("storage", function (e) {
  if (e.key === "sponsors") {
    console.log("Sponsors updated - reloading carousel");
    loadSponsorsCarousel();
  }
});

// Manual refresh for testing
window.refreshSponsors = function () {
  console.log("Manual refresh triggered");
  loadSponsorsCarousel();
};

function redirectToRegister() {
  window.location.href = "index.html?register=open";
}
