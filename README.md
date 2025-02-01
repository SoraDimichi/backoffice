# Backoffice system

## Table of Contents

- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
  - [1. Register with Supabase](#1-register-with-supabase)
  - [2. Clone the Repository](#2-clone-the-repository)
  - [3. Configure Environment Variables](#3-configure-environment-variables)
  - [4. Set Up the Database](#4-set-up-the-database)
  - [5. Configure Authentication](#5-configure-authentication)
  - [6. Set Up Webhooks](#6-set-up-webhooks)
  - [7. Run the Application](#7-run-the-application)

---

## Project Overview

This project is a **Backoffice System** designed to manage users and transactions with data visualization features. It includes authentication, user management, transaction handling, and revenue breakdown charts. The application distinguishes between two roles:

- **Admin**: Can manage users.
- **Basic User**: Can view transactions and charts.

---

## Technologies Used

- **Frontend:**
  - React
  - React Router
  - Shadcn-UI
  - Vite (build tool)
- **Backend:**
  - Supabase (PostgreSQL, Authentication, API)
- **Other Tools:**
  - pnpm (package manager)
  - SQL (for database schema and seeding)

---

## Setup Instructions

### 1. Register with Supabase

1. Visit [Supabase](https://supabase.com/) and sign up for a free account.
2. Once registered, create a new project.
3. Note down your **Supabase URL** and **Supabase Anon Key** from the project settings. These will be used in the environment configuration.

### 2. Clone the Repository

```bash
git clone https://github.com/SoraDimichi/backoffice.git
cd backoffice
```

### 3. Configure Environment Variables

1. Create a `.env` file in the root directory of the project.

2. Add the following environment variables to the `.env` file:

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_KEY=your_supabase_anon_key
   ```

   Replace `your_supabase_url` and `your_supabase_anon_key` with the actual values from your Supabase project.

### 4. Set Up the Database

1. Navigate to the **Supabase Dashboard** for your project.

2. Go to the **SQL Editor**.

3. **Run Schema Setup:**

   - Open the `schema.sql` file provided in the repository.
   - Copy the contents and paste them into the SQL Editor.
   - Execute the script to create the necessary tables (`users`, `transactions`, `roles`, `permissions`, etc.).

4. **Seed the Database:**
   - Open the `seed.sql` file from the repository.
   - Copy the contents and paste them into the SQL Editor.
   - Execute the script to populate the tables with initial data.

### 5. Configure Authentication

1. In the Supabase Dashboard, navigate to **Authentication > Settings**.

2. Under **External OAuth Providers**, ensure that **Email** is enabled.

3. **Disable Email Confirmation:**

   - Uncheck the **Confirm Email** option to allow users to sign up without email verification.

4. **Secure Email Change:**

   - Enable **Secure Email Change** to ensure users can safely update their email addresses.

5. Save the changes.

### 6. Set Up Webhooks

1. In the Supabase Dashboard, go to **Authentication > Webhooks**.

2. **Add an Access Token (JWT) Claims Hook:**

   - Click on **Add a new webhook**.
   - Select **Access Token (JWT) Claims Hook**.
   - Choose the function named `custom_access_token_hook`.
   - Enable the hook to customize the JWT claims with user roles and permissions.

3. **Refresh the Page:**
   - After setting up the webhook, refresh the Supabase Dashboard to ensure the changes take effect.

### 7. Run the Application

1. **Install Dependencies:**

   Ensure you have `pnpm` installed. If not, install it from [pnpm.io](https://pnpm.io/installation).

   ```bash
   pnpm install
   ```

2. **Start the Development Server:**

   ```bash
   pnpm run dev
   ```

3. **Access the Application:**

   Open your browser and navigate to `http://localhost:3000` (or the port specified in the terminal) to view the application.
