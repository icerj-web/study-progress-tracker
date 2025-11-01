// Dependencies: utils.js functions (loadUsers, saveUsers, loadMasterRoles, saveMasterRoles)

let masterRoles = loadMasterRoles();
let users = loadUsers();

const adminUserList = document.getElementById("admin-user-list");
const masterRolesList = document.getElementById("master-roles-list");
const newRoleTitleInput = document.getElementById("new-role-title");
const newRoleDescInput = document.getElementById("new-role-desc");
const addMasterRoleBtn = document.getElementById("add-master-role-btn");

const topicEditorContainer = document.getElementById("topic-editor-container");
const adminTopicList = document.getElementById("admin-topic-list");
const topicRoleTitle = document.getElementById("topic-role-title");
const backToTopicsBtn = document.getElementById("back-to-topics-btn");
const newTopicTitleInput = document.getElementById("new-topic-title");
const newTopicStatusSelect = document.getElementById("new-topic-status");
const newTopicDeadlineInput = document.getElementById("new-topic-deadline");
const newTopicDescInput = document.getElementById("new-topic-desc");
const addTopicBtn = document.getElementById("add-topic-btn");

const subtopicEditorContainer = document.getElementById("subtopic-editor-container");
const adminSubtopicList = document.getElementById("admin-subtopic-list");
const subtopicTopicTitle = document.getElementById("subtopic-topic-title");
const backToSubtopicsBtn = document.getElementById("back-to-subtopics-btn");
const newSubtopicTitleInput = document.getElementById("new-subtopic-title");
const newSubtopicStatusSelect = document.getElementById("new-subtopic-status");
const newSubtopicDeadlineInput = document.getElementById("new-subtopic-deadline");
const newSubtopicDescInput = document.getElementById("new-subtopic-desc");
const addSubtopicBtn = document.getElementById("add-subtopic-btn");

let editingRoleIndex = null;
let editingTopicIndex = null;

// Render admin user management list
function renderAdminUsers() {
  adminUserList.innerHTML = "";
  Object.keys(users).forEach(user => {
    const div = document.createElement("div");
    div.style.border = "1px solid #ddd";
    div.style.padding = "8px";
    div.style.marginBottom = "8px";
    div.style.borderRadius = "8px";
    div.style.display = "flex";
    div.style.justifyContent = "space-between";
    div.style.alignItems = "center";

    const span = document.createElement("span");
    span.textContent = user;
    div.appendChild(span);

    // Prevent deleting admin user
    if (user !== ADMIN_USERNAME) {
      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete User";
      delBtn.style.background = "#e53935";
      delBtn.style.color = "white";
      delBtn.style.border = "none";
      delBtn.style.padding = "4px 10px";
      delBtn.style.cursor = "pointer";
      delBtn.style.borderRadius = "6px";

      delBtn.onclick = () => {
        if (confirm(`Delete user: ${user}?`)) {
          delete users[user];
          saveUsers();
          renderAdminUsers();
        }
      };
      div.appendChild(delBtn);
    }
    adminUserList.appendChild(div);
  });
}

