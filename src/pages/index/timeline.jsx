import { render } from 'solid-js/web';

function Timeline() {
    return (
        <section class="bg-white dark:bg-gray-900">
            <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <h2 class="text-4xl font-extrabold dark:text-white">Timeline</h2>
                <p class="my-4 text-lg font-normal text-gray-500 dark:text-gray-400">
                    Large Language Models have not been actively used by adtech companies
                    besides some initial experiments. However, everyone sees the potential
                    and we believe they are soon arise.
                </p>

                <ol class="relative border-s border-gray-200 dark:border-gray-700">
                    <TimelineItem
                        title="ELIZA"
                        time="1966"
                        description="Created by Joseph Weizenbaum at MIT, ELIZA is considered to be the first chatbot ever built by humans."
                        buttonText="Try it"
                        buttonLink="https://web.njit.edu/~ronkowit/eliza.html"
                    />
                    <TimelineItem
                        title="SmarterChild: pioneering AI chatbot"
                        time="2001"
                        description="Early chatbot SmarterChild gains popularity among preteens for its witty responses on AIM and MSN. It is a precursor to modern AI bots like Siri and Alexa, even inspiring investors to fund Siri."
                    />
                    <TimelineItem
                        title="Creation of OpenAI"
                        time="December 2015"
                        description="OpenAI is introduced as a non-profit organization focused on advancing digital intelligence in a way that benefits humanity as a whole."
                    />
                    <TimelineItem
                        title="The invention of Transformers Architecture"
                        time="June 2017"
                        description="Transformers came out in 2017 with the paper “Attention is all you need” from Vaswani and colleagues of a Google Team."
                        buttonText="Read the paper"
                        buttonLink="https://arxiv.org/abs/1706.03762"
                    />
                    <TimelineItem
                        title="GPT-1 launch"
                        time="June 2018"
                        description="OpenAI unveils GPT-1, its initial version of GPT."
                    />
                    <TimelineItem
                        title="Google's BERT"
                        time="October 2018"
                        description="Pre-trained on vast amounts of text, BERT was the first proper foundational language model that could be fine-tuned for specific tasks, setting new performance standards across various benchmarks."
                        buttonText="Read the paper"
                        buttonLink="https://arxiv.org/abs/1810.04805"
                    />
                    <TimelineItem
                        title="Launch of GPT-2"
                        time="February 2019"
                        description="The second version of GPT (Generative Pre-trained Transformer), known as GPT-2, makes its debut."
                    />
                    <TimelineItem
                        title="Partnership between Microsoft and OpenAI"
                        time="July 2019"
                        description="The partnership between Microsoft and OpenAI is disclosed, marking the commencement of their collaborative efforts in advancing AI technology."
                    />
                    <TimelineItem
                        title="GPT-3 launch"
                        time="June 2020"
                        description="OpenAI introduces GPT-3, which has over a thousand times the number of parameters compared to its initial predecessor."
                    />
                    <TimelineItem
                        title="OpenAI launches GPT-3.5 featuring ChatGPT"
                        time="November 2022"
                        description="OpenAI introduces GPT-3, which has over a thousand times the number of parameters compared to its initial predecessor."
                    />
                    <TimelineItem
                        title="ChatGPT achieves unprecedented growth"
                        time="February 2023"
                        description="It is reported that ChatGPT reached an estimated 100 million monthly active users in January, just two months after its launch, making it the fastest-growing consumer application in history."
                    />
                    <TimelineItem
                        title="TBD"
                        time="TBD"
                        description="TBD: Other models, using LLMs in search engines, announcing ads, research papers about LLM ads."
                    />
                </ol>
                <p class="my-4 text-sm font-normal italic text-gray-500 dark:text-gray-400">
                    Sources for the timeline:&nbsp;
                    <a class="text-blue-400" href="https://timelines.issarice.com/wiki/Timeline_of_ChatGPT">
                        timelines.issarice.com
                    </a>,&nbsp;
                    <a class="text-blue-400"
                        href="https://medium.com/@researchgraph/brief-introduction-to-the-history-of-large-language-models-llms-3c2efa517112">
                        Research Graph
                    </a>,&nbsp;
                    <a class="text-blue-400" href="https://synthedia.substack.com/p/a-timeline-of-large-language-model">
                        synthedia.substack.com
                    </a>
                </p>
            </div>
        </section>
    )
}

function TimelineItem(props) {
    return (
        <li class="mb-10 ms-4">
            <div
                class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700">
            </div>
            <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                {props.year}
            </time>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {props.title}
            </h3>
            <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                {props.description}
            </p>

            {props.buttonText && props.buttonLink && (
                <a href={props.buttonLink} target="_blank"
                    class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700">
                    {props.buttonText}
                    <svg class="w-3 h-3 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg>
                </a>
            )}
        </li>
    )
}

document.addEventListener('DOMContentLoaded', () => {
    render(() => <Timeline />, document.getElementById('timeline'));
});

