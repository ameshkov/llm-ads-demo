# LLM ads demo

This is a demo project that demonstrates how LLM ads can be implemented and
also how they can be blocked.

## How to run locally

```bash
npm install
npm run dev
```

## How to deploy

The demo project is supposed to be deployed on Cloudflare Pages.

You'll need to do the following:

* Add a secret with your OpenAI token: `API_TOKEN`.
* Set up **strict** budget and rate limiting rules in OpenAI since the page
  functions are not protected.
