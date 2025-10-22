CipherStudio: A Web-Based React IDE

CipherStudio is a full-stack MERN application that provides a lightweight, in-browser Integrated Development Environment (IDE) for simple React projects. It features a file explorer, a live-reloading code editor, and a browser preview, all powered by @codesandbox/sandpack-react.

Projects are automatically created with a default App.js and package.json, and all file changes are automatically saved to a MongoDB database, allowing you to pick up where you left off.

✨ Features

Full-Stack MERN Architecture: Built with MongoDB, Express.js, React, and Node.js.

Live React Environment: Uses Sandpack to provide a live-reloading code editor and browser preview.

Persistent Storage: All projects and files are saved to a MongoDB database.

Auto-Saving: A custom React hook automatically saves file changes to the backend after a 2-second delay.

Modern Frontend: Built with Vite, React (using Hooks), and styled with Tailwind CSS.

Scalable File Structure: The frontend is organized by feature and type (api, components, hooks, pages) for maintainability.

🚀 Tech Stack

Backend (server)

Node.js: JavaScript runtime

Express.js: Web server framework

MongoDB: NoSQL database

Mongoose: ODM for MongoDB

cors: Cross-Origin Resource Sharing middleware

dotenv: For managing environment variables

Frontend (client)

React 18: UI library (with Hooks)

Vite: Frontend build tool and dev server

Tailwind CSS: Utility-first CSS framework

@codesandbox/sandpack-react: The core editor/preview component

react-router-dom: For client-side routing

axios: For making API requests

Getting Started

To run this project locally, you will need two separate terminals: one for the backend server and one for the frontend client.

Prerequisites

Node.js (v16 or later)

MongoDB (a local instance or a free MongoDB Atlas cluster)

1. Backend (server) Setup

Navigate to the server directory:

cd server


Install dependencies:

npm install


Create your environment file:
Create a file named .env in the server directory and add your MongoDB connection string and a port:

# Example .env file
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
PORT=8008


Note: The frontend is pre-configured to connect to port 8008. You can change this in client/src/api/index.js.

Start the backend server:

node server.js


You should see MongoDB Connected successfully. and Server is running on port 8008.

2. Frontend (client) Setup

Open a new terminal and navigate to the client directory:

cd client


Install dependencies:

npm install


Start the frontend dev server:

npm run dev


Vite will open your browser to http://localhost:5173 (or the next available port).

3. Usage

Open the application in your browser.

Click the "Start a New Project" button.

You will be redirected to the IDE page for your new project.

Start coding in App.js! Your changes will appear in the preview pane.

Wait two seconds after you stop typing, and your work will be automatically saved to the database.