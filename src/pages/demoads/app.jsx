import { render } from 'solid-js/web';
import { createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { SolidMarkdown } from "solid-markdown";
import { diffChars } from 'diff';
import chatGptSvg from '../../assets/chatgpt.svg';

function Prompt(props) {
    const submit = async (e) => {
        e.preventDefault();

        const prompt = document.getElementById('message').value.trim();
        if (!prompt) {
            return;
        }

        props.setStore('prompt', prompt);
        props.setStore('promptSubmitted', true);

        try {
            const response = await fetch('/api/baseline?' + new URLSearchParams({
                prompt: document.getElementById('message').value,
            }));

            const json = await response.json();

            props.setStore('baselineResponse', json.text);
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

function BaselineResponse(props) {
    const findAdvertisers = async (e) => {
        e.preventDefault();

        props.setStore('loadingAdvertisers', true);

        const response = await fetch('/api/find-advertisers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: props.store.prompt,
                baselineResponse: props.store.baselineResponse,
            }),
        });

        const json = await response.json();

        props.setStore('loadingAdvertisers', false);
        props.setStore('advertisers', json.advertisers);
    }

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
                <Comment text={props.store.baselineResponse} author="ChatBot" />

                <p class="my-4 text-base font-normal text-gray-500 dark:text-gray-400">
                    Good response, but what happens now?
                </p>

                <Show when={!props.store.loadingAdvertisers && !props.store.advertisers}>
                    <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        onClick={findAdvertisers}>
                        Find advertisers
                    </button>
                </Show>
            </Show>
        </li>
    )
}

function Comment(props) {
    return (
        <article class="p-6 text-base bg-white rounded-lg dark:bg-gray-900">
            <footer class="flex justify-between items-center mb-2">
                <div class="flex items-center">
                    <p
                        class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                        <img class="mr-2 w-6 h-6 rounded-full"
                            src={chatGptSvg}
                            alt={props.author} />
                        {props.author}
                    </p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        <time pubdate
                            datetime={new Date().toLocaleDateString()}
                            title={new Date().toLocaleDateString()}>
                            {new Date().toLocaleDateString()}
                        </time>
                    </p>
                </div>
            </footer>
            <div class="text-gray-500 dark:text-gray-400">
                <SolidMarkdown children={props.text} />
            </div>
        </article>
    )
}

function AdvertiserCard(props) {
    return (
        <div class="items-center bg-gray-50 rounded-lg shadow sm:flex dark:bg-gray-800 dark:border-gray-700">
            <div class="p-5">
                <h3 class="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {props.advertiser.productName} by {props.advertiser.companyName}
                </h3>
                <span class="text-gray-500 dark:text-gray-400">{props.advertiser.companyCategory}</span>
                <p class="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400">
                    {props.advertiser.productDescription}
                </p>
            </div>
        </div>
    )
}

function Advertisers(props) {
    const runPrediction = (e) => {
        e.preventDefault();

        props.setStore('predict', true);
    }

    return (
        <li class="mb-10 ms-4">
            <div
                class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700">
            </div>
            <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                Advertisers
            </time>

            <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                Who would like to advertise to you?
            </p>

            <Show when={props.store.loadingAdvertisers && !props.store.advertisers}>
                <div
                    class="px-3 py-1 w-64 text-xs text-center font-medium leading-none text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
                    Loading advertisers...
                </div>
            </Show>

            <Show when={!props.store.loadingAdvertisers && props.store.advertisers}>
                <div class="grid gap-8 mb-6 lg:mb-16 md:grid-cols-2">
                    <For each={props.store.advertisers}>{(advertiser, i) =>
                        <AdvertiserCard advertiser={advertiser} key={i} />
                    }</For>
                </div>

                <Show when={!props.store.predict}>
                    <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        onClick={runPrediction}>
                        Run prediction
                    </button>
                </Show>
            </Show>
        </li>
    )
}

function PredictRow(props) {
    return (
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {props.advertiser.productName}
            </th>
            <td class="px-6 py-4">
                {props.advertiser.predict}%
            </td>
        </tr>
    )
}

function Predict(props) {
    const runAuction = (e) => {
        e.preventDefault();

        props.setStore('auction', true);
    }

    const advertisers = props.store.advertisers.map((advertiser) => {
        return {
            productName: `${advertiser.productName} by ${advertiser.companyName}`,
            predict: advertiser.predict
        }
    }).sort((a, b) => b.predict - a.predict);

    return (
        <li class="mb-10 ms-4">
            <div
                class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700">
            </div>
            <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                Predict
            </time>

            <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                In order to run the auction the prediction module needs to
                run and predict the likelihood of a person clicking on the ad.
            </p>

            <div class="relative overflow-x-auto">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Product name
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Click prediction
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <For each={advertisers}>{(advertiser, i) =>
                            <PredictRow advertiser={advertiser} key={i} />
                        }</For>
                    </tbody>
                </table>
            </div>

            <p class="my-4 text-base font-normal text-gray-500 dark:text-gray-400">
                The tricky part here is that it is not clear how the ad will
                look like. Alternatively, it could first run the modification
                module for every ad and then run the prediction module on the
                content with ads.
            </p>

            <Show when={!props.store.auction}>
                <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={runAuction}>
                    Run auction
                </button>
            </Show>
        </li>
    )
}

