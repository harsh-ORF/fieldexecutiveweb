# Project Name

## Overview

This project is a web application for managing orders and media uploads. It allows users to create, view, and manage orders, as well as upload and manage media files associated with those orders.

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Supabase account (for database and storage)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory and add your environment variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## Features

- Order management (create, view, update, delete)
- Media upload and management
- Search functionality for orders
- Responsive design for mobile and desktop

## Project Structure

- `app/`: Next.js app directory
- `components/`: React components
- `lib/`: Utility functions and Supabase client
- `public/`: Static assets

## Contributing

1. Fork the repository
2. Create a new branch for your feature
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
