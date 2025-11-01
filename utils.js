// Hash password (simple, for demo only)
function hashPassword(str) {
  let hash = 0, i, chr;
  if (str.length === 0) return hash.toString();
  for (i=0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash.toString();
}

// Format ISO datetime string as human readable
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  return d.toLocaleDateString() + (dateStr.includes("T") ? " " + d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : "");
}

// Calculate percentage progress of items based on finished count
function calculateProgress(items) {
  if (!items || items.length === 0) return 0;
  const finishedCount = items.filter(i => i.status && i.status.toLowerCase() === "finished").length;
  return Math.round((finishedCount / items.length) * 100);
}

// Local Storage helpers
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function loadUsers() {
  const stored = localStorage.getItem("users");
  return stored ? JSON.parse(stored) : {};
}

function saveMasterRoles(masterRoles) {
  localStorage.setItem("masterRoles", JSON.stringify(masterRoles));
}

function loadMasterRoles() {
  const stored = localStorage.getItem("masterRoles");
  return stored ? JSON.parse(stored) : [];
}
