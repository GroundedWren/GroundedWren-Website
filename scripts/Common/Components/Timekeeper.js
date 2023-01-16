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
		// Time options
		__options;
		//#endregion

		/**
		 * Create a Timekeeper
		 * @param contentEl Element in which to display the time
		 * @param prefix
		 * @param timeZone
		 */
		constructor(contentEl, prefix, options)
		{
			this.__element = contentEl;
			this.__element.innerText = prefix;

			this.__options = options;

			this.__span = document.createElement("span");
			this.__updateTimeDelegate();
			this.__element.appendChild(this.__span);
		}

		__updateTimeDelegate = () =>
		{
			this.__span.innerText = new Date().toLocaleString(undefined, this.__options)
		}

		/**
		 * Begin ticking
		 */
		start()
		{
			this.__timerToken = window.setInterval(this.__updateTimeDelegate, 500);
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