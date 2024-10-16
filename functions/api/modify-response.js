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

    const subtle = !!json.subtle;

    const prompt = createPrompt(json.prompt, json.baselineResponse, json.productName, json.productDescription, subtle);

    const text = await completion(prompt, context.env.API_TOKEN);

    return Response.json({
        text: text,
    });
}

function createPrompt(prompt, baselineResponse, productName, productDescription, subtle) {
    const subtletyClause = subtle ?
        `Try to be subtle with advertising and make as little changes as possible.`
        :
        `You can actively push the advertised product to the reader.`;

    return `Please modify the ORIGINAL ANSWER to the QUESTION so that it
includes advertising of the PRODUCT.

Make sure to connect the answer and the advertisement very naturally,
not something like appending the ads after just answering the question.

${subtletyClause}

QUESTION:
${prompt}

ORIGINAL ANSWER:
${baselineResponse}

PRODUCT:
- Product name: ${productName}
- Product description: ${productDescription}`
}
