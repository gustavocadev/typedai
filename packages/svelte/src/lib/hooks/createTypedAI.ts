import { writable } from 'svelte/store';
import { SSE } from 'sse.js';

export function createTypedAI<T>(url: string) {
	// a state for the real time typeAI
	const realTimeTypedAI = writable('');

	// a state for the input text
	const userInput = writable<T>();

	// error state
	const isError = writable(false);

	// is loading state
	const isLoading = writable(false);

	// options like headers, payload, method
	const options = writable({
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		payload: ''
	});

	const setOptionsPayload = (payload: T) => {
		options.update((c) => {
			c.payload = JSON.stringify(payload);
			return c;
		});
	};

	userInput.subscribe((value) => {
		setOptionsPayload(value);
	});

	// instance of typeAI
	let opts = {};
	options.subscribe((value) => {
		opts = value;
	});

	const messageHandler = (e: MessageEvent) => {
		try {
			isLoading?.set(true);
			if (e.data === '[DONE]') return;

			const completionResponse = JSON.parse(e.data);
			// we only need the first choice
			const [{ text }] = completionResponse.choices;

			// update the realTimeTypedAI state
			realTimeTypedAI?.update((c) => {
				return c + text;
			});
		} catch (err) {
			isError?.set(true);
			isLoading?.set(false);
			console.error(err);
		}
	};

	const errorHandler = () => {
		console.log(`Error: ${url}`);
		isError?.set(true);
		isLoading?.set(false);
	};

	const startTypedAI = () => {
		const sse = new SSE(url, opts);
		sse.addEventListener('error', errorHandler);
		sse.addEventListener('message', messageHandler);
		sse.stream();
	};

	// set the user input
	const setUserInput = (value: T) => {
		userInput.set(value);
	};

	return {
		realTimeTypedAI,
		startTypedAI,
		setUserInput
	};
}
