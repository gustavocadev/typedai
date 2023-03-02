# A package for OpenAI to easily create text in realtime like you were writing a haiku.

### Install the package for SvelteKit

```bash
npm install @typedai/svelte
```

### Example

```svelte
<script lang="ts">
	import { createTypedAI } from '@typedai/svelte';

	const { realTimeTypeAI, startTypeAI, setUserInput } = createTypedAI('/api/explain');
	let userInput = '';

	const handleSubmit = async () => {
		// Set the user input
		setUserInput(userInput);

		// Start the TypeAI and generate text in realtime
		startTypeAI();
	};
</script>

<h1>Explain It Like I'm Five</h1>
<form on:submit|preventDefault={handleSubmit}>
	<label for="context">Enter the text you want summarized/explained</label>
	<textarea name="context" rows="5" bind:value={context} />
	<button>Explain it</button>
	<div class="pt-4">
		<h2>Explanation:</h2>
		{#if $realTimeTypeAI}
			<p>{$realTimeTypeAI}</p>
		{/if}
	</div>
</form>
```
