/**
 * Convenience functions for interacting with the Document Object Model
 */
registerNamespace("Common.DOMLib", function (ns)
{
	/**
	 * ID Prefix for all elements created thru createElement
	 */
	const ELEMENT_PREFIX = "DOMLibElement-";
	ns.ELEMENT_PREFIX = ELEMENT_PREFIX;

	ns.InsertLoc = {
		Prepend: "Prepend",
		Append: "Arepend",
	};

	/**
	 * Shortcut to create an element
	 * @param type Element tag name
	 * @param parent Element under which this will be inserted
	 * @param attrs Attributes object
	 * @param classAry Array of CSS classes to assign.
	 * @param innerHTML HTML inside the element
	 * @param loc InsertLoc - Where to insert (default: append)
	 */
	function createElement(type, parent, attrs, classAry, innerHTML, loc)
	{
		const el = document.createElement(type);

		attrs = attrs || {};
		if (!attrs.id)
		{
			attrs.id = incElId();
		}
		ns.setAttributes(el, attrs);

		(classAry || []).forEach((cls) =>
		{
			el.classList.add(cls);
		});

		if (innerHTML)
		{
			el.innerHTML = innerHTML;
		}

		if (parent)
		{
			switch (loc)
			{
				case ns.InsertLoc.Prepend:
					parent.prepend(el);
					break;
				default:
					parent.appendChild(el);
					break;
			}
		}

		return el;
	};
	ns.createElement = createElement;

	var elemIter = 0;
	function incElId()
	{
		return ELEMENT_PREFIX + elemIter++;
	};

	/**
	 * Set an entire object of styles into an element
	 * @param el Element to modify
	 * @param style Style object
	 */
	function addStyle(el, style)
	{
		for (const property in style)
		{
			el.style[property] = style[property];
		}
	};
	ns.addStyle = addStyle;

	/**
	 * Sets an entire object of attributes onto an element
	 * @param el Element to modify
	 * @param attrs Attributes object
	 */
	function setAttributes(el, attrs)
	{
		for (const attribute in attrs)
		{
			el.setAttribute(attribute, attrs[attribute]);
		}
	};
	ns.setAttributes = setAttributes;

	function setAsButton(el, action)
	{
		if (!el.getAttribute("role"))
		{
			el.setAttribute("role", "button");
		}
		if (el.getAttribute("tabIndex") === null
			|| el.getAttribute("tabIndex") === undefined
			|| el.getAttribute("tabIndex") === ""
		)
		{
			el.setAttribute("tabindex", "0");
		}
		el.addEventListener("keyup", (event) => { __buttonKeyup(action, event); });
		el.addEventListener("keydown", (event) => { __buttonKeydown(action, event); });
		el.addEventListener("click", (event) => { __buttonPress(action, event); });
	};
	ns.setAsButton = setAsButton;

	function setAsLink(el, href)
	{
		el.setAttribute("role", "link");
		el.addEventListener("keyup", (event) => { __buttonKeyup(() => { Common.navTo(href); }, event); });
		el.addEventListener("keydown", (event) => { __buttonKeydown(() => { Common.navTo(href); }, event); });
		el.addEventListener("click", (event) => { __buttonPress(() => { Common.navTo(href); }, event); });
	};
	ns.setAsLink = setAsLink;

	function __buttonKeyup(action, event)
	{
		if (!event.keyCode
			|| (event.keyCode !== Common.KeyCodes.Space)
		)
		{
			return;
		}
		__buttonPress(action, event);
	};

	function __buttonKeydown(action, event)
	{
		if (!event.keyCode
			|| (event.keyCode !== Common.KeyCodes.Space && event.keyCode !== Common.KeyCodes.Enter)
		)
		{
			return;
		}
		event.preventDefault();
		if (event.keyCode === Common.KeyCodes.Enter)
		{
			__buttonPress(action, event);
		}
	};

	function __buttonPress(action, event)
	{
		action(event);
	};

	ns.getAbsoluteHeight = function getAbsoluteHeight(el)
	{
		const styles = window.getComputedStyle(el);
		const margin = parseFloat(styles['marginTop']) + parseFloat(styles['marginBottom']);
		return el.offsetHeight + margin;
	};
});