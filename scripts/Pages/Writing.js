/**
 * Namespace for Writing.html
 */
registerNamespace("Pages.Writing", function (ns)
{
	ns.entryFrame = null;
	ns.entryHeader = null;
	ns.zsc = null;

	ns.currentFolder = null;

	const ENTRY_PARAM = "entry";
	ns.ENTRY_PARAM = ENTRY_PARAM;
	const FOLDER_PARAM = "folder";
	ns.FOLDER_PARAM = FOLDER_PARAM;

	const FOLDER_CONTENT_ID = "folderContent";
	const DIRECTORY_CARD_ID = "directoryCard";
	ns.DIRECTORY_CARD_ID = DIRECTORY_CARD_ID;
	const DIRECTORY_HEADER_ID = "directoryHeader";
	const DIRECTORY_CONTENT_ID = "directoryContent";
	const METADATA_CARD_ID = "metaCard";
	const METADATA_CONTENT_ID = "metaContent";

	/**
	 * Shows the zero stage control
	 */
	function enterZeroState()
	{
		Common.DOMLib.addStyle(ns.entryFrame, { "display": "none" });
		Common.DOMLib.addStyle(ns.zsc, { "display": "block" });
		hideMetadata();
	}
	ns.enterZeroState = enterZeroState;

	/**
	 * Hides the zero state control
	 */
	function exitZeroState()
	{
		Common.DOMLib.addStyle(ns.zsc, { "display": "none" });
		Common.DOMLib.addStyle(ns.entryFrame, { "display": "block" });
	}
	ns.exitZeroState = exitZeroState;

	/**
	 * Builds the folder list card
	 */
	ns.buildFolderList = function ()
	{
		const folderContentEl = document.getElementById(FOLDER_CONTENT_ID);
		const listEl = Common.DOMLib.createElement("ul", folderContentEl).el;

		Object.keys(ns.Data.Folders).forEach(folder =>
		{
			const listItemEL = Common.DOMLib.createElement("li", listEl).el;

			const linkEl = Common.DOMLib.createElement("a", listItemEL).el;
			linkEl.innerHTML = `${folder}`;
			linkEl.setAttribute("href", `?folder=${folder}`);
			linkEl.onclick = Common.fcd(
				ns,
				ns.openFolder,
				[folder]
			);
		});
	};

	/**
	 * Opens the specified folder
	 */
	ns.openFolder = function (folder, event)
	{
		enterZeroState();
		ns.buildDirectory(folder);
		document.getElementById(DIRECTORY_CARD_ID).classList.remove("hidden");

		if (event)
		{
			event.preventDefault();
			window.history.replaceState(null, "", `?${FOLDER_PARAM}=${ns.currentFolder}`);
		}
	}

	/**
	 * Sets up the entries (directory) card according to a specified folder
	 */
	ns.buildDirectory = function(folder)
	{
		if (!folder || !ns.Data.Folders[folder]) { return; }

		ns.currentFolder = folder;

		document.getElementById(DIRECTORY_HEADER_ID).innerHTML = `${folder} Entries`

		document.getElementById(DIRECTORY_CONTENT_ID).remove();
		const directoryEl = Common.DOMLib.createElement(
			"div",
			document.getElementById(DIRECTORY_CARD_ID),
			[],
			DIRECTORY_CONTENT_ID
		).el;

		const listEl = Common.DOMLib.createElement("ul", directoryEl).el;

		const folderObj = ns.Data.Folders[folder];
		Object.keys(folderObj.entries).forEach(entryId =>
		{
			const entry = folderObj.entries[entryId];

			const listItemEL = Common.DOMLib.createElement("li", listEl).el;

			const linkEl = Common.DOMLib.createElement("a", listItemEL).el;
			linkEl.innerHTML = `${entry.title}`;
			linkEl.setAttribute("href", `?folder=${folder}&entry=${entryId}`);
			linkEl.onclick = Common.fcd(
				ns,
				ns.openToEntry,
				[folder, entryId]
			);
		});
	}

	/**
	 * Opens the specified entry from the specified folder
	 */
	function openToEntry(folder, entryId, event)
	{
		const folderObj = ns.Data.Folders[folder];

		const entry = folderObj.entries[entryId];
		if (entry)
		{
			loadEntry(entryId, folderObj.entriesDirectory, folderObj.entryExtension, entry.title, event);
			displayMetadata(entry);
		}
		else
		{
			window.history.replaceState(null, "", "Writing.html");
			Pages.Writing.enterZeroState();
			Common.Controls.Popups.showModal("Writing", `Entry not found: ${entry}`);
		}
	}
	ns.openToEntry = openToEntry;

	function loadEntry(filename, directory, extension, title, event)
	{
		const page = directory + filename + extension;
		ns.entryFrame.setAttribute("src", page);
		ns.entryHeader.innerHTML = `<a href="${page}">${title}</a>`;
		exitZeroState();

		if (event)
		{
			event.preventDefault();
			window.history.replaceState(null, "", `?${FOLDER_PARAM}=${ns.currentFolder}&${ENTRY_PARAM}=${filename}`);
		}
	}

	function displayMetadata(entry)
	{
		const metaCard = document.getElementById(METADATA_CARD_ID);
		metaCard.classList.remove("hidden");

		var metaContent = document.getElementById(METADATA_CONTENT_ID);
		if (metaContent)
		{
			metaContent.remove();
		}
		metaContent = Common.DOMLib.createElement("div", metaCard, [], METADATA_CONTENT_ID).el;

		metaContent.innerHTML = `<span>Author: ${entry.author}</span>`;
		if (entry.date)
		{
			metaContent.innerHTML += `<br /><span>Date: ${entry.date.toLocaleString(
				undefined,
				{
					dateStyle: "medium",
				}
			)}</span>`
		}
	}

	function hideMetadata()
	{
		const metaCard = document.getElementById(METADATA_CARD_ID);
		metaCard.classList.add("hidden");

		const metaContent = document.getElementById(METADATA_CONTENT_ID);
		if (metaContent)
		{
			metaContent.remove();
		}
	}
});

/**
 * Code to be called when the window first loads
 */
window.onload = () =>
{
	Pages.Writing.entryFrame = document.getElementById("entryFrame");
	Pages.Writing.entryHeader = document.getElementById("entryHeader");

	Pages.Writing.zsc = Common.Controls.ZeroState.embedZSC(document.getElementById("entryCard"), "Select an Entry");

	Pages.Writing.buildFolderList();

	const params = Common.getUrlParams();
	var folder = "";
	if (params.has(Pages.Writing.FOLDER_PARAM))
	{
		folder = params.get(Pages.Writing.FOLDER_PARAM);
		Pages.Writing.buildDirectory(folder);
	}
	else
	{
		document.getElementById(Pages.Writing.DIRECTORY_CARD_ID).classList.add("hidden");
	}

	if (params.has(Pages.Writing.ENTRY_PARAM) && folder)
	{
		const entry = params.get(Pages.Writing.ENTRY_PARAM);
		Pages.Writing.openToEntry(folder, entry);
	}
	else
	{
		Pages.Writing.enterZeroState();
	}

	const visTogButton = document.getElementById("leftPaneCollapseBtn");
	const visTogChevron = document.getElementById("leftPaneCollapseChevron");
	Common.Components.RegisterVisToggle(
		visTogButton,
		[
			document.getElementById("leftPane"),
		],
		(visible) =>
		{
			visTogChevron.classList.remove(visible ? "right" : "left");
			visTogChevron.classList.add(visible ? "left" : "right");
		}
	);
};