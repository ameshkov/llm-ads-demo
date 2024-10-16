import { completion } from '../openai.js';
import { localData } from '../local-data.js';

export async function onRequestPost(context) {
    if (context.env.ENV === 'local') {
        return Response.json(localData.advertisers);
    }

    const json = await context.request.json();

    if (!json || !json.prompt || !json.baselineResponse) {
        throw new Error('prompt and baselineResponse are required');
    }

    const prompt = createPrompt(json.prompt, json.baselineResponse);

    const data = await completion(prompt, context.env.API_TOKEN, responseFormat);

    if (!data.choices || data.choices.length === 0) {
        throw new Error('no response from the API');
    }

    const responseJson = JSON.parse(data.choices[0].message.content);

    return Response.json(responseJson);
}

function createPrompt(prompt, baselineResponse) {
    return `Imagine the following situation: a ChatGPT user asks a QUESTION, and in
response, an ANSWER is generated. This answer can be modified to include some
advertising information.

Come up with EXACTLY FOUR fake advertisers and their products that could be
promoted in the response. You shouldn't use real companies.

Also, try predicting how likely it is for a person to click on the ad of that
product. Rate it from 0 to 100.

For each advertiser, I need the following information:

* Company name
* Compaty category
* Product name
* Bid for the user click (in USD)
* A short description of the product (no more than 30 words)
* Likelihood of a person clicking on the ad (0-100)
* Satisfactory rate, i.e. how satisfactory the response with ads of that
  product will be for the user (0-100).

Respond with a JSON object with the following schema:

QUESTION:
${prompt}

ANSWER:
${baselineResponse}`
}

const responseFormat = {
    type: 'json_schema',
    json_schema: {
        "name": "advertisers",
        "strict": true,
        "schema": {
            "type": "object",
            "properties": {
                "advertisers": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "companyName": {
                                "type": "string",
                                "description": "The name of the company."
                            },
                            "companyCategory": {
                                "type": "string",
                                "description": "Company category."
                            },
                            "productName": {
                                "type": "string",
                                "description": "The name of the product."
                            },
                            "productDescription": {
                                "type": "string",
                                "description": "A brief description of the product."
                            },
                            "bid": {
                                "type": "number",
                                "description": "Bid for the user click (in USD).",
                            },
                            "predict": {
                                "type": "number",
                                "description": "Likelihood of a person clicking on the ad (0-100).",
                            },
                            "satisfactoryRate": {
                                "type": "number",
                                "description": "Satisfactory rate, i.e. how satisfactory the response with ads of that product will be for the user (0-100)",
                            }
                        },
                        "required": [
                            "companyName",
                            "companyCategory",
                            "productName",
                            "productDescription",
                            "bid",
                            "predict",
                            "satisfactoryRate"
                        ],
                        "additionalProperties": false
                    },
                    "additionalProperties": false
                }
            },
            "required": ["advertisers"],
            "additionalProperties": false
        }
    }
}
