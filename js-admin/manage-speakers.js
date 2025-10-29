if (!localStorage.getItem("speakers")) {
  localStorage.setItem("speakers", JSON.stringify([]));
}

// Sidebar toggle
const sidebarToggle = document.getElementById("sidebar-toggle");
const sidebarClose = document.getElementById("sidebar-close");
const mobileSidebar = document.getElementById("mobile-sidebar");
const sidebarBackdrop = document.getElementById("sidebar-backdrop");

function toggleSidebar() {
  mobileSidebar.classList.toggle("-translate-x-full");
  if (window.innerWidth <= 768) {
    sidebarBackdrop.style.display = mobileSidebar.classList.contains("-translate-x-full")
      ? "none"
      : "block";
  }
  document.body.style.overflow = mobileSidebar.classList.contains("-translate-x-full")
    ? "auto"
    : "hidden";
}

sidebarToggle?.addEventListener("click", toggleSidebar);
sidebarClose?.addEventListener("click", toggleSidebar);
sidebarBackdrop?.addEventListener("click", toggleSidebar);

// Speaker CRUD & Search - USE THE SAME DATA
const STORAGE_KEY = "speakers";
let speakers = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; // This now loads the static data
let currentDisplayed = [];
let editIndex = null;

const tableBody = document.querySelector("#speakers-table tbody");
const searchBox = document.getElementById("search-box");
const addBtn = document.getElementById("add-speaker-btn");
const modal = document.getElementById("speaker-modal");
const closeModalBtn = document.getElementById("close-modal");
const form = document.getElementById("speaker-form");
const nameInput = document.getElementById("speaker-name");
const desigInput = document.getElementById("speaker-designation");
const topicInput = document.getElementById("speaker-topic");
const trackInput = document.getElementById("speaker-track"); // Add this
const photoInput = document.getElementById("speaker-photo");
const photoPreview = document.getElementById("photo-preview");

// this render function accepts optional list of {speaker, idx}
function renderSpeakers(list = null) {
  // Reload from localStorage to ensure we have the latest data
  speakers = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  
  if (!list) {
    currentDisplayed = speakers.map((sp, idx) => ({ speaker: sp, idx }));
  } else {
    currentDisplayed = list;
  }

  tableBody.innerHTML = "";

  if (currentDisplayed.length === 0) {
    tableBody.innerHTML = `
          <tr>
            <td colspan="5" class="py-8 px-4 text-center text-gray-400">
              <i class="fas fa-microphone-slash text-2xl mb-2"></i>
              <div>${
                searchBox.value.trim()
                  ? "No speakers match your search."
                  : "No speakers yet. Add one!"
              }</div>
            </td>
          </tr>`;
    return;
  }

  currentDisplayed.forEach(({ speaker, idx }) => {
    const tr = document.createElement("tr");
    tr.className = "border-b border-purple-400/20 hover:bg-purple-500/5 transition";
    const photoCell = speaker.photo
      ? `<img src="${escapeHtml(speaker.photo)}" alt="${escapeHtml(speaker.name)}" class="w-9 h-9 rounded-full object-cover">`
      : `<div class="w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">${speaker.name.charAt(0)}</div>`;
    
    tr.innerHTML = `
          <td class="py-3 px-2 sm:px-4 align-middle">${photoCell}</td>
          <td class="py-3 px-2 sm:px-4 align-middle text-white font-medium">${escapeHtml(speaker.name)}</td>
          <td class="py-3 px-2 sm:px-4 align-middle text-gray-300">${escapeHtml(speaker.designation)}</td>
          <td class="py-3 px-2 sm:px-4 align-middle text-gray-300">${escapeHtml(speaker.topic)}</td>
          <td class="py-3 px-2 sm:px-4 align-middle">
            <div class="flex gap-2">
              <button class="edit-btn bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg text-white text-sm" data-idx="${idx}"><i class="fas fa-pen"></i> Edit</button>
              <button class="delete-btn bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg text-white text-sm" data-idx="${idx}"><i class="fas fa-trash"></i> Delete</button>
            </div>
          </td>
        `;
    tableBody.appendChild(tr);
  });

  // wire buttons
  tableBody.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.idx);
      openEdit(idx);
    });
  });
  tableBody.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.idx);
      removeSpeaker(idx);
    });
  });
}

