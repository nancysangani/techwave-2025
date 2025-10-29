// sidebar toggle for small screens
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

// modal
const modal = document.getElementById("event-modal");
const addBtn = document.getElementById("add-event-btn");
const closeModal = document.getElementById("close-modal");

function openEventModal() {
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeEventModal() {
  modal.classList.add("hidden");
  document.body.style.overflow = "auto";
  editIndex = null;
  form.reset();
}

addBtn.addEventListener("click", openEventModal);
closeModal.addEventListener("click", closeEventModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeEventModal();
});

// event management
let events = JSON.parse(localStorage.getItem("events")) || [];
let editIndex = null;
let isSearching = false;
let currentDisplayedEvents = [];

const tableBody = document.querySelector("#events-table tbody");
const form = document.getElementById("event-form");
const searchBox = document.getElementById("search-box");

// Render events table
function renderEvents(eventsToRender = null) {
  const list = eventsToRender || events;
  currentDisplayedEvents = list; // Store what's currently displayed

  tableBody.innerHTML = "";

  if (list.length === 0) {
    tableBody.innerHTML = `
                    <tr>
                        <td colspan="5" class="py-8 px-4 text-center text-gray-400">
                            <i class="fas fa-calendar-times mb-2 text-2xl"></i>
                            <p>${
                              isSearching
                                ? "No events found matching your search"
                                : "No events found"
                            }</p>
                        </td>
                    </tr>
                `;
    return;
  }

  list.forEach((event, displayIndex) => {
    const tr = document.createElement("tr");
    tr.classList.add("border-b", "border-purple-400/20");
    tr.innerHTML = `
                    <td class="py-3 px-2 sm:px-4 text-sm sm:text-base mobile-text">${event.name}</td>
                    <td class="py-3 px-2 sm:px-4 text-sm sm:text-base mobile-text">${event.date}</td>
                    <td class="py-3 px-2 sm:px-4 text-sm sm:text-base mobile-text">${event.location}</td>
                    <td class="py-3 px-2 sm:px-4 action-buttons flex gap-2">
                        <button data-index="${displayIndex}" class="edit-btn bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg text-white text-sm transition"><i class="fas fa-pen"></i> Edit</button>
                        <button data-index="${displayIndex}" class="delete-btn bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg text-white text-sm transition"><i class="fas fa-trash"></i> Delete</button>
                    </td>
                `;
    tableBody.appendChild(tr);
  });

  // event listeners for buttons
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const displayIndex = parseInt(btn.dataset.index);
      editEvent(displayIndex);
    });
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const displayIndex = parseInt(btn.dataset.index);
      deleteEvent(displayIndex);
    });
  });

  localStorage.setItem("events", JSON.stringify(events));
}

// initial rendering
renderEvents();

// form submission for adding the event to table
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("event-name").value.trim();
  const date = document.getElementById("event-date").value;
  const location = document.getElementById("event-location").value.trim();
  const time = document.getElementById("event-time").value.trim();
  const speaker = document.getElementById("event-speaker").value.trim();

  if (!name || !date || !location || !time || !speaker) {
    alert("All fields are required!");
    return;
  }

  const eventData = {
    name,
    date,
    location,
    time,
    speaker,
  };

  if (editIndex !== null) {
    // to edit the existing event
    if (isSearching && currentDisplayedEvents[editIndex]) {
      const displayedEvent = currentDisplayedEvents[editIndex];
      const actualIndex = events.findIndex(
        (event) =>
          event.name === displayedEvent.name &&
          event.date === displayedEvent.date
      );
      if (actualIndex !== -1) {
        events[actualIndex] = eventData;
      }
    } else {
      events[editIndex] = eventData;
    }
  } else {
    // adding new event
    events.push(eventData);
  }

  // Save to localStorage and sync across pages
  localStorage.setItem("events", JSON.stringify(events));

  // clear search and show all events (when there's nothing to search)
  searchBox.value = "";
  isSearching = false;
  renderEvents();
  closeEventModal();
});

// to edit or delete
function editEvent(displayIndex) {
  const eventToEdit = currentDisplayedEvents[displayIndex];
  if (!eventToEdit) return;

  document.getElementById("event-name").value = eventToEdit.name;
  document.getElementById("event-date").value = eventToEdit.date;
  document.getElementById("event-location").value = eventToEdit.location;
  document.getElementById("event-time").value = eventToEdit.time;
  document.getElementById("event-speaker").value = eventToEdit.speaker;
  editIndex = displayIndex;
  openEventModal();
}

function deleteEvent(displayIndex) {
  const eventToDelete = currentDisplayedEvents[displayIndex];
  if (!eventToDelete) return;

  if (confirm("Are you sure you want to delete this event?")) {
    // to find and remove from main events array
    const actualIndex = events.findIndex(
      (event) =>
        event.name === eventToDelete.name &&
        event.date === eventToDelete.date &&
        event.location === eventToDelete.location &&
        event.time === eventToDelete.time &&
        event.speaker === eventToDelete.speaker
    );

    if (actualIndex !== -1) {
      events.splice(actualIndex, 1);
    }

    // update display
    if (isSearching) {
      // If searching, re-filter
      performSearch(searchBox.value);
    } else {
      // If not searching, show all events
      renderEvents();
    }
  }
}

function performSearch(query) {
  const q = query.toLowerCase();
  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(q) ||
      event.location.toLowerCase().includes(q) ||
      event.speaker.toLowerCase().includes(q) ||
      event.date.includes(q)
  );
  isSearching = true;
  renderEvents(filteredEvents);
}

// search or filter
searchBox.addEventListener("input", function (e) {
  const q = e.target.value.toLowerCase();
  tableBody.querySelectorAll("tr").forEach((row) => {
    const rowText = row.textContent.toLowerCase();
    row.style.display = rowText.includes(q) ? "" : "none";
  });
});
