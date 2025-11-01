// Dependencies: utils.js functions (hashPassword, saveUsers, loadUsers)

let isLogin = true;
let currentUser = null;

// DOM Elements
const authContainer = document.getElementById("auth-container");
const userContainer = document.getElementById("user-container");
const adminContainer = document.getElementById("admin-container");
const roleDetailsContainer = document.getElementById("role-details-container");
const topicEditorContainer = document.getElementById("topic-editor-container");
const subtopicEditorContainer = document.getElementById("subtopic-editor-container");
const studySessionContainer = document.getElementById("study-session-container");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const submitBtn = document.getElementById("submit-btn");
const toggleAuth = document.getElementById("toggle-auth");

const logoutBtn = document.getElementById("logout-btn");
const deleteAccountBtn = document.getElementById("delete-account-btn");
const adminLogoutBtn = document.getElementById("admin-logout-btn");

const welcomeMsg = document.getElementById("welcome-msg");
const adminWelcomeMsg = document.getElementById("admin-welcome-msg");

const formTitle = document.getElementById("form-title");

let users = loadUsers();

// Toggle between login and signup modes
toggleAuth.addEventListener("click", () => {
  isLogin = !isLogin;
  formTitle.textContent = isLogin ? "Login" : "Sign Up";
  submitBtn.textContent = isLogin ? "Login" : "Sign Up";
  toggleAuth.textContent = isLogin ? "Don't have an account? Sign up" : "Already have an account? Login";
  usernameInput.value = "";
  passwordInput.value = "";
});

// Handle login/signup form submit
submitBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    alert("Please enter username and password.");
    return;
  }

  if (isLogin) {
    if (users[username] && users[username].password === hashPassword(password)) {
      currentUser = username;
      sessionStorage.setItem("currentUser", currentUser);
      showDashboardForUser();
    } else {
      alert("Invalid username or password.");
    }
  } else {
    if (users[username]) {
      alert("Username already exists. Please pick another.");
      return;
    }
    users[username] = { password: hashPassword(password), data: { roles: [] } };
    saveUsers(users);
    alert("Account successfully created! Please login.");
    isLogin = true;
    formTitle.textContent = "Login";
    submitBtn.textContent = "Login";
    toggleAuth.textContent = "Don't have an account? Sign up";
    usernameInput.value = "";
    passwordInput.value = "";
  }
});

// Show correct dashboard after login (admin vs user)
function showDashboardForUser() {
  authContainer.classList.add("hidden");
  roleDetailsContainer.classList.add("hidden");
  topicEditorContainer.classList.add("hidden");
  subtopicEditorContainer.classList.add("hidden");
  studySessionContainer.classList.add("hidden");

  if (currentUser === ADMIN_USERNAME) {
    adminContainer.classList.remove("hidden");
    adminWelcomeMsg.textContent = `Welcome, Admin!`;
    // Call render functions in admin.js to populate admin dashboard
    if (typeof renderMasterRoles === "function") renderMasterRoles();
    if (typeof renderAdminUsers === "function") renderAdminUsers();
  } else {
    userContainer.classList.remove("hidden");
    welcomeMsg.textContent = `Welcome, ${currentUser}!`;
    // Call user render function in user.js
    if (typeof renderPersonalRoles === "function") renderPersonalRoles();
  }
}

// Logout common for user and admin
logoutBtn?.addEventListener("click", logout);
adminLogoutBtn?.addEventListener("click", logout);

function logout() {
  currentUser = null;
  sessionStorage.removeItem("currentUser");
  userContainer.classList.add("hidden");
  adminContainer.classList.add("hidden");
  roleDetailsContainer.classList.add("hidden");
  topicEditorContainer.classList.add("hidden");
  subtopicEditorContainer.classList.add("hidden");
  studySessionContainer.classList.add("hidden");
  authContainer.classList.remove("hidden");
  usernameInput.value = "";
  passwordInput.value = "";
}

// Delete current user's account (only for non-admin)
deleteAccountBtn?.addEventListener("click", () => {
  if (!currentUser || currentUser === ADMIN_USERNAME) {
    alert("Cannot delete admin account.");
    return;
  }
  if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
    delete users[currentUser];
    saveUsers(users);
    logout();
    alert("Your account has been deleted.");
  }
});

// On page load, attempt to restore session
window.addEventListener("load", () => {
  const savedUser = sessionStorage.getItem("currentUser");
  if (savedUser && users[savedUser]) {
    currentUser = savedUser;
    showDashboardForUser();
  }
});
