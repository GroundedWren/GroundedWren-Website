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

	/**
	 * Shortcut to create an element
	 * @param type Element tag name
	 * @param parent Element under which this will be inserted
	 * @param classAry Array of CSS classes to assign.
	 * @param id If specified, assigned to this element.
	 * @param prepend If true, prepend instead of append.
	 */
	function createElement(type, parent, classAry, id, prepend)
	{
		const el = document.createElement(type);

		if (!id)
		{
			id = incElId();
		}
		el.setAttribute("id", id);

		(classAry || []).forEach((cls) =>
		{
			el.classList.add(cls);
		});

		if (parent)
		{
			prepend
				? parent.prepend(el)
				: parent.appendChild(el); 
			
		}

		return { el: el, id: id };
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
	}
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
	}
	ns.setAttributes = setAttributes;
});