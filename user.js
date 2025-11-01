// Dependencies: utils.js functions and data persistence

let users = loadUsers();
let masterRoles = loadMasterRoles();

const userContainer = document.getElementById("user-container");
const roleDetailsContainer = document.getElementById("role-details-container");
const studySessionContainer = document.getElementById("study-session-container");

const roleSearchInput = document.getElementById("role-search");
const autocompleteList = document.getElementById("autocomplete-list");
const personalRoleList = document.getElementById("personal-role-list");

const roleDetailTitle = document.getElementById("role-detail-title");
const roleDetailDesc = document.getElementById("role-detail-desc");
const roleTopicsList = document.getElementById("role-topics-list");
const roleProgressBar = document.getElementById("role-progress-bar");
const roleProgressPercent = document.getElementById("role-progress-percent");

const backToRolesBtn = document.getElementById("back-to-roles-btn");

const studySessionSubtopicTitle = document.getElementById("session-subtopic-title");
const userStudySessionsList = document.getElementById("user-study-sessions-list");
const sessionStartInput = document.getElementById("session-start");
const sessionEndInput = document.getElementById("session-end");
const sessionNotesInput = document.getElementById("session-notes");
const addSessionBtn = document.getElementById("add-session-btn");
const backToSubtopicsFromSessionsBtn = document.getElementById("back-to-subtopics-from-session-btn");

let currentUser = sessionStorage.getItem("currentUser");

let selectedRoleIndex = null;
let selectedTopicIndex = null;
let selectedSubtopicIndex = null;

function renderPersonalRoles() {
  const userData = users[currentUser].data || { roles: [] };
  const roles = userData.roles;
  personalRoleList.innerHTML = "";

  if (!roles || roles.length === 0) {
    personalRoleList.innerHTML = "<p>No roles added yet. Use the search box above to add roles.</p>";
    return;
  }

  roles.forEach((role, idx) => {
    const div = document.createElement("div");
    div.className = "personal-role";
    div.tabIndex = 0;
    div.textContent = role.title;
    div.title = "Click to view role details";

    div.addEventListener("click", () => showRoleDetails(idx));
    div.addEventListener("keypress", e => { if (e.key === "Enter") showRoleDetails(idx); });

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.title = `Remove ${role.title}`;
    removeBtn.textContent = "×";
    removeBtn.addEventListener("click", e => {
      e.stopPropagation();
      if (confirm(`Remove role "${role.title}"?`)) {
        roles.splice(idx, 1);
        users[currentUser].data.roles = roles;
        saveUsers(users);
        renderPersonalRoles();
        hideRoleDetails();
      }
    });

    div.appendChild(removeBtn);
    personalRoleList.appendChild(div);
  });
}

roleSearchInput.addEventListener("input", () => {
  const val = roleSearchInput.value.trim().toLowerCase();
  autocompleteList.innerHTML = "";
  if (!val) return;

  // Filter masterRoles to those matching search
  const filtered = masterRoles.filter(r => r.title.toLowerCase().includes(val));
  filtered.forEach(role => {
    const item = document.createElement("div");
    item.className = "role-item";
    item.textContent = role.title;

    const addBtn = document.createElement("button");
    addBtn.textContent = "Add";
    addBtn.className = "role-add-btn";
    addBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      addRoleToUser(role);
    });

    item.appendChild(addBtn);
    autocompleteList.appendChild(item);

    item.addEventListener("click", () => {
      roleSearchInput.value = role.title;
      autocompleteList.innerHTML = "";
    });
  });
});

function addRoleToUser(role) {
  const userData = users[currentUser].data || { roles: [] };
  if (userData.roles.some(r => r.title === role.title)) {
    alert("Role already added");
    return;
  }
  userData.roles.push(JSON.parse(JSON.stringify(role))); // clone to user
  users[currentUser].data = userData;
  saveUsers(users);
  alert(`Added role "${role.title}"!`);
  renderPersonalRoles();
  roleSearchInput.value = "";
  autocompleteList.innerHTML = "";
}

function showRoleDetails(index) {
  selectedRoleIndex = index;
  const role = users[currentUser].data.roles[index];
  roleDetailTitle.textContent = role.title;
  roleDetailDesc.textContent = role.description || "No description provided.";

  renderRoleTopics(role.topics || []);
  updateRoleProgress(role.topics || []);

  userContainer.classList.add("hidden");
  roleDetailsContainer.classList.remove("hidden");
}

