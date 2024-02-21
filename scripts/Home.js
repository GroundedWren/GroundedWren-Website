/**
 * Namespace for Home.html
 */
registerNamespace("Pages.Home", function (ns)
{
	// Threshold to enter "mini" or mobile mode
	ns.MINI_THRESHOLD = 755;

	ns.directoryMenu = null;

	ns.resizeListener = () =>
	{
		var directoryContainer = document.getElementById("Directory");
		var directoryStyles = getComputedStyle(directoryContainer);
		if (directoryStyles.getPropertyValue("--gw-sized-down") == 1)
		{
			directoryContainer.classList.add("mini");
			ns.directoryMenu.setOrientation(Common.Controls.DropdownMenu.Orientations.vertical);
		}
		else
		{
			directoryContainer.classList.remove("mini");
			ns.directoryMenu.setOrientation(Common.Controls.DropdownMenu.Orientations.horizontal);
		}
	};

	ns.onUpdateVisToggled = (visible, event) =>
	{
		const updateChevron = document.getElementById("updateChevron");

		if (visible)
		{
			updateChevron.classList.remove("bottom");
			document.getElementById("updateContent").focus();
		}
		else
		{
			updateChevron.classList.add("bottom");
		}
		event.stopPropagation();
	};

	ns.onButtonsVisToggled = (visible, event) =>
	{
		const buttonsChevron = document.getElementById("buttonsChevron");

		if (visible)
		{
			buttonsChevron.classList.remove("bottom");
		}
		else
		{
			buttonsChevron.classList.add("bottom");
		}
		event.stopPropagation();
	};

	ns.displayA11yStatement = () =>
	{
		Common.Controls.Popups.showModal(
			"Accessibility Statement",
			`<p>Web content accessibility has been a recent focus of mine as it relates to my job and as a general skill I’m working to develop for its own sake because accessible content is better content. As such, this site strives to meet the <a href="https://www.w3.org/TR/WCAG21/" target="_blank">Web Content Accessibility Guidelines 2.1</a> as published by the World Wide Web Consortium at levels A and AA. If you notice any violations, please let me know; my contact info lives on my <a href="./AboutMe.html" target="_blank">About Me</a> page.</p>`
			+ `<p>In the interest of transparency, I test nonvisual operability using <a href="https://www.nvaccess.org/" target=”blank”>NVDA</a> with Chrome and using <a href="https://support.google.com/accessibility/android/answer/6283677?hl=en" target="blank">TalkBack</a> on Android. If you use a different combination of technologies to access this site, you are more likely to find issues.</p>`
			+ `<p>If you have any feedback about GroundedWren.com, especially if you use a screen reader, I want to hear from you!</p>`
		);
	};

	ns.addEmail = (event) =>
	{
		event.preventDefault();

		const name = document.getElementById("emailListForm_name").value;
		const email = document.getElementById("emailListForm_email").value;

		const request = new XMLHttpRequest();
		request.open(
			"POST",
			"https://discord.com/api/webhooks/1161152577631694898/J74qDB0Jno2UU46CpGo4nM8WIMBRegr-gRRPF1m2zeLpzl2d6xrZyrydarisFup67SHn"
		);
		request.setRequestHeader("Content-Type", "application/json");

		request.send(JSON.stringify({ content: `NAME=${name};EMAIL=${email}` }));

		document.getElementById("emailListForm").reset();
		alert("Email submitted!")
	};

	ns.populateThoughts = (sheetData) =>
	{
		const thoughtsList = document.getElementById("thoughtsList");

		for (let i = sheetData.rows.length - 1; i >= Math.max(sheetData.rows.length - 10, 0); i--)
		{
			const rowData = Common.GSheetsLib.fetchRow(i, sheetData);

			const thoughtItem = Common.DOMLib.createElement("li",thoughtsList);
			const thoughtArticle = Common.DOMLib.createElement("article", thoughtItem);

			Common.DOMLib.createElement(
				"span",
				thoughtArticle,
				undefined,
				["thought-preamble"],
				`Vera, feeling <strong>${rowData.Mood}</strong>, says:`
			);
			Common.DOMLib.createElement(
				"span",
				thoughtArticle,
				undefined,
				["thought-content"],
				`"${rowData.Message}"`
			);
			if (rowData.LocalTimestamp)
			{
				const timeString = rowData.LocalTimestamp.toLocaleString(
					undefined,
					{ dateStyle: "short", timeStyle: "short" }
				);
				Common.DOMLib.createElement(
					"footer",
					thoughtArticle,
					undefined,
					undefined,
					`at <time datetime=${rowData.LocalTimestamp.toISOString()}>${timeString}</time>`
				);
			}
		}
	};
});

