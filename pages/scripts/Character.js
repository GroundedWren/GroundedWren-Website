﻿/**
 * Namespace for Character.html
 */
registerNamespace("Pages.Character", function (ns)
{
	const CHARACTER_PARAM = "char";
	ns.CHARACTER_PARAM = CHARACTER_PARAM;

	// Threshold to enter "mini" or mobile mode
	ns.MINI_THRESHOLD = 750;

	//Page control for character information
	ns.infoControl = null;

	/**
	 * Loads a character's information onto the page
	 */
	function loadCharacter(characterKey)
	{
		const character = ns.Data.Characters[characterKey];
		if (!character) { return; }

		buildLeftPane(character);

		ns.infoControl = Common.Controls.PageControl.buildPageControl(
			document.getElementById("RightPane"),
			"Select a Tab",
			"Character documents"
		);
		Common.DOMLib.addStyle(ns.infoControl.controlEl, { height: "100%" });
		addRightPaneTabs(character);
	}
	ns.loadCharacter = loadCharacter;

	function buildLeftPane(character)
	{
		if (character.profileSrc)
		{
			document.getElementById("ProfilePicture").src = character.profileSrc;
			document.getElementById("ProfilePicture").alt = character.profileAlt;
		}
		else
		{
			document.getElementById("ProfilePicture").remove();
		}

		document.getElementById("tdName").innerHTML += character.name;
		document.getElementById("tdPronouns").innerHTML += character.pronouns;
		document.getElementById("tdGender").innerHTML += character.gender;
		document.getElementById("tdOrientation").innerHTML += character.orientation;

		document.getElementById("tdSpecies").innerText = character.species;
		const tdSex = document.getElementById("tdSex");
		tdSex.innerHTML += character.sex;
		if (character.sexInfo)
		{
			//document.getElementById("sexTooltip").innerHTML += character.sexInfo;
			const sexChevronEl = Common.DOMLib.createElement(
				"span",
				tdSex,
				["chevron", "bottom", "td-chevron"]
			).el;
			Common.DOMLib.setAttributes(sexChevronEl, {
				tabindex: 0,
				"aria-label": "Show additional sex information"
			});
			sexChevronEl.setAttribute("tabindex", 0);

			const sexInfoEl = Common.DOMLib.createElement("div", tdSex).el;
			Common.DOMLib.addStyle(sexInfoEl, { display: "none" });
			sexInfoEl.innerHTML += character.sexInfo;

			Common.Components.RegisterVisToggle(
				sexChevronEl,
				[
					sexInfoEl,
				],
				(visible, event) =>
				{
					if (visible)
					{
						sexChevronEl.classList.remove("bottom");
					}
					else
					{
						sexChevronEl.classList.add("bottom");
					}
					event.stopPropagation();
				},
				false,
				[tdSex]
			);
		}
		document.getElementById("tdAge").innerHTML += character.age;
		document.getElementById("tdHeight").innerHTML += character.height;

		var colorTable = document.getElementById("Colors");
		if (character.colors)
		{
			createColorTable(character.colors, colorTable);
		}

		document.getElementById("tdCreatedBy").innerText = character.createdBy;
		document.getElementById("tdCreatedDate").innerText = character.createdDate.toLocaleDateString(
			undefined,
			{ weekday: undefined, year: "numeric", month: "short" }
		);
		document.getElementById("tdStatus").innerText = character.status;
	}

	function createColorTable(colors, table)
	{
		var tbody = Common.DOMLib.createElement("tbody", table).el;
		Object.keys(colors).forEach(label =>
		{
			var tRow = Common.DOMLib.createElement("tr", tbody).el;
			var thLabel = Common.DOMLib.createElement("th", tRow, []).el
			thLabel.setAttribute("scope", "row")
			thLabel.innerText = label;

			var svg = Common.SVGLib.createChildElement(
				Common.DOMLib.createElement("td", tRow, ["color-cell"]).el,
				Common.SVGLib.ElementTypes.svg,
				{
					"width": "100%",
					"height": "100%"
				}
			);
			Common.SVGLib.createChildElement(
				svg,
				Common.SVGLib.ElementTypes.rect,
				{
					"x": "0",
					"y": "0",
					"width": "100%",
					"height": "100%",
					"fill": colors[label]
				}
			);
			Common.SVGLib.createChildElement(
				svg,
				Common.SVGLib.ElementTypes.text,
				{
					"x": "50%",
					"y": "50%",
					"dominant-baseline": "middle",
					"text-anchor": "middle",
					"font-size": "14",
					"fill": Common.getContrastingBorW(colors[label])
				},
				colors[label]
			);
		});
	}

	function addRightPaneTabs(character)
	{
		if (character.appearanceDetails)
		{
			var tabId = ns.infoControl.addNewTab("<u>A</u>ppearance", getBasicDiv(character.appearanceDetails));
			Common.Components.registerShortcuts({
				"ALT+A": {
					action: Common.fcd(this, function(tabId)
					{
						ns.infoControl.setActiveTab(tabId);
						document.getElementById(tabId).focus();
					}, [tabId]),
					description: "Open appearance information"
				}
			});
		}
		if (character.personality)
		{
			var tabId = ns.infoControl.addNewTab("<u>P</u>ersonality", getBasicDiv(character.personality));
			Common.Components.registerShortcuts({
				"ALT+P": {
					action: Common.fcd(this, function (tabId)
					{
						ns.infoControl.setActiveTab(tabId);
						document.getElementById(tabId).focus();
					}, [tabId]),
					description: "Open personality information"
				}
			});
		}
		if (character.backstory)
		{
			var tabId = ns.infoControl.addNewTab("<u>B</u>ackstory", getBasicDiv(character.backstory));
			Common.Components.registerShortcuts({
				"ALT+B": {
					action: Common.fcd(this, function (tabId)
					{
						ns.infoControl.setActiveTab(tabId);
						document.getElementById(tabId).focus();
					}, [tabId]),
					description: "Open backstory information"
				}
			});
		}
		if (character.galleryLink)
		{
			var galleryContainerEl = Common.DOMLib.createElement("div").el;
			Common.DOMLib.addStyle(
				galleryContainerEl,
				{ height: "100%", width: "100%", overflow: "hidden" }
			);
			var galleryTabId = ns.infoControl.addNewTab("<u>G</u>allery", galleryContainerEl);
			ns.infoControl.addOnActivate(
				galleryTabId,
				Common.fcd(ns, buildGalleryPage, [character, galleryContainerEl])
			);

			Common.Components.registerShortcuts({
				"ALT+G": {
					action: Common.fcd(this, function (tabId)
					{
						ns.infoControl.setActiveTab(tabId);
						document.getElementById(tabId).focus();
					}, [galleryTabId]),
					description: "Open character art gallery"
				}
			});
		}
	}

	var galleryPageBuilt = false;
	function buildGalleryPage(character, container)
	{
		if (galleryPageBuilt) { return; }

		var iframeDiv = getIFrameDiv(character.galleryLink);
		container.appendChild(iframeDiv);

		galleryPageBuilt = true;
	}

	function getBasicDiv(innerHTML)
	{
		var el = Common.DOMLib.createElement("div").el;
		el.innerHTML = innerHTML;
		Common.DOMLib.addStyle(el, { "padding-left": "10px", "padding-right": "10px" })
		return el;
	}

	function getIFrameDiv(link)
	{
		var el = Common.DOMLib.createElement("iframe").el;
		el.src = link;
		Common.DOMLib.addStyle(el, { width: "100%", height: "100%", border: "0" });
		return el;
	}

	ns.resizeListener = () =>
	{
		if (window.innerWidth > Pages.Character.MINI_THRESHOLD)
		{
			Common.Components.GetVisToggle("leftPaneCollapseBtn").doToggle(true);
		}
	};
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

	const params = Common.getUrlParams();
	if (params.has(Pages.Character.CHARACTER_PARAM))
	{
		const character = params.get(Pages.Character.CHARACTER_PARAM);
		if (Pages.Character.Data.Characters[character])
		{
			Pages.Character.loadCharacter(character);
		}
		else
		{
			window.history.replaceState(null, "", "Character.html");
			Common.Controls.Popups.showModal(
				"Character",
				`Character not found: ${character}`,
				undefined,
				() => { window.location.href = "/index.html"}
			);
		}
	}

	const visTogButton = document.getElementById("leftPaneCollapseBtn");
	const visTogChevron = document.getElementById("leftPaneCollapseChevron");
	const rightPane = document.getElementById("RightPane");
	Common.Components.RegisterVisToggle(
		visTogButton,
		[
			document.getElementById("LeftPane"),
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
	window.addEventListener("resize", Pages.Character.resizeListener);
};