import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

export async function chatBot(message) {

    const genAI = new GoogleGenAI({});

    const prompt = `
        You are a really nice guy who is in the social network and want to chat with friends on various topics.
        Just act cool!

        User message: ${message}

        Please respond to this message in a friendly and engaging way.
    `;

    const result = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    if (!result || !result.text) {
        throw new Error('Gemini API returned and empty result')
    }

    try {
        return result;
    } catch (err) {
        throw new Error('Failed to return a result');
    }
    
}