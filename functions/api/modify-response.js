import { completion } from '../openai.js';
import { localData } from '../local-data.js';

export async function onRequestPost(context) {
    if (context.env.ENV === 'local') {
        return Response.json(localData.modifiedResponse);
    }

    const json = await context.request.json();

    if (!json || !json.prompt || !json.baselineResponse) {
        throw new Error('prompt and baselineResponse are required');
    }

    if (!json.productName || !json.productDescription) {
        throw new Error('productName and productDescription are required');
    }

    const prompt = createPrompt(json.prompt, json.baselineResponse, json.productName, json.productDescription);

    const data = await completion(prompt, context.env.API_TOKEN);

    if (!data.choices || data.choices.length === 0) {
        throw new Error('no response from the API');
    }

    return Response.json({
        text: data.choices[0].message.content,
    });
}

function createPrompt(prompt, baselineResponse, productName, productDescription) {
    return `
Please modify the ORIGINAL ANSWER to the QUESTION so that it includes
advertising of the ADVERISER.

Make sure to connect the answer and the advertisement very naturally,
not something like appending the ads after just answering the question.
Focus on answering the question, there shouldn't be too much advertisment in the
output.

QUESTION:
${prompt}

ORIGINAL ANSWER:
${baselineResponse}

ADVERTISER:
- Product name: ${productName}
- Product description: ${productDescription}`
}
