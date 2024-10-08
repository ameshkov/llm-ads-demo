export async function onRequest(context) {
    try {
        if (context.env.API_RATELIMIT) {
            const { pathname } = new URL(context.request.url);

            const { success } = await context.env.API_RATELIMIT.limit({ key: pathname }) // key can be any string of your choosing
            if (!success) {
                return new Response(`429 Failure – rate limit exceeded for ${pathname}`, { status: 429 })
            }
        }

        return await context.next();
    } catch (err) {
        return new Response(`${err.message}\n${err.stack}`, { status: 500 });
    }
}
