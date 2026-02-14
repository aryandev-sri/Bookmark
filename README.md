Bookmark Manager
A full-stack web application designed to help users save, organize, and manage their digital links efficiently. Built as part of a technical assessment, this project focuses on seamless user experience and real-time data persistence.

Live Demo: bookmark-sigma-six.vercel.app

🚀 Features
URL Management: Save, edit, and delete bookmarks easily.

Categorization: Organize links with custom tags or folders.

Real-time Sync: Powered by a backend database to ensure data is available across sessions.

🛠️ Tech Stack
Frontend: Next.js (JavaScript), Tailwind CSS, Lucide React (Icons), Radix UI / Shadcn.

Backend/Database: Supabase (PostgreSQL).

Deployment: Vercel.

🧠 Challenges & Learning Journey
While I have extensive experience in frontend development, this project pushed me to step out of my comfort zone and dive into backend integration and cloud deployment.

1. Mastering Supabase (First Time)
The Problem: Transitioning from static frontend development to a dynamic backend was a hurdle. Initially, I struggled with setting up the database schema and handling asynchronous data fetching correctly.

The Solution: I spent time studying the Supabase documentation and experimenting with SQL queries. I focused on understanding how to initialize the Supabase client in Next.js and implemented robust error handling to manage connection states.

2. Backend Logic & Edge Cases
The Problem: Implementing the backend logic for this assessment presented several challenges, particularly around data validation and ensuring that duplicate bookmarks weren't cluttering the database.

The Solution: I implemented middleware and client-side validation logic to ensure data integrity. Even when things got complex, I persevered to ensure the core functionality of the assessment was fully operational.

3. Deployment with Vercel
The Problem: This was my first time deploying a full-stack Next.js app on Vercel. I encountered environment variable issues where the production build couldn't "see" my Supabase keys.

The Solution: I learned how to configure Environment Variables within the Vercel dashboard and used the Vercel CLI to debug deployment logs until the build was successful.
