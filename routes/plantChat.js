const express = require('express');
const router = express.Router();
const multer = require('multer');
const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });

// POST /api/chat/chat-identify
router.post('/chat-identify', upload.single('image'), async (req, res) => {
    try {
        const imagePath = req.file.path;

        const form = new FormData();
        form.append('images', fs.createReadStream(imagePath));

        const response = await axios.post('https://plant.id/api/v3/identification', form, {
            headers: {
                'Api-Key': process.env.PLANT_ID_API_KEY,
                ...form.getHeaders()
            }
        });

        fs.unlinkSync(imagePath); // Nettoyage

        const { access_token } = response.data;

        if (!access_token) {
            return res.status(400).json({ success: false, message: "Token non reçu" });
        }

        res.json({ success: true, access_token });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// POST /api/chat/ask-question
router.post('/ask-question', async (req, res) => {
    const accessToken = req.query.access_token;
    const question = req.body.question;

    if (!accessToken || !question) {
        return res.status(400).json({ success: false, message: 'access_token et question requis' });
    }

    try {
        const response = await axios.post(
            `https://plant.id/api/v3/identification/${accessToken}/conversation`,
            {
                question,
                temperature: req.body.temperature || 0.5,
                app_name: req.body.app_name || "SmartGardeningBot"
            },
            {
                headers: {
                    'Api-Key': process.env.PLANT_ID_API_KEY
                }
            }
        );

        const messages = response.data.messages || [];
        const answer = messages.find((msg) => msg.type === 'answer');

        res.json({
            success: true,
            answer: answer?.content || 'Pas de réponse détectée.'
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Erreur lors de la requête au chatbot.' });
    }
});

module.exports = router;
