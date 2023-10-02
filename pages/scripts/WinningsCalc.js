/**
 * Namespace for WinningsCalc.html
 */
registerNamespace("Pages.WinningsCalc", function (ns)
{
	ns.Players = [];
	ns.ChipTypes = [];
	ns.NetTblVal = 0;

	ns.calculatePayments = function ()
	{
		if (!document.forms["playersForm"].reportValidity())
		{
			return;
		}

		var params = Pages.Winnings.URL_PARAMS;
		var url = "./Winnings.html?"

		url += `${params.NUM_PLAYERS}=${encodeURIComponent(ns.Players.length)}`;
		for (var idx = 0; idx < ns.Players.length; idx++)
		{
			var playerDef = ns.Players[idx];
			url += `&${params.PLAYER_NAME_PREFIX}${idx}=${encodeURIComponent(playerDef.nameInput.value)}`;
			url += `&${params.PLAYER_NET_PREFIX}${idx}=${encodeURIComponent(playerDef.netAssets)}`;
		}

		Common.navTo(url);
	};

	ns.updatePlayerForm = function (playerDef)
	{
		playerDef.chipCounts = {};

		var startingAssets = 0;
		for (var idx = 0; idx < ns.ChipTypes.length; idx++)
		{
			const playerCount = parseInt(playerDef.startingCounts[idx].value) || 0;
			startingAssets += (ns.ChipTypes[idx].valInput.value * playerCount);
			playerDef.chipCounts[idx] = -playerCount;
		}
		playerDef.startingAssets = startingAssets;
		playerDef.spanStartTotal.innerText = `$${startingAssets}`;

		var endingAssets = 0;
		for (var idx = 0; idx < ns.ChipTypes.length; idx++)
		{
			const playerCount = parseInt(playerDef.endingCounts[idx].value) || 0;
			endingAssets += (ns.ChipTypes[idx].valInput.value * playerCount);
			playerDef.chipCounts[idx] += playerCount;
		}
		playerDef.spanEndTotal.innerText = `$${endingAssets}`;

		playerDef.netAssets = endingAssets - startingAssets;
		playerDef.netSpan.innerText = `$${playerDef.netAssets}`;

		ns.updateGameForm();
	};

	ns.updateGameForm = () =>
	{
		const gameForm = document.forms["gameForm"];
		const playersForm = document.forms["playersForm"];

		document.getElementById("btnAddPlayer").disabled = !gameForm.checkValidity();

		if (ns.Players.length)
		{
			document.getElementById("btnAddChipType").disabled = true;
			ns.ChipTypes.forEach(chipType =>
			{
				chipType.lblInput.disabled = true;
				chipType.valInput.disabled = true;
			});
		}

		updateStakes();
		const netBalanced = (ns.NetTblVal === 0);
		const chipsBalanced = Object.values(getOverallChipCounts()).every(count => count === 0);
		updateBanners(netBalanced, chipsBalanced);

		document.getElementById("btnCalcWinnings").disabled = !(gameForm.checkValidity()
			&& ns.Players.length
			&& netBalanced
			&& chipsBalanced
		);
	};

	function updateBanners(netBalanced, chipsBalanced)
	{
		Common.Components.unregisterShortcuts(["ALT+W"]);
		if (netBalanced)
		{
			document.getElementById("bnrTblNetWarning").classList.add("hidden");
			if (ns.Players.length)
			{
				if (chipsBalanced)
				{
					document.getElementById("bnrReady").classList.remove("hidden");
					document.getElementById("bnrChipsWarning").classList.add("hidden");
				}
				else
				{
					Common.Components.registerShortcuts({
						"ALT+W": {
							action: () => { document.getElementById("btnShowNetViaChips").click(); },
							description: "Show chip balance details"
						}
					});
					document.getElementById("bnrChipsWarning").classList.remove("hidden");
					document.getElementById("bnrReady").classList.add("hidden");
				}
			}
		}
		else
		{
			Common.Components.registerShortcuts({
				"ALT+W": {
					action: () => { document.getElementById("btnShowNet").click(); },
					description: "Show chip balance details"
				}
			});
			document.getElementById("bnrTblNetWarning").classList.remove("hidden");
			document.getElementById("bnrChipsWarning").classList.add("hidden");
			document.getElementById("bnrReady").classList.add("hidden");
		}
	};

	function updateStakes()
	{
		var buyIn = 0;
		ns.ChipTypes.forEach(chipType =>
		{
			if (chipType.valInput.value >= 0 && chipType.cntInput.value >= 0)
			{
				buyIn = buyIn + (chipType.valInput.value * chipType.cntInput.value);
			}
		});
		document.getElementById("tdBuyIn").innerText = `$${buyIn}`;
		document.getElementById("tdPlayers").innerText = `${ns.Players.length}`;

		var potVal = 0;
		ns.NetTblVal = 0;
		ns.Players.forEach(playerDef =>
		{
			potVal += playerDef.startingAssets;
			ns.NetTblVal += playerDef.netAssets;
		});
		document.getElementById("tdPot").innerText = `$${potVal}`;
		document.getElementById("tdTblNet").innerText = `$${ns.NetTblVal}`;
	};

	ns.addPlayer = function ()
	{
		const dce = Common.DOMLib.createElement;
		const dsa = Common.DOMLib.setAttributes;

		document.getElementById("bnrAddPlayerInfo").classList.add("hidden");

		var playerDef = { idx: ns.Players.length + 1 };
		ns.Players.push(playerDef);

		const playersContainer = document.getElementById("playersContent");
		const playerCard = dce("div", playersContainer, undefined, ["card"]);

		const playerHeader = dce(
			"div",
			playerCard,
			{ "role": "heading", "aria-level": "3" },
			["card-header"],
			`Player ${playerDef.idx}`
		);

		const playerFieldset = dce(
			"fieldset",
			playerCard,
			{ "aria-labelledby": playerHeader.id },
			["transparent-fieldset"]
		);

		const validatePlayer = Common.fcd(ns, ns.updatePlayerForm, [playerDef]);

		const topDiv = dce("div", playerFieldset, undefined, ["player-top"]);

		const nameLine = dce("div", topDiv, undefined, ["input-vertical-line"]);
		const nameLabel = dce("label", nameLine, undefined, [], "Name");
		const nameInput = dce("input", nameLine, { type: "text", required: "" }, ["player-name-field"]);
		dsa(nameLabel, { "for": nameInput.id });
		nameInput.addEventListener("input", validatePlayer);
		playerDef.nameInput = nameInput;

		const netLine = dce("div", topDiv, undefined, ["input-vertical-line", "player-net-line"]);
		const netLabel = dce("label", netLine, undefined, [], "Net");
		const netSpan = dce("span", netLine, undefined, [], "-");
		dsa(netLabel, { "for": netSpan.id });
		playerDef.netSpan = netSpan;

		const fieldsetsDiv = dce("div", playerFieldset, undefined, ["player-fieldset-container"]);
		playerDef.startingCounts = {};
		playerDef.endingCounts = {};
		playerDef.spanStartTotal = buildPlayerFieldset(
			fieldsetsDiv,
			"Starting",
			playerDef.startingCounts,
			validatePlayer,
			true
		);
		playerDef.spanEndTotal = buildPlayerFieldset(
			fieldsetsDiv,
			"Ending",
			playerDef.endingCounts,
			validatePlayer,
			false
		);

		ns.updatePlayerForm(playerDef);
		nameInput.focus();
	};

	function buildPlayerFieldset(fieldsetsDiv, legendText, countCollection, inputListener, setValues)
	{
		const dce = Common.DOMLib.createElement;
		const dsa = Common.DOMLib.setAttributes;

		const fieldset = dce("fieldset", fieldsetsDiv, undefined, ["input-flex"]);
		dce("legend", fieldset, undefined, [], legendText);

		ns.ChipTypes.forEach(chipType =>
		{
			const chipLine = dce("div", fieldset, undefined, ["input-flex-line"]);

			const chipLabel = dce("label", chipLine, undefined, undefined, chipType.lblInput.value);

			const chipInput = dce("input", chipLine, { type: "number", min: "0", placeholder: "0" });
			if (setValues)
			{
				chipInput.value = chipType.cntInput.value || 0;
			}
			chipInput.addEventListener("input", inputListener);

			dsa(chipLabel, { "for": chipInput.id });

			countCollection[chipType.idx - 1] = chipInput;
		});

		const totalLine = dce("div", fieldset, undefined, ["input-flex-line"]);
		const lblTotal = dce("label", totalLine, undefined, undefined, "Total");
		const spanTotal = dce("span", totalLine, undefined, undefined, "-");
		dsa(lblTotal, { for: spanTotal.id });

		return spanTotal;
	};

	ns.addChipType = function ()
	{
		const dce = Common.DOMLib.createElement;

		var chipTypeDef = { idx: ns.ChipTypes.length + 1 };
		ns.ChipTypes.push(chipTypeDef);

		const chipTypesContainer = document.getElementById("divChipTypesContainer");

		const cTypeSet = dce("fieldset", chipTypesContainer, undefined, ["chiptype-fieldset"]);
		chipTypeDef.fieldSet = cTypeSet;

		dce("legend", cTypeSet, undefined, [], `Type ${chipTypeDef.idx}`);

		chipTypeDef.lblInput = createChipInput(
			cTypeSet,
			"Label",
			{ type: "text", required: "" }
		);
		chipTypeDef.valInput = createChipInput(cTypeSet,
			"Value",
			{ type: "number", min: "0", step: "0.01", required: "" }
		);
		chipTypeDef.cntInput = createChipInput(
			cTypeSet, "Count",
			{ type: "number", min: "0", placeholder: "0" }
		);

		ns.updateGameForm();
		chipTypeDef.lblInput.focus();
	};

	function createChipInput(cTypeSet, labelText, inpAttrs)
	{
		const dce = Common.DOMLib.createElement;
		const dsa = Common.DOMLib.setAttributes;

		const cTypeLine = dce("div", cTypeSet, undefined, ["input-vertical-line"]);
		const cTypeLabel = dce("label", cTypeLine, undefined, undefined, labelText);
		const cTypeInput = dce("input", cTypeLine, inpAttrs);

		dsa(cTypeLabel, { for: cTypeInput.id });

		cTypeInput.addEventListener("input", ns.updateGameForm);

		return cTypeInput;
	}

	ns.showNetDetails = function (btnId)
	{
		var overallChipCounts = getOverallChipCounts();

		var tableMarkup = "";
		for (var idx = 0; idx < ns.ChipTypes.length; idx++)
		{
			if (!overallChipCounts[idx]) { continue; }
			const chipLabel = ns.ChipTypes[idx].lblInput.value;
			const chipCount = (overallChipCounts[idx] > 0)
				? `${overallChipCounts[idx]} excess in results`
				: `${overallChipCounts[idx]*-1} missing in results`;
			tableMarkup = tableMarkup + `<tr><td>${chipLabel}</td><td>${chipCount}</td></tr>`;
		}

		var Dialog = Common.Controls.Popups.Dialog;
		var dialog = new Dialog(
			"Net Chips",
			`<table class=''><thead class='sr-only'><tr><th>Chip Type</th><th>Discrepancy</th></tr></thead><tbody>${tableMarkup}</tbody></table>`,
			{},
			{},
			document.getElementById(btnId)
		);
		dialog.showInView(50, 50);
	};

	function getOverallChipCounts()
	{
		var overallChipCounts = {};
		ns.Players.forEach(playerDef =>
		{
			for (var idx = 0; idx < ns.ChipTypes.length; idx++)
			{
				overallChipCounts[idx] = (overallChipCounts[idx] || 0) + playerDef.chipCounts[idx];
			}
		});
		return overallChipCounts;
	};
});

/**
 * Code to be called when the window first loads
 */
window.onload = () =>
{
	Common.loadTheme();
	Common.setUpAccessibility();
	Common.Components.registerShortcuts({
		"ALT+H": {
			action: () => { document.getElementById("homeLink").click(); },
			description: "Return to the home page"
		},
		"ALT+S": {
			action: () => { document.getElementById("shortcutsButton").click(); },
			description: "Show shortcut keys"
		},
		"ALT+P": {
			action: () => { document.getElementById("btnAddPlayer").click(); },
			description: "Add player"
		},
		"ALT+C": {
			action: () => { document.getElementById("btnCalcWinnings").click(); },
			description: "Calculate winnings"
		},
	});
	Common.SVGLib.insertIcons();

	Common.Components.RegisterVisToggle(
		document.getElementById("showChipsChevron"),
		[
			document.getElementById("chipsFieldset")
		],
		function (visible, event)
		{
			const chipsChevron = document.getElementById("showChipsChevron");

			if (visible)
			{
				chipsChevron.classList.remove("bottom");
			}
			else
			{
				chipsChevron.classList.add("bottom");
			}
			event.stopPropagation();
		},
		true,
		[document.getElementById("chipsHeader")]
	);
};