/**
 * Namespace for Winnings.html
 */
registerNamespace("Pages.Winnings", function (ns)
{
	ns.URL_PARAMS = {
		NUM_PLAYERS: "num",
		PLAYER_NAME_PREFIX: "name",
		PLAYER_NET_PREFIX: "net",
	};
	ns.interperetUrlParams = function (params)
	{
		var players = [];
		var negPlayers = [];
		var posPlayers = [];

		var numPlayers = 0;
		if (!params.has(ns.URL_PARAMS.NUM_PLAYERS))
		{
			showLoadError();
			return;
		}
		numPlayers = decodeURIComponent(params.get(ns.URL_PARAMS.NUM_PLAYERS));

		for (var idx = 0; idx < numPlayers; idx++)
		{
			var nameParam = `${ns.URL_PARAMS.PLAYER_NAME_PREFIX}${idx}`;
			var netParam = `${ns.URL_PARAMS.PLAYER_NET_PREFIX}${idx}`;
			if (!params.has(nameParam) || !params.has(netParam))
			{
				showLoadError();
				return;
			}
			players.push({
				name: decodeURIComponent(params.get(nameParam)),
				net: parseFloat(decodeURIComponent(params.get(netParam)))
			});
			(players[idx].net > 0 ? posPlayers : negPlayers).push({...players[idx]});
		}

		var payments = calcPayments(posPlayers, negPlayers);

		players.sort(numericSort);

		for (var idx = 0; idx < players.length; idx++)
		{
			buildPlayerCard(idx+1, players[idx], payments[players[idx].name]);
		}
	};

	function calcPayments(posPlayers, negPlayers)
	{
		var sorted = false;
		var payments = {};
		if (posPlayers.length === 0 || negPlayers.length === 0) { return {}; }

		while (!sorted)
		{
			posPlayers.sort(absSort);
			negPlayers.sort(absSort)

			if (posPlayers[0].net === 0)
			{
				sorted = true;
				break;
			}

			var payRemainder = posPlayers[0].net + negPlayers[0].net;
			var amt;
			if (payRemainder > 0)
			{
				amt = Math.abs(negPlayers[0].net);
				posPlayers[0].net = payRemainder;
				negPlayers[0].net = 0;
			}
			else
			{
				amt = posPlayers[0].net;
				negPlayers[0].net = payRemainder;
				posPlayers[0].net = 0;
			}
			payments[negPlayers[0].name] = (payments[negPlayers[0].name] || []).concat(
				{ to: posPlayers[0].name, amt: amt }
			);
			payments[posPlayers[0].name] = (payments[posPlayers[0].name] || []).concat(
				{ from: negPlayers[0].name, amt: amt }
			);
		}
		return payments;
	}

	function numericSort(a, b)
	{
		return b.net - a.net; 
	}

	function absSort(a, b)
	{
		return Math.abs(b.net) - Math.abs(a.net);
	}

	function buildPlayerCard(rank, playerDef, paymentList)
	{
		const dce = Common.DOMLib.createElement;
		const dsa = Common.DOMLib.setAttributes;

		var list = document.getElementById("cardList");

		const playerCard = dce("div", list, ["card"]).el;

		const playerHeader = dce("div", playerCard, ["card-header"]).el;
		dsa(playerHeader, { "role": "heading", "aria-level": "2" });
		playerHeader.innerText = `${rank}${getSuffix(rank)}: ${playerDef.name}`;

		dce("span", playerCard).el.innerText =
			`${playerDef.net >= 0 ? "Payout" : "Losses"}: $${Math.abs(playerDef.net)}`;

		if (!paymentList) { return; }

		var paymentsTable = dce("table", playerCard).el;
		dce("caption", paymentsTable).el.innerText = "Payments";

		var paymentsHead = dce("thead", paymentsTable).el;
		var headerRow = dce("tr", paymentsHead).el;
		dce("th", headerRow).el.innerText = playerDef.net > 0 ? "From" : "To";
		dce("th", headerRow).el.innerText = "Amount";

		var paymentsBody = dce("tbody", paymentsTable).el;
		paymentList.forEach(payment =>
		{
			var paymentRow = dce("tr", paymentsBody).el;
			dce("td", paymentRow).el.innerText = playerDef.net > 0 ? payment.from : payment.to;
			dce("td", paymentRow).el.innerText = `$${payment.amt}`;
		});

	};

	function getSuffix(rank)
	{
		switch (rank)
		{
			case 1:
				return "st";
			case 2:
				return "nd";
			case 3:
				return "rd";
			default:
				return "th"
		}
	}

	function showLoadError()
	{
		const errHeading = Common.DOMLib.createElement("h2", document.getElementById("mainPage")).el;
		errHeading.innerText = "Error: Malformed URL";
	};
});

/**
 * Code to be called when the window first loads
 */
window.onload = () =>
{
	Common.setUpAccessibility();
	Common.Components.registerShortcuts({
		"ALT+H": {
			action: () => { document.getElementById("homeButton").click(); },
			description: "Return to the home page"
		},
		"ALT+S": {
			action: () => { document.getElementById("shortcutsButton").click(); },
			description: "Show shortcut keys"
		},
	});

	Pages.Winnings.interperetUrlParams(Common.getUrlParams());
};