// Admin: Render master roles list with edit and delete options
function renderMasterRoles() {
  masterRolesList.innerHTML = "";
  masterRoles.forEach((role, idx) => {
    const div = document.createElement("div");
    div.style.border = "1px solid #ddd";
    div.style.padding = "10px";
    div.style.marginBottom = "10px";
    div.style.borderRadius = "8px";

    const title = document.createElement("h4");
    title.textContent = role.title;
    div.appendChild(title);

    const desc = document.createElement("p");
    desc.textContent = role.description || "";
    div.appendChild(desc);

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit Topics";
    editBtn.style.background = "#2563eb";
    editBtn.style.color = "white";
    editBtn.style.border = "none";
    editBtn.style.padding = "6px 12px";
    editBtn.style.borderRadius = "6px";
    editBtn.style.cursor = "pointer";
    editBtn.style.marginRight = "10px";

    editBtn.onclick = () => {
      openTopicEditor(idx);
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete Role";
    deleteBtn.style.background = "#e53935";
    deleteBtn.style.color = "white";
    deleteBtn.style.border = "none";
    deleteBtn.style.padding = "6px 12px";
    deleteBtn.style.borderRadius = "6px";
    deleteBtn.style.cursor = "pointer";

    deleteBtn.onclick = () => {
      if (confirm(`Delete master role: ${role.title}?`)) {
        masterRoles.splice(idx, 1);
        saveMasterRoles();
        renderMasterRoles();
      }
    };

    div.appendChild(editBtn);
    div.appendChild(deleteBtn);

    masterRolesList.appendChild(div);
  });
}

// Admin: Add a new master role
addMasterRoleBtn.addEventListener("click", () => {
  const title = newRoleTitleInput.value.trim();
  const desc = newRoleDescInput.value.trim();

  if (!title) {
    alert("Role title is required");
    return;
  }
  if (masterRoles.some(r => r.title.toLowerCase() === title.toLowerCase())) {
    alert("Role title already exists");
    return;
  }
  masterRoles.push({ id: `role-${Date.now()}`, title, description: desc, topics: [] });
  saveMasterRoles();
  newRoleTitleInput.value = "";
  newRoleDescInput.value = "";
  renderMasterRoles();
});

// Open topic editor for role at index
function openTopicEditor(roleIdx) {
  editingRoleIndex = roleIdx;
  const role = masterRoles[roleIdx];
  topicRoleTitle.textContent = role.title;

  adminTopicList.innerHTML = "";
  if (!role.topics || role.topics.length === 0) {
    adminTopicList.innerHTML = "<li>No topics added.</li>";
  } else {
    role.topics.forEach((topic, idx) => {
      const li = document.createElement("li");
      li.className = "topic-item";
      li.textContent = topic.title + " (" + (topic.status || "Pending") + ")";

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit Subtopics";
      editBtn.style.marginLeft = "10px";
      editBtn.style.background = "#2563eb";
      editBtn.style.color = "white";
      editBtn.style.border = "none";
      editBtn.style.cursor = "pointer";
      editBtn.style.borderRadius = "6px";
      editBtn.onclick = () => openSubtopicEditor(idx);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.style.marginLeft = "10px";
      deleteBtn.style.background = "#e53935";
      deleteBtn.style.color = "white";
      deleteBtn.style.border = "none";
      deleteBtn.style.cursor = "pointer";
      deleteBtn.style.borderRadius = "6px";
      deleteBtn.onclick = () => {
        if (confirm(`Delete topic "${topic.title}"?`)) {
          masterRoles[editingRoleIndex].topics.splice(idx, 1);
          saveMasterRoles();
          openTopicEditor(editingRoleIndex);
        }
      };

      li.appendChild(editBtn);
      li.appendChild(deleteBtn);

      adminTopicList.appendChild(li);
    });
  }

  toggleVisibility(topicEditorContainer);
}

// Back to master roles from topics editor
document.getElementById("back-to-topics-btn").addEventListener("click", () => {
  toggleVisibility(adminContainer);
  toggleVisibility(topicEditorContainer);
  editingRoleIndex = null;
});

// Add new topic
addTopicBtn.addEventListener("click", () => {
  const title = newTopicTitleInput.value.trim();
  const status = newTopicStatusSelect.value;
  const deadline = newTopicDeadlineInput.value;
  const description = newTopicDescInput.value.trim();

  if (!title) {
    alert("Topic title required");
    return;
  }

  if(!masterRoles[editingRoleIndex].topics) masterRoles[editingRoleIndex].topics = [];

  masterRoles[editingRoleIndex].topics.push({
    title, status, deadline, description, subtopics: []
  });

  saveMasterRoles();

  newTopicTitleInput.value = "";
  newTopicStatusSelect.value = "Pending";
  newTopicDeadlineInput.value = "";
  newTopicDescInput.value = "";

  openTopicEditor(editingRoleIndex);
});

// Open subtopic editor
let editingTopicIndex = null;
function openSubtopicEditor(topicIdx) {
  editingTopicIndex = topicIdx;
  subtopicTopicTitle.textContent = masterRoles[editingRoleIndex].topics[topicIdx].title;

  renderAdminSubtopics(masterRoles[editingRoleIndex].topics[topicIdx].subtopics || []);
  toggleVisibility(topicEditorContainer);
  toggleVisibility(subtopicEditorContainer);
}

// Back to topics from subtopics editor
document.getElementById("back-to-subtopics-btn").addEventListener("click", () => {
  toggleVisibility(subtopicEditorContainer);
  toggleVisibility(topicEditorContainer);
  editingTopicIndex = null;
});

// Render admin subtopics list
function renderAdminSubtopics(subtopics) {
  adminSubtopicList.innerHTML = "";
  if (!subtopics.length) {
    adminSubtopicList.innerHTML = "<li>No subtopics added.</li>";
    return;
  }

  subtopics.forEach((subtopic, idx) => {
    const li = document.createElement("li");
    li.className = "subtopic-item";
    li.textContent = subtopic.title + " (" + (subtopic.status || "Pending") + ")";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.style.background = "#e53935";
    deleteBtn.style.color = "white";
    deleteBtn.style.border = "none";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.style.borderRadius = "6px";
    deleteBtn.onclick = () => {
      if (confirm(`Delete subtopic "${subtopic.title}"?`)) {
        masterRoles[editingRoleIndex].topics[editingTopicIndex].subtopics.splice(idx, 1);
        saveMasterRoles();
        renderAdminSubtopics(masterRoles[editingRoleIndex].topics[editingTopicIndex].subtopics);
      }
    };

    li.appendChild(deleteBtn);
    adminSubtopicList.appendChild(li);
  });
}

// Add new subtopic
addSubtopicBtn.addEventListener("click", () => {
  const title = newSubtopicTitleInput.value.trim();
  const status = newSubtopicStatusSelect.value;
  const deadline = newSubtopicDeadlineInput.value;
  const description = newSubtopicDescInput.value.trim();

  if (!title) {
    alert("Subtopic title required");
    return;
  }

  let subs = masterRoles[editingRoleIndex].topics[editingTopicIndex].subtopics || [];
  subs.push({ title, status, deadline, description });
  masterRoles[editingRoleIndex].topics[editingTopicIndex].subtopics = subs;
  saveMasterRoles();

  newSubtopicTitleInput.value = "";
  newSubtopicStatusSelect.value = "Pending";
  newSubtopicDeadlineInput.value = "";
  newSubtopicDescInput.value = "";

  renderAdminSubtopics(subs);
});

// Utility to toggle visibility between two containers
function toggleVisibility(...containers) {
  containers.forEach(c => c.classList.toggle("hidden"));
}
