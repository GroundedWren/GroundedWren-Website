﻿/**
 * Namespace for Music.html
 */
registerNamespace("Pages.Music", function (ns)
{
	const COLLECTION_LIST_ID = "collectionsList";
	const COLLECTION_IMG_ID = "collectionImg";
	const COLLECTION_INFO_ID = "collectionInfoContent";
	const TRACK_LIST_ID = "trackListContent";

	const COLLECTION_PARAM = "collection";

	ns.collectionRadioMap = {};
	ns.audioList = [];

	/*
	 * Uses the namespace's data to build out the list of collections 
	 */
	ns.buildCollectionList = function ()
	{
		const collectionListEl = document.getElementById(COLLECTION_LIST_ID);

		Object.keys(ns.Data.Collections).forEach(collectionId =>
		{
			const inputLineEl = Common.DOMLib.createElement("div", collectionListEl, undefined, ["input-flex-line"]);

			const labelEl = Common.DOMLib.createElement("label", inputLineEl, undefined, undefined, collectionId);
			labelEl.innerHTML = collectionId;

			const radioEl = Common.DOMLib.createElement(
				"input",
				inputLineEl,
				{
					"type": "radio",
					"name": "collectionList",
					"value": collectionId
				}
			);
			radioEl.addEventListener("change", Common.fcd(ns, openCollection, [collectionId]));

			labelEl.setAttribute("for", radioEl.id);

			ns.collectionRadioMap[collectionId] = radioEl;
		});
	};

	/**
	 * Handles url parameters for the music page
	 */
	ns.interperetUrlParams = function (params)
	{
		const collectionId = params.has(COLLECTION_PARAM)
			? params.get(COLLECTION_PARAM)
			: Object.keys(ns.collectionRadioMap)[0];
		ns.collectionRadioMap[collectionId].checked = true;
		openCollection(collectionId);
	};

	ns.PlayIndex = -1;
	ns.playTracks = function ()
	{
		markTracksPlaying();
		if (ns.PlayIndex === -1)
		{
			ns.PlayIndex = 0;
		}
		ns.audioList[ns.PlayIndex].play();
	};

	ns.pauseTracks = function ()
	{
		markTracksPaused();
		ns.audioList[ns.PlayIndex].pause();
	};

	ns.nextTrack = function ()
	{
		if (ns.PlayIndex > -1)
		{
			ns.audioList[ns.PlayIndex].pause();
		}
		onTrackEnded();
	};

	ns.prevTrack = function ()
	{
		if (ns.PlayIndex === -1)
		{
			ns.PlayIndex = ns.audioList.length - 1;
			ns.playTracks();
			return;
		}
		var audioEl = ns.audioList[ns.PlayIndex];
		if (audioEl.currentTime > 3)
		{
			audioEl.currentTime = 0;
			return;
		}
		if (ns.PlayIndex === 0)
		{
			ns.audioList[ns.PlayIndex].pause();
			audioEl.currentTime = 0;
			markTracksPaused();
			ns.PlayIndex = -1;
			return;
		}
		ns.audioList[ns.PlayIndex].pause();
		audioEl.currentTime = 0;
		ns.PlayIndex--;
		ns.playTracks();
	};

	ns.togglePlayback = () =>
	{
		if (document.getElementById("pauseBtn").classList.contains("hidden"))
		{
			ns.playTracks();
		}
		else
		{
			ns.pauseTracks();
		}
	};

	function onTrackEnded()
	{
		var nextAudio = ns.audioList[++ns.PlayIndex];
		if (nextAudio)
		{
			nextAudio.play();
		}
		else
		{
			markTracksPaused();
			ns.PlayIndex = -1;
		}
	};

	function markTracksPlaying()
	{
		if (document.activeElement === document.getElementById("playBtn"))
		{
			document.getElementById("pauseBtn").focus();
		}
		document.getElementById("playBtn").classList.add("hidden");
		document.getElementById("pauseBtn").classList.remove("hidden");
	};

	function markTracksPaused()
	{
		if (document.activeElement === document.getElementById("pauseBtn"))
		{
			document.getElementById("playBtn").focus();
		}
		document.getElementById("pauseBtn").classList.add("hidden");
		document.getElementById("playBtn").classList.remove("hidden");
	};

	function openCollection(collectionId, event)
	{
		populateCollectionInfo(collectionId);
		buildSongList(collectionId);

		const collectionImg = document.getElementById(COLLECTION_IMG_ID);
		collectionImg.setAttribute("src", ns.Data.Collections[collectionId].Art);
		collectionImg.setAttribute("alt", ns.Data.Collections[collectionId].ArtAlt);

		if (event)
		{
			event.preventDefault();
			window.history.replaceState(null, "", `?${COLLECTION_PARAM}=${collectionId}`);
		}

		markTracksPaused();
		ns.PlayIndex = -1;
	}

	function populateCollectionInfo(collectionId)
	{
		const collection = ns.Data.Collections[collectionId];
		const collectionInfoEl = document.getElementById(COLLECTION_INFO_ID);
		collectionInfoEl.innerHTML = "";

		Common.DOMLib.createElement("h3", collectionInfoEl, undefined, undefined, "Details");
		const collectionMetaTable = Common.DOMLib.createElement("table", collectionInfoEl);
		const collectionMetaTBody = Common.DOMLib.createElement("tbody", collectionMetaTable);
		addTableRow(collectionMetaTBody, "Collection Name", collectionId);
		addTableRow(collectionMetaTBody, "Date", collection.DateString);
		addTableRow(collectionMetaTBody, "Contributing Artists", collection.ContributingArtists.join(", "));

		Common.DOMLib.createElement("h3", collectionInfoEl, undefined, undefined, "Description");
		Common.DOMLib.createElement("p", collectionInfoEl, undefined, undefined, collection.Description);
	}

	function buildSongList(collectionId)
	{
		ns.audioList = [];
		const songs = ns.Data.Collections[collectionId].Songs;
		const rightPane = document.getElementById(TRACK_LIST_ID);

		rightPane.innerHTML = "";

		songs.forEach(song =>
		{
			createSongCard(song, rightPane);
		});
	}

	function createSongCard(song, parent)
	{
		const containerEl = Common.DOMLib.createElement("div", parent, undefined, ["songContainer", "card"]);

		const songTitleContainer = Common.DOMLib.createElement("div", containerEl, undefined, ["songTitleContainer"]);
		Common.DOMLib.createElement("h3", songTitleContainer, undefined, undefined, song.title);
		const expandButton = Common.DOMLib.createElement("div", songTitleContainer, undefined, ["song-info-btn"]);
		const infoIcon = Common.SVGLib.createIcon(Common.SVGLib.Icons["circle-info"], undefined, undefined, ["song-info-icon"]);
		infoIcon.setAttribute("aria-hidden", "true");
		expandButton.appendChild(infoIcon);
		const chevronEl = Common.DOMLib.createElement(
			"span",
			expandButton,
			{
				"aria-label": "Show track details for " + song.title
			},
			["chevron", "bottom"]
		);

		const audioEl = Common.DOMLib.createElement("audio", containerEl);
		ns.audioList.push(audioEl);
		audioEl.addEventListener("play", () =>
		{
			ns.audioList.forEach(audioListEl =>
			{
				if (audioListEl.id !== audioEl.id)
				{
					audioListEl.currentTime = 0;
					audioListEl.pause();
				}
				else
				{
					ns.PlayIndex = ns.audioList.indexOf(audioListEl);
					markTracksPlaying();
				}
			});
		});
		audioEl.addEventListener("pause", () =>
		{
			if (ns.PlayIndex === -1) { return; }
			if (ns.audioList[ns.PlayIndex] && ns.audioList[ns.PlayIndex].id === audioEl.id)
			{
				markTracksPaused();
			}
		});
		audioEl.addEventListener("ended", Common.fcd(ns, onTrackEnded, []));

		Common.DOMLib.setAttributes(audioEl, { "controls": null });
		const sourceEl = Common.DOMLib.createElement(
			"source",
			audioEl,
			{ "src": song.src, "type": song.type }
		);

		const detailEl = Common.DOMLib.createElement("div", containerEl);
		Common.DOMLib.addStyle(detailEl, { display: "none" });

		Common.DOMLib.createElement("h4", detailEl, undefined, undefined, "Details");
		const detailTable = Common.DOMLib.createElement("table", detailEl);
		const detailTBody = Common.DOMLib.createElement("tbody", detailTable);
		addTableRow(detailTBody, "Performers", song.performers.join(", "));
		addTableRow(detailTBody, "Composers", song.composers.join(", "));
		addTableRow(
			detailTBody,
			"Recorded",
			song.recorded ? song.recorded.toLocaleString(undefined, { dateStyle: "medium" }) : song.recordedString
		);
		addTableRow(detailTBody, "Instruments", song.instruments.join(", "));

		Common.DOMLib.createElement("h4", detailEl, undefined, undefined, "Description");
		Common.DOMLib.createElement("p", detailEl, undefined, undefined, song.description);

		Common.DOMLib.createElement("h4", detailEl, undefined, undefined, "Lyrics");
		Common.DOMLib.createElement("p", detailEl, undefined, undefined, song.lyrics);

		Common.Components.RegisterVisToggle(
			expandButton,
			[
				detailEl,
			],
			(visible, event) =>
			{
				if (visible)
				{
					chevronEl.classList.remove("bottom");
				}
				else
				{
					chevronEl.classList.add("bottom");
				}
				if (event)
				{
					event.stopPropagation();
				}
			},
			false,
			[songTitleContainer]
		);
	}

	function addTableRow(tableEl, labelText, labelValueHTML)
	{
		var dce = Common.DOMLib.createElement;

		var tableRow = dce("tr", tableEl);
		dce("th", tableRow, {"scope": "row"}, undefined, labelText);
		dce("td", tableRow, undefined, undefined, labelValueHTML);
	}
});

/**
 * Code to be called when the window first loads
 */
window.onload = () =>
{
	Common.loadTheme();
	Common.setUpAccessibility();
	Common.Components.registerShortcuts({
		"ALT+H": {
			action: () => { document.getElementById("homeLink").click(); },
			description: "Return to the home page"
		},
		"ALT+S": {
			action: () => { document.getElementById("shortcutsButton").click(); },
			description: "Show shortcut keys"
		},
		"ALT+P": {
			action: Pages.Music.togglePlayback,
			description: "Toggle playback"
		},
		"ALT+,": {
			action: Pages.Music.prevTrack,
			description: "Previous track"
		},
		"ALT+.": {
			action: Pages.Music.nextTrack,
			description: "Next track"
		},
	});
	Common.SVGLib.insertIcons();


	Pages.Music.buildCollectionList();

	Pages.Music.interperetUrlParams(Common.getUrlParams());
};