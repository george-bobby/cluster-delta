# Cluster Delta (MERN Stack)

This repository contains a full-stack social media application built with the MERN stack.

## MERN Architecture

The application is divided into two main parts:

- **`client`**: A React application created with Create React App that serves as the frontend.
- **`server`**: A Node.js and Express application that provides the backend API.

### How they work together

1.  **React Client**: The user interacts with the React application in their browser. When a user performs an action (e.g., logs in, creates a post), the client sends an HTTP request to the backend API.
2.  **Express Server**: The Express server receives the request, processes it, and interacts with the MongoDB database.
3.  **MongoDB Database**: The server uses Mongoose to model the application data and interact with the MongoDB database.
4.  **Data Flow**: The server sends a response back to the client, which then updates the UI to reflect the changes.

---

## Project Structure

```
cluster-delta/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable React components
│       ├── pages/          # Main pages of the application
│       ├── redux/          # Redux store and slices
│       └── utils/          # Utility functions (e.g., api.js)
└── server/                 # Node.js backend
    ├── controllers/        # Logic for handling requests
    ├── dbConfig/           # MongoDB connection configuration
    ├── middleware/         # Custom middleware (e.g., authentication)
    ├── models/             # Mongoose data models
    └── routes/             # API routes
```

---

## API Endpoints

The server exposes the following API endpoints:

- `POST /auth/register`: Register a new user.
- `POST /auth/login`: Log in a user.
- `POST /posts/create-post`: Create a new post.
- `GET /posts`: Get all posts.
- `GET /posts/:id`: Get a single post.
- `POST /posts/like/:id`: Like a post.
- `POST /posts/comment/:id`: Comment on a post.
- `DELETE /posts/:id`: Delete a post.
- `GET /users/get-user/:id?`: Get user information.
- `PUT /users/update-user`: Update user information.
- `POST /users/friend-request`: Send a friend request.
- `POST /users/accept-request`: Accept a friend request.

---

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB

### Installation and Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/cluster-delta.git
    cd cluster-delta
    ```

2.  **Setup the server:**

    ```bash
    cd server
    npm install
    ```

    Create a `.env` file in the `server` directory and add your MongoDB connection string and other environment variables.

3.  **Setup the client:**

    ```bash
    cd ../client
    npm install
    ```

    Create a `.env` file in the `client` directory and add the following:

    ```
    REACT_APP_API_URL=http://localhost:8800
    ```

### Running the Application

1.  **Start the server:**

    ```bash
    cd server
    npm start
    ```

2.  **Start the client:**

    ```bash
    cd ../client
    npm start
    ```

The client will be running at `http://localhost:3000` and the server at `http://localhost:8800`.
