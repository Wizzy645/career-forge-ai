require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use(express.static('public'));

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/generate', async (req, res) => {
    try {
        const { jobTitle, outputType, jobDescription, experience, tone } = req.body;

        if (!jobTitle) {
            return res.status(400).json({ error: "Job title is required." });
        }

        // Build the dynamic prompt based on user inputs
        let promptText = `Act as an expert career coach and professional copywriter. Write a customized ${outputType} for a candidate applying for a ${jobTitle} position.\n\n`;

        if (experience) {
            promptText += `Here is the candidate's current experience and skills:\n"${experience}"\n\n`;
        }

        if (jobDescription) {
            promptText += `Here is the job description they are applying for:\n"${jobDescription}"\n\n`;
        }

        promptText += `Instructions:
        - Weave the candidate's experience naturally into the requirements of the job description.
        - Do not hallucinate or invent fake experiences. 
        - The tone of the writing MUST be ${tone}.
        - Format it cleanly using Markdown (use headers, bullet points, and bold text where appropriate).`;

        // Tell the browser to expect a stream of text data
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Transfer-Encoding', 'chunked');

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        // Request the stream from Gemini
        const result = await model.generateContentStream(promptText);

        // Send each chunk to the frontend as soon as it arrives
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            res.write(chunkText); 
        }

        // Close the connection when done
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
    console.log(`🚀 Pro Streaming Server is running on port ${port}!`);
});