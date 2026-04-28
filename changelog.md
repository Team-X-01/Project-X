# Changelog

This document tracks the changes made to the Project X application.

## [2026-06-13 18:12]

### Changed
- **UI:** Updated the main welcome title to "Welcome to Project X !" and added a smaller, gray-colored instructional subtext for better readability.

### Fixed
- **UI:** Eliminated the distracting "flash" of the welcome screen that occurred for returning users. The application now waits to display the correct screen (welcome vs. chat), ensuring a smoother visual transition.

### Other
- **Testing:** Temporarily implemented a function to delete a user's data from Firestore to allow for clean testing of the new user experience. This code was subsequently removed.

## [2026-06-13 18:00]

### Added
- **Feature:** Implemented a dedicated full-screen welcome page for a more immersive first-time user experience when choosing a username.
- **Feature:** The 'edit username' functionality now uses a pop-up modal, allowing users to change their name without leaving the chat interface.
- **Refactor:** Replaced all unreliable `prompt()` calls with a robust system using a custom-built modal and a separate welcome screen.
- **Refactor:** Overhauled the application's startup logic in `app.js` to intelligently distinguish between new and returning users, showing the welcome screen or the chat as appropriate.

### Fixed
- **Critical Bug:** Resolved an issue where the chat input would become permanently disabled if the initial username prompt was blocked or canceled.
- **Critical Bug:** Fixed the broken username system, including the initial prompt and the 'edit username' feature.
- **Bug:** Corrected a flaw in the app's initialization that caused all messages to disappear under certain conditions.

## [2026-06-13 17:55]

### Added
- Accessibility improvements: Added `aria-label` attributes to the message input and send button for better screen reader support.

### Changed
- **UI:** Made the application full-screen to remove unintended borders and white corners.
- **UI:** Removed the border from the header for a cleaner look.

## [2026-06-13 17:50]

### Added
- Initial project setup with HTML, CSS, and JavaScript.
- Firebase Firestore for real-time chat functionality.
- Dark theme with a blue accent color.
- Font Awesome for icons.

### Changed
- Renamed the project from "D-AI" to "Project X".
- **UI:** Removed disclaimer, LLaMA pill, and hamburger menu.
- **UI:** Updated input placeholder text to "Send anything".
