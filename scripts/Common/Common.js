/**
 * Top-level namespace for general use code
 */
registerNamespace("Common", function (ns)
{
	/**
	 * Key codes for quick reference
	 * https://www.toptal.com/developers/keycode
	 */
	const KeyCodes = {
		Tab: 9,
		Enter: 13,
		Esc: 27,
		Space: 32,
		LeftArrow: 37,
		UpArrow: 38,
		RightArrow: 39,
		DownArrow: 40,
		F1: 112,
		F2: 113,
	};
	ns.KeyCodes = KeyCodes;

	/**
	 * Function Create Delegate
	 * @param context context in which the method should be applied (usually this)
	 * @param method method to turn into a delegate
	 * @param args argument array to the method
	 */
	function fcd(context, method, args)
	{
		return function generatedDelegate()
		{
			method.apply(context, (args || []).concat(...arguments));
		}
	}
	ns.fcd = fcd;

	// Threshold to enter "mini" or mobile mode
	ns.MINI_THRESHOLD = 600;

	/**
	 * Get's the page's URLSearchParams
	 */
	function getUrlParams()
	{
		return new URLSearchParams(window.location.search);
	}
	ns.getUrlParams = getUrlParams;

	/**
	 * Gets hex of black or white for contrasting with the provided color
	 * https://stackoverflow.com/a/35970186
	 */
	function getContrastingBorW(hex)
	{
		var rgb = hexToRGB(hex);
		return (rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114) > 186
			? '#000000'
			: '#FFFFFF';
	}
	ns.getContrastingBorW = getContrastingBorW;

	/**
	 * Converts a hex color to RGB
	 * https://stackoverflow.com/a/35970186
	 */
	function hexToRGB(hex)
	{
		if (hex.indexOf('#') === 0)
		{
			hex = hex.slice(1);
		}

		if (hex.length === 3)
		{
			hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
		}
		if (hex.length !== 6)
		{
			throw new Error('Invalid HEX color.');
		}
		return {
			r: parseInt(hex.slice(0, 2), 16),
			g: parseInt(hex.slice(2, 4), 16),
			b: parseInt(hex.slice(4, 6), 16)
		}
	}
	ns.hexToRGB = hexToRGB;

	function rgbToHex(rgb)
	{
		var r = rgb.r.toString();
		r = r.length == 2 ? r : "0" + r;
		var g = rgb.g.toString();
		g = g.length == 2 ? g : "0" + g;
		var b = rgb.b.toString();
		b = b.length == 2 ? b : "0" + b;
		return "#" + r + g + b;
	}
	ns.rgbToHex = rgbToHex;

	function navTo(href)
	{
		window.location.href = href;
	};
	ns.navTo = navTo;

	ns.axAssertiveElId = "axAssertiveElId";
	ns.axPoliteElId = "axPoliteElId";
	ns.setUpAccessibility = function setUpAccessibility()
	{
		var axParentEl = document.createElement("div");
		axParentEl.id = "axParentEl";
		axParentEl.classList.add("sr-only");

		axParentEl.appendChild(__getAxLiveEl(ns.axAssertiveElId, "assertive"));
		axParentEl.appendChild(__getAxLiveEl(ns.axPoliteElId, "polite"));

		document.body.appendChild(axParentEl);
	}
	function __getAxLiveEl(id, live)
	{
		var axLiveEl = document.createElement("div");
		axLiveEl.id = id;
		axLiveEl.setAttribute("aria-live", live);
		return axLiveEl;
	}

	ns.axAlertAssertive = function (message)
	{
		__axAlert(document.getElementById(ns.axAssertiveElId), message);
	}
	ns.axAlertPolite = function (message)
	{
		__axAlert(document.getElementById(ns.axPoliteElId), message);
	}
	function __axAlert(parentEl, message)
	{
		parentEl.innerHTML = "";

		var messageEl = document.createElement("p");
		messageEl.innerText = message;

		parentEl.appendChild(messageEl);
	}
});