// escaping HTML
function escapeHtml(s) {
  if (!s && s !== 0) return "";
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// open modal for new speaker
function openCreate() {
  editIndex = null;
  form.reset();
  photoPreview.classList.add("hidden");
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

// open modal for edit
function openEdit(idx) {
  const sp = speakers[idx];
  if (!sp) return;
  editIndex = idx;
  nameInput.value = sp.name || "";
  desigInput.value = sp.designation || "";
  topicInput.value = sp.topic || "";
  trackInput.value = sp.track || "";
  photoInput.value = sp.photo || "";
  if (sp.photo) {
    photoPreview.src = sp.photo;
    photoPreview.classList.remove("hidden");
  } else {
    photoPreview.classList.add("hidden");
  }
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

// close modal
function closeModal() {
  modal.classList.add("hidden");
  document.body.style.overflow = "auto";
  editIndex = null;
  form.reset();
  photoPreview.classList.add("hidden");
}

// add/update speaker - PRESERVE ALL FIELDS
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const designation = desigInput.value.trim();
  const topic = topicInput.value.trim();
  const track = trackInput.value.trim();
  const photo = photoInput.value.trim();

  if (!name || !designation || !topic || !track) {
    alert("Please fill name, designation, topic, and track.");
    return;
  }

  // Reload speakers to get current state
  speakers = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  if (editIndex === null) {
    // create - include all fields
    const newSpeaker = {
      id: speakers.length > 0 ? Math.max(...speakers.map(s => s.id)) + 1 : 1,
      name,
      designation,
      topic,
      track,
      photo: photo || "",
      bio: `${name} is a renowned expert in ${topic}.` // Default bio
    };
    speakers.push(newSpeaker);
  } else {
    // update - preserve existing fields
    speakers[editIndex] = {
      ...speakers[editIndex], // Keep existing fields like id, bio
      name,
      designation,
      topic,
      track,
      photo: photo || ""
    };
  }

  // Save and reload
  localStorage.setItem(STORAGE_KEY, JSON.stringify(speakers));
  searchBox.value = "";
  renderSpeakers();
  closeModal();
});

// remove speaker by actual index
function removeSpeaker(idx) {
  if (!confirm("Delete this speaker?")) return;
  speakers.splice(idx, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(speakers));
  if (searchBox.value.trim()) {
    performSearch(searchBox.value);
  } else {
    renderSpeakers();
  }
}

// search that returns list of {speaker, idx}
function performSearch(q) {
  const query = String(q || "").toLowerCase().trim();
  if (!query) {
    renderSpeakers();
    return;
  }

  const filtered = speakers
    .map((sp, idx) => ({ speaker: sp, idx }))
    .filter(
      ({ speaker }) =>
        speaker.name.toLowerCase().includes(query) ||
        speaker.designation.toLowerCase().includes(query) ||
        speaker.topic.toLowerCase().includes(query)
    );

  renderSpeakers(filtered);
}

// wire search box
searchBox.addEventListener("input", (e) => performSearch(e.target.value));

// wire add button & modal close/outside click
addBtn.addEventListener("click", openCreate);
closeModalBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (ev) => {
  if (ev.target === modal) closeModal();
});

// live photo preview
photoInput.addEventListener("input", () => {
  const url = photoInput.value.trim();
  if (!url) {
    photoPreview.classList.add("hidden");
    return;
  }
  if (/^https?:\/\//i.test(url)) {
    photoPreview.src = url;
    photoPreview.classList.remove("hidden");
  } else {
    photoPreview.classList.add("hidden");
  }
});

// initial render
renderSpeakers();

// keep sidebar state consistent on resize
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    sidebarBackdrop.style.display = "none";
    mobileSidebar.classList.add("-translate-x-full");
  }
});