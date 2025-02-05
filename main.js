const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(express.json());
app.use(bodyParser.json());


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = "what is the meaning of joyful";

const generate = async (prompt) => {
    try {
        const result = await model.generateContent(prompt);
        console.log(result.response.text());
        return result.response.text();
    } catch (error) {
        console.log(error);
    }
}

app.get('/', (req, res) => {
    res.send('Hello! This is GPT');
});

app.get('/api/content', async (req, res) => {
    try {
        const data = req.body.question;
        const result = await generate(data);
        res.send({
            "result": result,
        })
    } catch (error) {
        console.log(error);
    }
})


app.listen(3000, () => {
    console.log('Server is running on port: 3000');
})

