registerNamespace("Common.Components", function (ns)
{
	ns.displayShortcuts = function (anchorId)
	{
		if (!ns.Shortcuts.shortcutsDialog)
		{
			ns.Shortcuts.__buildDialog(anchorId);
		}
		ns.Shortcuts.shortcutsDialog.showInView(50, 50);
	}

	ns.registerShortcuts = function (shortcutMap)
	{
		for (var code in shortcutMap)
		{
			ns.Shortcuts.addShortcut(code, shortcutMap[code]);
		}
	}

	ns.unregisterShortcuts = function (codesArray)
	{
		codesArray.forEach((code) =>
		{
			ns.Shortcuts.removeShortcut(code);
		});
	}
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
			mapLevel = mapLevel["ALT"] = mapLevel["ALT"] || {};
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
		codeStack.pop();
	}

	ns.activateShortcut = function (code)
	{
		var codeStack = ns.findShortcutStack(code);
		if (codeStack[0])
		{
			codeStack[0].action();
		}
	}

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
	}

	ns.__buildDialog = function (anchorId)
	{
		var allShorts = ns.__collectShortcuts();
		var shortcutHTML = "";
		allShorts.forEach(function (short)
		{
			var line = short.desc
				+ "<span style='float: right; margin-left: 5px'>"
				+ short.code.map(key => "<kbd>" + key + "</kbd>").join("+")
				+ "</span>";
			shortcutHTML += "<li style='margin-top: 5px'>" + line + "</li>";
		});

		ns.shortcutsDialog = new Common.Controls.Popups.Dialog(
			document.getElementById('subveil'),
			"Shortcuts",
			shortcutHTML ? "<ul>" + shortcutHTML + "</ul>" : "No shortcuts",
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

