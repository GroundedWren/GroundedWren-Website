/**
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
			const inputLineEl = Common.DOMLib.createElement("div", collectionListEl, ["input-flex-line"]).el;

			const labelEl = Common.DOMLib.createElement("label", inputLineEl).el;
			labelEl.innerHTML = collectionId;

			const radioEl = Common.DOMLib.createElement("input", inputLineEl).el;
			Common.DOMLib.setAttributes(
				radioEl,
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
		document.getElementById("playBtn").classList.add("hidden");
		document.getElementById("pauseBtn").classList.remove("hidden");
	};

	function markTracksPaused()
	{
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

		Common.DOMLib.createElement("h3", collectionInfoEl).el.innerText = "Details";
		const collectionMetaTable = Common.DOMLib.createElement("table", collectionInfoEl).el;
		const collectionMetaTHead = Common.DOMLib.createElement("thead", collectionMetaTable, ["sr-only"]).el;
		collectionMetaTHead.innerHTML = "<tr><th>Property</th><th>Value</th></tr>";
		const collectionMetaTBody = Common.DOMLib.createElement("tbody", collectionMetaTable).el;
		addTableRow(collectionMetaTBody, "Collection Name", collectionId);
		addTableRow(collectionMetaTBody, "Date", collection.DateString);
		addTableRow(collectionMetaTBody, "Contributing Artists", collection.ContributingArtists.join(", "));

		Common.DOMLib.createElement("h3", collectionInfoEl).el.innerText = "Description";
		Common.DOMLib.createElement("p", collectionInfoEl).el.innerHTML = collection.Description;
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
		const containerEl = Common.DOMLib.createElement("div", parent, ["songContainer", "card"]).el;

		const songTitleContainer = Common.DOMLib.createElement("div", containerEl, ["songTitleContainer"]).el;
		Common.DOMLib.createElement("h3", songTitleContainer).el.innerText = song.title;
		const chevronEl = Common.DOMLib.createElement("span", songTitleContainer, ["chevron", "bottom"]).el;
		Common.DOMLib.setAttributes(chevronEl, {
			tabindex: 0,
			"aria-label": "Show track details for " + song.title
		});
		chevronEl.setAttribute("tabindex", 0);

		const audioEl = Common.DOMLib.createElement("audio", containerEl).el;
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
			if (ns.PlayIndex === 0) { return; }
			if (ns.audioList[ns.PlayIndex] && ns.audioList[ns.PlayIndex].id === audioEl.id)
			{
				markTracksPaused();
			}
		});
		audioEl.addEventListener("ended", Common.fcd(ns, onTrackEnded, [audioEl]));

		Common.DOMLib.setAttributes(audioEl, { "controls": null });
		const sourceEl = Common.DOMLib.createElement("source", audioEl).el;
		Common.DOMLib.setAttributes(sourceEl, { "src": song.src, "type": song.type });

		const detailEl = Common.DOMLib.createElement("div", containerEl).el;
		Common.DOMLib.addStyle(detailEl, { display: "none" });

		Common.DOMLib.createElement("h3", detailEl).el.innerText = "Details";
		const detailTable = Common.DOMLib.createElement("table", detailEl).el;
		const detailTHead = Common.DOMLib.createElement("thead", detailTable, ["sr-only"]).el;
		detailTHead.innerHTML = "<tr><th>Property</th><th>Value</th></tr>";
		const detailTBody = Common.DOMLib.createElement("tbody", detailTable).el;
		addTableRow(detailTBody, "Performers", song.performers.join(", "));
		addTableRow(detailTBody, "Composers", song.composers.join(", "));
		addTableRow(
			detailTBody,
			"Recorded",
			song.recorded ? song.recorded.toLocaleString(undefined, { dateStyle: "medium" }) : song.recordedString
		);
		addTableRow(detailTBody, "Instruments", song.instruments.join(", "));

		Common.DOMLib.createElement("h3", detailEl).el.innerText = "Description";
		Common.DOMLib.createElement("p", detailEl).el.innerHTML = song.description;

		Common.DOMLib.createElement("h3", detailEl).el.innerText = "Lyrics";
		Common.DOMLib.createElement("p", detailEl).el.innerHTML = song.lyrics;

		Common.Components.RegisterVisToggle(
			chevronEl,
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

		var { el: tableRow } = dce("tr", tableEl);
		var { el: rowLabel } = dce("td", tableRow, ["row-label"]);
		rowLabel.innerText = labelText;
		var { el: rowValue } = dce("td", tableRow);
		rowValue.innerHTML = labelValueHTML;
	}
});

/**
 * Code to be called when the window first loads
 */
window.onload = () =>
{
	Common.setUpAccessibility();
	Common.Components.registerShortcuts({
		"ALT+H": {
			action: () => { document.getElementById("homeButton").click(); },
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
	});


	Pages.Music.buildCollectionList();

	Pages.Music.interperetUrlParams(Common.getUrlParams());
};