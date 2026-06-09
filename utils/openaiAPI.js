import axios from 'axios';

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
export async function askChatGPT(prompt, conversationHistory = []) {
    try {
        // System message to set the conversation context
        const systemMessage = {
            role: 'system',
            content: "You are a knowledgeable cancer care assistant. You only answer questions related to cancer, including symptoms, treatments, research, and management. Always include a disclaimer that this advice is informational and not a substitute for professional medical advice. Keep responses short and concise."
        };

        const messages = [
            systemMessage,
            ...conversationHistory,
            { role: 'user', content: prompt }
        ];

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: messages,
                temperature: 0.7,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
            }
        );
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error calling ChatGPT API:', error.response?.data || error.message);
        return "Sorry, I couldn't process your request.";
    }
}