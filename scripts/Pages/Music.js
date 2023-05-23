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
	}

	function populateCollectionInfo(collectionId)
	{
		const collection = ns.Data.Collections[collectionId];
		const collectionInfoEl = document.getElementById(COLLECTION_INFO_ID);
		collectionInfoEl.innerHTML = "";

		Common.DOMLib.createElement("h3", collectionInfoEl).el.innerText = "Details";
		const collectionMetaTable = Common.DOMLib.createElement("table", collectionInfoEl).el;
		addTableRow(collectionMetaTable, "Collection Name", collectionId);
		addTableRow(collectionMetaTable, "Date", collection.DateString);
		addTableRow(collectionMetaTable, "Contributing Artists", collection.ContributingArtists.join(", "));

		Common.DOMLib.createElement("h3", collectionInfoEl).el.innerText = "Description";
		Common.DOMLib.createElement("p", collectionInfoEl).el.innerHTML = collection.Description;
	}

	function buildSongList(collectionId)
	{
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
					audioListEl.pause();
				}
			});
			Common.Components.GetVisToggle(chevronEl.id).doToggle(true);
		});

		Common.DOMLib.setAttributes(audioEl, { "controls": null });
		const sourceEl = Common.DOMLib.createElement("source", audioEl).el;
		Common.DOMLib.setAttributes(sourceEl, { "src": song.src, "type": song.type });

		const detailEl = Common.DOMLib.createElement("div", containerEl).el;
		Common.DOMLib.addStyle(detailEl, { display: "none" });

		Common.DOMLib.createElement("h3", detailEl).el.innerText = "Details";
		const detailTable = Common.DOMLib.createElement("table", detailEl).el;
		addTableRow(detailTable, "Performers", song.performers.join(", "));
		addTableRow(detailTable, "Composers", song.composers.join(", "));
		addTableRow(
			detailTable,
			"Recorded",
			song.recorded ? song.recorded.toLocaleString(undefined, { dateStyle: "medium" }) : song.recordedString
		);
		addTableRow(detailTable, "Instruments", song.instruments.join(", "));

		Common.DOMLib.createElement("h3", detailEl).el.innerText = "Description";
		Common.DOMLib.createElement("p", detailEl).el.innerHTML = song.description;

		Common.DOMLib.createElement("h3", detailEl).el.innerText = "Lyrics";
		Common.DOMLib.createElement("p", detailEl).el.innerHTML = song.lyrics;

		//songTitleContainer.addEventListener("click", toggleDetailDelegate);
		//chevronEl.addEventListener("keydown", toggleDetailDelegate);
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
				event.stopPropagation();
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
	Pages.Music.buildCollectionList();

	Pages.Music.interperetUrlParams(Common.getUrlParams());
};