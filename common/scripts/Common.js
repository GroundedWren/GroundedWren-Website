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
		Backspace: 8,
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
		};
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

	ns.getInvertedColor = function getInvertedColor(hex)
	{
		var rgb = hexToRGB(hex);
		var invRgb = {
			r: (255 - rgb.r).toString(16),
			g: (255 - rgb.b).toString(16),
			b: (255 - rgb.g).toString(16)
		}
		return ns.rgbToHex(invRgb);
	}

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
		};
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
	};
	function __getAxLiveEl(id, live)
	{
		var axLiveEl = document.createElement("div");
		axLiveEl.id = id;
		axLiveEl.setAttribute("aria-live", live);
		axLiveEl.setAttribute("aria-relevant", "all");
		return axLiveEl;
	}

	ns.axAlertAssertive = function (message)
	{
		__axAlert(document.getElementById(ns.axAssertiveElId), message);
	};
	ns.axAlertPolite = function (message)
	{
		__axAlert(document.getElementById(ns.axPoliteElId), message);
	};
	function __axAlert(parentEl, message)
	{
		parentEl.innerHTML = "";

		var messageEl = document.createElement("p");
		messageEl.innerText = message.replaceAll("<br />", " ");

		parentEl.appendChild(messageEl);
	}

	ns.ThemeNames = {
		"Vera": "theme-vera",
		"Serin": "theme-serin",
		"Paper": "theme-paper",
		"Nighthawks": "theme-nighthawks",
	};

	ns.Themes = {
		"theme-vera": {
			"--background-color": "#1A0D26",
			"--content-color": "#331A4D",
			"--content-color-2": "#000000",
			"--input-background-color": "#000000",
			"--input-text-color": "#FFFFFF",
			"--input-selected-color": "#663399",
			"--accent-color": "#663399",
			"--accent-color-hover": "#A853FC",
			"--accent-color-2": "#4D2673",
			"--text-color": "#FFFFFF",
			"--button-face-color": "#262626",
			"--button-face-color-hover": "#191919",
			"--button-face-color-disabled": "#191919",
			"--button-border-color": "#5B9AD5",
			"--button-border-color-hover": "#497CAB",
			"--button-border-color-disabled": "#474747",
			"--button-text-color": "#FFFFFF",
			"--clickable-border-color": "#FFFFFF",
			"--link-color": "#FFFFFF",
			"--general-border-color": "#FFFFFF",
			"--scrollbar-track-color": "#2C1642",
			"--inline-banner-color": "#404040",
			"--inline-banner-warn-color": "#766000",
			"--inline-banner-pos-color": "#195725",
			"--icon-color": "#FFFFFF",
			"--heading-color": "#FFFFFF",
		},
		"theme-serin": {
			"--background-color": "#FEFAE0",
			"--content-color": "#D7D7B6",
			"--content-color-2": "#FFF194",
			"--input-background-color": "#FFFFFF",
			"--input-text-color": "#000000",
			"--input-selected-color": "#B5CC6A",
			"--accent-color": "#606C38",
			"--accent-color-hover": "#606C38",
			"--accent-color-2": "#9FA872",
			"--text-color": "#283618",
			"--button-face-color": "#FEFAE0",
			"--button-face-color-hover": "#F4F07D",
			"--button-face-color-disabled": "#A6A6A6",
			"--button-border-color": "#DFDCC5",
			"--button-border-color-hover": "#DFDCC5",
			"--button-border-color-disabled": "#DFDCC5",
			"--button-text-color": "#2E2E2E",
			"--clickable-border-color": "#DFDCC5",
			"--link-color": "#551A8B",
			"--general-border-color": "#606C38",
			"--scrollbar-track-color": "#32381D",
			"--inline-banner-color": "#B3B3B3",
			"--inline-banner-warn-color": "#EDC200",
			"--inline-banner-pos-color": "#3FD95E",
			"--icon-color": "#000000",
			"--heading-color": "#FFFFFF",
		},
		"theme-paper": {
			"--background-color": "#EDEDED",
			"--content-color": "#FFFFEE",
			"--content-color-2": "#FFFFFF",
			"--input-background-color": "#FFFFFF",
			"--input-text-color": "#000000",
			"--input-selected-color": "#D9BDA5",
			"--accent-color": "#E1CAA4",
			"--accent-color-hover": "#614C2A",
			"--accent-color-2": "#EBE1C3",
			"--text-color": "#000000",
			"--button-face-color": "#E5DECF",
			"--button-face-color-hover": "#E5CBBA",
			"--button-face-color-disabled": "#B8B2A5",
			"--button-border-color": "#615747",
			"--button-border-color-hover": "#615747",
			"--button-border-color-disabled": "#8D95A8",
			"--button-text-color": "#000000",
			"--clickable-border-color": "#615747",
			"--link-color": "#0645AD",
			"--general-border-color": "#000000",
			"--scrollbar-track-color": "#EDEDED",
			"--inline-banner-color": "#B3B3B3",
			"--inline-banner-warn-color": "#EDC200",
			"--inline-banner-pos-color": "#3FD95E",
			"--icon-color": "#000000",
			"--heading-color": "#000000",
		},
		"theme-nighthawks": {
			"--background-color": "#1D2323",
			"--content-color": "#2E4052",
			"--content-color-2": "#72301A",
			"--input-background-color": "#000000",
			"--input-text-color": "#FFFFFF",
			"--input-selected-color": "#C91B18",
			"--accent-color": "#046946",
			"--accent-color-hover": "#FFFFFF",
			"--accent-color-2": "#508053",
			"--text-color": "#ECFCDE",
			"--button-face-color": "#821917",
			"--button-face-color-hover": "#D25A58",
			"--button-face-color-disabled": "#AC6F6F",
			"--button-border-color": "#361F18",
			"--button-border-color-hover": "#FFFFFF",
			"--button-border-color-disabled": "#AC6F6F",
			"--button-text-color": "#F5E3C1",
			"--clickable-border-color": "#046946",
			"--link-color": "#EBE6AD",
			"--general-border-color": "#03452E",
			"--scrollbar-track-color": "#03452E",
			"--inline-banner-color": "#404040",
			"--inline-banner-warn-color": "#766000",
			"--inline-banner-pos-color": "#195725",
			"--icon-color": "#FFFFFF",
			"--heading-color": "#EBE6AD",
		},
	};

	ns.currentTheme = "theme-vera";
	ns.loadTheme = function loadTheme()
	{
		ns.setTheme(localStorage.getItem("theme"));
	};

	ns.setTheme = function setTheme(thName)
	{
		ns.currentTheme = thName || "theme-vera";
		document.documentElement.className = ns.currentTheme;
		localStorage.setItem("theme", ns.currentTheme);
	};
});
