/**
 * Convenience functions for creating SVG elements
 */
registerNamespace("Common.SVGLib", function (ns)
{
	const XML_NAMESPACE = "http://www.w3.org/2000/svg";

	/**
	 * https://www.w3.org/TR/SVG/eltindex.html
	 */
	ns.ElementTypes = {
		svg: "svg", //viewBox, preserveAspectRatio, zoomAndPan, transform - https://www.w3.org/TR/SVG/struct.html#SVGElement
		circle: "circle", //cx, cy, r - https://www.w3.org/TR/SVG/shapes.html#CircleElement
		linearGradient: "linearGradient", //x1, y1, x2, y2, gradientUnits, gradientTransform, spreadMethod, href - https://www.w3.org/TR/SVG/pservers.html#LinearGradientElement
		stop: "stop", //offset, stop-color https://www.w3.org/TR/SVG/pservers.html#StopElement
		defs: "defs", //https://www.w3.org/TR/SVG/struct.html#DefsElement
		rect: "rect", //x, y, width, height, rx, ry - https://www.w3.org/TR/SVG/shapes.html#RectElement
		text: "text", //x, y, dominant-baseline, text-anchor, fill - https://www.w3.org/TR/SVG/text.html#TextElement
		a: "a", //href, target - https://developer.mozilla.org/en-US/docs/Web/SVG/Element/a
	};

	/**
	 * Shortcut to create an SVG element and append it to a parent
	 * @param parent the parent element
	 * ... see ns.createElement
	 */
	function createChildElement(parent, elementType, attributes, innerHTML)
	{
		var childEl = createElement(elementType, attributes, innerHTML)
		parent.appendChild(childEl);
		return childEl;
	}
	ns.createChildElement = createChildElement;

	/**
	 * Creates an SVG element to spec
	 * @param elementType type of SVG element (see ns.ElementTypes)
	 * @param attributes object of attributes and values
	 * @param innerHTML inner HTML
	 */
	function createElement(elementType, attributes, innerHTML)
	{
		var el = document.createElementNS(XML_NAMESPACE, elementType);
		Object.keys(attributes || {}).forEach((attr) => el.setAttributeNS(null, attr, attributes[attr]));
		el.innerHTML = innerHTML || null;
		return el;
	};
	ns.createElement = createElement;

	/**
	 * Gets a reference to an element in the defs by id
	 */
	function getDefsRef(id)
	{
		return `url(#${id})`;
	}
	ns.getDefsRef = getDefsRef;
});