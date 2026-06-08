# University No-Dues Clearance Portal

This project is a comprehensive "No Dues" certificate portal for Arka Jain University, designed to streamline the clearance process for students. It features separate, secure portals for students and faculty, an interactive dashboard for tracking clearance statuses, and an AI-powered assistant to help students navigate the process.

## CV Summary
Engineered a comprehensive University No-Dues Clearance Portal using Next.js 15, TypeScript, Shadcn UI, and Tailwind CSS, featuring dual-role authentication for students and faculty, interactive dashboards for department-wise dues tracking, automated payment simulation, and professional clearance certificate generation. Integrated an AI-powered process assistant utilizing Firebase Genkit and Google Gemini to streamline administrative workflows through intelligent query handling and document validation across departments like Library, Laboratory, and Accounts.

## Key Features

- **Dual User Portals**: Secure login systems for both students and faculty members.
- **Student Dashboard**: An interactive interface for students to track their clearance status across all relevant university departments (Library, Accounts, Laboratory, etc.).
- **Dues Management**: Students can view outstanding dues for each department and clear them via a simulated payment interface.
- **Document Upload**: Support for departments requiring completion certificates (e.g., Coursera, L/T Program).
- **Faculty Approval Workflow**: Dedicated dashboard for faculty to view and approve pending clearance requests for their specific departments.
- **AI-Powered Chatbot**: Integrated "No Dues Assistant" (built with Genkit) to answer student queries about status and department contacts.
- **Automated Certificate Generation**: Formal "Clearance Acknowledgement" generation once all departments have approved.
- **Modern UI/UX**: Responsive and professional interface built with Shadcn/ui and Tailwind CSS.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn/ui](https://ui.shadcn.com/)
- **Generative AI**: [Firebase Genkit](https://firebase.google.com/docs/genkit) with Google Gemini models.
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

1.  **Clone and Install**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Create a `.env.local` and add your `GEMINI_API_KEY`.

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## Credentials

- **Student Login**: Predefined in `src/lib/students.ts` (e.g., ID: `AJU/240507`, Pass: `AJU@507`).
- **Faculty Login**: Predefined in `src/lib/faculty.ts` (e.g., ID: `asstdean`, Pass: `AJU@asstdean`).
