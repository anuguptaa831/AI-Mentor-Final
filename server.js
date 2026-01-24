const express = require('express');
const cors = require('cors');

const app = express();

// Middleware - Frontend connection allow karne ke liye
app.use(cors()); 
app.use(express.json()); 

const PORT = 5000;

// Main Chat Route
app.post('/chat', (req, res) => {
    try {
        const { message } = req.body;
        const userMsg = message.toLowerCase();
        let reply = "";

        // 1. Greeting & Introduction
        if (userMsg.includes("hi") || userMsg.includes("hello") || userMsg.includes("kaun")) {
            reply = "Hello! I am your AI Mentor Pro. I will help you learn Full Stack Development. What shall we study today? (Java, Python, or Web Dev?)";
        } 
        // 2. Technical Mentor Logic
        else if (userMsg.includes("java")) {
            reply = "Java is a high-level, class-based language. Lets start by understanding **Variables aur Data Types** , Would you like to see a example?";
        } 
        // 3. Motivational Prompt
        else if (userMsg.includes("darr") || userMsg.includes("hard")) {
            reply = "Coding may feel tough starting out, but it is all about staying consistent! Build small projects to start, and remember, I am here to help you.";
        }
        // 4. Default Response
        else {
            reply = "Great question! As a mentor, I would suggest we break this down step-by-step. While my API Key is being processed, I can help with the basics.";
        }

        res.json({ reply: reply }); 

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "The server is feeling a bit tired; let's give it a refresh." });
    }
});

// Server Start
app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`✅ SERVER ready!`);
    console.log(`🚀 Address: http://localhost:${PORT}`);
    console.log(`=================================`);
});







 