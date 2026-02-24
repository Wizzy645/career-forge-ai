require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/generate', async (req, res) => {
    try {
        // Extract all the new specific resume fields
        const { fullName, email, phone, location, targetJob, jobDescription, company, dates, experience, skills, education, tone } = req.body;

        if (!fullName || !targetJob) {
            return res.status(400).json({ error: "Name and Target Job are required." });
        }

        // Build a highly specific ATS Prompt
        let promptText = `You are an expert executive resume writer and ATS (Applicant Tracking System) optimizer. 
        Your task is to write a complete, perfectly formatted single-page resume for this candidate.
        
        Use the following information to build the resume:
        - Target Job Title: ${targetJob}
        - Full Name: ${fullName}
        - Contact Info: ${email} | ${phone} | ${location}
        - Education: ${education}
        - Core Skills: ${skills}
        
        Job History Context:
        Company: ${company} (${dates})
        Raw Experience Notes: ${experience}
        
        Job Description they are applying for (Tailor the resume to this):
        ${jobDescription || "Standard industry duties for this role."}
        
        STRICT FORMATTING INSTRUCTIONS:
        You must format the response entirely in Markdown using this exact structure:
        
        # ${fullName}
        ${email} | ${phone} | ${location}
        
        ## PROFESSIONAL SUMMARY
        (Write a powerful, 3-sentence summary tailored to the target job, highlighting their top skills and value proposition. Tone: ${tone})
        
        ## PROFESSIONAL EXPERIENCE
        ### ${targetJob} | ${company}
        *${dates}*
        (Transform the raw experience notes into 4-5 highly professional, impact-driven bullet points. Start each bullet with a strong action verb. Incorporate keywords from the job description if provided. Focus on achievements rather than just duties.)
        
        ## EDUCATION
        ${education}
        
        ## CORE COMPETENCIES
        (Format their skills into a clean, comma-separated list optimized for ATS keyword scanning based on the target job).
        
        Do NOT add any conversational intro or outro text. Output ONLY the resume text.`;

        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Transfer-Encoding', 'chunked');

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContentStream(promptText);

        for await (const chunk of result.stream) {
            res.write(chunk.text()); 
        }

        res.end();

    } catch (error) {
        console.error("Error connecting to Gemini:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: "Something went wrong generating the text." });
        } else {
            res.end("\n\n[Error: Connection interrupted.]");
        }
    }
});

app.listen(port, () => {
    console.log(`🚀 V2 ATS Resume Server is running on port ${port}!`);
});