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
		if (window.innerWidth <= Pages.Home.MINI_THRESHOLD)
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
		}
		else
		{
			updateChevron.classList.add("bottom");
		}
		event.stopPropagation();
	};

	ns.onSelectTheme = () =>
	{
		const themeKey = document.getElementById("selTheme").value;
		Common.setTheme(themeKey);
		ns.buildColorsTable();
	};

	ns.buildColorsTable = () =>
	{
		const theme = Common.Themes[Common.currentTheme];
		buildColorCell(document.getElementById("tdBackground"), theme["--background-color"], theme["--text-color"]);
		buildColorCell(document.getElementById("tdContent1"), theme["--content-color"], theme["--text-color"]);
		buildColorCell(document.getElementById("tdContent2"), theme["--content-color-2"], theme["--text-color"]);
		buildColorCell(document.getElementById("tdAccent"), theme["--accent-color"], theme["--heading-color"]);
	};

	function buildColorCell(tdElement, color, textColor)
	{
		tdElement.innerHTML = null;

		const SVGLib = Common.SVGLib;
		const svgTypes = Common.SVGLib.ElementTypes;

		var svg = SVGLib.createChildElement(
			tdElement,
			svgTypes.svg,
			{
				"width": "100%",
				"height": "100%",
			}
		);
		Common.SVGLib.createChildElement(
			svg,
			svgTypes.rect,
			{
				"x": "0",
				"y": "0",
				"width": "100%",
				"height": "100%",
				"fill": color
			}
		);

		var linkEl = null;
		if (color === "#663399") //rebeccapurple
		{
			linkEl = Common.SVGLib.createChildElement(
				svg,
				svgTypes.a,
				{
					"href": "https://meyerweb.com/eric/thoughts/2014/06/19/rebeccapurple/",
					"target": "_blank",
				}
			);
		}

		Common.SVGLib.createChildElement(
			!!linkEl ? linkEl : svg,
			svgTypes.text,
			{
				"x": "50%",
				"y": "50%",
				"dominant-baseline": "middle",
				"text-anchor": "middle",
				"font-size": "14",
				"text-decoration": !!linkEl ? "underline" : "",
				"fill": textColor
			},
			color
		);
	}
});

/**
 * Code to be called when the window first loads
 */
window.onload = () =>
{
	Common.loadTheme();
	Common.loadTheme();
	Common.setUpAccessibility();

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
					"Text Adventure": { linkHref: "https://textadventure.groundedwren.com" },
					"DnD Workbook": { linkHref: "./DnDWorkbook.html" },
					"Winnings Calc": { linkHref: "./WinningsCalc.html" },
				}
			},
			"Misc": {
				childActionMap: {
					"About Me": { linkHref: "./AboutMe.html" },
					"Demo page": { linkHref: "./Example.html" },
					"Shortcuts": { action: () => { Common.Components.displayShortcuts(); } },
				}
			},
		}
	);

	Pages.Home.resizeListener();
	window.addEventListener("resize", Pages.Home.resizeListener);

	const updateContent = document.getElementById("updateContent");
	Common.Components.RegisterVisToggle(
		document.getElementById("updateChevron"),
		[
			updateContent
		],
		Pages.Home.onUpdateVisToggled,
		false,
		[document.getElementById("updatesCardHeader")]
	);

	const selTheme = document.getElementById("selTheme");
	for (const themeName in Common.ThemeNames)
	{
		selTheme.add(new Option(themeName, Common.ThemeNames[themeName]));
	}
	selTheme.value = Common.currentTheme;
	Pages.Home.buildColorsTable();
	selTheme.addEventListener("change", Pages.Home.onSelectTheme);
};