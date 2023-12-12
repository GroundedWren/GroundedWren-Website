/**
 * Comments control
 * TODO refactor into components
 */

registerNamespace("Common.Controls.Comments", function (ns)
{
	ns.COMMENT_SECTION_CLASS = "comments-region";
	ns.COMMENT_SPREADSHEET_ATTRIBUTE = "data-spreadsheet";
	ns.COMMENT_SHEET_ATTRIBUTE = "data-sheet";
	ns.FORM_TITLE_ATTRIBUTE = "data-form-title";
	ns.DEFAULT_FORM_TITLE = "Add a Comment"
	ns.COMMENT_DISCORD_ATTRIBUTE = "data-discord";
	ns.NEWEST_FIRST_ATTRIBUTE = "data-new-first";
	ns.ALREADY_LOADED_ATTRIBUTE = "already-loaded";
	ns.ERR_COULDNT_LOAD = "Comments could not be loaded";
	ns.ERR_NOTHING = "Nothing to show";

	ns.buildSections = () =>
	{
		const commentsSections = document.getElementsByClassName(ns.COMMENT_SECTION_CLASS);
		for (element of commentsSections)
		{
			if (element.getAttribute(ns.ALREADY_LOADED_ATTRIBUTE))
			{
				continue;
			}

			const commentsGSpreadsheetId = element.getAttribute(ns.COMMENT_SPREADSHEET_ATTRIBUTE);
			const commentsGSheetId = element.getAttribute(ns.COMMENT_SHEET_ATTRIBUTE);
			const discordUrl = element.getAttribute(ns.COMMENT_DISCORD_ATTRIBUTE);
			const formTitleText = element.getAttribute(ns.FORM_TITLE_ATTRIBUTE) || ns.DEFAULT_FORM_TITLE;
			const newestFirst = element.getAttribute(ns.NEWEST_FIRST_ATTRIBUTE) || false;

			if (!commentsGSheetId || !discordUrl)
			{
				element.innerHTML = `<span>${ns.ERR_COULDNT_LOAD}</span>`;
				continue;
			}

			ns.buildCommentsSection(
				element,
				commentsGSpreadsheetId,
				commentsGSheetId,
				discordUrl,
				formTitleText,
				newestFirst
			);

			element.setAttribute(ns.ALREADY_LOADED_ATTRIBUTE, true);
		};
	};

	ns.buildCommentsSection = async function buildCommentsSection(
		sectionEl,
		gSpreadsheetId,
		gSheetId,
		discordUrl,
		formTitleText,
		newestFirst
	)
	{
		const sheetData = await Common.GSheetsLib.loadSheet(gSpreadsheetId, gSheetId);

		const { formElementIds, formEl } = buildCommentForm(discordUrl, formTitleText);

		const allComments = Common.GSheetsLib.fetchAllRows(sheetData);
		if (newestFirst)
		{
			allComments.reverse();
			sectionEl.appendChild(formEl);
		}
		buildCommentList(sectionEl, allComments, formElementIds);

		if (!newestFirst)
		{
			sectionEl.appendChild(formEl);
		}
	};

	function buildCommentList(sectionEl, allComments, formIds)
	{
		
		const allCommentsIndex = {};
		const topLevelCommentIdxs = [];
		const childCommentIdxs = [];
		for (let i = 0; i < allComments.length; i++)
		{
			const comment = allComments[i];
			allCommentsIndex[comment.ID] = i;
			if (!comment.ResponseTo)
			{
				topLevelCommentIdxs.push(i);
			}
			else
			{
				childCommentIdxs.push(i);
			}
		}
		childCommentIdxs.forEach(childIdx =>
		{
			const replyId = allComments[childIdx].ResponseTo;
			const respondeeComment = allComments[allCommentsIndex[replyId]];

			respondeeComment.childrenIdxs = respondeeComment.childrenIdxs || [];
			respondeeComment.childrenIdxs.push(childIdx);
		});

		const commentsContainer = Common.DOMLib.createElement(
			"div",
			sectionEl,
			undefined,
			["comments-container"]
		);

		let commentsToBuild = [];
		topLevelCommentIdxs.forEach(
			topCommentIdx => commentsToBuild.push(
				{
					parent: commentsContainer,
					parentId: null,
					comment: allComments[topCommentIdx]
				}
			)
		);

		while (commentsToBuild.length > 0)
		{
			let { parent, parentId, comment } = commentsToBuild.shift();
			const commentEl = buildComment(parent, parentId, comment, formIds);
			(comment.childrenIdxs || []).forEach(
				childIdx => commentsToBuild.push({
					parent: commentEl,
					parentId: comment.ID,
					comment: allComments[childIdx]
				})
			);
		}
	};

	function buildComment(parent, parentId, commentObj, formIds)
	{
		if (!commentObj.ID
			|| !commentObj["Display Name"]
			|| !commentObj.Comment
			|| !commentObj.Timestamp
		)
		{
			return Common.DOMLib.createElement("article", parent, undefined, undefined, ns.ERR_NOTHING);
		}
		const articleHeader = Common.DOMLib.createElement("div", undefined, undefined, ["comment-header"]);
		const articleEl = Common.DOMLib.createElement(
			"article",
			parent,
			{ "aria-labelledby": articleHeader.id },
			["comment-article"]
		);
		articleEl.appendChild(articleHeader);

		const idContainer = Common.DOMLib.createElement("div", articleHeader);


		Common.DOMLib.createElement("span",
			idContainer,
			{
				"aria-hidden": true
			},
			["comment-id"],
			`#${commentObj.ID}`
		);
		Common.DOMLib.createElement(
			"span",
			idContainer,
			undefined,
			["sr-only"],
			parentId
					? `Comment #${ commentObj.ID } replying to #${ parentId }`
					: `Top level Comment #${ commentObj.ID }`
		);

		Common.DOMLib.createElement(
			commentObj.Website ? "a" : "span",
			articleHeader,
			commentObj.Website ? { href: commentObj.Website, target: "_blank" } : undefined,
			["commenter-name"],
			commentObj["Display Name"]
		);

		const timestampString = commentObj.Timestamp.toLocaleString(
			undefined,
			{ dateStyle: "short", timeStyle: "short" }
		);
		Common.DOMLib.createElement(
			"time",
			articleHeader,
			{ datetime: commentObj.Timestamp.toISOString() },
			["comment-timestamp"],
			timestampString
		);

		Common.DOMLib.createElement("blockquote", articleEl, undefined, undefined, commentObj.Comment);
		Common.DOMLib.createElement(
			"button",
			articleEl,
			undefined,
			undefined,
			`Reply to #${commentObj.ID}`
		).onclick = Common.fcd(this, onReplyClicked, [commentObj.ID, formIds.responseTo]);

		return articleEl;
	};

	function onReplyClicked(commentId, responseToId)
	{
		const responseEl = document.getElementById(responseToId);
		responseEl.value = commentId;
		responseEl.focus();
	};

	function buildCommentForm(discordUrl, formTitleText)
	{
		const nameEl = Common.DOMLib.createElement(
			"input",
			undefined,
			{ type: "text", maxlength: "1000", "required": true, value: localStorage.getItem("comment-name") || "" }
		);
		const emailEl = Common.DOMLib.createElement("input", undefined, {
			type: "email",
			value: localStorage.getItem("comment-email") || ""
		});
		const websiteEl = Common.DOMLib.createElement("input", undefined, {
			type: "text",
			maxlength: "1000",
			value: localStorage.getItem("comment-website") || ""
		});
		const commentEl = Common.DOMLib.createElement(
			"textarea",
			undefined,
			{ minlength: "1", maxlength: "1000", required: true, rows: "5", cols: "33" }
		);
		const responseToEl = Common.DOMLib.createElement("input", undefined, { type: "number" });

		const formTitle = Common.DOMLib.createElement(
			"span",
			undefined,
			undefined,
			["comment-form-title"],
			formTitleText
		);
		const formInfo = Common.DOMLib.createElement("div", undefined, undefined, ["inline-banner"]);
		formInfo.appendChild(Common.SVGLib.createIcon(Common.SVGLib.Icons["circle-info"], "info"));
		Common.DOMLib.createElement("span", formInfo, undefined, undefined, "Comments are manually approved");

		const formEl = Common.DOMLib.createElement(
			"form",
			undefined,
			{
				autocomplete: "off",
				"aria-labelledby": formTitle.id,
				"aria-describedby": formInfo.id
			}
		);
		const formElementIds = {
			form: formEl.id,
			name: nameEl.id,
			email: emailEl.id,
			website: websiteEl.id,
			comment: commentEl.id,
			responseTo: responseToEl.id
		};
		formEl.onsubmit = Common.fcd(this, ns.addComment, [discordUrl, formElementIds])
		formEl.appendChild(formTitle);

		const horizFlex = Common.DOMLib.createElement("div", formEl, undefined, ["input-horizontal-flex"]);
		addFormLabelledItem(horizFlex, "Display name*", nameEl);
		addFormLabelledItem(horizFlex, "Email", emailEl);
		addFormLabelledItem(horizFlex, "Website", websiteEl);
		addFormLabelledItem(horizFlex, "Response to", responseToEl);

		const commentBoxContainer = Common.DOMLib.createElement("div", formEl, undefined, ["comment-box-container"]);
		addFormLabelledItem(commentBoxContainer, "Comment*", commentEl);

		formEl.appendChild(formInfo);

		const formFooterEl = Common.DOMLib.createElement("div", formEl, undefined, ["form-footer"]);
		Common.DOMLib.createElement("input", formFooterEl, { type: "reset", value: "Reset" });
		Common.DOMLib.createElement("input", formFooterEl, { type: "submit", value: "Submit" });

		return { formElementIds, formEl };
	};

	function addFormLabelledItem(parentEl, labelText, inputEl)
	{
		const containerEl = Common.DOMLib.createElement("div", parentEl, undefined, ["input-vertical"]);
		Common.DOMLib.createElement("label", containerEl, { for: inputEl.id }, undefined, labelText);
		containerEl.appendChild(inputEl);
	};

	ns.addComment = function (discordUrl, formElementIds, event)
	{
		event.preventDefault();

		const contentObj = {
			name: document.getElementById(formElementIds.name).value,
			email: document.getElementById(formElementIds.email).value,
			website: document.getElementById(formElementIds.website).value,
			comment: document.getElementById(formElementIds.comment).value,
			responseTo: document.getElementById(formElementIds.responseTo).value,
			timestamp: new Date().toUTCString(),
		};
		const contentAry = [];
		for (contentKey in contentObj)
		{
			contentAry.push(`${contentKey}=${contentObj[contentKey]}`);
		}

		const request = new XMLHttpRequest();
		request.open(
			"POST",
			discordUrl,
			true
		);
		request.setRequestHeader("Content-Type", "application/json");

		request.onreadystatechange = function ()
		{
			if (request.readyState == 4)
			{
				console.log(request.responseText);
			}
		};

		request.send(JSON.stringify({ content: contentAry.join("; ") }));

		localStorage.setItem("comment-name", contentObj.name);
		localStorage.setItem("comment-email", contentObj.email);
		localStorage.setItem("comment-website", contentObj.website);

		document.getElementById(formElementIds.form).reset();
		document.getElementById(formElementIds.name).value = contentObj.name;
		document.getElementById(formElementIds.email).value = contentObj.email;
		document.getElementById(formElementIds.website).value = contentObj.website;


		alert("Comment submitted!")
	};
});

window.addEventListener("load", Common.Controls.Comments.buildSections);