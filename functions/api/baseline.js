import { completion } from '../openai.js';
import { localData } from '../local-data.js';

export async function onRequest(context) {
    if (context.env.ENV === 'local') {
        return Response.json(localData.baseline);
    }

    const url = new URL(context.request.url);

    const prompt = url.searchParams.get('prompt');
    if (!prompt) {
        throw new Error('prompt is required');
    }

    const text = await completion(prompt, context.env.API_TOKEN);

    return Response.json({
        text: text,
    });
}
