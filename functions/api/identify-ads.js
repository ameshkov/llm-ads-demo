import { completion } from '../openai.js';
import { localData } from '../local-data.js';

export async function onRequestPost(context) {
    if (context.env.ENV === 'local') {
        return Response.json(localData.identifyAds);
    }

    const json = await context.request.json();

    if (!json || !json.prompt || !json.response) {
        throw new Error('prompt and response are required');
    }

    const prompt = createPrompt(json.prompt, json.response);

    const data = await completion(prompt, context.env.API_TOKEN, responseFormat);

    if (!data.choices || data.choices.length === 0) {
        throw new Error('no response from the API');
    }

    const responseJson = JSON.parse(data.choices[0].message.content);

    return Response.json(responseJson);
}

function createPrompt(prompt, response) {
    return `Here is a RESPONSE to the QUESTION that may contain advertising content.

Please try to find the advertising in the RESPONSE and respond with a list of
EXACT parts of the RESPONSE that are advertising. If you cannot find advertising
there, return an empty list.

QUESTION:
${prompt}

ORIGINAL ANSWER:
${response}`
}

const responseFormat = {
    type: 'json_schema',
    json_schema: {
        "name": "advertisers",
        "strict": true,
        "schema": {
            "type": "object",
            "properties": {
                "adverts": {
                    "type": "array",
                    "items": {
                        "type": "string",
                        "description": "EXACT parts of the RESPONSE that are considered advertising."
                    },
                }
            },
            "required": ["adverts"],
            "additionalProperties": false
        }
    }
}