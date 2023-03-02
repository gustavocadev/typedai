declare module 'sse.js' {
	export class SSE extends EventSource {
		constructor(
			url: string | URL,
			sseOptions: {
				headers?: Record<string, string>;
				payload?: string;
				method?: string;
			} & EventSourceInit
		);

		stream(): void;
	}
}
