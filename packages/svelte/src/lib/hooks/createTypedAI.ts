import { writable } from 'svelte/store';
import { SSE } from 'sse.js';

export const createTypedAI = (url: string) => {
	// a state for the real time typeAI
	const realTimeTypeAI = writable('');

	// a state for the input text
	const userInput = writable('');

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

	const setOptionsPayload = (payload: string) => {
		options.update((c) => {
			c.payload = JSON.stringify(payload);
			return c;
		});
	};

	userInput.subscribe((value) => {
		console.log({ value });
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
			console.log(completionResponse, 'completionResponse');
			// we only need the first choice
			const [{ text }] = completionResponse.choices;
			console.log(text, 'Text');

			// update the realTimeTypeAI state
			realTimeTypeAI?.update((c) => {
				console.log(c, text, 'test');
				return c + text;
			});
		} catch (err) {
			isError?.set(true);
			isLoading?.set(false);
			console.error(err);
			alert('Something went wrong!');
		}
	};

	const errorHandler = () => {
		console.log('error');
		isError?.set(true);
		isLoading?.set(false);
	};

	const startTypeAI = () => {
		const sse = new SSE(url, opts);
		sse.addEventListener('error', errorHandler);
		sse.addEventListener('message', messageHandler);
		sse.stream();
	};

	const setUserInput = (value: unknown) => {
		userInput.set(JSON.stringify(value));
	};

	return {
		realTimeTypeAI,
		startTypeAI,
		setUserInput
	};
};
