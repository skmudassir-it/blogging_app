# Mrs. Frost's Holiday Recipe Blog (MERN Stack)

A full-stack blogging application built with the MERN stack (MongoDB, Express, React, Node.js). It features a premium editorial "Mrs. Frost" aesthetic, complete with social interactions (likes, comments, replies) and an admin dashboard.

## Features
- **Public Blog**: Responsive grid layout with large images and elegant typography.
- **Admin Dashboard**: Manage posts (Create, Read, Update, Delete).
- **Social Features**:
    - Like & Dislike posts.
    - View counters.
    - Related/Recent posts section.
    - **Comments System**: Nested replies, likes/dislikes on comments.
- **API**: External API integration supported (verified via Postman/cURL).

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (URI required)

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    ```

2.  **Backend Setup**
    ```bash
    cd server
    npm install
    # Create .env file with:
    # PORT=5001
    # MONGODB_URI=your_mongodb_connection_string
    npm run start
    ```

3.  **Frontend Setup**
    ```bash
    cd client
    npm install
    npm run dev
    ```

## Access
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5001/api`
