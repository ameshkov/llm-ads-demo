import { completion } from '../openai.js';

export async function onRequest(context) {
    const url = new URL(context.request.url);

    const prompt = url.searchParams.get('prompt');
    if (!prompt) {
        throw new Error('prompt is required');
    }

    const data = await completion(prompt, context.env.API_TOKEN);

    if (!data.choices || data.choices.length === 0) {
        throw new Error('no response from the API');
    }

    return Response.json({
        text: data.choices[0].message.content,
    });
}
