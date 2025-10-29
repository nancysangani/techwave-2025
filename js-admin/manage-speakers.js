// ==== CLEAN START - Pehle existing data clear karo ====
if (!localStorage.getItem("speakers")) {
  // Static data with ALL fields
  const staticSpeakers = [
    {
      id: 1,
      name: "Dr. Sarah Chen",
      designation: "AI Research Lead at Google",
      topic: "The Future of Artificial Intelligence",
      photo: "",
      track: "keynote sessions",
      bio: "Leading AI researcher with 10+ years of experience in machine learning and neural networks. Published over 50 research papers in top AI conferences.",
    },
    {
      id: 2,
      name: "Rajiv Mehta",
      designation: "Blockchain Architect at Ethereum Foundation",
      topic: "Web3 and Decentralized Future",
      photo: "",
      track: "panel discussions",
      bio: "Blockchain expert specializing in smart contracts and decentralized applications. Contributor to Ethereum core development since 2018.",
    },
    {
      id: 3,
      name: "Priya Sharma",
      designation: "Cloud Solutions Director at Microsoft",
      topic: "Cloud Computing Revolution",
      photo: "",
      track: "keynote sessions",
      bio: "Cloud infrastructure specialist with expertise in Azure, AWS, and hybrid cloud solutions. Helped migrate 100+ enterprises to cloud platforms.",
    },
    {
      id: 4,
      name: "Marcus Johnson",
      designation: "Cybersecurity Expert at CyberShield",
      topic: "Next-Gen Security Threats",
      photo: "",
      track: "panel discussions",
      bio: "Cybersecurity veteran with focus on threat intelligence and zero-trust architectures. Former white-hat hacker turned security consultant.",
    },
  ];

  localStorage.setItem("speakers", JSON.stringify(staticSpeakers));
  console.log("✅ Static speakers data initialized with ALL fields");
}

// ==== SIDEBAR TOGGLE ====
const sidebarToggle = document.getElementById("sidebar-toggle");
const sidebarClose = document.getElementById("sidebar-close");
const mobileSidebar = document.getElementById("mobile-sidebar");
const sidebarBackdrop = document.getElementById("sidebar-backdrop");

function toggleSidebar() {
  mobileSidebar.classList.toggle("-translate-x-full");
  if (window.innerWidth <= 768) {
    sidebarBackdrop.style.display = mobileSidebar.classList.contains(
      "-translate-x-full"
    )
      ? "none"
      : "block";
  }
  document.body.style.overflow = mobileSidebar.classList.contains(
    "-translate-x-full"
  )
    ? "auto"
    : "hidden";
}

sidebarToggle?.addEventListener("click", toggleSidebar);
sidebarClose?.addEventListener("click", toggleSidebar);
sidebarBackdrop?.addEventListener("click", toggleSidebar);

// ==== SPEAKER CRUD & SEARCH ====
const STORAGE_KEY = "speakers";

// DOM Elements
const tableBody = document.querySelector("#speakers-table tbody");
const searchBox = document.getElementById("search-box");
const addBtn = document.getElementById("add-speaker-btn");
const modal = document.getElementById("speaker-modal");
const closeModalBtn = document.getElementById("close-modal");
const form = document.getElementById("speaker-form");
const nameInput = document.getElementById("speaker-name");
const desigInput = document.getElementById("speaker-designation");
const topicInput = document.getElementById("speaker-topic");
const trackInput = document.getElementById("speaker-track");
const photoInput = document.getElementById("speaker-photo");
const photoPreview = document.getElementById("photo-preview");

let speakers = [];
let currentDisplayed = [];
let editIndex = null;

// Load speakers from localStorage
function loadSpeakers() {
  const data = localStorage.getItem(STORAGE_KEY);
  speakers = data ? JSON.parse(data) : [];
  console.log("Loaded speakers:", speakers);
}

