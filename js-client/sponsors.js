// Static sponsors data for all devices
const staticSponsorsData = [
  {
    name: "Swiggy",
    contribution: "₹5,00,000",
    email: "partnership@swiggy.com",
    logo: "https://images.seeklogo.com/logo-png/34/2/swiggy-logo-png_seeklogo-348257.png",
  },
  {
    name: "Paytm",
    contribution: "₹3,50,000",
    email: "sponsor@paytm.com",
    logo: "https://images.seeklogo.com/logo-png/30/2/paytm-logo-png_seeklogo-305549.png",
  },
  {
    name: "Meta",
    contribution: "₹2,00,000",
    email: "events@meta.com",
    logo: "https://images.seeklogo.com/logo-png/42/2/meta-icon-new-facebook-2021-logo-png_seeklogo-424014.png",
  },
  {
    name: "Infosys",
    contribution: "₹4,00,000",
    email: "marketing@infosys.com",
    logo: "https://images.seeklogo.com/logo-png/28/2/infosys-limited-logo-png_seeklogo-289643.png",
  },
  {
    name: "Zoho",
    contribution: "₹6,00,000",
    email: "hello@zoho.com",
    logo: "https://images.seeklogo.com/logo-png/27/2/zoho-logo-png_seeklogo-274112.png",
  },
];

function getSponsors() {
  try {
    const localSponsors = JSON.parse(localStorage.getItem("sponsors")) || [];
    if (localSponsors.length === 0) {
      console.log("Using static sponsors data");
      return staticSponsorsData;
    }
    console.log("Using localStorage sponsors data");
    return localSponsors;
  } catch (error) {
    return staticSponsorsData;
  }
}

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

function loadSponsorsCarousel() {
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

  const sponsors = getSponsors();

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
            <div class="text-sm text-gray-400 mt-1">${sponsor.contribution}</div>
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

  // Initialize carousel
  setTimeout(() => {
    initializeCarousel();
  }, 100);
}

function initializeCarousel() {
  const track = document.getElementById("carousel-track");
  const items = document.querySelectorAll(".carousel-item");
  const indicators = document.querySelectorAll(".indicator");

  if (items.length === 0) {
    console.log("No carousel items found");
    return;
  }

  const itemWidth = items[0].offsetWidth + 32; // width + margin

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

  // Auto-advance every 3 seconds
  autoAdvanceInterval = setInterval(nextSlide, 3000);

  // Pause on hover
  if (track) {
    track.addEventListener("mouseenter", () => {
      clearInterval(autoAdvanceInterval);
    });
    track.addEventListener("mouseleave", () => {
      autoAdvanceInterval = setInterval(nextSlide, 3000);
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

// Reload when storage changes (from admin panel)
window.addEventListener("storage", function (e) {
  if (e.key === "sponsors") {
    console.log("Sponsors updated - reloading carousel");
    loadSponsorsCarousel();
  }
});

// normal refresh
window.refreshSponsors = function () {
  console.log("Manual refresh triggered");
  loadSponsorsCarousel();
};

function redirectToRegister() {
  window.location.href = "index.html?register=open";
}
