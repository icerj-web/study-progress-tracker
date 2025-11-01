// Global shared variables and constants

const ADMIN_USERNAME = "vaish";
const ADMIN_PASSWORD_HASH = hashPassword("123456");

let users = JSON.parse(localStorage.getItem("users")) || {};
let masterRoles = JSON.parse(localStorage.getItem("masterRoles")) || [];
let currentUser = null;  // Will be set on login

// Ensure admin user exists
if (!users[ADMIN_USERNAME] || users[ADMIN_USERNAME].password !== ADMIN_PASSWORD_HASH) {
  users[ADMIN_USERNAME] = { password: ADMIN_PASSWORD_HASH, data: { roles: [] } };
  saveUsers();
}

// Utility functions
function hashPassword(str) {
  let hash = 0, i, chr;
  if (str.length === 0) return hash.toString();
  for(i=0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash.toString();
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if(isNaN(d)) return "";
  return d.toLocaleDateString() + (dateStr.includes("T") ? " " + d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : "");
}

function calculateProgress(items) {
  if (!items || items.length === 0) return 0;
  const finishedCount = items.filter(i => i.status && i.status.toLowerCase() === "finished").length;
  return Math.round((finishedCount / items.length) * 100);
}

function saveUsers() {
  localStorage.setItem("users", JSON.stringify(users));
}

function saveMasterRoles() {
  localStorage.setItem("masterRoles", JSON.stringify(masterRoles));
}

function loadUsers() {
  users = JSON.parse(localStorage.getItem("users")) || {};
  return users;
}

function loadMasterRoles() {
  masterRoles = JSON.parse(localStorage.getItem("masterRoles")) || [];
  return masterRoles;
}
