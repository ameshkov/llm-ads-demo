import { completion } from '../openai.js';

export async function onRequest(context) {
    // TODO: Temp, remove
    // return Response.json({
    //     "text": "A large language model (LLM) is an advanced type of artificial intelligence designed to understand and generate human language in a coherent and contextually relevant manner. These models, typically built on neural network architectures—most commonly transformer networks—are trained on vast amounts of text data from diverse sources, such as books, articles, and websites.\n\nKey characteristics of large language models include:\n\n1. **Scale**: LLMs are characterized by their large number of parameters (the adjustable weights in the model), which allows them to capture complex patterns and nuances in language. Some models, like GPT-3 or GPT-4, have billions or even trillions of parameters.\n\n2. **Training**: They are trained using unsupervised learning techniques, where the model predicts the next word in a sentence given the preceding words. This training helps the model learn grammar, facts about the world, and even some reasoning abilities.\n\n3. **Versatility**: Once trained, LLMs can perform a wide range of language-related tasks, including text completion, translation, summarization, question answering, and even conversational responses.\n\n4. **Contextual Understanding**: Due to their architecture and training methods, LLMs can capture and maintain context, allowing them to generate responses that are pertinent to the input they receive.\n\n5. **Limitations**: Despite their capabilities, LLMs have limitations. They may generate incorrect information, lack true understanding or reasoning, and can sometimes produce biased or inappropriate outputs based on the data they were trained on.\n\nApplications of large language models span various domains, including customer service chatbots, content creation, programming assistance, and educational tools. As AI research progresses, LLMs continue to evolve, becoming more effective and widely utilized."
    // });


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
