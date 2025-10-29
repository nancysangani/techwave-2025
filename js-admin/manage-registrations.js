// Sidebar toggle functionality
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

if (sidebarToggle) sidebarToggle.addEventListener("click", toggleSidebar);
if (sidebarClose) sidebarClose.addEventListener("click", toggleSidebar);
if (sidebarBackdrop) sidebarBackdrop.addEventListener("click", toggleSidebar);

// Modal handling
const modal = document.getElementById("registration-modal");
const addBtn = document.getElementById("add-registration-btn");
const closeModalBtn = document.getElementById("close-modal");
const form = document.getElementById("registration-form");
const modalTitle = document.getElementById("modal-title");
const submitBtn = document.getElementById("submit-btn");
const regName = document.getElementById("reg-name");
const regEmail = document.getElementById("reg-email");
const regCountry = document.getElementById("reg-country");
const regState = document.getElementById("reg-state");
const regCity = document.getElementById("reg-city");
const regPassword = document.getElementById("reg-password");
const searchInput = document.getElementById("search-registration");
const tableBody = document.querySelector("#registrations-table tbody");
let registrations = JSON.parse(localStorage.getItem("registrations")) || [];
let editIndex = null;

// to update dashboard count
function updateDashboardCount() {
  localStorage.setItem("totalRegistrations", registrations.length);
}

// Smooth modal
function openModal() {
  modal.classList.remove("hidden");
  setTimeout(() => {
    modal.classList.remove("opacity-0");
    modal.classList.add("show");
  }, 10);
}

function closeModal() {
  modal.classList.remove("show");
  modal.classList.add("opacity-0");
  setTimeout(() => modal.classList.add("hidden"), 300);
}

addBtn.onclick = () => {
  editIndex = null;
  form.reset();
  modalTitle.textContent = "Add Registration";
  submitBtn.textContent = "Save";
  openModal();
};

closeModalBtn.onclick = closeModal;
modal.onclick = (e) => {
  if (e.target === modal) closeModal();
};

// Render registrations
function renderRegistrations(data = registrations) {
  tableBody.innerHTML = data
    .map((r, i) => {
      const regDate = new Date(
        r.registrationDate || new Date()
      ).toLocaleDateString();

      return `
        <tr class="border-b border-purple-400/20">
          <td class="py-3 px-4">${r.name}</td>
          <td class="py-3 px-4">${r.email}</td>
          <td class="py-3 px-4">${r.country}</td>
          <td class="py-3 px-4">${r.state}</td>
          <td class="py-3 px-4">${r.city}</td>
          <td class="py-3 px-4">${regDate}</td>
          <td class="py-3 px-4 flex gap-2">
            <button onclick="editRegistration(${i})" class="bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg text-white text-sm"><i class="fas fa-pen"></i> Edit</button>
            <button onclick="deleteRegistration(${i})" class="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg text-white text-sm"><i class="fas fa-trash"></i> Delete</button>
          </td>
        </tr>
      `;
    })
    .join("");
  localStorage.setItem("registrations", JSON.stringify(registrations));
  updateDashboardCount();
}

renderRegistrations();

// Add/Edit form
form.onsubmit = (e) => {
  e.preventDefault();
  const name = regName.value.trim();
  const email = regEmail.value.trim();
  const country = regCountry.value.trim();
  const state = regState.value.trim();
  const city = regCity.value.trim();
  const password = regPassword.value;

  if (!name || !email || !country || !state || !city || !password) {
    return alert("All fields are required!");
  }

  const registrationData = {
    name,
    email,
    country,
    state,
    city,
    password,
    registrationDate: new Date().toISOString(),
  };

  if (editIndex !== null) {
    // Preserve original registration date when editing
    registrationData.registrationDate =
      registrations[editIndex].registrationDate;
    registrations[editIndex] = registrationData;
  } else {
    registrations.push(registrationData);
  }

  renderRegistrations();
  form.reset();
  closeModal();
};

// Edit
window.editRegistration = (i) => {
  const r = registrations[i];
  regName.value = r.name;
  regEmail.value = r.email;
  regCountry.value = r.country;
  regState.value = r.state;
  regCity.value = r.city;
  regPassword.value = r.password;
  editIndex = i;

  // Update modal title and button text
  modalTitle.textContent = "Edit Registration";
  submitBtn.textContent = "Update";

  openModal();
};

// Delete
window.deleteRegistration = (i) => {
  if (confirm("Are you sure you want to delete this registration?")) {
    registrations.splice(i, 1);
    renderRegistrations();
  }
};

// Search
searchInput.oninput = (e) => {
  const q = e.target.value.toLowerCase();
  const filtered = registrations.filter(
    (r) =>
      r.name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.country.toLowerCase().includes(q) ||
      r.state.toLowerCase().includes(q) ||
      r.city.toLowerCase().includes(q)
  );
  renderRegistrations(filtered);
};
