/**
 * Namespace for index.html
 */
registerNamespace("Pages.Index", function (ns)
{
	//Nothing here :)
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
				}
			},
			"Music": {
				action: () => { window.location.href = "pages/Music.html"; },
			},
			"Writing": {
				childActionMap: {
					"Blog": () => { window.location.href = "pages/Writing.html?folder=Blog"; },
					"Fiction": () => { window.location.href = "pages/Writing.html?folder=Fiction"; },
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