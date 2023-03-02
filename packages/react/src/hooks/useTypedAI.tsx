import { useEffect, useState } from 'react'
import { SSE } from 'sse.js'

export function useTypedAI<T>(url: string) {
	const [realTimeTypedAI, setRealTimeTypedAI] = useState('')
	const [userInput, setUserInput] = useState<T | null>(null)
	const [isError, setIsError] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const [options, setOptions] = useState({
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		payload: '',
	})

	const errorHandler = (event: Event) => {
		setIsError(true)
	}

	const messageHandler = (e: MessageEvent) => {
		try {
			setIsLoading(true)
			if (e.data === '[DONE]') return setIsLoading(false)

			const completionResponse = JSON.parse(e.data)
			// we only need the first choice
			const [{ text }] = completionResponse.choices

			// update the realTimeTypedAI state
			setRealTimeTypedAI((c) => c + text)
		} catch (err) {
			setIsError(true)
			setIsLoading(false)
			console.error(err)
		}
	}

	useEffect(() => {
		if (userInput) setOptions((c) => ({ ...c, payload: JSON.stringify(userInput) }))
	}, [userInput])

	const startTypedAI = async () => {
		const sse = new SSE(url, options)
		sse.addEventListener('error', errorHandler)
		sse.addEventListener('message', messageHandler)
		sse.stream()
	}

	return {
		realTimeTypedAI,
		setUserInput,
		startTypedAI,
		isError,
		isLoading,
	}
}
