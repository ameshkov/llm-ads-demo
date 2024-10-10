import { render } from 'solid-js/web';
import { createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { SolidMarkdown } from "solid-markdown";
import { diffChars } from 'diff';
import chatGptSvg from '../../assets/img/chatgpt.svg';

function scrollIntoView(elementRef) {
    if (elementRef) {
        // Make a short pause before scrolling the element into view.
        setTimeout(() => {
            elementRef.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }, 100);
    }
}

function replaceNewlinesWithBr(div) {
    // Iterate over all child nodes of the div
    div.childNodes.forEach(node => {
        // Only process text nodes (nodeType 3)
        if (node.nodeType === Node.TEXT_NODE) {
            // Replace double newlines (\n\n) with <br/>
            const updatedText = node.nodeValue.replace(/\n{2}/g, '<br/>');
            // Replace the text node with a new HTML node
            const newHTML = document.createElement('span');
            newHTML.innerHTML = updatedText;
            div.replaceChild(newHTML, node);
        }
    });
}

function Prompt(props) {
    const [loading, setLoading] = createSignal(false);
    const [error, setError] = createSignal(false);

    const submit = async (e) => {
        e.preventDefault();

        const prompt = document.getElementById('message').value.trim();
        if (!prompt) {
            return;
        }

        setLoading(true);
        setError(false);
        props.setStore('prompt', prompt);

        try {
            const response = await fetch('/api/baseline?' + new URLSearchParams({
                prompt: document.getElementById('message').value,
            }));

            const json = await response.json();

            props.setStore('baselineResponse', json.text);
        } catch (ex) {
            setError(true);
        } finally {
            setLoading(false);
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
                prompt. The demo is interactive, so feel free to ask anything.
            </p>

            <form class="max-w-sm aria-disabled" onSubmit={submit}>
                <div class="mb-5">
                    <label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Ask the Chatbot something
                    </label>
                    <textarea id="message"
                        rows="4"
                        disabled={loading() || props.store.baselineResponse}
                        class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Enter your question">What is a large language model?</textarea>
                </div>

                <Show when={!props.store.baselineResponse}>
                    <Show when={!loading()}>
                        <button type="submit"
                            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Submit
                        </button>
                    </Show>

                    <Show when={loading()}>
                        <div
                            class="px-3 py-1 w-40 text-xs text-center font-medium leading-none text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
                            Thinking...
                        </div>
                    </Show>

                    <Show when={error()}>
                        <p id="filled_error_help" class="mt-2 text-xs text-red-600 dark:text-red-400">
                            <span class="font-medium">Oh, snapp!</span> Please try again later.
                        </p>
                    </Show>
                </Show>
            </form>
        </li>
    )
}

function BaselineResponse(props) {
    const [loading, setLoading] = createSignal(false);
    const [error, setError] = createSignal(false);

    const findAdvertisers = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(false);

        try {
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
            if (!json.advertisers || json.advertisers.length === 0) {
                throw new Error('Got empty advertisers list');
            }

            props.setStore('advertisers', json.advertisers);
        } catch (ex) {
            setError(true);
        } finally {
            setLoading(false);
        }
    }

    return (
        <li class="mb-10 ms-4" ref={el => scrollIntoView(el)}>
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

            <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                Alternative approach is to use "Retrieval Augmented Generation",
                i.e. select the advertisers first and then use a special prompt
                for generating the response. This way there will be no baseline
                response to which we could compare the augmented response. More
                on that in&nbsp;
                <a href="https://arxiv.org/abs/2406.09459"
                    class="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline">
                    this paper
                </a> (June 2024).
            </p>

            <Comment text={props.store.baselineResponse} author="ChatBot" />

            <p class="my-4 text-base font-normal text-gray-500 dark:text-gray-400">
                Good response, but what happens now? Now we should find
                advertisers that are relevant to your prompt and the
                baseline response.
            </p>

            <Show when={!props.store.advertisers}>
                <Show when={!loading()}>
                    <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        onClick={findAdvertisers}>
                        Find advertisers
                    </button>
                </Show>

                <Show when={loading()}>
                    <div
                        class="px-3 py-1 w-40 text-xs text-center font-medium leading-none text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
                        Looking for them...
                    </div>
                </Show>

                <Show when={error()}>
                    <p id="filled_error_help" class="mt-2 text-xs text-red-600 dark:text-red-400">
                        <span class="font-medium">Oh, snapp!</span> Please try again later.
                    </p>
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
                <Show when={props.text}>
                    <SolidMarkdown children={props.text} />
                </Show>
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
        <li class="mb-10 ms-4" ref={el => scrollIntoView(el)}>
            <div
                class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700">
            </div>
            <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                Advertisers
            </time>

            <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                Here are some fictional advertisers that we found based on your
                prompt and the baseline response.
            </p>

            <Show when={props.store.advertisers}>
                <div class="grid gap-8 mb-6 lg:mb-8 md:grid-cols-2">
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
            <td class="px-6 py-4">
                {props.advertiser.welfare}%
            </td>
            <td class="px-6 py-4">
                {props.advertiser.score}
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
            predict: advertiser.predict,
            welfare: advertiser.welfare,
            score: advertiser.predict * advertiser.welfare
        }
    }).sort((a, b) => (b.score) - (a.score));

    return (
        <li class="mb-10 ms-4" ref={el => scrollIntoView(el)}>
            <div
                class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700">
            </div>
            <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                Predict
            </time>

            <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                In order to run the auction the prediction module needs to
                run first and predict the likelihood of a person clicking on
                the ad and the social welfare score.
            </p>

            <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                <b>Social welfare</b> is a new concept, a type of welfare
                function that balances economic efficiency and fairness. To make
                it simple, this function is an attempt to avoid considerable
                decrease in response quality.
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
                            <th scope="col" class="px-6 py-3">
                                Social welfare
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Overall score
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
                look like. Alternatively, the modification module could run
                first and then the prediction module will operate on responses
                with ads.
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
                {props.advertiser.predict}
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
            predict: advertiser.predict * advertiser.welfare,
            bid: advertiser.bid,
            result: advertiser.bid * advertiser.predict * advertiser.welfare,
            originalAdvertiser: advertiser,
        }
    }).sort((a, b) => b.result - a.result);

    const [loading, setLoading] = createSignal(false);
    const [error, setError] = createSignal(false);

    const loadAdResponse = async (e) => {
        e.preventDefault();

        setError(false);
        setLoading(true);

        try {
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
            if (!json || !json.text) {
                throw new Error('Empty response text');
            }

            props.setStore('adResponse', json.text);
        } catch (ex) {
            setError(true);
        } finally {
            setLoading(false);
        }


    }

    return (
        <li class="mb-10 ms-4" ref={el => scrollIntoView(el)}>
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
                                Predict score
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Bid
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Bid × Predict score
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

            <Show when={!props.store.adResponse}>
                <Show when={!loading()}>
                    <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        onClick={loadAdResponse}>
                        Show response with ad
                    </button>
                </Show>

                <Show when={loading()}>
                    <div
                        class="px-3 py-1 w-40 text-xs text-center font-medium leading-none text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
                        Waiting for AdBot...
                    </div>
                </Show>

                <Show when={error()}>
                    <p id="filled_error_help" class="mt-2 text-xs text-red-600 dark:text-red-400">
                        <span class="font-medium">Oh, snapp!</span> Please try again later.
                    </p>
                </Show>
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
            const color = part.added ? 'green' : part.removed ? 'red' : null;
            const textNode = document.createTextNode(part.value);

            if (color) {
                const span = document.createElement('span');
                span.style.color = color;
                span.appendChild(textNode);
                fragment.appendChild(span);
            } else {
                fragment.appendChild(textNode);
            }
        });

        divRef.appendChild(fragment);
        replaceNewlinesWithBr(divRef);
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
            <div class="text-gray-500 dark:text-gray-400" ref={divRef}>
            </div>
        </article>
    )
}