backToRolesBtn.addEventListener("click", () => hideRoleDetails());

function hideRoleDetails() {
  selectedRoleIndex = null;
  roleDetailsContainer.classList.add("hidden");
  userContainer.classList.remove("hidden");
}

function renderRoleTopics(topics) {
  roleTopicsList.innerHTML = "";
  if (!topics.length) {
    roleTopicsList.innerHTML = "<li>No topics for this role.</li>";
    return;
  }
  topics.forEach((topic, idx) => {
    const li = document.createElement("li");
    li.className = "topic-item";

    const leftDiv = document.createElement("div");
    leftDiv.style.flex = "1";

    const titleSpan = document.createElement("span");
    titleSpan.textContent = topic.title;
    titleSpan.style.fontWeight = "600";
    leftDiv.appendChild(titleSpan);

    const statusSelect = document.createElement("select");
    ["Pending","In Progress","Finished"].forEach(st => {
      const option = document.createElement("option");
      option.value = st;
      option.textContent = st;
      if (topic.status === st) option.selected = true;
      statusSelect.appendChild(option);
    });
    statusSelect.style.marginLeft = "10px";

    const notesInput = document.createElement("textarea");
    notesInput.placeholder = "Personal notes...";
    notesInput.value = topic.notes || "";
    notesInput.style.width = "100%";
    notesInput.style.marginTop = "6px";
    notesInput.rows = 2;

    const linkInput = document.createElement("input");
    linkInput.type = "text";
    linkInput.placeholder = "Your learning link/resource";
    linkInput.value = topic.userLink || "";
    linkInput.style.width = "100%";
    linkInput.style.marginTop = "6px";

    statusSelect.addEventListener("change", () => {
      topic.status = statusSelect.value;
      saveUsers(users);
      updateRoleProgress(users[currentUser].data.roles[selectedRoleIndex].topics);
    });

    notesInput.addEventListener("input", () => {
      topic.notes = notesInput.value;
      saveUsers(users);
    });

    linkInput.addEventListener("input", () => {
      topic.userLink = linkInput.value;
      saveUsers(users);
    });

    li.appendChild(leftDiv);
    li.appendChild(statusSelect);
    roleTopicsList.appendChild(li);
    li.appendChild(notesInput);
    li.appendChild(linkInput);

    // If subtopics present, list them similarly with nested indentation
    if(topic.subtopics && topic.subtopics.length){
      const sublist = document.createElement("ul");
      sublist.className = "subtopic-list";
      topic.subtopics.forEach((subtopic, sidx) => {
        const sli = document.createElement("li");
        sli.className = "subtopic-item";
        sli.style.marginLeft = "20px";

        const sleftDiv = document.createElement("div");
        sleftDiv.style.flex = "1";

        const stitleSpan = document.createElement("span");
        stitleSpan.textContent = subtopic.title;
        stitleSpan.style.fontWeight = "600";
        sleftDiv.appendChild(stitleSpan);

        const sstatusSelect = document.createElement("select");
        ["Pending","In Progress","Finished"].forEach(st => {
          const option = document.createElement("option");
          option.value = st;
          option.textContent = st;
          if (subtopic.status === st) option.selected = true;
          sstatusSelect.appendChild(option);
        });
        sstatusSelect.style.marginLeft = "10px";

        const snotesInput = document.createElement("textarea");
        snotesInput.placeholder = "Personal notes...";
        snotesInput.value = subtopic.notes || "";
        snotesInput.style.width = "100%";
        snotesInput.style.marginTop = "6px";
        snotesInput.rows = 2;

        const slinkInput = document.createElement("input");
        slinkInput.type = "text";
        slinkInput.placeholder = "Your learning link/resource";
        slinkInput.value = subtopic.userLink || "";
        slinkInput.style.width = "100%";
        slinkInput.style.marginTop = "6px";

        sstatusSelect.addEventListener("change", () => {
          subtopic.status = sstatusSelect.value;
          saveUsers(users);
          updateRoleProgress(users[currentUser].data.roles[selectedRoleIndex].topics);
        });

        snotesInput.addEventListener("input", () => {
          subtopic.notes = snotesInput.value;
          saveUsers(users);
        });

        slinkInput.addEventListener("input", () => {
          subtopic.userLink = slinkInput.value;
          saveUsers(users);
        });

        sli.appendChild(sleftDiv);
        sli.appendChild(sstatusSelect);
        sublist.appendChild(sli);
        sli.appendChild(snotesInput);
        sli.appendChild(slinkInput);

        // Add button to show study sessions for this subtopic
        const sessionBtn = document.createElement("button");
        sessionBtn.textContent = "Study Sessions";
        sessionBtn.className = "session-btn";
        sessionBtn.style.marginLeft = "10px";
        sessionBtn.onclick = () => {
          showStudySessions(selectedRoleIndex, idx, sidx);
        };
        sli.appendChild(sessionBtn);
      });
      roleTopicsList.appendChild(sublist);
    }
  });
}

