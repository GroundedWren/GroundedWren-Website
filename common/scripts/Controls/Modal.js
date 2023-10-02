/**
 * Code for a singleton modal popup which lives directly in the Popups namespace. 
 */
registerNamespace("Common.Controls.Popups", function (ns)
{
	ns.SUBVEIL_ID = "subveil";

	ns.isModalShowing = false;

	//#region private fields
	// The veil upon which our modal sits
	var __veilEl = null;
	// The top-level DOM element of the modal
	var __modalEl = null;

	// The modal's title element
	var __modalTitle = null;
	// The modal's content element
	var __modalContent = null;

	//Callback for when the modal is closed
	var __onModalClosed = function () { };
	//#endregion

	/**
	 * Shows a modal popup
	 * @param title The modal's title
	 * @param content The modal's HTML content
	 * @param style Style attributes to apply to the modal
	 * @param onClosed Callback when the modal closes
	 */
	function showModal(title, content, style, onClosed)
	{
		__createDOM();
		Common.DOMLib.addStyle(__modalEl, style);

		__modalTitle.innerHTML = title;
		__modalContent.innerHTML = content;

		__modalEl.setAttribute("tabIndex", "-1");
		__modalEl.focus();

		document.body.addEventListener('keydown', __hideModalOnEsc);
		document.body.classList.add('stop-scrolling');

		get_subveil().setAttribute("inert", "true");

		__onModalClosed = onClosed || function () { };

		ns.isModalShowing = true;
	};
	ns.showModal = showModal;

	function __createDOM()
	{
		const veil = Common.DOMLib.createElement(
			"div",
			window.document.body,
			undefined,
			["veil"]
		);
		__veilEl = veil;

		const modalEl = Common.DOMLib.createElement(
			"div",
			veil,
			{
				"aria-live": "polite"
			},
			["modal", "popup"]
		);
		__modalEl = modalEl;

		const modalHeader = Common.DOMLib.createElement(
			"div",
			modalEl,
			undefined,
			["popup-header"]
		);

		const modalTitle = Common.DOMLib.createElement(
			"span",
			modalHeader,
			{
				"role": "heading",
				"aria-level": "1"
			},
			["popup-title"]
		);
		__modalTitle = modalTitle;

		Common.DOMLib.createElement(
			"button",
			modalHeader,
			{
				"aria-label": "Close the modal"
			},
			["popup-close"],
			"&times;"
		).onclick = () => { hideModal(); };

		const modalContent = Common.DOMLib.createElement(
			"div",
			modalEl,
			undefined,
			["popup-content"]
		);
		__modalContent = modalContent;
	}

	/**
	 * Hides the modal, completely removing it from the DOM
	 */
	function hideModal()
	{
		__veilEl.remove();

		document.body.removeEventListener('keydown', __hideModalOnEsc);
		document.body.classList.remove('stop-scrolling');

		get_subveil().removeAttribute("inert");

		ns.isModalShowing = false;
		__onModalClosed();
	};
	ns.hideModal = hideModal;

	/**
	 * Gets the subveil element
	 */
	function get_subveil()
	{
		return document.getElementById(ns.SUBVEIL_ID);
	}
	ns.get_subveil = get_subveil;

	function __hideModalOnEsc(keyEv)
	{
		if (keyEv.keyCode === Common.KeyCodes.Esc)
		{
			hideModal();
		}
	};
});