# A package for OpenAI to easily create text in realtime like you were writing a haiku.

### Install the package for React or Next.js

```bash
npm install @typedai/react
```

### Example in the client using Next.js 13

```tsx
'use client'
import { useTypedAI } from './hooks/useTypedAI'
import { useEffect, useState } from 'react'

export default function Home() {
	const [msg, setMsg] = useState('')
	const { realTimeTypedAI, startTypedAI, setUserInput } = useTypedAI('/api/explain')

	useEffect(() => {
		setUserInput(msg)
	}, [msg])

	const handleForm = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		startTypedAI()
	}

	return (
		<main>
			<div>
				<form onSubmit={handleForm}>
					<label htmlFor="userInput">Type something</label>
					<input type="text" value={msg} onChange={(e) => setMsg(e.currentTarget.value)} />
					<button type="submit">Ask</button>
				</form>
				<p>{realTimeTypedAI}</p>
			</div>
		</main>
	)
}
```

### Example in the server using Next.js 13 route handler

```ts
import { oneLine, stripIndent } from 'common-tags'
import type { CreateCompletionRequest } from 'openai'

const OPENAPI_TOKEN = ''

export const POST = async (request: Request) => {
	try {
		if (!OPENAPI_TOKEN) {
			throw new Error('OPENAPI_TOKEN is not set')
		}
		// request.json() is a function that returns a promise
		const body = await request.json()
		if (!body) {
			throw new Error('No openapi field')
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
	    `
		const completionsOpts = {
			// engine is the name of the model to use
			model: 'text-davinci-003',
			// prompt is the text that the model will use to generate a response
			prompt,
			// max_tokens is how many words the model will generate
			max_tokens: 256,
			// temperature means how much the model will deviate from the prompt
			temperature: 0.9,
			// stream true means the API will return results as available
			stream: true,
		} satisfies CreateCompletionRequest
		console.log(
			`
	      Hello, this is a test of the OpenAI API.
	      `
		)
		const resp = await fetch('https://api.openai.com/v1/completions', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${OPENAPI_TOKEN}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(completionsOpts),
		})
		if (!resp.ok) {
			throw new Error('OpenAI API error')
		}
		return new Response(resp.body, {
			headers: {
				'Content-Type': 'text/event-stream',
			},
		})
	} catch (err) {
		console.log(err)
	}
}
```
