// Initialize with static data if no sponsors exist
if (!localStorage.getItem("sponsors")) {
  const staticSponsors = [
    {
      name: "Swiggy",
      contribution: "₹5,00,000",
      email: "partnership@techcorp.com",
      logo: "https://images.seeklogo.com/logo-png/34/2/swiggy-logo-png_seeklogo-348257.png"
    },
    {
      name: "Paytm",
      contribution: "₹3,50,000", 
      email: "sponsor@innovatelabs.com",
      logo: "https://images.seeklogo.com/logo-png/30/2/paytm-logo-png_seeklogo-305549.png"
    },
    {
      name: "Meta",
      contribution: "₹2,00,000",
      email: "events@datadynamo.ai",
      logo: "https://images.seeklogo.com/logo-png/42/2/meta-icon-new-facebook-2021-logo-png_seeklogo-424014.png"
    },
    {
      name: "Infosys",
      contribution: "₹4,00,000",
      email: "marketing@cloudnexus.com", 
      logo: "https://images.seeklogo.com/logo-png/28/2/infosys-limited-logo-png_seeklogo-289643.png"
    },
    {
      name: "Zoho",
      contribution: "₹6,00,000",
      email: "hello@futuretech.vc",
      logo: "https://images.seeklogo.com/logo-png/27/2/zoho-logo-png_seeklogo-274112.png"
    }
  ];
  localStorage.setItem("sponsors", JSON.stringify(staticSponsors));
}

// Sidebar toggle (Mobile)
const sidebarToggle = document.getElementById("sidebar-toggle");
const sidebarClose = document.getElementById("sidebar-close");
const mobileSidebar = document.getElementById("mobile-sidebar");

sidebarToggle?.addEventListener("click", () =>
  mobileSidebar.classList.toggle("-translate-x-full")
);
sidebarClose?.addEventListener("click", () =>
  mobileSidebar.classList.add("-translate-x-full")
);

// Modal handling
const modal = document.getElementById("sponsor-modal");
const addBtn = document.getElementById("add-sponsor-btn");
const closeModal = document.getElementById("close-modal");
const form = document.getElementById("sponsor-form");

// Input fields
const sponsorName = document.getElementById("sponsor-name");
const sponsorContribution = document.getElementById("contribution-amount");
const sponsorEmail = document.getElementById("sponsor-email");
const searchInput = document.getElementById("search-sponsor");

// Data
let sponsors = JSON.parse(localStorage.getItem("sponsors")) || [];
let editIndex = null;

// Open modal
addBtn.onclick = () => {
  editIndex = null;
  form.reset();
  modal.classList.remove("hidden");
};

// Close modal
closeModal.onclick = () => modal.classList.add("hidden");
modal.onclick = (e) => {
  if (e.target === modal) modal.classList.add("hidden");
};

// sponsors table
const tableBody = document.querySelector("#sponsors-table tbody");
function renderSponsors(data = sponsors) {
  tableBody.innerHTML = data
    .map(
      (sp, i) => `
      <tr class="border-b border-purple-400/20">
        <td class="py-3 px-4">${sp.name}</td>
        <td class="py-3 px-4">${sp.contribution}</td>
        <td class="py-3 px-4">${sp.email}</td>
        <td class="py-3 px-4 flex gap-2">
          <button onclick="editSponsor(${i})" class="bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg text-white text-sm"><i class="fas fa-pen"></i> Edit</button>
          <button onclick="deleteSponsor(${i})" class="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg text-white text-sm"><i class="fas fa-trash"></i> Delete</button>
        </td>
      </tr>
    `
    )
    .join("");
  localStorage.setItem("sponsors", JSON.stringify(sponsors));
}
renderSponsors();

// Add or edit sponsor
form.onsubmit = (e) => {
  e.preventDefault();

  const name = sponsorName.value.trim();
  const contribution = sponsorContribution.value.trim();
  const email = sponsorEmail.value.trim();
  const logo = document.getElementById("sponsor-logo").value.trim();

  if (!name || !contribution || !email || !logo) {
    alert("All fields are required!");
    return;
  }

  if (editIndex !== null) {
    sponsors[editIndex] = { name, contribution, email, logo };
  } else {
    sponsors.push({ name, contribution, email, logo });
  }

  // Save to localStorage
  localStorage.setItem("sponsors", JSON.stringify(sponsors));

  // Debug log
  console.log("Sponsor saved:", { name, contribution, email, logo });
  console.log("All sponsors:", sponsors);

  renderSponsors();
  modal.classList.add("hidden");
  form.reset();
};

const modalTitle = document.getElementById("modal-title");

// Open modal for new sponsor
addBtn.onclick = () => {
  editIndex = null;
  form.reset();
  modalTitle.textContent = "Add Sponsor";
  modal.classList.remove("hidden");
};

// Edit sponsor
window.editSponsor = (i) => {
  const s = sponsors[i];
  sponsorName.value = s.name;
  sponsorContribution.value = s.contribution;
  sponsorEmail.value = s.email;
  document.getElementById("sponsor-logo").value = s.logo || "";
  editIndex = i;
  modalTitle.textContent = "Edit Sponsor";
  modal.classList.remove("hidden");
};

// Delete sponsor
window.deleteSponsor = (i) => {
  if (confirm("Are you sure you want to delete this sponsor?")) {
    sponsors.splice(i, 1);
    renderSponsors();
  }
};

// Search sponsors
searchInput.oninput = (e) => {
  const q = e.target.value.toLowerCase();
  const filtered = sponsors.filter(
    (s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
  );
  renderSponsors(filtered);
};