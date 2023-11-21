window.onload = () =>
{
	Common.loadTheme();
	[...document.getElementsByClassName("stanza")].forEach(stanzaEl =>
	{
		Common?.DOMLib?.createElement("span", stanzaEl, {}, ["sr-only"], "End of stanza");
	});

	[...document.getElementsByClassName("poetry-line")].forEach(stanzaEl =>
	{
		Common?.DOMLib?.createElement("span", stanzaEl, {}, ["sr-only"], "End of line");
	});
};