function AdResponse(props) {
    const showDiff = (e) => {
        e.preventDefault();

        props.setStore('adResponseDiff', true);
    }

    return (
        <li class="mb-10 ms-4" ref={el => scrollIntoView(el)}>
            <div
                class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700">
            </div>
            <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                Modification
            </time>

            <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                Now let's see how the response with the ad looks like.
            </p>

            <Comment text={props.store.adResponse} author="AdBot" />

            <Show when={!props.store.adResponseDiff}>
                <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={showDiff}>
                    See what changed
                </button>
            </Show>
        </li>
    )
}

function AdResponseDiff(props) {
    const [loading, setLoading] = createSignal(false);
    const [error, setError] = createSignal(false);

    const identifyAds = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(false);

        try {
            const response = await fetch('/api/identify-ads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: props.store.prompt,
                    response: props.store.adResponse,
                }),
            });

            const json = await response.json();
            if (!json.adverts) {
                throw new Error('Got empty adverts list');
            }

            props.setStore('adParts', json.adverts);
        } catch (ex) {
            setError(true);
        } finally {
            setLoading(false);
        }
    }

    return (
        <li class="mb-10 ms-4" ref={el => scrollIntoView(el)}>
            <div
                class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700">
            </div>
            <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                What changed
            </time>

            <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                Here's what changed in the response with ads.
            </p>

            <Diff before={props.store.baselineResponse}
                after={props.store.adResponse}
                author="AdBot vs ChatBot" />

            <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                Huh, what can ad blockers do with that? Traditional
                ad&nbsp;blocking is indeed helpless and its only chance is
                also to use LLMs. First of all, let's see if we can identify
                ads in the modified response.
            </p>

            <Show when={!props.store.adParts}>
                <Show when={!loading()}>
                    <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        onClick={identifyAds}>
                        Identify ads
                    </button>
                </Show>

                <Show when={loading()}>
                    <div
                        class="px-3 py-1 w-40 text-xs text-center font-medium leading-none text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
                        Waiting for AdGuardBot...
                    </div>
                </Show>

                <Show when={error()}>
                    <p id="filled_error_help" class="mt-2 text-xs text-red-600 dark:text-red-400">
                        <span class="font-medium">Oh, snapp!</span> Please try again later.
                    </p>
                </Show>
            </Show>
        </li>
    )
}

