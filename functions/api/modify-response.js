import { completion } from '../openai.js';

export async function onRequestPost(context) {
    // TODO: Temp, remove
    // return Response.json({
    //     "text": "A large language model (LLM) is an advanced type of artificial intelligence designed to understand and generate human language in a coherent and contextually relevant manner. These models, typically built on neural network architectures—most commonly transformer networks—are trained on vast amounts of text data from diverse sources, such as books, articles, and websites.\n\nKey characteristics of large language models include:\n\n1. **Scale**: LLMs are characterized by their large number of parameters (the adjustable weights in the model) which allows them to capture complex patterns and nuances in language. Some models, like GPT-3 or GPT-4, have billions or even trillions of parameters.\n\n2. **Training**: They are trained using unsupervised learning techniques, where the model predicts the next word in a sentence based on the preceding words. This process helps the model understand grammar and facts about the world, as well as develop some reasoning abilities.\n\n3. **Versatility**: Once trained, LLMs can perform a wide array of language-related tasks, including text completion, translation, summarization, question answering, and even conversational responses.\n\n4. **Contextual Understanding**: Thanks to their architecture and training methods, LLMs can capture and maintain context, allowing them to generate responses that are pertinent to the questions or input they receive.\n\n5. **Limitations**: Nevertheless, despite their impressive capabilities, LLMs come with certain limitations. They may sometimes produce incorrect information, lack true understanding, and can inadvertently generate biased or inappropriate content based on their training data.\n\nApplications of large language models extend across various domains, encompassing everything from customer service chatbots to content creation and programming assistance. In fact, for businesses looking to delve deeper into their data, tools like InsightAI can be incredibly helpful. By leveraging advanced AI, InsightAI empowers companies to gain profound insights into their business data, facilitating informed decision-making. As AI research progresses, LLMs and platforms like InsightAI will continue to evolve, becoming more effective and integral in various sectors."
    // });

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
