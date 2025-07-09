📚 Book Snippet Collector
A full-stack MERN application designed for book lovers to capture, store, and revisit the lines that move them. This platform provides a personal, digital library for all your favorite quotes and snippets, accessible from anywhere.

✨ Features

#Secure User Authentication:
Full email/password registration and login.
Google OAuth 2.0 for quick and secure access.
Persistent login sessions using cookies.


# Snippet Management (CRUD):

Create: Add new snippets with quote text, author, book name, page number, and an associated emotion.
Read: View all your saved snippets in a clean, modern, and responsive grid.
Click-to-View: View full snippet details in a modal pop-up.
Image Uploads: Attach cover images or relevant pictures to your snippets.


# Dynamic Dashboard:

Rich Filtering: Filter snippets by emotion, or by content type (with or without an image).
Powerful Search: Instantly search across all your snippets by quote text, author, or book name.
Sorting: Organize snippets by date added (Newest or Oldest First).


# "Pick Random" Feature:
Get a dose of inspiration by viewing a random snippet from your collection.


# Comprehensive User Profile & Settings:

Update your name, bio, and profile picture.
Securely change/reset your password via an email link sent to your inbox.
Permanently delete your account and all associated data, including uploaded images.



🛠️ Tech Stack

# Frontend

React.js: For building the dynamic user interface.
Material-UI (MUI): For a modern and responsive component library.
React Router: For client-side routing and navigation.
Axios: For making API requests to the backend.


# Backend

Node.js: JavaScript runtime environment.
Express.js: Web framework for creating robust APIs.
MongoDB: NoSQL database for storing user and snippet data.
Mongoose: Object Data Modeling (ODM) library for MongoDB.
Passport.js: Authentication middleware with strategies for local (email/password) and Google OAuth.
Express Session: For managing user login sessions.
Cloudinary & Multer: For handling image uploads and cloud storage.
Nodemailer: For sending password reset emails.




🚀 Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

# Prerequisites
You will need the following installed on your machine:
Node.js (v14 or newer)
MongoDB (or a free MongoDB Atlas account)
Git


# Installation & Setup
1. Clone the Repository
Open your terminal and clone the project:

git clone  https://github.com/Madicharlalavanya/Book-snippet-collector.git
cd book-snippet-collector

2. Backend Setup

Navigate into the backend directory and install the required npm packages.

cd backend
npm install


Next, create a .env file in the backend directory. This file will store all your secret keys and credentials.

Generated env
# MongoDB Connection String
# For a local DB: MONGO_URI=mongodb://localhost:27017/book-snippet-db
# For Atlas: MONGO_URI=your_mongodb_atlas_connection_string
MONGO_URI=

# Express Session Secret (make this a long, random string)
SESSION_SECRET=a_very_long_and_random_string_for_security

# Google OAuth Credentials (from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary Credentials for Image Uploads (from Cloudinary dashboard)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Nodemailer / Email Service Credentials
# For development, Mailtrap.io is highly recommended
EMAIL_HOST=your_email_host
EMAIL_PORT=your_email_port
EMAIL_USER=your_email_username
EMAIL_PASS=your_email_password
EMAIL_FROM="Book Snippet Collector <noreply@example.com>"

# Frontend URL
FRONTEND_URL=http://localhost:3000

Important: You must fill in the required values for the application to work. Do not commit your .env file to Git.


3. Frontend Setup
Open a new terminal window, navigate into the frontend directory, and install its dependencies.

cd frontend
npm install


Running the Application
You will need two separate terminal windows open to run both the backend and frontend servers concurrently.
In your first terminal (for the backend):

cd backend
npm start

The backend server will start and listen on http://localhost:5000 (or your specified port).
In your second terminal (for the frontend):

cd frontend
npm start

The React development server will start, and your application should automatically open in your browser at http://localhost:3000.
You're all set! You can now register a new account and start collecting snippets.