function IdentifiedAds(props) {
    const [loading, setLoading] = createSignal(false);
    const [error, setError] = createSignal(false);

    const blockAds = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(false);

        try {
            const response = await fetch('/api/block-ads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: props.store.prompt,
                    response: props.store.adResponse,
                }),
            });

            const json = await response.json();
            if (!json || !json.text) {
                throw new Error('Empty response text');
            }

            props.setStore('adGuardResponse', json.text);
        } catch (ex) {
            setError(true);
        } finally {
            setLoading(false);
        }
    }

    let divRef;

    onMount(() => {
        // Function to highlight substrings
        function highlightSubstrings(str, substrings) {
            // Sort substrings by length in descending order to avoid overlapping issues
            substrings.sort((a, b) => b.length - a.length);

            // Escape special characters in substrings to prevent issues with regex
            const escapedSubstrings = substrings.map(substring =>
                substring.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            );

            // Create a regex pattern from the substrings
            const regex = new RegExp(`(${escapedSubstrings.join('|')})`, 'gi');

            // Replace the matched substrings with a <span> tag to highlight them
            return str.replace(regex, '<span style="color: red;">$1</span>');
        }

        const originalText = props.store.adResponse;
        const highlightedText = props.store.adParts.length === 0 ?
            originalText : highlightSubstrings(originalText, props.store.adParts);

        divRef.innerHTML = highlightedText;
        replaceNewlinesWithBr(divRef);
    });

    return (
        <li class="mb-10 ms-4" ref={el => scrollIntoView(el)}>
            <div
                class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700">
            </div>
            <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                Attempt to identify ads
            </time>

            <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                Here is the ad response with where the highlighted advertising
                parts.
            </p>

            <article class="p-6 text-base bg-white rounded-lg dark:bg-gray-900">
                <footer class="flex justify-between items-center mb-2">
                    <div class="flex items-center">
                        <p
                            class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                            <img class="mr-2 w-6 h-6 rounded-full"
                                src={chatGptSvg}
                                alt="ChatBot" />
                            AdGuardBot
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

            <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                What's next? Now let's try removing the ads!
            </p>

            <Show when={!props.store.adGuardResponse}>
                <Show when={!loading()}>
                    <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        onClick={blockAds}>
                        Block ads!
                    </button>
                </Show>

                <Show when={loading()}>
                    <div
                        class="px-3 py-1 w-40 text-xs text-center font-medium leading-none text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
                        Waiting for AdGuardBot...
                    </div>
                </Show>

                <Show when={error()}>
                    <p id="filled_error_help" class="mt-2 text-xs text-red-600 dark:text-red-400">
                        <span class="font-medium">Oh, snapp!</span> Please try again later.
                    </p>
                </Show>
            </Show>
        </li>
    )
}