function AuctionRow(props) {
    return (
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {props.advertiser.productName}

                {props.key() === 0 && (
                    <span class="ml-1 bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                        Winner
                    </span>
                )}
            </th>
            <td class="px-6 py-4">
                {props.advertiser.predict}%
            </td>
            <td class="px-6 py-4">
                ${props.advertiser.bid}
            </td>
            <td class="px-6 py-4">
                {props.advertiser.result}
            </td>
        </tr>
    )
}

function Auction(props) {
    const advertisers = props.store.advertisers.map(advertiser => {
        return {
            productName: `${advertiser.productName} by ${advertiser.companyName}`,
            predict: advertiser.predict,
            bid: advertiser.bid,
            result: advertiser.bid * advertiser.predict,
            originalAdvertiser: advertiser,
        }
    }).sort((a, b) => b.result - a.result);

    const loadAdResponse = async (e) => {
        e.preventDefault();

        props.setStore('adSubmitted', true);

        const advert = advertisers[0].originalAdvertiser;

        const response = await fetch('/api/modify-response', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: props.store.prompt,
                baselineResponse: props.store.baselineResponse,
                productName: advert.productName,
                productDescription: advert.productDescription,
            }),
        });

        const json = await response.json();

        props.setStore('adResponse', json.text);
    }

    return (
        <li class="mb-10 ms-4">
            <div
                class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700">
            </div>
            <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                Auction
            </time>

            <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                Now that we have the predictions, we can check advertiser bids
                and choose the advertiser.
            </p>

            <div class="mb-8 relative overflow-x-auto">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Product name
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Predict
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Bid
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Result
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <For each={advertisers}>{(advertiser, i) =>
                            <AuctionRow advertiser={advertiser} key={i} />
                        }</For>
                    </tbody>
                </table>
            </div>

            <Show when={!props.store.adSubmitted}>
                <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={loadAdResponse}>
                    Show response with ad
                </button>
            </Show>
        </li>
    )
}

function Diff(props) {
    let divRef;

    onMount(() => {
        const diff = diffChars(props.before, props.after);
        const fragment = document.createDocumentFragment();

        diff.forEach((part) => {
            // green for additions, red for deletions
            // grey for common parts
            const color = part.added ? 'green' :
                part.removed ? 'red' : 'grey';
            const span = document.createElement('span');
            span.style.color = color;
            span.appendChild(document.createTextNode(part.value));
            fragment.appendChild(span);
        });

        divRef.appendChild(fragment);
    });

    return (
        <article class="p-6 text-base bg-white rounded-lg dark:bg-gray-900">
            <footer class="flex justify-between items-center mb-2">
                <div class="flex items-center">
                    <p
                        class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                        <img class="mr-2 w-6 h-6 rounded-full"
                            src={chatGptSvg}
                            alt="ChatBot" />
                        ChatBot vs AdBot
                    </p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        <time pubdate
                            datetime={new Date().toLocaleDateString()}
                            title={new Date().toLocaleDateString()}>
                            {new Date().toLocaleDateString()}
                        </time>
                    </p>
                </div>
            </footer>
            <div class="text-gray-500 dark:text-gray-400" ref={divRef}>
            </div>
        </article>
    )
}

function AdResponse(props) {
    const [showDiff, setShowDiff] = createSignal(false);

    const tryAgain = () => {
        window.location.reload();
    }

    return (
        <li class="mb-10 ms-4">
            <div
                class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700">
            </div>
            <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                Ad response
            </time>

            <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                Now let's see how the response with the ad looks like.
            </p>

            <Show when={props.store.adSubmitted && !props.store.adResponse}>
                <div
                    class="px-3 py-1 w-64 text-xs text-center font-medium leading-none text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
                    Preparing the response...
                </div>
            </Show>

            <Show when={props.store.adResponse}>
                <Comment text={props.store.adResponse} author="AdBot" />

                <Show when={!showDiff()}>
                    <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        onClick={setShowDiff(true)}>
                        See what changed
                    </button>
                </Show>

                <Show when={showDiff()}>
                    <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                        Here's what changed in the response.
                    </p>

                    <Diff before={props.store.baselineResponse} after={props.store.adResponse} />

                    <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        onClick={tryAgain}>
                        Try again
                    </button>
                </Show>
            </Show>
        </li>
    )
}

function App() {
    const [store, setStore] = createStore({
        prompt: null,
        promptSubmitted: false,
        baselineResponse: null,
        loadingAdvertisers: false,
        advertisers: null,
        predict: false,
        auction: false,
        adSubmitted: false,
        adResponse: null,
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
                            setStore={setStore}
                        />
                    </Show>

                    <Show when={store.loadingAdvertisers || store.advertisers}>
                        <Advertisers
                            store={store}
                            setStore={setStore}
                        />
                    </Show>

                    <Show when={store.predict}>
                        <Predict
                            store={store}
                            setStore={setStore}
                        />
                    </Show>

                    <Show when={store.auction}>
                        <Auction
                            store={store}
                            setStore={setStore}
                        />
                    </Show>

                    <Show when={store.adSubmitted}>
                        <AdResponse
                            store={store}
                            setStore={setStore}
                        />
                    </Show>
                </ol>
            </div>
        </section>
    )
}

render(() => <App />, document.getElementById('app'));
