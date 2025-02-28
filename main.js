const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");

dotenv.config();
const app = express();

// Enable CORS for all origins
app.use(cors());

app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generate = async (prompt) => {
    try {
        const result = await model.generateContent({
            contents: [{ parts: [{ text: prompt }] }],
        });

        return result.response.candidates[0].content.parts[0].text || "I couldn't process that.";
    } catch (error) {
        console.error("Error generating response:", error);
        return "Error fetching response from Gemini API.";
    }
};

app.get("/", (req, res) => {
    res.send("Hello! This is Gemini AI Chatbot");
});

app.post("/api/content", async (req, res) => {
    try {
        const userMessage = req.body.question;
        if (!userMessage) {
            return res.status(400).json({ error: "Question is required" });
        }

        const response = await generate(userMessage);
        res.json({ result: response });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
