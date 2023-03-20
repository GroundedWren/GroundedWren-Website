/**
 * Data Namespace for Music.html
 */
registerNamespace("Pages.Music.Data", function (ns)
{
	ns.Collections = {
		"Untitled 2023": {
			ContributingArtists: ["Vera"],
			DateString: "2023",
			Art: "../img/Music/Untitled2.png",
			Description: "In-progress collection of things I'm recording this year.",
			Songs: [
				{
					title: "The Air Near My Fingers",
					src: "../music/Untitled 2023/The_Air_Near_My_Fingers.mp3",
					type: "audio/mp3",
					performers: ["Vera"],
					composers: ["The White Stripes"],
					instruments: ["Acoustic Guitar", "Vocals"],
					recorded: new Date(2023, 2, 19),
					description: "Had a weird burst of energy one Sunday and it manifested as this recording.",
					lyrics: "Life is so boring<br />It's really got me snoring<br />I'm wearing out the flooring in a cheap hotel<br />"
						+ "But I don't have to work<br />And I might be sinning<br />But I never have to hear the rings of school bells<br />"
						+ "<br />"
						+ "Don't you remember<br />You told me in December<br />That a boy is not a man until he makes a stand<br />"
						+ "Well I'm not a genius<br />But maybe you'll remember this<br />I never said I ever wanted to be a man<br />"
						+ "<br />"
						+ "I get nervous when she comes around<br />"
						+ "<br />"
						+ "My mom is so caring<br />She's really got me staring<br />At all the crazy little things she does for sure<br />"
						+ "But I can't seem to think of another kind of love<br />That I could ever get from anyone but her<br />"
						+ "<br />"
						+ "I get nervous when she comes around<br />",
				},
			]
		},
		"Grounded Wren": {
			ContributingArtists: ["Vera"],
			DateString: "2022",
			Art: "../img/Music/Grounded Wren.png",
			Description: "This is a collection of songs I recorded from the onset of the pandemic thru 2023. <br />"
				+ "Most are pretty low-fidelity, recorded on a phone or computer microphone. Doing these sketches helped keep me sane in a very isolating time.<br />"
				+ "I've uploaded a sample subset of the full collection here.",
			Songs: [
				{
					title: "Upward Over The Mountain",
					src: "../music/Grounded Wren/Upward Over The Mountain.mp3",
					type: "audio/mp3",
					performers: ["Vera"],
					composers: ["Iron & Wine"],
					instruments: ["Acoustic Guitar"],
					recorded: new Date(2022, 5, 4),
					description: "I recorded this song entirely while in bed!<br />"
						+ "I was in the process of getting a new phone at the time, so I temporarily had two. I used one to record while I played back what I already had recorded on the other to simulate multiple tracks.<br />"
						+ "The result is that it sounds like it was recorded at the bottom of a well, which, honestly is in the spirit of The Creek Drank The Cradle",
					lyrics: "(Instrumental)",
				},
				{
					title: "Flightless Bird American Mouth",
					src: "../music/Grounded Wren/Flightless Bird American Mouth.mp3",
					type: "audio/mp3",
					performers: ["Vera"],
					composers: ["Iron & Wine"],
					instruments: ["Acoustic Guitar"],
					recorded: new Date(2022, 10, 21),
					description: "First time recording my favorite song! First time recording anything in GarageBand in years.<br />"
						+ "I think it came out nice if a little slow. Kind of sounds like a lullaby.",
					lyrics: "(Instrumental)",
				},
				{
					title: "Boy With a Coin",
					src: "../music/Grounded Wren/Boy With a Coin.mp3",
					type: "audio/mp3",
					performers: ["Vera"],
					composers: ["Iron & Wine"],
					instruments: ["Acoustic Guitar", "Vocals"],
					recorded: new Date(2022, 10, 10),
					description: "Hastily recorded this the same evening I learned how to play the song.<br />"
						+ "I feel like the range was a little too low for me. <br />"
						+ "I'm not sure what happened, but the microphone glitched a couple times, so the volume gets a little wonky in places.",
					lyrics: "Boy with a coin he found in the weeds<br />With bullets and pages of trade magazines<br />Close to a car that flipped on the turn<br />When God left the ground to circle the world<br />"
						+ "<br/>Hey, ah<br />"
						+ "<br />Girl with a bird she found in the snow<br />That flew up her gown and that's how she knows<br />That God made her eyes for crying at birth<br />And then left the ground to circle the Earth<br/>"
						+ "<br/>Hey, ah<br />"
						+ "<br />Boy with a coin he crammed in his jeans<br />Then making a wish he tossed in the sea<br />And walked to a town that all of us burned<br />When God left the ground the circle the world<br />"
						+ "<br />Hey, ah",
				},
			],
		},
		"Non Sequitur": {
			ContributingArtists: ["Vera"],
			DateString: "2016",
			Art: "../img/Music/Non Sequitur.png",
			Description: "This is the second collection of music I ever recorded. It was very different from the first, hence the title.<br />"
				+ "I recorded all of these in my college apartment's bedroom. College was a pretty dark time for me, and recording these gave me a good creative outlet which lifted my spirits.<br />"
				+ "The songs recorded here are a subset of the full collection.",
			Songs: [
				{
					title: "Ladybug's Day Off",
					src: "../music/Non Sequitur/Ladybug's Day Off.mp3",
					type: "audio/mp3",
					performers: ["Vera"],
					composers: ["Vera"],
					instruments: ["Acoustic Guitar"],
					recordedString: "2016",
					description: "This is the first song I wrote that I look back on positively.<br />"
						+ "I came up with the melody by just improving and keeping what sounded good - it ended up being broken into a few distinct parts this way.<br />"
						+ "I tried to write this to be as peaceful and tranquil sounding as I could. I also wanted it to seem nature-y, if that makes sense.",
					lyrics: "(Instrumental)",
				},
				{
					title: "Exhausted",
					src: "../music/Non Sequitur/Exhausted.mp3",
					type: "audio/mp3",
					performers: ["Vera"],
					composers: ["Foo Fighters"],
					instruments: ["Acoustic Guitar", "Acoustic Bass Guitar", "Synthetic Drums"],
					recordedString: "2016",
					description: "Go listen to the original song, it's a totally different vibe.",
					lyrics: "(Instrumental)",
				},
				{
					title: "Down The Dirt Path",
					src: "../music/Non Sequitur/Down The Dirt Path.mp3",
					type: "audio/mp3",
					performers: ["Vera"],
					composers: ["Vera"],
					instruments: ["Acoustic Guitar", "Tapping on an acoustic guitar"],
					recordedString: "2016",
					description: "Not really sure what I was going for here, but it was fun to record.",
					lyrics: "(Instrumental)",
				},
				{
					title: "Polly",
					src: "../music/Non Sequitur/Polly.mp3",
					type: "audio/mp3",
					performers: ["Vera"],
					composers: ["Nirvana"],
					instruments: ["Acoustic Guitar", "Acoustic Bass Guitar"],
					recordedString: "2016",
					description: "This ended up sounding waaaay too happy for the subject matter. Recording it as an instrumental though, the groove just let me get carried away with it.",
					lyrics: "(Instrumental)",
				},
				{
					title: "Offend in Every Way",
					src: "../music/Non Sequitur/Offend in Every Way.mp3",
					type: "audio/mp3",
					performers: ["Vera"],
					composers: ["The White Stripes"],
					instruments: ["Acoustic Guitar", "Acoustic Bass Guitar", "Synthetic Drums"],
					recordedString: "2016",
					description: "I played a <i>lot</i> of White Stripes back in the day. It wouldn't be inacurate to say I learned guitar by playing along to their music.",
					lyrics: "(Instrumental)",
				},
			],
		},
	};
});