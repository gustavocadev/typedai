export type SSEOptions = EventSourceInit & IHeaders & IPayload & IMethod;

export type IHeaders = {
	headers?: Record<string, string>;
};

export type IPayload = {
	payload?: string;
};

export type IMethod = {
	method?: string;
};
