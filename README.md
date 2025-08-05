# Shutr - Instagram Clone Frontend

Welcome to **Shutr**, a pixel-perfect Instagram clone built with modern web technologies. This frontend project is designed for seamless interaction with the Appwrite backend, offering features like user authentication, image posting, and social interactions.

## 🌐 Live Demo

[Visit Live Site](https://insta-clone-iuqs.vercel.app)

---

## 🚀 Tech Stack

* **React.js** – Frontend UI library
* **Redux Toolkit** – State management
* **Tailwind CSS** – Utility-first CSS framework
* **Appwrite** – Backend-as-a-Service (authentication, database, storage)
* **React Router** – Routing
* **Zod + React Hook Form** – Form validation and management

---

## 📸 Features

* 🔐 **Authentication** (Signup, Login, Logout, Google OAuth)
* 📷 **Image Uploading** via Appwrite Storage
* 🧑‍🤝‍🧑 **Follow/Unfollow** Users
* 💬 Realtime chatting using socket
* 📄 **User Profiles** with Avatar Support

---

## 📁 Project Structure

```
shutr/
├── components/         # Reusable UI components
├── constants/          # Appwrite constants
├── hooks/              # Custom React hooks
├── lib/                # Export appwrite configuration
├── pages/              # Page-level components
├── routes/             # Route defination for app router
├── schemas/            # Zod validation schemas
├── services/           # Appwrite services for auth, storage, DB
├── store/              # Redux slices and async thunks
├── utility/            # Utility functions
├── App.tsx             # App Logic
└── main.tsx            # App entry point
```

---

## 🛠️ Setup & Installation

1. **Clone the repo**

   ```bash
   git clone https://github.com/Aryan9inja/Insta-Clone.git
   cd Insta-Clone
   ```
2. **Install dependencies**

   ```bash
   npm install
   ```
3. **Configure environment**

   * Create a `.env` file
   * Add your Appwrite and Chat Server credentials:

     ```bash
     VITE_APPWRITE_PROJECT_ID=
     VITE_APPWRITE_ENDPOINT=
     VITE_APPWRITE_DATABASE_ID=
     VITE_APPWRITE_BUCKET_ID=
     VITE_DEFAULT_PROFILE_IMAGE_ID=
     VITE_APPWRITE_EMAIL_VERIFY_REDIRECT=
     VITE_APPWRITE_COLLECTION_USERS=
     VITE_APPWRITE_COLLECTION_POSTS=
     VITE_APPWRITE_COLLECTION_LIKES=
     VITE_APPWRITE_COLLECTION_FOLLOWERS=
     VITE_SOCKET_SERVER_URL=
     ```
4. **Run the app**

   ```bash
   npm run dev
   ```

---

## 💬 Running Your Own Chat Server

To enable the messaging feature, run your own socket server using the following repo:

**Repo:** [ChatServiceNestJs](https://github.com/Aryan9inja/ChatServiceNestJs)

---

## 💡 Notes

* Only one Appwrite storage bucket is used (due to free plan limits)
* Images (avatars and posts) are stored in the same bucket and distinguished via metadata

---

## 🧑‍💻 Author

**Aryan Singh Thakur**
[GitHub](https://github.com/Aryan9inja) · [LinkedIn](https://www.linkedin.com/in/aryan9inja/)

---

## 📜 License

This project is for educational and portfolio purposes. Not for commercial use.
