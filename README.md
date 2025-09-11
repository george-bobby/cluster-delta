# Cluster Delta Project

Below are the instructions for setting up and running the project.

---

## Folder Structure

```
cluster-delta

├── client
├── server
```

- **client**: Frontend code (Next.js application).
- **server**: Backend code (Node.js application).

---

## Setup Instructions

### Frontend (Client)

1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install --force
   ```
3. Start the client:
   ```bash
   npm start
   ```

### Backend (Server)

1. Open a New Terminal

2. Navigate to the server directory:
   ```bash
   cd server
   ```
3. Install dependencies:
   ```bash
   npm install --force
   ```
4. Start the server:
   ```bash
   npm start
   ```

---

## Defaults

- Client dev server: http://localhost:3000
- API server: http://localhost:8800

---

## Environment Variables

- The env file for `server` folder is there in the repo already.
- The env file for `client` folder is not there in the repo. Create a new file named `.env.local` in the `client` folder and add the following line:
  ```bash
  NEXT_PUBLIC_API_URL=http://localhost:8800
  ```

---

## MongoDB Access

- Download and Install MongoDB Compass on your Machine
- MongoDB Connectuon URI is given in the .env file of `/server` folder. Copy that and paste it in new connection option inside Compass App

---
