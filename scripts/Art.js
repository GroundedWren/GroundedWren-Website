﻿/**
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
					const divider = dce(
						"div",
						ns.GalleryEl,
						{
							"role": "heading",
							"aria-level": "2",
						},
						["card", "divider"],
						primaryChar
					);
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
					const divider = dce(
						"div",
						ns.GalleryEl,
						{
							"role": "heading",
							"aria-level": "2",
						},
						["card", "divider"],
						ns.Artists[primaryArtist].getLink()
					);
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
					const divider = dce(
						"div",
						ns.GalleryEl,
						{
							"role": "heading",
							"aria-level": "2",
						},
						["card", "divider"],
						date
					);
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
	ns.NUM_ARTISTS = 9;
	ns.shownArtists = [];
	// Array of characters currently shown
	ns.NUM_CHARS = 10;
	ns.shownCharacters = [];
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

		setFilterAllStatuses({ characters: true, artists: true });
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

		setFilterAllStatuses({ characters: false, artists: false });
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

		setFilterAllStatuses({ characters: true });
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

		setFilterAllStatuses({ characters: false });
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

		setFilterAllStatuses({ artists: true });
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

		setFilterAllStatuses({ artists: false });
	};

	function setFilterAllStatuses(filterStatuses)
	{
		if (filterStatuses.characters === true)
		{
			ns.showingAllChars = true;
			document.getElementById("showAllCharsBtn").setAttribute("aria-pressed", "true");
		}
		else if (filterStatuses.characters === false)
		{
			ns.showingAllChars = false;
			document.getElementById("showAllCharsBtn").setAttribute("aria-pressed", "false");
		}

		if (filterStatuses.artists === true)
		{
			ns.showingAllArtists = true;
			document.getElementById("showAllArtistsBtn").setAttribute("aria-pressed", "true");
		}
		else if (filterStatuses.artists === false)
		{
			ns.showingAllArtists = false;
			document.getElementById("showAllArtistsBtn").setAttribute("aria-pressed", "false");
		}

		document.getElementById("showAllBtn").setAttribute(
			"aria-pressed",
			(ns.showingAllChars && ns.showingAllArtists) ? "true" : "false"
		);

		document.getElementById("hideAllBtn").setAttribute(
			"aria-pressed",
			(ns.shownCharacters.length === 0 && ns.shownArtists.length === 0) ? "true" : "false"
		);
		document.getElementById("hideAllCharsBtn").setAttribute(
			"aria-pressed",
			ns.shownCharacters.length === 0 ? "true" : "false"
		);
		document.getElementById("hideAllArtistsBtn").setAttribute(
			"aria-pressed",
			ns.shownArtists.length === 0 ? "true" : "false"
		);
	}

	/**
	 * Toggles every chexkbox which is a child of a particular element
	 * @element parent of checkboxes
	 * @checked whether the checkboxes will be checked
	 */
	function setAllChildCheckboxes(element, checked)
	{
		for (const child of element.children)
		{
			if (element.children)
			{
				/**
				 * Yeah I know.
				 * TODO
				 */
				setAllChildCheckboxes(child, checked);
			}
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
			if (ns.NUM_CHARS === ns.shownCharacters.length)
			{
				setFilterAllStatuses({ characters: true });
			}
			else
			{
				setFilterAllStatuses({ characters: false });
			}
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
			if (ns.NUM_ARTISTS === ns.shownArtists.length)
			{
				setFilterAllStatuses({ artists: true });
			}
			else
			{
				setFilterAllStatuses({ artists: false });
			}
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

	ns.buildFilters = function ()
	{
		buildArtistFilters();
		buildCharFilters();
	};

	function buildArtistFilters()
	{
		const charTogglesEl = document.getElementById("charToggles");

		let categoryNum = 0;
		Object.keys(ns.Data.CharacterCategories).forEach(categoryName =>
		{
			categoryNum++;

			charTogglesEl.insertAdjacentHTML("beforeend", `
			<h4 id="charCategory${categoryNum}">${categoryName}</h4>
			<fieldset
				id="charFieldset${categoryNum}"
				class="transparent-fieldset input-flex"
				aria-labelledby="charCategory${categoryNum}"
			></fieldset>
			`);

			const fieldsetEl = document.getElementById(`charFieldset${categoryNum}`);
			ns.Data.CharacterCategories[categoryName].forEach(characterName =>
			{
				fieldsetEl.insertAdjacentHTML("beforeend", `
				<div class="input-flex-line">
					<label for="${characterName}charCB">${characterName}</label>
					<input id="${characterName}charCB"
							type="checkbox"
							onchange="Pages.Art.setCharFilter('${characterName}', arguments[0].target.checked)"
					/>
				</div>
				`);
				ns.UrlParams.charFilt[characterName] = `${characterName}charCB`;
			});
		});
	}

	function buildCharFilters()
	{
		const artistTogglesEl = document.getElementById("artistToggles");

		Object.keys(ns.Data.Artists).forEach(artistName =>
		{
			artistTogglesEl.insertAdjacentHTML("afterbegin", `
			<div class="input-flex-line">
				<label for="${artistName}artistCB">${artistName}</label>
				<input id="${artistName}artistCB"
						type="checkbox"
						onchange="Pages.Art.togArtistFilter('${artistName}', arguments[0].target.checked)"
				/>
			</div>
			`);
			ns.UrlParams.artistFilt[artistName] = `${artistName}artistCB`;
		});
	}
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
		 * @param description A description of the work
		 * @param altText Alt text for the image
		 * @param isExplicit Whehter the art is explicit
		 */
		constructor(title, artLink, characters, artists, date, description, altText, isExplicit)
		{
			super(
				title,
				artLink,
				characters,
				artists,
				date,
				description,
				altText,
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
			return this.characters.some(character => ns.shownCharacters.includes(character))
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

			const frame = dce("div", undefined, undefined, ["card", "artframe"]);
			this.frameId = frame.id;

			dce("div", frame, undefined, ["frameBuffer"]);

			var srHeader = dce("h3", frame, undefined, ["sr-only"]);
			srHeader.innerHTML = this.__title;

			const image = dce("img", frame, {"src": this.__artLink, "aria-label": this.altText});

			var frameClickDelegate =(event) =>
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
					`<a href="${artLocation}" target="_blank" class="heading-text">${this.__title}</a>`,
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
			Common.DOMLib.setAttributes(
				frame,
				{
					"role": "none",
					"aria-label": ("Art frame for " + this.__title + ", press enter to expand")
				}
			);
			frame.setAttribute("role", "none");
			Common.DOMLib.setAsButton(frame, frameClickDelegate);

			dce("div", frame, undefined, ["frameBuffer"]);

			const meta = dce("div", frame, undefined, ["imgMeta"]);
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
				artObj.altText,
				artObj.isExplicit
			));
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
		},
		"artistFilt": {
		},
		"showAll": {
			"char": "CharFilters",
			"artist": "ArtistFilters",
		},
		"hide": {
			"leftPane": "leftPane",
			"banner": "Banner",
			"bannerBuffer": "BannerBuffer",
		},
		"disable": {
			"shortcuts": "shortcuts"
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

		var disabledItms = params.getAll("disable");
		if (disabledItms.indexOf("shortcuts") >= 0)
		{
			Common.Components.clearShortcuts();
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
		"ALT+A": {
			action: () =>
			{
				for (var i = 0; i < Pages.Art.ArtFrames.length; i++)
				{
					var frame = Pages.Art.ArtFrames[i];
					if (!frame.filtered)
					{
						document.getElementById(frame.frameId).focus();
						return;
					}
				}
			},
			description: "Focus the first artwork"
		},
		"ALT+ArrowUp": {
			action: () =>
			{
				window.scrollTo(0, 0);
			},
			description: "Jump to the top of the page"
		},
	});

	Pages.Art.Data.InitializeArtists(Pages.Art, "Artists");
	Pages.Art.initializeFrames();

	Pages.Art.GalleryEl = document.getElementById("gallery");

	Pages.Art.ZeroStateControl = Common.Controls.ZeroState.embedZSC(
		document.getElementById("rightPane"),
		"Nothing to Show - Modify Filters"
	);
	Pages.Art.enterZeroState();

	Pages.Art.ArtFrames.sort((a, b) => b.date - a.date);

	Pages.Art.buildFilters();

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

	var charTogChev = document.getElementById("chevViewCharacters");
	Common.Components.RegisterVisToggle(
		charTogChev,
		[
			document.getElementById("charToggles"),
		],
		(visible) =>
		{
			if (visible)
			{
				charTogChev.classList.remove("bottom");
			}
			else
			{
				charTogChev.classList.add("bottom");
			}

			charTogChev.focus();
		}
	);

	var artTogChev = document.getElementById("chevViewArtists");
	Common.Components.RegisterVisToggle(
		artTogChev,
		[
			document.getElementById("artistToggles"),
		],
		(visible) =>
		{
			if (visible)
			{
				artTogChev.classList.remove("bottom");
			}
			else
			{
				artTogChev.classList.add("bottom");
			}

			artTogChev.focus();
		}
	);
};