// Render speakers in table
function renderSpeakers(list = null) {
  loadSpeakers(); // Always reload from localStorage

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
    tr.className =
      "border-b border-purple-400/20 hover:bg-purple-500/5 transition";

    const photoCell = speaker.photo
      ? `<img src="${escapeHtml(speaker.photo)}" alt="${escapeHtml(
          speaker.name
        )}" class="w-10 h-10 rounded-full object-cover border border-purple-400/30">`
      : `<div class="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">${speaker.name.charAt(
          0
        )}</div>`;

    tr.innerHTML = `
      <td class="py-4 px-4 align-middle">${photoCell}</td>
      <td class="py-4 px-4 align-middle text-white font-medium">${escapeHtml(
        speaker.name
      )}</td>
      <td class="py-4 px-4 align-middle text-gray-300">${escapeHtml(
        speaker.designation
      )}</td>
      <td class="py-4 px-4 align-middle text-gray-300">${escapeHtml(
        speaker.topic
      )}</td>
      <td class="py-4 px-4 align-middle">
        <div class="flex gap-2">
          <button class="edit-btn bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg text-white text-sm transition" data-idx="${idx}">
            <i class="fas fa-edit mr-1"></i>Edit
          </button>
          <button class="delete-btn bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-white text-sm transition" data-idx="${idx}">
            <i class="fas fa-trash mr-1"></i>Delete
          </button>
        </div>
      </td>
    `;

    tableBody.appendChild(tr);
  });

  // Add event listeners
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

// Utility function
function escapeHtml(s) {
  if (!s && s !== 0) return "";
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Modal functions
function openCreate() {
  editIndex = null;
  form.reset();
  photoPreview.classList.add("hidden");
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function openEdit(idx) {
  loadSpeakers();
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

function closeModal() {
  modal.classList.add("hidden");
  document.body.style.overflow = "auto";
  editIndex = null;
}

// Form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const designation = desigInput.value.trim();
  const topic = topicInput.value.trim();
  const track = trackInput.value.trim();
  const photo = photoInput.value.trim();

  if (!name || !designation || !topic || !track) {
    alert(
      "Please fill all required fields: Name, Designation, Topic, and Track."
    );
    return;
  }

  loadSpeakers(); // Reload current data

  if (editIndex === null) {
    // Create new speaker
    const newSpeaker = {
      id: speakers.length > 0 ? Math.max(...speakers.map((s) => s.id)) + 1 : 1,
      name,
      designation,
      topic,
      track,
      photo: photo || "",
      bio: `${name} is an expert in ${topic}.`, // Default bio
    };
    speakers.push(newSpeaker);
  } else {
    // Update existing speaker - preserve all fields
    speakers[editIndex] = {
      ...speakers[editIndex], // Keep existing id, bio, etc.
      name,
      designation,
      topic,
      track,
      photo: photo || "",
    };
  }

  // Save to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(speakers));

  // Reset and close
  searchBox.value = "";
  renderSpeakers();
  closeModal();
});

// Delete speaker
function removeSpeaker(idx) {
  if (!confirm("Are you sure you want to delete this speaker?")) return;

  loadSpeakers();
  speakers.splice(idx, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(speakers));

  if (searchBox.value.trim()) {
    performSearch(searchBox.value);
  } else {
    renderSpeakers();
  }
}

// Search function
function performSearch(q) {
  const query = String(q || "")
    .toLowerCase()
    .trim();
  if (!query) {
    renderSpeakers();
    return;
  }

  loadSpeakers();
  const filtered = speakers
    .map((sp, idx) => ({ speaker: sp, idx }))
    .filter(
      ({ speaker }) =>
        speaker.name.toLowerCase().includes(query) ||
        speaker.designation.toLowerCase().includes(query) ||
        speaker.topic.toLowerCase().includes(query) ||
        (speaker.track && speaker.track.toLowerCase().includes(query))
    );

  renderSpeakers(filtered);
}

// Event Listeners
searchBox.addEventListener("input", (e) => performSearch(e.target.value));
addBtn.addEventListener("click", openCreate);
closeModalBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (ev) => {
  if (ev.target === modal) closeModal();
});

photoInput.addEventListener("input", () => {
  const url = photoInput.value.trim();
  if (url && /^https?:\/\//i.test(url)) {
    photoPreview.src = url;
    photoPreview.classList.remove("hidden");
  } else {
    photoPreview.classList.add("hidden");
  }
});

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  loadSpeakers();
  renderSpeakers();
});

// Resize handler
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    sidebarBackdrop.style.display = "none";
    mobileSidebar.classList.add("-translate-x-full");
  }
});
