/**
 * Namespace for index.html
 */
registerNamespace("Pages.Index", function (ns)
{
	// Threshold to enter "mini" or mobile mode
	ns.MINI_THRESHOLD = 940;

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
});

/**
 * Code to be called when the window first loads
 */
window.onload = () =>
{
	var directoryContainer = document.getElementById("Directory");
	Common.Controls.DropdownMenu.buildDropdownMenu(
		directoryContainer,
		{
			"Art Gallery": {
				action: () => { window.location.href = "pages/Art.html"; },
			},
			"Characters": {
				childActionMap: {
					"Vera": () => { window.location.href = "pages/Character.html?char=Vera"; },
					"Freya": () => { window.location.href = "pages/Character.html?char=Freya"; },
					"Orianna": () => { window.location.href = "pages/Character.html?char=Orianna"; },
					"Sindri": () => { window.location.href = "pages/Character.html?char=Sindri"; },
					"Veryn": () => { window.location.href = "pages/Character.html?char=Veryn"; },
				}
			},
			"Music": {
				action: () => { window.location.href = "pages/Music.html"; },
			},
			"Writing": {
				childActionMap: {
					"Blog": () => { window.location.href = "pages/Writing.html?folder=Blog"; },
					"Fiction": () => { window.location.href = "pages/Writing.html?folder=Fiction"; },
					"Poetry": () => { window.location.href = "pages/Writing.html?folder=Poetry"; },
				}
			},
			"Coding Projects": {
				childActionMap: {
					"Text Adventure": () => { window.location.href = "https://textadventure.groundedwren.com"; },
					"DnD Workbook": () => { window.location.href = "pages/DnDWorkbook.html"; },
				}
			},
			"Misc": {
				childActionMap: {
					"About Me": () => { window.location.href = "pages/AboutMe.html"; },
					"Demo page": () => { window.location.href = "pages/Example.html"; },
				}
			},
		}
	);

	Pages.Index.resizeListener();
	window.addEventListener("resize", Pages.Index.resizeListener);

	const updateChevron = document.getElementById("updateChevron");
	const updateContent = document.getElementById("updateContent");
	const updateHeader = document.getElementById("updatesCardHeader");
	const toggleChevDel = (event) =>
	{
		if (event.keyCode
			&& event.keyCode !== Common.KeyCodes.Space
			&& event.keyCode !== Common.KeyCodes.Enter)
		{
			return;
		}
		if (updateChevron.classList.contains("bottom"))
		{
			updateChevron.classList.remove("bottom");
			updateContent.classList.remove("hidden");
		}
		else
		{
			updateChevron.classList.add("bottom");
			updateContent.classList.add("hidden");
		}
		event.preventDefault();
	};
	updateHeader.addEventListener("click", toggleChevDel);
	updateChevron.addEventListener("keydown", toggleChevDel);
};