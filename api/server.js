// generate-story.js
const { OpenAI } = require('openai');

// 환경 변수에서 API 키를 가져옵니다.
const openai = new OpenAI(process.env.OPENAI_API_KEY);

module.exports = async (req, res) => {
    try {
        // 요청 본문에서 메시지를 파싱합니다.
        const { messages } = req.body;

        console.log("Received messages:", messages);

        // OpenAI API에 요청을 보냅니다.
        const completion = await openai.chat.completions.create({
            messages: messages,
            model: "gpt-4",
            max_tokens: 150
        });

        console.log("OpenAI response:", completion);

        // 응답을 반환합니다.
        res.status(200).json(completion.choices[0]);
    } catch (error) {
        // 에러가 발생한 경우 로그를 출력하고, 클라이언트에게 에러 메시지를 반환합니다.
        console.error("Error occurred:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
