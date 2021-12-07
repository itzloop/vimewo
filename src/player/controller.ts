import EventEmitter from "events";
import { WebsocketApi } from "../api/websocket";


enum ActionType {
	PAUSE = "pause",
	PLAY	= "play",
	GOTO 	= "goto"
}


class Controller {
	private api: WebsocketApi;
	private roomid: string;
	private event: EventEmitter;
	constructor(api: WebsocketApi, roomid: string)	{
		this.api = api;
		this.roomid = roomid;
		this.event = new EventEmitter();
	}	

	play(time: number) {
		const data = {
			roomid: this.roomid,
			action: ActionType.PLAY,
			data: {
				time: time
			}
		}

		this.api.send(JSON.stringify(data))
	}

	pause(time: number) {
		const data = {
			roomid: this.roomid,
			action: ActionType.PAUSE,
			data: {
				time: time
			}
		}

		this.api.send(JSON.stringify(data))
	}

	goto(time: number) {
		const data = {
			roomid: this.roomid,
			action: ActionType.GOTO,
			data: {
				time: time
			}
		}

		this.api.send(JSON.stringify(data))
	}

	handleMessage(message: string) {
		const data = JSON.parse(message);
		if (!("action" in data)) {
			console.log("message must contain 'action' as it's properties")
		}

		const action: ActionType = data.action

		switch(action) {
			case ActionType.PLAY:
				this.event.on(ActionType.PLAY, data.data.data)
				break;
			case ActionType.PAUSE:
				this.event.emit(ActionType.PAUSE, data.data.time)
				break
			case ActionType.GOTO:
				this.event.emit(ActionType.GOTO, data.data.time)
				break;
			default:
				console.log(`action '${action}' is not valid`);
		}
	}

	on(action: ActionType, fn: (time: number) => void) : void {
		switch(action) {
			case ActionType.PLAY:
				this.event.on(ActionType.PLAY, fn)
				break;
			case ActionType.PAUSE:
				this.event.on(ActionType.PAUSE, fn)
				break
			case ActionType.GOTO:
				this.event.on(ActionType.GOTO, fn)
				break;
			default:
				console.log(`action '${action}' is not valid`);
		}
	}
}


export {
	Controller,
	ActionType
}
