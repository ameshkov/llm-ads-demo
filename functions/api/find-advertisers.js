import { completion } from '../openai.js';

export async function onRequestPost(context) {
    // TODO: Temp, remove
    // return Response.json({"advertisers":[{"companyName":"TextGenius Co.","companyCategory":"AI Technology","productName":"GeniusWriter","productDescription":"An AI writing assistant that helps you create high-quality content quickly and easily.","bid":1.5,"predict":75},{"companyName":"LinguaPro","companyCategory":"Language Learning","productName":"LinguaMaster","productDescription":"A comprehensive app for mastering any language through interactive lessons and real-world practice.","bid":1.2,"predict":65},{"companyName":"ChatBot Solutions","companyCategory":"Software Development","productName":"SmartChat Bot","productDescription":"Build custom chatbots for your business using our intelligent chatbot framework.","bid":2,"predict":70},{"companyName":"DataInsights Analytics","companyCategory":"Business Intelligence","productName":"InsightAI","productDescription":"Leverage AI to gain deep insights into your business data for informed decision-making.","bid":2.5,"predict":60}]});

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
    return `
Imagine the following situation: a ChatGPT user asks a QUESTION, and in
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
                            }
                        },
                        "required": [
                            "companyName",
                            "companyCategory",
                            "productName",
                            "productDescription",
                            "bid",
                            "predict"
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
