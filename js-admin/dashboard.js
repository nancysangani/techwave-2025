// Sidebar toggle
const sidebarToggle = document.getElementById("sidebar-toggle");
const sidebarClose = document.getElementById("sidebar-close");
const mobileSidebar = document.getElementById("mobile-sidebar");
const sidebarBackdrop = document.getElementById("sidebar-backdrop");

function toggleSidebar() {
  mobileSidebar.classList.toggle("-translate-x-full");
  sidebarBackdrop.style.display = mobileSidebar.classList.contains(
    "-translate-x-full"
  )
    ? "none"
    : "block";
  document.body.style.overflow = mobileSidebar.classList.contains(
    "-translate-x-full"
  )
    ? "auto"
    : "hidden";
}

sidebarToggle.addEventListener("click", toggleSidebar);
sidebarClose.addEventListener("click", toggleSidebar);
sidebarBackdrop.addEventListener("click", toggleSidebar);

// Modal functionality
const modal = document.getElementById("event-modal");
const addBtn = document.getElementById("add-event-btn");
const closeModal = document.getElementById("close-modal");

addBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
});

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
  document.body.style.overflow = "auto";
});

// Close modal when clicking outside
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = "auto";
  }
});

// Event management
let events = JSON.parse(localStorage.getItem("events")) || [];
const tableBody = document.querySelector("#events-table tbody");
const totalEvents = document.getElementById("total-events");
function renderEvents() {
  tableBody.innerHTML = "";
  events.forEach((event, index) => {
    const tr = document.createElement("tr");
    tr.classList.add("border-b", "border-purple-400/20");
    tr.innerHTML = `
            <td class="py-2 xs:py-3 px-2 xs:px-3 sm:px-4 text-xs xs:text-sm sm:text-base mobile-text">${event.name}</td>
            <td class="py-2 xs:py-3 px-2 xs:px-3 sm:px-4 text-xs xs:text-sm sm:text-base mobile-text">${event.date}</td>
            <td class="py-2 xs:py-3 px-2 xs:px-3 sm:px-4 text-xs xs:text-sm sm:text-base mobile-text">${event.location}</td>
            <td class="py-2 xs:py-3 px-2 xs:px-3 sm:px-4 action-buttons flex xs:flex-row gap-1 xs:gap-2">
                <button onclick="editEvent(${index})" class="bg-blue-600 hover:bg-blue-700 px-2 xs:px-3 py-1.5 rounded-lg text-white text-xs xs:text-sm transition min-h-[44px] flex items-center justify-center"><i class="fas fa-pen mr-1"></i> Edit</button>
                <button onclick="deleteEvent(${index})" class="bg-red-600 hover:bg-red-700 px-2 xs:px-3 py-1.5 rounded-lg text-white text-xs xs:text-sm transition min-h-[44px] flex items-center justify-center"><i class="fas fa-trash mr-1"></i> Delete</button>
            </td>
        `;
    tableBody.appendChild(tr);
  });
  totalEvents.innerText = events.length;
  localStorage.setItem("events", JSON.stringify(events));
}
renderEvents();

const form = document.getElementById("event-form");
let editIndex = null;
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("event-name").value;
  const date = document.getElementById("event-date").value;
  const location = document.getElementById("event-location").value;
  const time = document.getElementById("event-time").value;
  const speaker = document.getElementById("event-speaker").value;

  if (editIndex !== null) {
    events[editIndex] = { name, date, location, time, speaker };
    showToast("Event updated successfully!");
    editIndex = null;
  } else {
    events.push({ name, date, location, time, speaker });
    showToast("Event added successfully!");
  }
  renderEvents();
  modal.classList.add("hidden");
  document.body.style.overflow = "auto";
  form.reset();
});

function editEvent(index) {
  const event = events[index];
  document.getElementById("event-name").value = event.name;
  document.getElementById("event-date").value = event.date;
  document.getElementById("event-location").value = event.location;
  document.getElementById("event-time").value = event.time;
  document.getElementById("event-speaker").value = event.speaker;
  editIndex = index;
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function deleteEvent(index) {
  if (confirm("Are you sure you want to delete this event?")) {
    events.splice(index, 1);
    renderEvents();
    showToast("Event deleted successfully!");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const speakers = JSON.parse(localStorage.getItem("speakers")) || [];
  const speakerCount = document.getElementById("total-speakers");

  // update speaker count on dashboard when I add speakers
  if (speakerCount) {
    speakerCount.textContent = speakers.length;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Get speakers from localStorage
  const speakers = JSON.parse(localStorage.getItem("speakers")) || [];

  // Update total count
  const speakerCount = document.getElementById("total-speakers");
  if (speakerCount) {
    speakerCount.textContent = speakers.length;
  }

  // To show speakers table on dashboard
  const dashboardSpeakersTable = document.getElementById(
    "dashboard-speakers-table"
  );
  if (dashboardSpeakersTable) {
    dashboardSpeakersTable.innerHTML = speakers
      .map(
        (sp) => `
            <tr class="border-b border-purple-400/20">
                <td class="py-2 xs:py-3 px-2 xs:px-3 sm:px-4 text-xs xs:text-sm sm:text-base mobile-text">${sp.name}</td>
                <td class="py-2 xs:py-3 px-2 xs:px-3 sm:px-4 text-xs xs:text-sm sm:text-base mobile-text">${sp.designation}</td>
                <td class="py-2 xs:py-3 px-2 xs:px-3 sm:px-4 text-xs xs:text-sm sm:text-base mobile-text">${sp.topic}</td>
            </tr>
        `
      )
      .join("");
  }
});

// sponsors count
const sponsors = JSON.parse(localStorage.getItem("sponsors")) || [];
const sponsorCount = document.getElementById("total-sponsors");
if (sponsorCount) {
  sponsorCount.textContent = sponsors.length;
}

function updateTotalRegistrations() {
  const registrations = JSON.parse(localStorage.getItem("registrations")) || [];
  document.getElementById("total-registrations").textContent =
    registrations.length;
}

// Call it once on load
updateTotalRegistrations();

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = message;

  toast.style.background =
    type === "success" ? "rgba(147, 51, 234, 0.85)" : "rgba(239, 68, 68, 0.85)";

  toast.classList.remove("hidden");
  toast.classList.add("toast-show");
  toast.style.opacity = "1";
  toast.style.transform = "translateY(0)";

  setTimeout(() => {
    toast.classList.remove("toast-show");
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    setTimeout(() => {
      toast.classList.add("hidden");
    }, 500);
  }, 3000);
}
