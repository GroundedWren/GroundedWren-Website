registerNamespace("Common.Controls.Popups", function (ns)
{
	/**
	 * A map of element ids to non-destroyed dialogs
	 */
	var DialogMap = {};
	ns.DialogMap = DialogMap;

	ns.DialogContainerID = "dialogRegion";

	/**
	 * An amodal popup
	 */
	class Dialog
	{
		static LastShowLeft = 0;
		static LastShowTop = 0;
		static NumberShowing = 0;

		//#region fields
		// Outermost popup element
		__dialogEl;
		// Topmost element id
		__dialogId;

		// Header element
		__dialogHeader;
		// Title element
		__dialogTitle;

		//Content element
		__dialogContent;

		// Dragger class
		__dragger;

		// Caller delegates
		__delegates;

		// Whether the dialog is currently shown
		__isShowing = false;

		//Element where focus will return once out of the dialog
		__anchorEl = null;
		//#endregion

		/**
		 * Creates the dialog without displaying it
		 * @param title HTML title for the dialog
		 * @param content HTML Content for the dialog
		 * @param style Object of properties to set into the top-level popup style
		 * @param delegates Delegate functions to be invoked at various steps
		 *					- onShow
		 *					- onHide
		 *					- onDestroy
		 */
		constructor(title, content, style, delegates, anchorEl)
		{
			this.__anchorEl = anchorEl;

			this.__createDOM(document.getElementById(Common.Controls.Popups.DialogContainerID));
			Common.DOMLib.addStyle(this.__dialogEl, style || {});

			this.__dialogTitle.innerHTML = title;
			this.__dialogContent.innerHTML = content;
			this.__dragger = new Common.Components.ElementDragger(this.__dialogEl, this.__dialogHeader);

			this.__dialogEl.addEventListener('keydown', (keyEv) =>
			{
				if (keyEv.keyCode === Common.KeyCodes.Esc)
				{
					this.destroy();
				}
			});
			this.__dialogEl.addEventListener('focusout', (event) =>
			{
				if (this.__anchorEl && !this.__dialogEl.contains(event.relatedTarget))
				{
					this.__anchorEl.focus();
				}
			});

			this.__delegates = delegates || {};
			this.__delegates.onShow = this.__delegates.onShow || function () { };
			this.__delegates.onHide = this.__delegates.onHide || function () { };
			this.__delegates.onDestroy = this.__delegates.onDestroy || function () { };

			DialogMap[this.__dialogId] = this;
		}

		__createDOM(parentEl)
		{
			var focusTrapBefore = Common.DOMLib.createElement("div", parentEl).el;

			const { el: dialogEl, id: dialogId } = Common.DOMLib.createElement(
				"div",
				parentEl,
				["dialog", "popup"]
			);
			this.__dialogEl = dialogEl;
			this.__dialogId = dialogId;

			var focusTrapAfter = Common.DOMLib.createElement("div", parentEl).el;

			if (this.__anchorEl)
			{
				focusTrapBefore.tabIndex = 0;
				focusTrapAfter.tabIndex = 0;

				focusTrapBefore.addEventListener('focus', () =>
				{
					this.__dialogEl.focus();
				});
				focusTrapAfter.addEventListener('focus', () =>
				{
					this.__dialogEl.focus();
				});
				this.__anchorEl.addEventListener('keydown', this.__anchorKeydown);
				setTimeout(() =>
				{
					this.__anchorEl.setAttribute(
						"aria-description",
						"Press F2 to focus associated dialog."
					);
				}, 10);
			}

			const { el: dialogHeader } = Common.DOMLib.createElement(
				"div",
				this.__dialogEl,
				["popup-header", "dialog-header"]
			);
			this.__dialogHeader = dialogHeader;

			const { el: dialogTitle, id: dialogTitleId } = Common.DOMLib.createElement(
				"span",
				dialogHeader,
				["popup-title"]
			);
			Common.DOMLib.setAttributes(dialogTitle, {
				"role": "heading",
				"aria-level": "1"
			});
			this.__dialogTitle = dialogTitle;

			const { el: dialogClose } = Common.DOMLib.createElement(
				"button",
				dialogHeader,
				["popup-close"]
			);
			Common.DOMLib.setAttributes(dialogClose, {
				"aria-label": "Close the dialog"
			});
			Common.DOMLib.setAsButton(dialogClose, () => { this.destroy(); });
			dialogClose.innerHTML = "<span>&times;</span>";

			const { el: dialogContent } = Common.DOMLib.createElement(
				"div",
				this.__dialogEl,
				["popup-content"]
			);
			this.__dialogContent = dialogContent;

			Common.DOMLib.setAttributes(this.__dialogEl, {
				"tabIndex": "-1",
				"aria-live": "polite",
				"role": "dialog",
				"aria-labelledBy": dialogTitleId
			});
			Common.DOMLib.addStyle(this.__dialogEl, { display: "None" });
		}

		__anchorKeydown = (event) =>
		{
			if (event.keyCode !== Common.KeyCodes.F2) { return; }
			if (!this.__isShowing)
			{
				Common.axAlertAssertive("Dialog is currently hidden");
			}
			this.__dialogEl.focus();
		}

		/**
		 * Display the dialog in the current viewport
		 * @param offsetX pixels offset from the left of the window
		 * @param offsetY pixels offset from the top of the window
		 */
		showInView(offsetX, offsetY)
		{
			var top = window.scrollY + (offsetY || 0);
			var left = Dialog.lastShowLeft = window.scrollX + (offsetX || 0);

			this.__show(left, top);
		}

		/**
		 * Display the dialog with absolute coordinates
		 * @param left X coordinate
		 * @param top Y Coordinate
		 */
		showAbsolute(left, top)
		{
			this.__show(left, top);
		}

		__show(left, top)
		{
			Dialog.LastShowLeft = left;
			Dialog.LastShowTop = top;

			Common.DOMLib.addStyle(
				this.__dialogEl,
				{
					display: "Block",
					top: top + "px",
					left: left + "px"
				}
			);
			this.__dialogEl.focus();

			if (!this.__isShowing)
			{
				Dialog.NumberShowing++;
				this.__isShowing = true;

				this.__dragger.enableDragging();
				this.__delegates.onShow();
			}
		}

		/**
		 * Hide the dialog without removing it from the DOM
		 */
		hide()
		{
			Dialog.NumberShowing--;

			Common.DOMLib.addStyle(this.__dialogEl, { display: "None" });
			this.__dragger.disableDragging();

			this.__isShowing = false;
			this.__delegates.onHide();
		}

		/**
		 * Completely remove the dialog from the DOM
		 */
		destroy()
		{
			this.hide();
			this.__dialogEl.remove();
			if (this.__anchorEl)
			{
				this.__anchorEl.setAttribute("aria-description", "");
			}

			delete this.__dragger;

			delete DialogMap[this.__dialogId];

			this.__delegates.onDestroy();
		}
	}
	ns.Dialog = Dialog;
});