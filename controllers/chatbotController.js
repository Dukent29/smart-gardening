const axios = require('axios');

exports.askChatbot = async (req, res) => {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ success: false, message: "Invalid messages format." });
    }

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant for plant care. You answer in a friendly, simple way.',
                    },
                    ...messages,
                ],
                temperature: 0.7,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_PLANT_BOT_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const reply = response.data.choices?.[0]?.message?.content;
        res.status(200).json({ success: true, reply });
    } catch (error) {
        console.error('Chatbot Error:', error.response?.data || error.message);
        res.status(500).json({ success: false, message: 'Bot failed to respond.' });
    }
};
