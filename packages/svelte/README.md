# A package for OpenAI to easily create text in realtime like you were writing a haiku.

### Install the package for SvelteKit

```bash
npm install @typedai/svelte
```

### Example

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
