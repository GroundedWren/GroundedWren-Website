/**
 * Namespace for Art.html
 */
registerNamespace("Pages.Art", function (ns)
{
	// Threshold to enter "mini" or mobile mode
	ns.MINI_THRESHOLD = 700;

	// All tracked artists
	ns.Artists = {};

	//#region Siting
	//The galery div
	ns.GalleryEl = null;

	// List of all frames which may be shown
	ns.ArtFrames = [];

	// Map from key to group
	ns.ArtGroupMap = {};
	// List of groups of frames
	ns.ArtGroups = [];

	/**
	 * Sites all frames which should be visible onto the page in groups
	 * @param getOrCreateGroup function which fetches the group element the frame should go under
	 */
	function siteFrames(getOrCreateGroup)
	{
		var shownFrameCount = 0;
		ns.ArtFrames.forEach((artFrame) =>
		{
			if (!artFrame.filtered)
			{
				var group = getOrCreateGroup(artFrame);
				__findInsertionPoint(group).after(artFrame.getElement());
				shownFrameCount++;
			}
		});
		shownFrameCount ? exitZeroState() : enterZeroState();
	};
	ns.siteFrames = siteFrames;

	/**
	 * Gets where to insert the next art frame in a group (at the end)
	 */
	function __findInsertionPoint(group)
	{
		var insPt = group;
		var keepLooking = true;
		while (keepLooking)
		{
			var nextEl = insPt.nextElementSibling;
			if (nextEl && nextEl.classList.contains("artframe"))
			{
				insPt = nextEl;
			}
			else { keepLooking = false; }
		}
		return insPt;
	}

	/**
	 * Sorts and sites frames onto the page
	 * @param sorter the type of sorting to do
	 */
	ns.sortBy = function (sorter)
	{
		for (const group of ns.ArtGroups)
		{
			group.remove();
		}
		ns.ArtGroups = [];
		ns.ArtGroupMap = {};

		var dce = Common.DOMLib.createElement;

		switch (sorter)
		{
			case "Character":
				siteFrames((artFrame) =>
				{
					var primaryChar = artFrame.getPrimaryCharacter();
					if (ns.ArtGroupMap[primaryChar]) { return ns.ArtGroupMap[primaryChar]; }
					const { el: divider } = dce("div", ns.GalleryEl, ["card", "divider"]);
					divider.innerText = primaryChar;
					ns.ArtGroupMap[primaryChar] = divider;
					ns.ArtGroups.push(divider);
					return divider;
				});
				ns.__lastSort = "Character";
				break;
			case "Artist":
				siteFrames((artFrame) =>
				{
					var primaryArtist = artFrame.getPrimaryArtist();
					if (ns.ArtGroupMap[primaryArtist]) { return ns.ArtGroupMap[primaryArtist]; }
					const { el: divider } = dce("div", ns.GalleryEl, ["card", "divider"]);
					divider.innerHTML = ns.Artists[primaryArtist].getLink();
					ns.ArtGroupMap[primaryArtist] = divider;
					ns.ArtGroups.push(divider);
					return divider;
				});
				ns.__lastSort = "Artist";
				break;
			case "Date":
				Pages.Art.ArtFrames.sort((a, b) => b.date - a.date);
				siteFrames((artFrame) =>
				{
					var date = artFrame.date.getUTCFullYear();
					if (ns.ArtGroupMap[date]) { return ns.ArtGroupMap[date]; }
					const { el: divider } = dce("div", ns.GalleryEl, ["card", "divider"]);
					divider.innerHTML = date;
					ns.ArtGroupMap[date] = divider;
					ns.ArtGroups.push(divider);
					return divider;
				});
				ns.__lastSort = "Date";
				break;
		}
	};
	// The option by which frames were last sorted
	ns.__lastSort = "Character";
	//#endregion

	//#region Filtering
	// Array of artists currently shown
	ns.shownArtists = [];
	// Array of characters currently shown
	ns.shownCharacters = [];
	// Whether to show explicit art
	ns.isExplicitAllowed = false;
	// Whether to pause re-siting frames as changes come in
	ns.pauseUpdates = false;

	// Flags to track whether all of a particular type is showing
	ns.showingAllChars = false;
	ns.showingAllArtists = false;

	/**
	 * Show all frames (clears all filters)
	 */
	ns.showAll = function ()
	{
		ns.pauseUpdates = true;
		setAllChildCheckboxes(document.getElementById("CharFilters"), true);
		setAllChildCheckboxes(document.getElementById("ArtistFilters"), true);
		ns.pauseUpdates = false;
		updateForFilters();

		ns.showingAllChars = true;
		ns.showingAllArtists = true;
	};
	/**
	 * Hides all frames (sets all filters)
	 */
	ns.hideAll = function ()
	{
		ns.pauseUpdates = true;
		setAllChildCheckboxes(document.getElementById("CharFilters"), false);
		setAllChildCheckboxes(document.getElementById("ArtistFilters"), false);
		ns.pauseUpdates = false;
		updateForFilters();

		ns.showingAllChars = false;
		ns.showingAllArtists = false;
	};

	/**
	 * Toggles explicit content on or off
	 */
	ns.showExplicit = function (enable)
	{
		if (enable)
		{
			Common.Controls.Popups.showModal(
				"Explicit content",
				`<h3>Are you sure?</h3>`
				+ `<p>To view explicit content you must be over 18 and legally allowed to view such material.</p>`
				+ `<button style="float: right; height: 25px; margin-left: 5px;" onclick="Pages.Art.__explicitModalAccepted()">`
				+ `I'm sure</button>`
				+ `<button style="float: right; height: 25px;" onclick="Pages.Art.__explicitModalRejected()">`
				+ `Never mind</button>`,
				undefined,
				() =>
				{
					if (!ns.isExplicitAllowed)
					{
						document.getElementById("ExplicitCB").checked = false;
					}
				}
			);
		}
		else
		{
			ns.isExplicitAllowed = false;
			updateForFilters();
		}
	};

	ns.__explicitModalAccepted = function ()
	{
		ns.isExplicitAllowed = true;
		updateForFilters();
		Common.Controls.Popups.hideModal();
	};
	ns.__explicitModalRejected = function ()
	{
		ns.isExplicitAllowed = false;
		updateForFilters();
		Common.Controls.Popups.hideModal();
	};

	/**
	 * Turn off all character filtering
	 */
	ns.showAllChars = function ()
	{
		ns.pauseUpdates = true;
		setAllChildCheckboxes(document.getElementById("CharFilters"), true);
		ns.pauseUpdates = false;
		updateForFilters();

		ns.showingAllChars = true;
	};
	/**
	 * Filter every character
	 */
	ns.hideAllChars = function ()
	{
		ns.pauseUpdates = true;
		setAllChildCheckboxes(document.getElementById("CharFilters"), false);
		ns.pauseUpdates = false;
		updateForFilters();

		ns.showingAllChars = false;
	};

	/**
	 * Turn off all artist filtering
	 */
	ns.showAllArtists = function ()
	{
		ns.pauseUpdates = true;
		setAllChildCheckboxes(document.getElementById("ArtistFilters"), true);
		ns.pauseUpdates = false;
		updateForFilters();

		ns.showingAllArtists = true;
	};
	/**
	 * Filter every artist
	 */
	ns.hideAllArtists = function ()
	{
		ns.pauseUpdates = true;
		setAllChildCheckboxes(document.getElementById("ArtistFilters"), false);
		ns.pauseUpdates = false;
		updateForFilters();

		ns.showingAllArtists = false;
	};

	/**
	 * Toggles every chexkbox which is a child of a particular element
	 * @element parent of checkboxes
	 * @checked whether the checkboxes will be checked
	 */
	function setAllChildCheckboxes(element, checked)
	{
		for (const child of element.children)
		{
			if (child.tagName
				&& child.tagName.toLowerCase() === "input"
				&& child.type.toLowerCase() === "checkbox"
			)
			{
				child.checked = checked;
				child.onchange({ target: { checked: checked } }); //Spoof event structure
			}
		}
	}

	/**
	 * Sets filtering for a particular character
	 */
	ns.setCharFilter = function (character, checked)
	{
		var idx = ns.shownCharacters.indexOf(character);
		if (idx >= 0 && !checked)
		{
			ns.shownCharacters.splice(idx, 1);
		}
		else if (idx < 0 && checked)
		{
			ns.shownCharacters.push(character);
		}

		if (!ns.pauseUpdates)
		{
			updateForFilters();
			ns.showingAllChars = false;
		}

	};
	/**
	 * Sets filtering for a particular artist
	 */
	ns.togArtistFilter = function (artist, checked)
	{
		var idx = ns.shownArtists.indexOf(artist);
		if (idx >= 0 && !checked)
		{
			ns.shownArtists.splice(idx, 1);
		}
		else if (idx < 0 && checked)
		{
			ns.shownArtists.push(artist);
		}

		if (!ns.pauseUpdates)
		{
			updateForFilters();
			ns.showingAllArtists = false;
		};
	};

	/**
	 * Updates the filtered status of all frames and re-sites them according to the last sort
	 */
	function updateForFilters()
	{
		ns.ArtFrames.forEach(frame => frame.setFiltered(!frame.passesFilters()));
		ns.sortBy(ns.__lastSort);
		window.history.replaceState(null, "", "Art.html");
	};
	//#endregion

	//#region Frames
	class ArtFrameCard extends ns.Data.ArtFrame
	{
		//#region fields
		// Outermost element id
		frameId;
		// Whether the frame is currently filtered out
		filtered;
		//#endregion

		/**
		 * Creates an art frame for display
		 * @param title The display title of the work
		 * @param artLink A link to the art file
		 * @param characters An array of characters depicted
		 * @param artists An array of artist names who contributed to the work
		 * @param date A date object of when the art was produced
		 * @param isExplicit Whehter the art is explicit
		 */
		constructor(title, artLink, characters, artists, date, description, isExplicit)
		{
			super(
				title,
				artLink,
				characters,
				artists,
				date,
				description,
				isExplicit,
				(artistId) => ns.Artists[artistId].getLink()
			);
			this.frameId = null;
			this.filtered = false;
		}

		/**
		 * Whether the frame should be filtered by the current namespace filtering
		 */
		passesFilters()
		{
			return (!this.__isExplicit || ns.isExplicitAllowed)
				&& this.characters.some(character => ns.shownCharacters.includes(character))
				&& this.artists.some(artist => ns.shownArtists.includes(artist));
		}

		/**
		 * Toggles whether the frame is filtered
		 */
		setFiltered(value)
		{
			var frame = document.getElementById(this.frameId);
			if (value)
			{
				if (frame) { Common.DOMLib.addStyle(frame, { display: "none" }); };
			}
			else
			{
				if (frame) { Common.DOMLib.addStyle(frame, { display: null }); };
			}
			this.filtered = value;
		}

		/**
		 * Gets or creates the representation of this art frame in the UI
		 */
		getElement()
		{
			if (this.frameId)
			{
				return document.getElementById(this.frameId);
			}
			else
			{
				return this.render();
			}
		}

		/**
		 * Gets the character this frame should be grouped with
		 */
		getPrimaryCharacter()
		{
			var unfilteredChara = this.characters.filter(chara => ns.shownCharacters.includes(chara));
			return unfilteredChara.length ? unfilteredChara[0] : this.characters[0];
		}
		/**
		 * Gets the artist this frame should be grouped with
		 */
		getPrimaryArtist()
		{
			var unfilteredArtists = this.artists.filter(artist => ns.shownArtists.includes(artist));
			return unfilteredArtists.length ? unfilteredArtists[0] : this.artists[0];
		}

		/**
		 * Creates the frame's DOM elements
		 */
		render()
		{
			var dce = Common.DOMLib.createElement;

			const { el: frame, id: id } = dce("div", null, ["card", "artframe"]);
			this.frameId = id;

			dce("div", frame, ["frameBuffer"]);

			const { el: image } = dce("img", frame);
			image.setAttribute("src", this.__artLink);

			frame.onclick = (event) =>
			{
				if (event.target.tagName.toLowerCase() === 'a') { return; }

				const artLocation = `/pages/ArtFrame.html?art=${encodeURIComponent(this.__title)}`;
				if (window.innerWidth <= Common.MINI_THRESHOLD)
				{
					window.location.href = artLocation;
					return;
				}

				Common.DOMLib.addStyle(image, { display: "block", "margin-left": "auto", "margin-right": "auto", "height": "100%" });
				Common.Controls.Popups.showModal(
					`<a href="${artLocation}" target="_blank">${this.__title}</a>`,
					`<iframe src="/pages/ArtFrame.html?art=${encodeURIComponent(this.__title)}&inFrame=true">`,
					{
						width: "80%",
						height: "95%",
						overflow: "hidden"
					},
					() =>
					{
						Common.DOMLib.addStyle(image, { "height": null });
					}
				);
			};

			dce("div", frame, ["frameBuffer"]);

			const { el: meta } = dce("div", frame, ["imgMeta"]);
			this.buildMetaTable(meta);

			return frame;
		}
	}
	ns.ArtFrameCard = ArtFrameCard;

	// All art frames
	ns.ArtFrames = [];

	/**
	 * Initialize art frames from data
	 */
	ns.initializeFrames = function initializeFrames()
	{
		Object.keys(ns.Data.ArtFrames).forEach(artTitle =>
		{
			const artObj = ns.Data.ArtFrames[artTitle];
			ns.ArtFrames.push(new ArtFrameCard(
				artTitle,
				artObj.src,
				artObj.characters,
				artObj.artists,
				artObj.date,
				artObj.description,
				artObj.isExplicit)
			);
		});
	};

	//#endregion
	//#region Zero State
	ns.ZeroStateControl = null;
	function enterZeroState()
	{
		Common.DOMLib.addStyle(ns.ZeroStateControl, { "display": "block" });
	}
	ns.enterZeroState = enterZeroState;

	function exitZeroState()
	{
		Common.DOMLib.addStyle(ns.ZeroStateControl, { "display": "none" });
	}
	ns.exitZeroState = exitZeroState;
	//#endregion

	//#region URL Params
	ns.UrlParams = {
		"sort": {
			"character": "CharaRad",
			"artist": "ArtistRad",
			"date": "DateRad",
		},
		"charFilt": {
			"Vera": "VeraCB",
			"Eryn": "ErynCB",
			"Freya": "FreyaCB",
			"Sindri": "SindriCB",
			"Ghodukk": "GhodukkCB",
			"Jack": "JackCB",
			"Lightsong": "LightsongCB",
			"Percy": "PercyCB",
			"Serin": "SerinCB",
			"Nocturna": "NocturnaCB",
		},
		"artistFilt": {
			"Bastien Aufrere": "BACB",
			"Berenice Borggrefe": "BerBorCB",
			"Chelsea-Rhi": "ChelseaRhiCB",
			"Bonnie Guerra": "BonnieCB",
			"Despey": "DespeyCB",
			"JesterDK": "JestCB",
			"Raiyk": "RaiykCB",
			"ShrimpLoverCat": "SLCCB",
			"Vera": "VeraArtCB",
		},
		"showAll": {
			"char": "CharFilters",
			"artist": "ArtistFilters",
		},
		"hide": {
			"leftPane": "leftPane",
			"banner": "Banner",
			"bannerBuffer": "BannerBuffer",
		}
	};
	ns.interperetUrlParams = function (params)
	{
		ns.pauseUpdates = true;

		var charFilts = params.getAll("charFilt");
		var artistFilts = params.getAll("artistFilt");

		var charIds = charFilts.map(filt => ns.UrlParams.charFilt[filt]);
		var artistIds = artistFilts.map(filt => ns.UrlParams.artistFilt[filt]);
		charIds.concat(artistIds).forEach(elId =>
		{
			var cbEl = document.getElementById(elId);
			if (cbEl.tagName
				&& cbEl.tagName.toLowerCase() === "input"
				&& cbEl.type.toLowerCase() === "checkbox"
			)
			{
				cbEl.checked = true;
				cbEl.onchange({ target: { checked: true } }); //Spoof event structure
			}
		});

		var showAllIds = params.getAll("showAll").map(filt => ns.UrlParams.showAll[filt]);
		showAllIds.forEach(parentId =>
		{
			setAllChildCheckboxes(document.getElementById(parentId), true);
		});

		ns.pauseUpdates = false;

		ns.ArtFrames.forEach(frame => frame.setFiltered(!frame.passesFilters()));

		var sortEl = document.getElementById(ns.UrlParams.sort[params.get("sort")]);
		if (sortEl)
		{
			sortEl.checked = true;
			sortEl.onchange();
		}
		else
		{
			ns.sortBy("Character");
		}

		var hiddenItms = params.getAll("hide");
		var hideIds = hiddenItms.map(hiddenItm => ns.UrlParams.hide[hiddenItm]);
		hideIds.forEach(elId =>
		{
			Common.DOMLib.addStyle(document.getElementById(elId), { "display": "none" });
		});

		if (hideIds.indexOf("leftPane") >= 0)
		{
			rightPane.classList.remove("mini-hide");
			Common.DOMLib.addStyle(document.getElementById("divVert"), { "display": "none" });
			Common.DOMLib.addStyle(document.getElementById("leftPaneCollapseBtn"), { "display": "none" });
		}
	};

	ns.onLinkRequested = function ()
	{
		const params = [];

		const charParams = ns.showingAllChars
			? "showAll=char"
			: ns.shownCharacters.map(char => `charFilt=${encodeURIComponent(char)}`).join("&");
		if (charParams) { params.push(charParams); }

		const artistParams = ns.showingAllArtists
			? "showAll=artist"
			: ns.shownArtists.map(artist => `artistFilt=${encodeURIComponent(artist)}`).join("&");
		if (artistParams) { params.push(artistParams); }

		const sortParam = `sort=${encodeURIComponent(ns.__lastSort.toLowerCase())}`;
		if (sortParam) { params.push(sortParam); }

		const link = `GroundedWren.com/pages/Art.html?${params.join("&")}`;

		navigator.clipboard.writeText(link);

		Common.Controls.Popups.showModal("Art Gallery",`Link Copied!<br>${link}`);
	}
	//#endregion
});

/**
 * Code to be called when the window first loads
 */
window.onload = () =>
{
	Pages.Art.Data.InitializeArtists(Pages.Art, "Artists");
	Pages.Art.initializeFrames();

	Pages.Art.GalleryEl = document.getElementById("gallery");

	Pages.Art.ZeroStateControl = Common.Controls.ZeroState.embedZSC(
		document.getElementById("rightPane"),
		"Nothing to Show - Modify Filters"
	);
	Pages.Art.enterZeroState();

	Pages.Art.ArtFrames.sort((a, b) => b.date - a.date);
	Pages.Art.interperetUrlParams(Common.getUrlParams());

	const visTogButton = document.getElementById("leftPaneCollapseBtn");
	const visTogChevron = document.getElementById("leftPaneCollapseChevron");
	const rightPane = document.getElementById("rightPane");
	Common.Components.RegisterVisToggle(
		visTogButton,
		[
			document.getElementById("leftPane"),
		],
		(visible) =>
		{
			visTogChevron.classList.remove(visible ? "right" : "left");
			visTogChevron.classList.add(visible ? "left" : "right");

			if (visible)
			{
				rightPane.classList.add("mini-hide");
			}
			else
			{
				rightPane.classList.remove("mini-hide");
			}
		}
	);
};