import { render } from 'solid-js/web';
import { createSignal, Match, Switch } from "solid-js";
import { createStore } from "solid-js/store";
import { SolidMarkdown } from "solid-markdown";

function Prompt(props) {
    const submit = async (e) => {
        e.preventDefault();

        const prompt = document.getElementById('message').value.trim();
        if (!prompt) {
            return;
        }

        props.setStore('promptSubmitted', true);

        try {
            // TODO: Uncomment later

            // const response = await fetch('/api/baseline?' + new URLSearchParams({
            //     prompt: document.getElementById('message').value,
            // }));

            // const json = await response.json();

            // props.setStore('baselineResponse', json.text);

            props.setStore('baselineResponse', 'LLMs are **great**');
        } catch (ex) {
            props.setStore('baselineResponse', 'Something went wrong, please try again.');
        }
    }


    return (
        <li class="mb-10 ms-4">
            <div
                class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700">
            </div>
            <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                Prompt
            </time>

            <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                We're showcasing LLM ads so we should start with a
                prompt.
            </p>

            <form class="max-w-sm aria-disabled" onSubmit={submit}>
                <div class="mb-5">
                    <label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Ask the Chatbot something
                    </label>
                    <textarea id="message"
                        rows="4"
                        disabled={props.store.promptSubmitted}
                        class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Enter your question">What is a large language model?</textarea>
                </div>

                <Show when={!props.store.promptSubmitted}>
                    <button type="submit"
                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Submit
                    </button>
                </Show>
            </form>
        </li>
    )
}

function Comment(props) {
    const date = new Date().toLocaleDateString();
    const datetime = new Date().toLocaleString();

    return (
        <article class="p-6 text-base bg-white rounded-lg dark:bg-gray-900">
            <footer class="flex justify-between items-center mb-2">
                <div class="flex items-center">
                    <p
                        class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                        <img class="mr-2 w-6 h-6 rounded-full"
                            src="assets/chatgpt.svg"
                            alt="ChatBot" />
                        ChatBot
                    </p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        <time pubdate datetime={datetime} title={datetime}>{date}</time>
                    </p>
                </div>
            </footer>
            <div class="text-gray-500 dark:text-gray-400">
                <SolidMarkdown children={props.text} />
            </div>
        </article>
    )
}

function Advertisers(props) {

}

function BaselineResponse(props) {
    return (
        <li class="mb-10 ms-4">
            <div
                class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700">
            </div>
            <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                Baseline response
            </time>

            <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                The first step is to generate a baseline response that
                does not include any ads.
            </p>

            <Show when={props.store.promptSubmitted && !props.store.baselineResponse}>
                <div
                    class="px-3 py-1 w-64 text-xs text-center font-medium leading-none text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
                    Preparing the response...
                </div>
            </Show>

            <Show when={props.store.baselineResponse}>
                <Comment text={props.store.baselineResponse} />

                <p class="my-4 text-base font-normal text-gray-500 dark:text-gray-400">
                    Good response, but now I want to advertise something.
                </p>

                <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Find advertisers
                </button>
            </Show>
        </li>
    )
}

function App() {
    const [store, setStore] = createStore({
        promptSubmitted: false,
        baselineResponse: null,
    });

    return (
        <section class="bg-white dark:bg-gray-900">
            <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <h2 class="text-4xl font-extrabold dark:text-white">Demo</h2>
                <p class="my-4 text-lg font-normal text-gray-500 dark:text-gray-400">
                    This is a demo page to showcase how ads can be displayed.
                </p>

                <ol class="relative border-s border-gray-200 dark:border-gray-700">
                    <Prompt
                        store={store}
                        setStore={setStore}
                    />

                    <Show when={store.promptSubmitted}>
                        <BaselineResponse
                            store={store}
                        />
                    </Show>
                </ol>
            </div>
        </section>
    )
}

render(() => <App />, document.getElementById('app'));
