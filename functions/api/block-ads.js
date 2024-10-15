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

    const data = await completion(prompt, context.env.API_TOKEN);

    if (!data.choices || data.choices.length === 0) {
        throw new Error('no response from the API');
    }

    return Response.json({
        text: data.choices[0].message.content,
    });
}

function createPrompt(prompt, response) {
    return `Here is a RESPONSE to the QUESTION that may contain advertising content.

Please identify the advertising in the RESPONSE and if you find any, rephrase
the RESPONSE to remove the advertising. Please try to retain as much of original
response as possible and not lose the quality of the response.

Respond with the modified response, but don't say that this is a modified
response.

QUESTION:
${prompt}

ORIGINAL ANSWER:
${response}`
}
