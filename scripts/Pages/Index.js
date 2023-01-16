/**
 * Namespace for index.html
 */
registerNamespace("Pages.Index", function (ns)
{
	
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
					"Vera": () => { window.location.href = "pages/Character.html?char=vera"; },
					"Freya": () => { window.location.href = "pages/Character.html?char=freya"; },
					"Orianna": () => { window.location.href = "pages/Character.html?char=orianna"; },
					"Sindri": () => { window.location.href = "pages/Character.html?char=sindri"; },
				}
			},
			"Music": {
				action: () => { Common.Controls.Popups.showModal("GroundedWren.com", "Coming soon!"); },
			},
			"Writing": {
				childActionMap: {
					"Blog": () => { window.location.href = "pages/Blog.html"; },
					"Fiction": () => { Common.Controls.Popups.showModal("GroundedWren.com", "Coming soon!"); },
				}
			},
			"Coding Projects": {
				childActionMap: {
					"Text Adventure": () => { window.location.href = "https://textadventure.groundedwren.com"; },
					"D&D Workbook": () => { Common.Controls.Popups.showModal("GroundedWren.com", "Coming soon!"); },
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
};