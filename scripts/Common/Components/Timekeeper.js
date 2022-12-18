registerNamespace("Common.Components", function (ns)
{
	/**
	 * Class which simply displays the current time
	 */
	class Timekeeper
	{
		//#region fields
		// The element in which to display the current time
		__element;
		// A span with the actual time
		__span;
		// Token for the update timer
		__timerToken;
		//#endregion

		/**
		 * Create a Timekeeper
		 * @param contentEl Element in which to display the time
		 */
		constructor(contentEl)
		{
			this.__element = contentEl;
			this.__element.innerText = "Current time: ";

			this.__span = document.createElement("span");
			this.__span.innerText = new Date().toUTCString();
			this.__element.appendChild(this.__span);
		}

		/**
		 * Begin ticking
		 */
		start()
		{
			this.__timerToken = window.setInterval(() =>
			{
				this.__span.innerHTML = new Date().toUTCString();
			}, 500);
		}

		/**
		 * Stop ticking
		 */
		stop()
		{
			clearTimeout(this.__timerToken);
		}
	}
	ns.Timekeeper = Timekeeper;
});