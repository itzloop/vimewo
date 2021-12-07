import util from "util"
import React, { useCallback, useEffect } from "react";
import videojs from "video.js";
import logo from "./logo.svg";
import "./App.css";
import { API } from "./api/websocket";
import { ActionType, Controller } from "./player/controller";

function App() {
	useEffect(() => {
		let player = videojs("my-player", {}, function onPlayerReady() {
			videojs.log("hello from the other side");

			this.play();

			this.on("ended", function() {
				videojs.log("done...")
			})
		});

		let controller = new Controller(API, "abcdef")
		// controller.on(ActionType.PLAY, () => console.log())
			
		player.on("play", (args) => controller.play(player.currentTime()))
		player.on("pause", (args) => controller.pause(player.currentTime()))

		// setInterval(() => console.log(player.currentTime()), 1000)

		try {
			API.init("ws://localhost:8080/chat", console.log);
			// setInterval(() => {
			// 	let data = JSON.stringify({
			// 		roomid: "abcedf",
			// 		action: "pause",
			// 			data: {
			// 				time: "1:25:34",
			// 			}
			// 		})
			// 	console.log("dataaa", data)
			// 	API.send(data) 
			// }, 1000)

			return () => {
				API.close()
			}
		} catch(err) {
			console.log(err)
		}


	}, []);
		
		
  return (
    <div className="App">
			<video
					id="my-player"
					className="video-js"
					preload="auto">
				<source src="film.mp4" type="video/mp4"></source>

			</video>
    </div>
  );
}

export default App;
