CareerForge Pro  | ATS-Optimized AI Resume Builder
Project Description
CareerForge Pro is a full-stack, AI-powered document generator designed to solve the problem of generic, poorly formatted AI resumes. While standard AI chatbots output raw text that users must manually format, CareerForge acts as a complete Applicant Tracking System (ATS) resume builder.

It takes a user's raw experience, personal details, and target job description, and engineers a highly targeted prompt. The backend then streams the tailored response chunk-by-chunk to the frontend, instantly parsing it into a strict, single-column, ATS-friendly layout. Users can then natively export the finished product to a clean PDF with one click.

Tech Stack
Frontend: HTML5, CSS3, Vanilla JavaScript

Backend: Node.js, Express.js

AI Integration: Google Gemini API (gemini-2.5-flash model via @google/generative-ai)

Libraries & Tools: marked.js (live Markdown-to-HTML parsing), native Browser Print API (PDF generation)

Deployment & DevOps: Git, GitHub, Render (Web Service Hosting)

Live Demo & Interface
🟢 Live Application: https://career-forge-ai-1.onrender.com/

<img width="1366" height="642" alt="image" src="https://github.com/user-attachments/assets/e42d7e72-9cd5-4fd7-8294-144def4e6bde" />

Setup Instructions
If you want to run this application locally on your own machine, follow these steps:

Clone the repository:

Bash
git clone https://github.com/your-username/career-forge-ai.git
cd career-forge-ai
Install dependencies:

Bash
npm install
Set up your environment variables:

Create a file named .env in the root directory.

Get a free API key from Google AI Studio.

Add your key to the .env file like this:

Code snippet
GEMINI_API_KEY=your_actual_api_key_here
Start the server:

Bash
npm start
The application will now be running. Open your browser and navigate to http://localhost:3000.
