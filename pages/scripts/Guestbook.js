/**
 * Namespace for Guestbook.html
 */
registerNamespace("Pages.Guestbook", function (ns)
{
	ns.onHCBLoad = () =>
	{
		Common.DOMLib.setAttributes(document.getElementById("hcb_msg"), {
			"aria-live": "polite",
			"aria-relevant": "all",
		});

		ns.modifyHCBForm(300);

		var hcbStyles = [...document.getElementById("HCB_comment_box").children].filter(
			el => el.tagName === "STYLE"
		);
		hcbStyles.forEach(styleEl =>
		{
			var styleList = styleEl.innerHTML.split("}");
			var filteredStyles = styleList.filter(style =>
			{
				return !style.includes("btn") && !style.includes(".home-desc a");
			});
			styleEl.innerHTML = filteredStyles.join("}");
		});
	};

	ns.onHCBComment = () => { };

	ns.modifyHCBForm = (timeout) =>
	{
		var hcbForm = document.getElementById("hcb_form");
		if (!hcbForm)
		{
			setTimeout(ns.modifyHCBForm, timeout, timeout * 2);
			return;
		}

		const hcbFormLabelId = "hcbTItle";
		Common.DOMLib.setAttributes(hcbForm, {
			"autocomplete": "off",
			"aria-labelledby": hcbFormLabelId
		});
		Common.DOMLib.createElement(
			"h2",
			hcbForm,
			[],
			hcbFormLabelId,
			true
		).el.innerText = "Sign the Guestbook";

		[...document.getElementById("hcb_subscribe").children].filter(
			el => el.tagName === "INPUT"
		).forEach(inputEl => inputEl.setAttribute("checked", "true"));

		addFormLabel("hcb_form_name", "Display Name");
		addFormLabel("hcb_form_content", "Message");
		addFormLabel("hcb_form_website", "Website");
		addFormLabel("hcb_form_email", "Email");
	};

	function addFormLabel(inputId, labelText)
	{
		const nameContainer = document.getElementById(inputId).parentElement;
		nameContainer.classList.add("input-vertical-line");
		const nameLabel = Common.DOMLib.createElement("label", nameContainer, [], undefined, true).el;
		nameLabel.innerText = labelText;
		nameLabel.setAttribute("for", inputId);
	};
});

hcb_user = {
	name_label: '',
	content_label: 'Write something nice :)',
	submit: 'Sign',
	no_comments_msg: 'The guestbook is empty :(',
	again: 'Write something else',
	said: 'wrote:',
	email_label: '(optional)',
	msg_thankyou: 'Thanks for stopping by!',
	msg_approval: 'NOTE: This comment is not published until approved',
	msg_approval_required: 'Thanks for stopping by! Your comment will appear once approved by a moderator.',
	website_label: '(optional)',
	PAGE: 'https://www.groundedwren.com/pages/Guestbook.html',
	onload: Pages.Guestbook.onHCBLoad,
	ON_COMMENT: Pages.Guestbook.onHCBComment,
};

/**
 * Code to be called when the window first loads
 */
window.onload = () =>
{
	Common.loadTheme();
	Common.setUpAccessibility();
	Common.Components.registerShortcuts({
		"ALT+H": {
			action: () => { document.getElementById("homeLink").click(); },
			description: "Return to the home page"
		},
		"ALT+S": {
			action: () => { document.getElementById("shortcutsButton").click(); },
			description: "Show shortcut keys"
		},
	});
	Common.SVGLib.insertIcons();
};
