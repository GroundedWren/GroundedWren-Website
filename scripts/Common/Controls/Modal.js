/**
 * Code for a singleton modal popup which lives directly in the Popups namespace. 
 */
registerNamespace("Common.Controls.Popups", function (ns)
{
	ns.SUBVEIL_ID = "subveil";

	ns.isModalShowing = false;

	//#region private fields
	// The veil upon which our modal sits
	__veilEl = null;
	// The top-level DOM element of the modal
	__modalEl = null;

	// The modal's title element
	__modalTitle = null;
	// The modal's content element
	__modalContent = null;

	//Callback for when the modal is closed
	__onModalClosed = function () { };
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
		const { el: veil } = Common.DOMLib.createElement(
			"div",
			window.document.body,
			["veil"]
		);
		__veilEl = veil;

		const { el: modalEl } = Common.DOMLib.createElement(
			"div",
			veil,
			["modal", "popup"]
		);
		__modalEl = modalEl;

		const { el: modalHeader } = Common.DOMLib.createElement(
			"div",
			modalEl,
			["popup-header"]
		);

		const { el: modalTitle } = Common.DOMLib.createElement(
			"span",
			modalHeader,
			["popup-title"]
		);
		__modalTitle = modalTitle;

		const { el: modalClose } = Common.DOMLib.createElement(
			"button",
			modalHeader,
			["popup-close"]
		);
		modalClose.onclick = () => { hideModal(); };
		modalClose.innerHTML = "<span>&times;</span>";

		const { el: modalContent } = Common.DOMLib.createElement(
			"div",
			modalEl,
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