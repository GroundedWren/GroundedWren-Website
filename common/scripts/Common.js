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
		End: 35,
		Home: 36,
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
			return method.apply(context, (args || []).concat(...arguments));
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
		messageEl.innerHTML = message.replaceAll("<br />", " ");

		parentEl.appendChild(messageEl);
	}

	ns.ThemeNames = {
		"Ocean": "theme-ocean",
		"Vera": "theme-vera",
		"Paper": "theme-paper",
		"Serin": "theme-serin",
	};

	ns.Themes = {
		"theme-ocean": {
			"--background-color": "#090B1A",
			"--content-color": "#1F2555",
			"--content-color-2": "#10122B",
			"--input-background-color": "#000000",
			"--input-text-color": "#FFFFFF",
			"--input-selected-color": "#2F3780",
			"--tab-selected-color": "#2F3780",
			"--accent-color": "#2F3780",
			"--accent-color-hover": "#10122B",
			"--accent-color-2": "#10122B",
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
			"--scrollbar-track-color": "#2F3780",
			"--scrollbar-thumb-color": "#306396",
			"--inline-banner-color": "#404040",
			"--inline-banner-warn-color": "#766000",
			"--inline-banner-pos-color": "#195725",
			"--icon-color": "#FFFFFF",
			"--heading-color": "#FFFFFF",
			"--box-shadow-color": "#64646466",
		},
		"theme-vera": {
			"--background-color": "#1A0D26",
			"--content-color": "#331A4D",
			"--content-color-2": "#27143A",
			"--input-background-color": "#000000",
			"--input-text-color": "#FFFFFF",
			"--input-selected-color": "#775FE8",
			"--tab-selected-color": "#663399",
			"--accent-color": "#663399",
			"--accent-color-hover": "#4D2673",
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
			"--scrollbar-track-color": "#663399",
			"--scrollbar-thumb-color": "#775FE8",
			"--inline-banner-color": "#404040",
			"--inline-banner-warn-color": "#766000",
			"--inline-banner-pos-color": "#195725",
			"--icon-color": "#FFFFFF",
			"--heading-color": "#FFFFFF",
			"--box-shadow-color": "#64646466",
		},
		"theme-paper": {
			"--background-color": "#EDEDED",
			"--content-color": "#FFFFEE",
			"--content-color-2": "#FFFFFF",
			"--input-background-color": "#FFFFFF",
			"--input-text-color": "#000000",
			"--input-selected-color": "#D9BDA5",
			"--tab-selected-color": "#D9BDA5",
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
			"--link-color": "#551A8B",
			"--general-border-color": "#000000",
			"--scrollbar-track-color": "#EDEDED",
			"--scrollbar-thumb-color": "#E1CAA4",
			"--inline-banner-color": "#B3B3B3",
			"--inline-banner-warn-color": "#EDC200",
			"--inline-banner-pos-color": "#3FD95E",
			"--icon-color": "#000000",
			"--heading-color": "#000000",
			"--box-shadow-color": "#64646466",
		},
		"theme-serin": {
			"--background-color": "#FEFAE0",
			"--content-color": "#D7D7B6",
			"--content-color-2": "#FFF194",
			"--input-background-color": "#FFFFFF",
			"--input-text-color": "#000000",
			"--input-selected-color": "#B5CC6A",
			"--tab-selected-color": "#B5CC6A",
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
			"--scrollbar-thumb-color": "#606C38",
			"--inline-banner-color": "#B3B3B3",
			"--inline-banner-warn-color": "#EDC200",
			"--inline-banner-pos-color": "#3FD95E",
			"--icon-color": "#000000",
			"--heading-color": "#FFFFFF",
			"--box-shadow-color": "#64646466",
		},
	};

	ns.currentTheme = "theme-ocean";
	ns.loadTheme = function loadTheme()
	{
		ns.setTheme(localStorage.getItem("theme"));
	};

	ns.setTheme = function setTheme(thName)
	{
		ns.currentTheme = thName || "theme-ocean";
		document.documentElement.className = ns.currentTheme;
		localStorage.setItem("theme", ns.currentTheme);

		for (const themer of document.getElementsByTagName("gw-themer"))
		{
			themer.onThemeSelected();
		}
	};

	ns.Themer = class Themer extends HTMLElement
	{
		//#region staticProperties
		static observedAttributes = [];
		static instanceCount = 0;
		static instanceMap = {};
		//#endregion

		//#region instance properties
		instanceId;

		//#region element properties
		articleEl;
		selectEl;
		tdBackground;
		tdContent1;
		tdContent2;
		tdAccent;
		//#endregion
		//#endregion

		constructor()
		{
			super();
			this.instanceId = Themer.instanceCount++;
			Themer.instanceMap[this.instanceId] = this;
		}

		get idKey()
		{
			return `gw-db-area-${this.instanceId}`;
		}

		//#region HTMLElement implementation
		connectedCallback()
		{
			this.renderContent();
			this.registerHandlers();

			for (const themeName in Common.ThemeNames)
			{
				this.selectEl.add(new Option(themeName, Common.ThemeNames[themeName]));
			}

			this.selectEl.value = Common.currentTheme;
			this.buildColorsTable();
		}

		disconnectedCallback()
		{
		}

		adoptedCallback()
		{
		}

		attributeChangedCallback(name, oldValue, newValue)
		{
		}
		//#endregion

		renderContent()
		{
			//Markup
			this.innerHTML = `
			<article id="${this.idKey}" class="card">
				<div class="card-header">
					<h2 id="${this.idKey}-spColors">Site Colors</h2>
					<div class="input-vertical-line" style="margin-bottom: 0px">
						<label style="font-size: small;" for="${this.idKey}-selTheme">Theme</label>
						<select id="${this.idKey}-selTheme">
						</select>
					</div>
				</div>
				<table aria-labelledby="${this.idKey}-spColors">
					<tbody>
						<tr>
							<th scope="row">Background</th>
							<td id="${this.idKey}-tdBackground" class="color-cell">
							</td>
						</tr>
						<tr>
							<th scope="row">Content 1</th>
							<td id="${this.idKey}-tdContent1" class="color-cell">
							</td>
						</tr>
						<tr>
							<th scope="row">Content 2</th>
							<td id="${this.idKey}-tdContent2" class="color-cell">
							</td>
						</tr>
						<tr>
							<th scope="row">Accent</th>
							<td id="${this.idKey}-tdAccent" class="color-cell">
							</td>
						</tr>
					</tbody>
				</table>
			</article>
			`;

			//element properties
			this.articleEl = document.getElementById(this.idKey);
			this.selectEl = document.getElementById(`${this.idKey}-selTheme`);
			this.tdBackground = document.getElementById(`${this.idKey}-tdBackground`);
			this.tdContent1 = document.getElementById(`${this.idKey}-tdContent1`);
			this.tdContent2 = document.getElementById(`${this.idKey}-tdContent2`);
			this.tdAccent = document.getElementById(`${this.idKey}-tdAccent`);
		}

		//#region Handlers
		registerHandlers()
		{
			this.selectEl.addEventListener("change", this.onSelectTheme);
		}

		onThemeSelected = () =>
		{
			if (this.selectEl.value === Common.currentTheme)
			{
				return;
			}
			this.selectEl.value = Common.currentTheme;
			this.buildColorsTable();
		};

		onSelectTheme = () =>
		{
			Common.setTheme(this.selectEl.value);
			this.buildColorsTable();
		};
		//#endregion

		buildColorsTable()
		{
			const theme = Common.Themes[Common.currentTheme];
			this.#buildColorCell(this.tdBackground, theme["--background-color"], theme["--text-color"]);
			this.#buildColorCell(this.tdContent1, theme["--content-color"], theme["--text-color"]);
			this.#buildColorCell(this.tdContent2, theme["--content-color-2"], theme["--text-color"]);
			this.#buildColorCell(this.tdAccent, theme["--accent-color"], theme["--heading-color"]);
		};

		#buildColorCell(tdElement, color, textColor)
		{
			tdElement.innerHTML = null;
			const SVGLib = Common.SVGLib;

			if (!SVGLib)
			{
				tdElement.innerHTML = color === "#663399"
					? `<a href="https://meyerweb.com/eric/thoughts/2014/06/19/rebeccapurple/" target="_blank">${color}</a>`
					: color;
				return;
			}

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
					"font-size": "0.8em",
					"text-decoration": !!linkEl ? "underline" : "",
					"fill": textColor
				},
				color
			);
		}

	};
	customElements.define("gw-themer", ns.Themer);

	ns.isNullUndefinedOrEmpty = function isNullUndefinedOrEmpty(subject)
	{
		return ns.isNullOrUndefined(subject)
			|| subject === ""
			|| subject === []
			|| (typeof subject === "object" && Object.keys(subject).length === 0);
	}
	ns.isNullOrUndefined = function isNullOrUndefined(subject)
	{
		return subject === null || subject === undefined;
	}

	/**
	 * Locates an object by namespace address
	 * @param address period delimited address
	 * @returns Whatever's at the address
	 */
	ns.nsLookup = function nsLookup(address)
	{
		var ancestors = address.split(".");

		var ns = window;
		for (var i = 0; i < ancestors.length; i++)
		{
			ns[ancestors[i]] = ns[ancestors[i]] || {};
			ns = ns[ancestors[i]];
		}

		return ns;
	};
});
