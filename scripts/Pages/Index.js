/**
 * Namespace for index.html
 */
registerNamespace("Pages.Index", function (ns)
{
	// Threshold to enter "mini" or mobile mode
	ns.MINI_THRESHOLD = 755;

	ns.resizeListener = () =>
	{
		var directoryContainer = document.getElementById("Directory");
		if (window.innerWidth <= Pages.Index.MINI_THRESHOLD)
		{
			directoryContainer.classList.add("mini");
		}
		else
		{
			directoryContainer.classList.remove("mini");
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
});

/**
 * Code to be called when the window first loads
 */
window.onload = () =>
{
	Common.setUpAccessibility();

	var directoryContainer = document.getElementById("Directory");
	Common.Controls.DropdownMenu.buildDropdownMenu(
		directoryContainer,
		{
			"Art Gallery": {
				linkHref: "pages/Art.html",
			},
			"Characters": {
				childActionMap: {
					"Vera": { linkHref: "pages/Character.html?char=Vera"},
					"Freya": { linkHref: "pages/Character.html?char=Freya" },
					"Orianna": { linkHref: "pages/Character.html?char=Orianna" },
					"Sindri": { linkHref: "pages/Character.html?char=Sindri" },
					"Veryn": { linkHref: "pages/Character.html?char=Veryn" },
				}
			},
			"Music": {
				linkHref: "pages/Music.html",
			},
			"Writing": {
				childActionMap: {
					"Blog": { linkHref: "pages/Writing.html?folder=Blog" },
					"Fiction": { linkHref: "pages/Writing.html?folder=Fiction" },
					"Poetry": { linkHref: "pages/Writing.html?folder=Poetry" },
				}
			},
			"Coding": {
				childActionMap: {
					"Text Adventure": { linkHref: "https://textadventure.groundedwren.com" },
					"DnD Workbook": { linkHref: "pages/DnDWorkbook.html" },
				}
			},
			"Misc": {
				childActionMap: {
					"About Me": { linkHref: "pages/AboutMe.html" },
					"Demo page": { linkHref: "pages/Example.html" },
				}
			},
		}
	);

	Pages.Index.resizeListener();
	window.addEventListener("resize", Pages.Index.resizeListener);

	const updateContent = document.getElementById("updateContent");
	Common.Components.RegisterVisToggle(
		document.getElementById("updateChevron"),
		[
			updateContent
		],
		Pages.Index.onUpdateVisToggled,
		false,
		[document.getElementById("updatesCardHeader")]
	);
};