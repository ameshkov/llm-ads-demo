import { completion } from '../openai.js';
import { localData } from '../local-data.js';

export async function onRequestPost(context) {
    if (context.env.ENV === 'local') {
        return Response.json(localData.blockAds);
    }

    const json = await context.request.json();

    if (!json || !json.prompt || !json.response) {
        throw new Error('prompt and response are required');
    }

    const prompt = createPrompt(json.prompt, json.response);

    const text = json.localAI ? await runAI(context, prompt) : await completion(prompt, context.env.API_TOKEN);

    return Response.json({
        text: text,
    });
}

function createPrompt(prompt, response) {
    return `Here is a RESPONSE to the QUESTION that may contain advertising content.

Please identify the advertising in the RESPONSE and if you find any, rephrase
the RESPONSE to remove the advertising. Please try to retain as much of original
response as possible and not lose the quality of the response.

Respond with the rephrased response ONLY and don't mention that you did anything
to it in the response.

QUESTION:
${prompt}

ORIGINAL ANSWER:
${response}`
}

async function runAI(context, prompt) {
    const messages = [
        {
            role: 'system',
            content: 'You are an assistant that identifies and removes advertising from text.'
        },
        {
            role: "user",
            content: prompt,
        },
    ];
    const response = await context.env.AI.run('@cf/meta/llama-2-7b-chat-int8', { messages });

    // It's hard to get rid of the "Here is what I done" with llama so
    // there's that:
    const text = response.response.replace(/^Here is.*?:\s*/, '');

    return text;
}
