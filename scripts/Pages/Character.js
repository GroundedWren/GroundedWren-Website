/**
 * Namespace for Character.html
 */
registerNamespace("Pages.Character", function (ns)
{
	const CHARACTER_PARAM = "char";
	ns.CHARACTER_PARAM = CHARACTER_PARAM;

	//Page control for character information
	ns.infoControl = null;

	/**
	 * Loads a character's information onto the page
	 */
	function loadCharacter(characterKey)
	{
		const character = ns.Characters[characterKey];
		if (!character) { return; }

		buildLeftPane(character);

		ns.infoControl = Common.Controls.PageControl.buildPageControl(
			document.getElementById("RightPane"),
			"Select a Tab"
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
		}
		else
		{
			document.getElementById("ProfilePicture").remove();
		}

		document.getElementById("tdName").innerText = character.name;
		document.getElementById("tdPronouns").innerText = character.pronouns;
		document.getElementById("tdGender").innerText = character.gender;
		document.getElementById("tdOrientation").innerText = character.orientation;

		document.getElementById("tdSpecies").innerText = character.species;
		document.getElementById("tdSex").innerText = character.sex;
		document.getElementById("tdAge").innerText = character.age;
		document.getElementById("tdHeight").innerText = character.height;

		document.getElementById("tdCreatedBy").innerText = character.createdBy;
		document.getElementById("tdCreatedDate").innerText = character.createdDate.toLocaleDateString(
			undefined,
			{ weekday: undefined, year: "numeric", month: "short" }
		);
		document.getElementById("tdStatus").innerText = character.status;
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
		if (Pages.Character.Characters[character])
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
};