function updateRoleProgress(topics) {
  if (!topics.length) {
    roleProgressBar.style.width = "0%";
    roleProgressPercent.textContent = "";
    return;
  }
  // Calculate percentage completing topics and subtopics
  let totalCount = 0, finishedCount = 0;
  topics.forEach(t => {
    totalCount++;
    if (t.status && t.status.toLowerCase() === "finished") finishedCount++;
    if (t.subtopics && t.subtopics.length) {
      t.subtopics.forEach(st => {
        totalCount++;
        if (st.status && st.status.toLowerCase() === "finished") finishedCount++;
      });
    }
  });
  const percent = totalCount === 0 ? 0 : Math.round((finishedCount / totalCount) * 100);
  roleProgressBar.style.width = percent + "%";
  roleProgressPercent.textContent = `Progress: ${percent}% completed`;
}

// Study session management for users
let currentRoleIdx = null;
let currentTopicIdx = null;
let currentSubtopicIdx = null;

const studySessionSubtopicTitle = document.getElementById("session-subtopic-title");
const userStudySessionsList = document.getElementById("user-study-sessions-list");
const sessionStartInput = document.getElementById("session-start");
const sessionEndInput = document.getElementById("session-end");
const sessionNotesInput = document.getElementById("session-notes");
const addSessionBtn = document.getElementById("add-session-btn");
const backToSubtopicsFromSessionsBtn = document.getElementById("back-to-subtopics-from-session-btn");

function showStudySessions(roleIdx, topicIdx, subtopicIdx) {
  currentRoleIdx = roleIdx;
  currentTopicIdx = topicIdx;
  currentSubtopicIdx = subtopicIdx;

  const subtopic = users[currentUser].data.roles[roleIdx].topics[topicIdx].subtopics[subtopicIdx];
  studySessionSubtopicTitle.textContent = subtopic.title || "(Unnamed subtopic)";
  userStudySessionsList.innerHTML = "";

  subtopic.sessions = subtopic.sessions || [];

  if (subtopic.sessions.length === 0) {
    userStudySessionsList.innerHTML = "<li>No study sessions logged.</li>";
  } else {
    subtopic.sessions.forEach((session, index) => {
      const li = document.createElement("li");
      li.textContent = `Start: ${formatDate(session.start)} - End: ${formatDate(session.end)} - Notes: ${session.notes || "(none)"}`;
      userStudySessionsList.appendChild(li);
    });
  }

  userContainer.classList.add("hidden");
  roleDetailsContainer.classList.add("hidden");
  studySessionContainer.classList.remove("hidden");
}

backToSubtopicsFromSessionsBtn.addEventListener("click", () => {
  studySessionContainer.classList.add("hidden");
  showRoleDetails(selectedRoleIndex);
});

addSessionBtn.addEventListener("click", () => {
  let start = sessionStartInput.value;
  let end = sessionEndInput.value;
  let notes = sessionNotesInput.value.trim();

  if (!start || !end) {
    alert("Please provide start and end date/time.");
    return;
  }
  if (new Date(start) > new Date(end)) {
    alert("End date/time must be after start date/time.");
    return;
  }
  const subtopic = users[currentUser].data.roles[currentRoleIdx].topics[currentTopicIdx].subtopics[currentSubtopicIdx];
  subtopic.sessions = subtopic.sessions || [];
  subtopic.sessions.push({ start, end, notes });
  saveUsers(users);
  alert("Study session added!");
  sessionStartInput.value = "";
  sessionEndInput.value = "";
  sessionNotesInput.value = "";
  showStudySessions(currentRoleIdx, currentTopicIdx, currentSubtopicIdx);
});
