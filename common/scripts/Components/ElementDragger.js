registerNamespace("Common.Components", function (ns)
{
	/**
	 * A class which enables dragging an element across the screen
	 */
	class ElementDragger
	{
		//#region fields
		__startX;
		__startY;

		// The element to be dragged
		__element;
		// The element which must be clicked to initiate dragging
		__anchor;
		//#endregion

		/**
		 * @param element The element to be dragged
		 * @param anchor The element which must be clicked to initiate dragging
		 */
		constructor(element, anchor)
		{
			this.__element = element;
			this.__anchor = anchor;
		}

		/**
		 * Turns on dragging
		 */
		enableDragging()
		{
			this.__anchor.onmousedown = this.__dragMouseDown;
		}

		/**
		 * Turns off dragging
		 */
		disableDragging()
		{
			this.__anchor.onmousedown = null;
		}

		__dragMouseDown = (event) =>
		{
			event.preventDefault();

			this.__startX = event.clientX;
			this.__startY = event.clientY;

			document.addEventListener("mousemove", this.__elementDrag);
			document.addEventListener("mouseup", this.__closeDragEvent);
		};

		__elementDrag = (event) =>
		{
			event.preventDefault();

			var deltaX = this.__startX - event.clientX;
			var deltaY = this.__startY - event.clientY;
			this.__startX = event.clientX;
			this.__startY = event.clientY;

			this.__element.style.left = (this.__element.offsetLeft - deltaX) + "px";
			this.__element.style.top = (this.__element.offsetTop - deltaY) + "px";
		};

		__closeDragEvent = () =>
		{
			document.removeEventListener('mousemove', this.__elementDrag);
			document.removeEventListener("mouseup", this.__closeDragEvent);
		};
	}
	ns.ElementDragger = ElementDragger;
});
