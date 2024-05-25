# Express File Upload and Search Application

This project is a web application that allows users to upload files and search for uploaded files. It uses Algolia for search functionality, Next.js for the frontend, and Express.js for the backend. The files are stored in a PostgreSQL database using Prisma as the ORM.

## Prerequisites

- Node.js
- npm or yarn
- PostgreSQL
- Algolia account

## Installation

1. **Clone the repository:**

   ```
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies:**
    ```
    npm install
    ```
    or
    ```
    yarn install
    ```
3. **Set up environment variables:**
    ```
    DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
    ALGOLIA_APP_ID=<your-algolia-app-id>
    ALGOLIA_SEARCH_API_KEY=<your-algolia-search-api-key>
    ALGOLIA_ADMIN_API_KEY=<your-algolia-admin-api-key>
    ```
4. **Set up Prisma:**
Set up Prisma through the link below:
https://www.prisma.io/docs/getting-started/quickstart

5. **Express quick Guide:**
Quick Guide of express.js server
https://expressjs.com/en/starter/installing.html

6.**Run the development server:**
    ```
    npm run dev
    ```
    or
    ```
    yarn dev
    ```
    The server will start on http://localhost:3000.

## Project Structure
server.js: The main server file that sets up Express and handles file uploads and downloads.
prisma/schema.prisma: The Prisma schema file that defines the database structure.
pages/api/upload.js: The API route for handling file uploads.
public/uploads: The directory where files are stored.
components/Search.tsx: React component for searching files using Algolia.
components/FileUpload.tsx: React component for uploading files.

## Search.tsx
The Search.tsx file sets up a basic search interface using Algolia. It includes the following key parts:
Algolia client setup using the algoliasearch package.
Form schema validation using zod and react-hook-form.
Search functionality using Algolia's InstantSearch and Hits components.

## Fileupload.tsx
The fileupload.tsx file provides the UI for uploading files. Key functionalities include:
File selection and display.
Form submission to upload the file to the server.
Toasts for user feedback on upload success or failure.

## Server.js
The server.js file sets up the Express.js server. Key functionalities include:
File uploads using multer.
Saving file metadata to a PostgreSQL database using Prisma.
Indexing files in Algolia for search functionality.

## schema.prisma
The schema.prisma file defines the database schema. It includes a single model:

File: Represents an uploaded file with id, filename, filepath, and createdAt fields.

## Notes
Make sure to configure your PostgreSQL database and Algolia account properly by setting the environment variables.