function BlockAds(props) {
    return (
        <li class="mb-10 ms-4" ref={el => scrollIntoView(el)}>
            <div
                class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700">
            </div>
            <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                Attempt to block ads
            </time>

            <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                Here is how the response looks like after the ads were removed.
            </p>

            <Comment text={props.store.adGuardResponse} author="AdGuardBot" />

            <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                Here's what changed compared to the ad response.
            </p>

            <Diff before={props.store.adResponse}
                after={props.store.adGuardResponse}
                author="AdGuardBot vs AdBot" />

            <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                And here's what changed compared to the baseline response.
            </p>

            <Diff before={props.store.baselineResponse}
                after={props.store.adGuardResponse}
                author="AdGuardBot vs ChatBot" />

            <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                Want to try again?
            </p>

            <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={() => { window.location.reload(); }}>
                Try again
            </button>
        </li>
    )
}

function App() {
    const [store, setStore] = createStore({
        prompt: null,
        baselineResponse: null,
        advertisers: null,
        predict: false,
        auction: false,
        adResponse: null,
        adResponseDiff: null,
        adParts: null,
        adGuardResponse: null,
    });

    return (
        <section class="bg-white dark:bg-gray-900">
            <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <h2 class="text-4xl font-extrabold dark:text-white">Demo: Ads Framework</h2>
                <p class="my-4 text-lg font-normal text-gray-500 dark:text-gray-400">
                    This is a demo page to showcase how ads can be displayed.
                    It uses the approach outlined the paper&nbsp;
                    <a href="https://arxiv.org/abs/2311.07601"
                        class="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline">
                        Online Advertisements with LLMs: Opportunities and Challenges
                    </a>
                    &nbsp;that was published in November 2023. This paper introduces
                    a general framework for LLM advertising: prediction,
                    bidding, auction and modification modules.
                </p>

                <ol class="relative border-s border-gray-200 dark:border-gray-700">
                    <Prompt
                        store={store}
                        setStore={setStore}
                    />

                    <Show when={store.baselineResponse}>
                        <BaselineResponse
                            store={store}
                            setStore={setStore}
                        />
                    </Show>

                    <Show when={store.advertisers}>
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

                    <Show when={store.adResponse}>
                        <AdResponse
                            store={store}
                            setStore={setStore}
                        />
                    </Show>

                    <Show when={store.adResponseDiff}>
                        <AdResponseDiff
                            store={store}
                            setStore={setStore}
                        />
                    </Show>

                    <Show when={store.adParts}>
                        <IdentifiedAds
                            store={store}
                            setStore={setStore}
                        />
                    </Show>

                    <Show when={store.adGuardResponse}>
                        <BlockAds
                            store={store}
                            setStore={setStore}
                        />
                    </Show>
                </ol>
            </div>
        </section>
    )
}

document.addEventListener('DOMContentLoaded', () => {
    render(() => <App />, document.getElementById('app'));
});
