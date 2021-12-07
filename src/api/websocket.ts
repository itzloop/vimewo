class WebsocketApi {
	private _socket?: WebSocket;
	
	init(addr: string, onMessage: (data: string) => void) {
		if (this._socket)
			throw new Error("WebsocketApi: attempt reinitialize api");

		WebsocketApi.log("creating the socket")	
		let socket = new WebSocket(addr);
		socket.onopen = this.onOpen;
		socket.onclose = this.onClose;
		socket.onerror = this.onError;
		socket.onmessage = (event) => this.onMessage(event, onMessage);
		this._socket = socket;	
	}	
		
	private get socket() {
		if (!this._socket)
			throw new Error("can't use socket before initializing");

		return this._socket
	}
	
	private onOpen(_: Event) {
		WebsocketApi.log("connected")
	}

	private async onMessage(event: MessageEvent<any>, fn: (event: any) => void) {
		try{
			const data = await event.data.text();
			WebsocketApi.log(data)
			fn(data)
		} catch(err) {
			WebsocketApi.log(err)
		}
	}

	private onClose(_: CloseEvent) {
		WebsocketApi.log("socket closed.")
	}

	private onError(event: Event) {
		WebsocketApi.log(`something went wrong: ${event}`)
	}

	private static log(...data: any[]) {
		console.log("WebsocketApi:", ...data)
	}
	
	send(data: string) {
		this.socket.send(data)
	}

	close() {
		this.socket.close()
	}
}

export const API = new WebsocketApi(); 

export {
	WebsocketApi
}