/**
 * Code to be called when the window first loads
 */
window.onload = () =>
{
	Common.loadTheme();
	Common.loadTheme();
	Common.setUpAccessibility();
	Common.SVGLib.insertIcons();

	var directoryContainer = document.getElementById("Directory");
	Pages.Home.directoryMenu = Common.Controls.DropdownMenu.buildDropdownMenu(
		directoryContainer,
		{
			"Art Gallery": {
				linkHref: "./Art.html",
			},
			"Characters": {
				childActionMap: {
					"Vera": { linkHref: "./Character.html?char=Vera" },
					"Freya": { linkHref: "./Character.html?char=Freya" },
					"Orianna": { linkHref: "./Character.html?char=Orianna" },
					"Sindri": { linkHref: "./Character.html?char=Sindri" },
					"Veryn": { linkHref: "./Character.html?char=Veryn" },
				}
			},
			"Music": {
				linkHref: "./Music.html",
			},
			"Writing": {
				childActionMap: {
					"Blog": { linkHref: "./Writing.html?folder=Blog" },
					"Fiction": { linkHref: "./Writing.html?folder=Fiction" },
					"Poetry": { linkHref: "./Writing.html?folder=Poetry" },
				}
			},
			"Coding": {
				childActionMap: {
					"Winnings Calc": { linkHref: "./WinningsCalc.html" },
					"GTAS": { linkHref: "https://textadventure.groundedwren.com" },
					"DnD Workbook": { linkHref: "./DnDWorkbook.html" },
				}
			},
			"Misc": {
				childActionMap: {
					"About Me": { linkHref: "./AboutMe.html" },
					"Guestbook": { linkHref: "./Guestbook.html" },
					"Accessibility": { action: () => { Pages.Home.displayA11yStatement(); } },
					"Neocities": { linkHref: "https://groundedwren.neocities.org/"},
					"Demo page": { linkHref: "./Example.html" },
					"Shortcuts": { action: () => { Common.Components.displayShortcuts(); } },
				}
			},
		}
	);

	Pages.Home.resizeListener();
	window.addEventListener("resize", Pages.Home.resizeListener);

	const updateHistory = document.getElementById("updateHistory");
	Common.Components.RegisterVisToggle(
		document.getElementById("updateChevron"),
		[
			updateHistory
		],
		Pages.Home.onUpdateVisToggled,
		false,
		[document.getElementById("updatesCardHeader")]
	);

	const buttonsExpanded = document.getElementById("buttonsExpanded");
	Common.Components.RegisterVisToggle(
		document.getElementById("buttonsChevron"),
		[
			buttonsExpanded
		],
		Pages.Home.onButtonsVisToggled,
		false,
		[document.getElementById("buttonsCardHeader")]
	);

	Common.Controls.VeraOnionring.siteRing(
		"https://emeowly.github.io/bi/onionring-variables.js",
		"bisexualism",
		"Bisexualism",
		"https://bisexualism.emeowly.gay/"
	);

	Common.GSheetsLib.loadSheet(
		"1i6ywPKS-i0gNq7cWC-yWJXJPTnhBcfnmmdjVNFa0Ngo",
		"0"
	).then(Pages.Home.populateThoughts);
};