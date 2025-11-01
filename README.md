# Study Tracker App

A browser-based study tracker and learning roadmap management application with multi-user authentication, admin role management, detailed topic and subtopic progress tracking, study session logging, and personalized notes/links for learners.

---

## Features

- User authentication with signup and login.
- Admin dashboard to manage users, master roles, topics, and subtopics.
- Roles include detailed roadmap with topics and nested subtopics.
- Users can add roles from the master list to their profile.
- Track progress on topics and subtopics (Pending, In Progress, Finished).
- Add personal notes and learning resource links per topic/subtopic.
- Log study sessions with start/end datetime and notes.
- View dynamic progress bars at role, topic, and subtopic level.
- Clean UI with navigation between roles, topics, subtopics, and sessions.
- Persistent data storage in browser localStorage.

---

## Project Structure

- `index.html` — Main HTML file defining the UI structure.
- `styles.css` — CSS styling for layouts and components.
- `utils.js` — Utility functions for hashing, formatting, and storage.
- `auth.js` — Authentication logic and session handling.
- `admin.js` — Admin dashboard and management features.
- `user.js` — User dashboard, progress tracking, and session logging.
- `app.js` — Initialization and app flow control.
- `README.md` — Project documentation.

---

## Setup and Usage

1. Clone or download this repository.

2. Open `index.html` in a modern web browser (Chrome, Firefox, Edge).

3. Predefined Admin Credentials:
   - Username: `vaish`
   - Password: `123456`

4. Admin can log in to manage users, roles, topics, and subtopics.

5. Users can sign up, log in, add roles, and track learning progress.

6. All data is saved locally in browser storage. Clearing browser data will erase stored information.

---

## Contribution

Feel free to submit issues or pull requests to improve the app, add more features, or fix bugs.

---

## License

This project is provided as-is with no warranty. Use and modify as you see fit.

---

## Contact

For questions or help, please open an issue or contact the project maintainer.

