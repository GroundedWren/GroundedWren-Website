/**
 * Namespace for ArtFrame.html
 */
registerNamespace("Pages.ArtFrame", function (ns)
{
	// All tracked artists
	ns.Artists = {};

	ns.render = function (params)
	{
		if (!params.has("art"))
		{
			window.history.replaceState(null, "", "ArtFrame.html");
			Common.Controls.Popups.showModal(
				"ArtFrame",
				`No art specified`,
				undefined,
				() => { window.location.href = "/Pages/Art.html"; }
			);
			return;
		}

		var artName = params.get("art");
		const artData = Pages.Art.Data.ArtFrames[artName];
		if (!artData)
		{
			window.history.replaceState(null, "", "ArtFrame.html");
			Common.Controls.Popups.showModal(
				"ArtFrame",
				`Art not found: ${artName}`,
				undefined,
				() => { window.location.href = "/Pages/Art.html"; }
			);
			return;
		}

		const artFrame = new Pages.Art.Data.ArtFrame(
			artName,
			artData.src,
			artData.characters,
			artData.artists,
			artData.date,
			artData.description,
			artData.altText,
			artData.isExplicit,
			(name) => ns.Artists[name].getLink()
		);

		var inFrame = params.has("inFrame");
		if (inFrame)
		{
			document.getElementById("Banner").remove();
			document.getElementById("BannerBuffer").remove();
			document.getElementById("mainPage").classList.add("frame");
		}

		document.getElementById("imgElement").setAttribute("src", artFrame.getArtLink());
		document.getElementById("imgElement").setAttribute("alt", artFrame.getAltText());

		if (!inFrame)
		{
			artFrame.buildMetaTable(document.getElementById("metaContainer"));
		}

		const descParagraph = Common.DOMLib.createElement("p", document.getElementById("commentContainer")).el;
		descParagraph.innerHTML = artFrame.description;
	};
});

/**
 * Code to be called when the window first loads
 */
window.onload = () =>
{
	Common.setUpAccessibility();

	Pages.Art.Data.InitializeArtists(Pages.ArtFrame, "Artists");
	Pages.ArtFrame.render(Common.getUrlParams());
};