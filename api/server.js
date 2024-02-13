const { OpenAI } = require('openai');
const openai = new OpenAI(process.env.OPENAI_API_KEY);

let subUsageCounter = 0;
const subMonthlyLimit = 47170;

module.exports = async (req, res) => {
    try {
        const { messages } = req.body;
        console.log("Received messages:", messages);

        if (subUsageCounter >= subMonthlyLimit) {
            return res.status(429).json({ message: "API usage limit exceeded for sub domain" });
        }

        const completion = await openai.chat.completions.create({
            messages: messages,
            model: "gpt-4",
            max_tokens: 380, // 서브 도메인의 max_tokens 설정
        });

        console.log("OpenAI response:", completion);
        subUsageCounter += 1; // Update the usage counter for the sub domain

        res.status(200).json(completion.choices[0]);
    } catch (error) {
        console.error("Error occurred in sub domain:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
