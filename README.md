# LLM ads demo

This is a demo project that demonstrates how LLM ads can be implemented and
also how they can be blocked.

You can check out the demo here [llm-ads-demo.pages.dev](https://llm-ads-demo.pages.dev/).

## How to run locally

```bash
npm install
npm run dev
```

For local development it is recommended to keep `ENV` to `local` in
`vite.config.js` to avoid expensive calls to OpenAI API.

If you need to test the OpenAI API, you can set `ENV` to `prod` and
provide your OpenAI token in `.env` file.

```properties
API_TOKEN=sk-proj-...
```

## How to deploy

The demo project is supposed to be deployed on Cloudflare Pages. Check out
the Github Actions workflow in `.github/workflows/deploy.yml` for more details.

If you want to deploy the project on your own, you'll need to do the following:

* Add a secret to the Cloudflare Pages project with your OpenAI token: `API_TOKEN`.
* Add Workers AI binding to `AI` in the project settings.
* Set up **strict** budget and rate limiting rules in OpenAI since the page
  functions are not protected.
