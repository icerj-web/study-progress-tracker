// Assumes utils.js, auth.js, admin.js, user.js are loaded and available

// Initialization and app startup

// Restore logged-in user session (handled in auth.js already)
// Here, just ensure all data are loaded and set initial UI states properly.

let users = loadUsers();
let masterRoles = loadMasterRoles();

function initializeApp() {
  // Check session and show appropriate view
  let savedUser = sessionStorage.getItem("currentUser");
  if (savedUser && users[savedUser]) {
    // Data available; render dashboard for saved user
    if (typeof showDashboardForUser === "function") {
      window.currentUser = savedUser;
      showDashboardForUser();
    }
  } else {
    // Show auth interface
    if (typeof authContainer !== "undefined") {
      authContainer.classList.remove("hidden");
    }
    if (typeof userContainer !== "undefined") {
      userContainer.classList.add("hidden");
    }
    if (typeof adminContainer !== "undefined") {
      adminContainer.classList.add("hidden");
    }
  }
}

// Because modules define event listeners and UI manipulation already,
// app.js focuses on initialization and can provide utility functions if needed.

window.addEventListener("load", () => {
  initializeApp();
});
