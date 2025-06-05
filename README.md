# Image Management System Backend

This is the backend component of the Role-Based Image Management System, built with Node.js, Express.js, and MongoDB. It provides a secure API for user authentication, image uploads, and image management with role-based access control.

## Features

- User authentication (Registration, Login)
- JWT-based authorization
- Role-based access control (Super Admin, Admin, User)
- Image upload using Multer
- Image storage on the server filesystem
- MongoDB database integration using Mongoose
- API endpoints for user management and image operations

## Tech Stack

- **Node.js:** JavaScript runtime environment
- **Express.js:** Web application framework
- **MongoDB:** NoSQL database
- **Mongoose:** MongoDB object modeling for Node.js
- **bcryptjs:** For password hashing
- **jsonwebtoken:** For generating and verifying JWTs
- **cors:** For enabling Cross-Origin Resource Sharing
- **multer:** For handling file uploads
- **dotenv:** For loading environment variables from a .env file
- **nodemon:** For automatically restarting the server during development

## Project Structure

```
server/
├── models/          # MongoDB Mongoose models (User, UserImage)
├── middleware/      # Custom Express middleware (auth)
├── routes/          # API route handlers (auth, images, users)
├── uploads/         # Directory for storing uploaded images (created on first upload or manually)
├── .env             # Environment variables (NOT committed to Git)
├── .gitignore       # Specifies intentionally untracked files
├── server.js        # Main application entry point
├── init-db.js       # Script to initialize default users in the database
├── package.json     # Project dependencies and scripts
└── README.md        # This file
```

## Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd <repository_directory>/server
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the `server/` directory with the following content. Replace the placeholder values with your actual configuration:

    ```
    PORT=5000
    MONGODB_URI=your_mongodb_atlas_connection_string
    JWT_SECRET=a_long_random_string_for_jwt_signing
    ```

    - **`PORT`**: The port the server will run on (default is 5000).
    - **`MONGODB_URI`**: Your connection string for the MongoDB database (e.g., from MongoDB Atlas). Make sure to replace `<username>` and `<password>` in the connection string if they are included, and ensure your Atlas cluster allows connections from your IP.
    - **`JWT_SECRET`**: A strong, random string used to sign and verify JSON Web Tokens. You can generate one using `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`.

4.  **Initialize the Database (Optional but Recommended):**
    Run the initialization script to create default users (super_admin, admin, user):

    ```bash
    npm run init-db
    ```

    _Note: This script will delete all existing users before creating the defaults._ Use with caution on a production database.

5.  **Create Uploads Directory:**
    Create a directory named `uploads` in the `server/` folder where uploaded images will be stored:

    ```bash
    mkdir uploads
    ```

    (This directory is automatically ignored by Git via `.gitignore`)

6.  **Start the Server:**
    During development, you can use nodemon to automatically restart the server on code changes:
    ```bash
    npm run dev
    ```
    For production, use:
    ```bash
    npm start
    ```

## API Endpoints

The API endpoints are prefixed with `/api`. All routes requiring authentication need a valid JWT in the `Authorization: Bearer <token>` header.

### Authentication (`/api/auth`)

- `POST /api/auth/register`: Register a new user.
  - Body: `{ name, email, password, role? }` (`role` defaults to 'user' if not provided).
  - Returns: User details and JWT.
- `POST /api/auth/login`: Log in an existing user.
  - Body: `{ email, password }`.
  - Returns: User details and JWT.
- `GET /api/auth/me` (Protected): Get details of the currently logged-in user.
  - Returns: User details (excluding password).

### Images (`/api/images`)

- `POST /api/images` (Protected): Upload a new image.
  - Requires `multipart/form-data`. Fields: `title`, `description`, `image` (file).
  - Returns: Created image document.
- `GET /api/images/my-images` (Protected, User Role): Get images uploaded by the logged-in user.
  - Returns: Array of user's images.
- `GET /api/images/all` (Protected, Admin/Super Admin Roles): Get all images uploaded by all users.
  - Returns: Array of all images with uploader details.
- `DELETE /api/images/:id` (Protected, Super Admin Role): Delete an image by ID.
  - Returns: Success message.

## Role-Based Access Control

The application enforces different permissions based on user roles:

- **`user`**: Can upload images and view only their own uploaded images.
- **`admin`**: Can upload images, view their own images, and view all images uploaded by any user.
- **`super_admin`**: Can upload images, view their own images, view all images, and delete any image.

## Error Handling

The API returns standard HTTP status codes and JSON responses with a `message` and sometimes an `error` field for details.

## Development

- Use `npm run dev` with nodemon for automatic restarts.
- Ensure your `.env` file is correctly configured before starting the server.

This README should provide anyone looking at the `server` directory with a good understanding of its purpose and how to get it running.
