registerNamespace("Common.Components", function (ns)
{
	ns.displayShortcuts = function (anchorId)
	{
		if (!ns.Shortcuts.shortcutsDialog)
		{
			ns.Shortcuts.__buildDialog(anchorId);
		}
		ns.Shortcuts.shortcutsDialog.showInView(50, 50);
	};

	ns.registerShortcuts = function (shortcutMap)
	{
		for (var code in shortcutMap)
		{
			ns.Shortcuts.addShortcut(code, shortcutMap[code]);
		}
	};

	ns.unregisterShortcuts = function (codesArray)
	{
		codesArray.forEach((code) =>
		{
			ns.Shortcuts.removeShortcut(code);
		});
	};

	ns.clearShortcuts = function ()
	{
		ns.Shortcuts.shortcutMap = {};
	};
});

registerNamespace("Common.Components.Shortcuts", function (ns)
{
	ns.shortcutsDialog;
	ns.shortcutMap = {};

	document.addEventListener("keydown", function checkShortcuts(event)
	{
		var mapLevel = ns.shortcutMap;
		if (event.ctrlKey)
		{
			mapLevel = mapLevel["CTRL"] = mapLevel["CTRL"] || {};
		}
		if (event.altKey)
		{
			mapLevel = mapLevel["ALT"] = mapLevel["ALT"] || {};
		}
		if (event.shiftKey)
		{
			mapLevel = mapLevel["SHIFT"] = mapLevel["SHIFT"] || {};
		}
		var stack = mapLevel[event.key.toUpperCase()];
		if (stack && stack.length)
		{
			stack[0].action();
		}
	});

	ns.addShortcut = function (code, info)
	{
		var codeStack = ns.findShortcutStack(code);
		codeStack.unshift(info);
	};

	ns.removeShortcut = function (code)
	{
		var codeStack = ns.findShortcutStack(code);
		codeStack.shift();
	};

	ns.activateShortcut = function (code)
	{
		var codeStack = ns.findShortcutStack(code);
		if (codeStack[0])
		{
			codeStack[0].action();
		}
	};

	ns.findShortcutStack = function (code)
	{
		var components = code.toUpperCase().split("+");
		var key = components.slice(-1)[0];

		var mapLevel = ns.shortcutMap;
		if (components.includes("CTRL"))
		{
			mapLevel = mapLevel["CTRL"] = mapLevel["CTRL"] || {};
		}
		if (components.includes("ALT"))
		{
			mapLevel = mapLevel["ALT"] = mapLevel["ALT"] || {};
		}
		if (components.includes("SHIFT"))
		{
			mapLevel = mapLevel["SHIFT"] = mapLevel["SHIFT"] || {};
		}
		return mapLevel[key] = mapLevel[key] || [];
	};

	ns.__buildDialog = function (anchorId)
	{
		var allShorts = ns.__collectShortcuts();
		var shortcutHTML = "";
		allShorts.forEach(function (short)
		{
			shortcutHTML += "<tr>"
				+ `<td>${short.desc}</td>`
				+ `<td style='text-align: right'>${short.code.map(key => "<kbd>" + key + "</kbd>").join("+")}</td>`
				+ "</tr>";
		});

		var popupBodyHTML = shortcutHTML
			? `<table class='dialog-shortcut-table'><thead class='sr-only'><tr><th>Description</th><th>Shortcut</th></tr></thead><tbody>${shortcutHTML}</tbody></table>`
			: "No shortcuts"

		ns.shortcutsDialog = new Common.Controls.Popups.Dialog(
			"Shortcuts",
			popupBodyHTML + (anchorId
				? "<footer>Pressing F2 on the element which launched this dialog will return focus here</footer>"
				: ""),
			{}, //style
			{ onDestroy: () => { ns.shortcutsDialog = null; } },
			anchorId ? document.getElementById(anchorId) : null
		);
	};

	ns.__collectShortcuts = function ()
	{
		var queue = [{ map: ns.shortcutMap, code: [] }];
		var results = [];
		while (queue.length)
		{
			var current = queue.shift();
			if (Array.isArray(current.map))
			{
				if (current.map.length)
				{
					results.push({ code: current.code, desc: current.map[0].description });
				}
			}
			else
			{
				for (var key in current.map)
				{
					queue.push({
						map: current.map[key],
						code: current.code.concat(key)
					});
				}
			}
		}
		return results;
	};
});

