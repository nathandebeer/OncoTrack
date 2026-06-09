# OncoTrack: A Cross-Platform Mobile App Designed to Assist Cancer Patients

OncoTrack is a mobile app built with React Native and Firebase to assist cancer patients in managing their health journey.

---

## 📚 Contents

- [🎥 Demo Video](#-demo-video)
- [📱 Core Features](#-core-features)
- [⚙️ Technologies Used](#️-technologies-used)
- [📂 Folder Structure Overview](#-folder-structure-overview)
- [🚀 Setup & Installation](#-setup--installation)


---

## 🎥 Demo Video

To show the features and functionalites of the app, I have created a demo video. The video showcases the app's user interface, navigation, and core functionalities.

[▶️ Click here for the OncoTrack Demo Video](https://universityofexeteruk-my.sharepoint.com/:v:/g/personal/nd450_exeter_ac_uk/EVNQKQviLUFLim1W60l9d3sB2mS6vufoqasGBb2KAKPm4Q?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=oW0q2y)


---

## 📱 Core Features

- **Medication and Appointment Management**  
  - Reminders for medications and doctor appointments
  - Customisable schedules and notifications
  - Check off completed reminders

- **Symptom Tracking**  
  - Report symptoms with severity and notes
  - View previous symptom reports

- **Community Forum**  
  - Create text based posts
  - Comment and like other posts

- **Onco AI Assistant**  
  - AI chatbot powered by OpenAI
  - Answer cancer-related questions

- **Educational Articles**  
  - Basic educational articles

- **Journaling**  
  - Add journal entries
  - Read, edit, and delete past entries

- **To-Do List**  
  - Manage daily tasks
  - Check off completed tasks



---

## ⚙️ Technologies Used

- **Frontend**: React Native (Expo)
- **Backend**: Firebase (Firestore, Authentication)
- **Notifications**: Expo Notifications
- **AI Integration**: OpenAI API
- **State Management**: React hooks (`useState`, `useEffect`)
- **Navigation**: React Navigation (Drawer, Stack, Tab Navigators)

---


## 📂 Folder Structure Overview

```plaintext
├── assets/
│   ├── animations/
│   ├── appIcon/
│   ├── articles/
│   ├── icons/
│   └── images/
├── components/
│   ├── AppointmentCard.js
│   ├── ArticleCard.js
│   ├── CalendarCard.js
│   ├── CalendarComponent.js
│   ├── QuickActionCard.js
│   └── ReminderCard.js
├── navigation
│   └── navigationRef.js
├── screens/
│   ├── HomePage.js
│   ├── SchedulePage.js
│   ├── TrackPage.js
│   ├── CommunityPage.js
│   ├── ChatPage.js
│   ├── ToDoScreen.js
│   ├── JournalListScreen.js
│   ├── AddJournalEntryScreen.js
│   ├── ViewJournalEntryScreen.js
│   ├── SymptomDetailScreen.js
│   ├── SymptomReportsScreen.js
│   ├── AllSymptomsScreen.js
│   ├── CreatePostScreen.js
│   ├── PostDetailScreen.js
│   ├── EditReminder.js
│   ├── LoginScreen.js
│   ├── EmailSignUpScreen.js
│   ├── SignUpOptionsScreen.js
│   ├── TermsAndConditions.js
│   └── PrivacyPolicy.js  
├── utils/
│   ├── dateHelper.js
│   ├── notifications.js
│   ├── openaiAPI.js
│   ├── timeUtils.js
│   └── userAvatar.js
├── App.js
├── app.json
├── firebaseConfig.js
├── index.js
├── metro.config.js
├── package-lock.json
├── package.json
└── README.md
```


## 🚀 Setup & Installation

Follow these steps to install dependencies and run the app locally.

### 1. Prerequisites

Ensure the following tools are installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)


### Install Project Dependencies

Open a terminal and run:

```bash
npm install
```
### 3. Run the App
To start the development server, run:

```bash
npm start
```
or
```bash
npx expo start
```


This will start the server and show the Expo developer tools and a QR code in terminal. 

From here, you can run the app on a physical device:

	•	Download and install the Expo Go app (available on AppStore and PlayStore)
    •   Scan the QR code 

Or choose to run the app in an emulator:

	•	Press a for Android emulator (if Android Studio installed and configured)
	•	Press i for iOS simulator (if xCode installed and configured)


