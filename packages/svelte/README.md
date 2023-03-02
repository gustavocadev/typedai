# A package for OpenAI to easily create text in realtime like you were writing a haiku.

### Install the package for SvelteKit

```bash
npm install @typedai/svelte
```

### Example in the client

```svelte
<script lang="ts">
	import { createTypedAI } from '@typedai/svelte';

	const { realTimeTypedAI, startTypedAI, setUserInput } = createTypedAI<string>('/api/explain');
	let userInput = '';

	const handleSubmit = async () => {
		// Set the user input
		setUserInput(userInput);

		// Start the TypedAI and generate text in realtime
		startTypedAI();
	};
</script>

<h1>Explain It Like I'm Five</h1>
<form on:submit|preventDefault={handleSubmit}>
	<label for="context">Enter the text you want summarized/explained</label>
	<textarea name="context" rows="5" bind:value={userInput} />
	<button>Explain it</button>
	<div class="pt-4">
		<h2>Explanation:</h2>
		{#if $realTimeTypedAI}
			<p>{$realTimeTypedAI}</p>
		{/if}
	</div>
</form>
```

### Example in the server using SvelteKit route handler

```ts
import { OPENAPI_TOKEN } from '$env/static/private';
import { type RequestHandler, error } from '@sveltejs/kit';
import { oneLine, stripIndent } from 'common-tags';
import type { CreateCompletionRequest } from 'openai';

export const POST = (async ({ request }) => {
	try {
		if (!OPENAPI_TOKEN) {
			throw new Error('OPENAPI_TOKEN is not set');
		}

		// request.json() is a function that returns a promise
		const body = await request.json();

		if (!body) {
			throw new Error('No openai field');
		}

		// prompt is the text that the model will use to generate a response
		const prompt = stripIndent`
      ${oneLine`
        You are going to answer a few questions about if someone is a good fit for a course.

        Here is the information that gpt-3 will use to generate a response:
        """
         name: foo
         course: foo
         age: foo
         instructor: foo
        """
      `}

      Context: """${body.trim()}"""

      Answer:
    `;

		const completionsOpts = {
			// engine is the name of the model to use
			model: 'text-davinci-003',
			// prompt is the text that the model will use to generate a response
			prompt,
			// max_tokens is how many words the model will generate
			max_tokens: 256,
			// temperature means how much the model will deviate from the prompt
			temperature: 0.9,
			// IMPORTART!(SET TRUE) stream true means the API will return results as available in real time
			stream: true
		} satisfies CreateCompletionRequest;

		const resp = await fetch('https://api.openai.com/v1/completions', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${OPENAPI_TOKEN}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(completionsOpts)
		});

		if (!resp.ok) {
			throw new Error('OpenAI API error');
		}
		console.log({ body: resp.body });

		return new Response(resp.body, {
			headers: {
				'Content-Type': 'text/event-stream'
			}
		});
	} catch (err) {
		console.log(err);
		throw error(500, 'OpenAI API error');
	}
}) satisfies RequestHandler;
```
