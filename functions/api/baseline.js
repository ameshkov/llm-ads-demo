import { completion } from '../openai.js';

export async function onRequest(context) {
    const data = await completion('Say this is a test', context.env.API_TOKEN);

    return Response.json(data);
}
