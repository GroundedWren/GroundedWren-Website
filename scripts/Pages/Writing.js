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
	const FOLDER_PARAM = "folder";

	const FOLDER_CONTENT_ID = "folderContent";
	const DIRECTORY_CARD_ID = "directoryCard";
	const DIRECTORY_HEADER_ID = "directoryHeader";
	const DIRECTORY_CONTENT_ID = "directoryContent";
	const METADATA_CARD_ID = "metaCard";
	const METADATA_CONTENT_ID = "metaContent";

	// Map from folder name to radio element
	ns.folderRadioMap = {};

	/**
	 * Builds the folder list card
	 */
	ns.buildFolderList = function ()
	{
		const folderContentEl = document.getElementById(FOLDER_CONTENT_ID);

		Object.keys(ns.Data.Folders).forEach(folder =>
		{
			const inputLineEl = Common.DOMLib.createElement("div", folderContentEl, ["input-flex-line"]).el;

			const labelEl = Common.DOMLib.createElement("label", inputLineEl).el;
			labelEl.innerHTML = folder;

			const radioEl = Common.DOMLib.createElement("input", inputLineEl).el;
			Common.DOMLib.setAttributes(
				radioEl,
				{
					"type": "radio",
					"name": "folderList",
					"value": folder
				}
			);
			radioEl.addEventListener("change", Common.fcd(ns, openFolder, [folder]));

			labelEl.setAttribute("for", radioEl.id);

			ns.folderRadioMap[folder] = radioEl;
		});
	};

	/**
	 * Handles url parameters for the writing page
	 */
	ns.interperetUrlParams = function (params)
	{
		var folder = "";
		if (params.has(FOLDER_PARAM))
		{
			folder = params.get(FOLDER_PARAM);
			buildDirectory(folder);
			ns.folderRadioMap[folder].checked = true;
		}
		else
		{
			document.getElementById(DIRECTORY_CARD_ID).classList.add("hidden");
		}

		if (params.has(ENTRY_PARAM) && folder)
		{
			const entry = params.get(ENTRY_PARAM);
			openToEntry(folder, entry);
		}
		else
		{
			enterZeroState();
		}
	};

	/**
	 * Shows the zero state control
	 */
	function enterZeroState()
	{
		Common.DOMLib.addStyle(ns.entryFrame, { "display": "none" });
		Common.DOMLib.addStyle(ns.zsc, { "display": "block" });
		ns.entryHeader.innerHTML = "Entry";
		hideMetadata();
	}

	/**
	 * Hides the zero state control
	 */
	function exitZeroState()
	{
		Common.DOMLib.addStyle(ns.zsc, { "display": "none" });
		Common.DOMLib.addStyle(ns.entryFrame, { "display": "block" });
	}

	/**
	 * Opens the specified folder
	 */
	function openFolder(folder, event)
	{
		enterZeroState();
		buildDirectory(folder);
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
	function buildDirectory(folder)
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
				openToEntry,
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
			exitZeroState();

			if (event)
			{
				event.preventDefault();
				window.history.replaceState(null, "", `?${FOLDER_PARAM}=${ns.currentFolder}&${ENTRY_PARAM}=${entryId}`);
			}
		}
		else
		{
			window.history.replaceState(null, "", "Writing.html");
			enterZeroState();
			Common.Controls.Popups.showModal("Writing", `Entry not found: ${entry}`);
		}
	}

	/**
	 * Helper method to actually load writing content into the right pane
	 */
	function loadEntry(filename, directory, extension, title)
	{
		const page = directory + filename + extension;
		if (window.innerWidth <= Common.MINI_THRESHOLD)
		{
			if (window.innerWidth <= Common.MINI_THRESHOLD)
			{
				window.location.href = page;
				return;
			}
		}
		ns.entryFrame.setAttribute("src", page);
		ns.entryHeader.innerHTML = `<a href="${page}">${title}</a>`;
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
			)}</span>`;
		}
		else if (entry.dateString)
		{
			metaContent.innerHTML += `<br /><span>Date: ${entry.dateString}</span>`;
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
	});


	Pages.Writing.entryFrame = document.getElementById("entryFrame");
	Pages.Writing.entryHeader = document.getElementById("entryHeader");

	Pages.Writing.zsc = Common.Controls.ZeroState.embedZSC(document.getElementById("entryCard"), "Select an Entry");

	Pages.Writing.buildFolderList();

	Pages.Writing.interperetUrlParams(Common.getUrlParams());

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