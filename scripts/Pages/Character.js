/**
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
			document.getElementById("sexTooltip").innerHTML += character.sexInfo;

			document.getElementById("tdSexSR").innerHTML += character.sex + ": " + character.sexInfo;
			tdSex.setAttribute("aria-hidden", "true");
		}
		else
		{
			document.getElementById("sexTooltip").remove();
			tdSex.classList.remove("tooltip-target");
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
			Common.DOMLib.createElement("td", tRow, ["row-label"]).el.innerText = label;

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
			ns.infoControl.addNewTab("Appearance", getBasicDiv(character.appearanceDetails));
		}
		if (character.personality)
		{
			ns.infoControl.addNewTab("Personality", getBasicDiv(character.personality));
		}
		if (character.backstory)
		{
			ns.infoControl.addNewTab("Backstory", getBasicDiv(character.backstory));
		}
		if (character.galleryLink)
		{
			var galleryContainerEl = Common.DOMLib.createElement("div").el;
			Common.DOMLib.addStyle(galleryContainerEl, { height: "100%", width: "100%", overflow: "hidden" });
			var galleryTabId = ns.infoControl.addNewTab("Gallery", galleryContainerEl);
			ns.infoControl.addOnActivate(galleryTabId, Common.fcd(ns, buildGalleryPage, [character, galleryContainerEl]));
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
		Common.DOMLib.addStyle(el, { "margin-left": "10px", "margin-right": "10px" })
		return el;
	}

	function getIFrameDiv(link)
	{
		var el = Common.DOMLib.createElement("iframe").el;
		el.src = link;
		Common.DOMLib.addStyle(el, { width: "100%", height: "100%", border: "0" });
		return el;
	}
});

/**
 * Code to be called when the window first loads
 */
window.onload = () =>
{
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
};