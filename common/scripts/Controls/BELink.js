registerNamespace("Common.Controls", function (ns)
{
	ns.BELink = class BELink extends HTMLElement
	{
		static instanceCount = 0;
		static instanceMap = {};

		instanceId;
		networkedBEName;
		inputElId;
		createDelegate;
		linkDelegate;

		pauseIconUpdates;

		buttonElement;

		constructor()
		{
			super();
			this.instanceId = BELink.instanceCount++;
			BELink.instanceMap[this.instanceId] = this;
			this.pauseIconUpdates = false;
		}

		get idKey()
		{
			return `gw-be-link-${this.instanceId}`;
		}

		connectedCallback()
		{
			this.networkedBEName = this.getAttribute("networkedBEName");
			this.inputElId = this.getAttribute("inputElId");
			this.createDelegate = Common.nsLookup(this.getAttribute("createDelegate"));
			this.linkDelegate = Common.nsLookup(this.getAttribute("linkDelegate"));

			this.renderContent();
			this.registerHandlers();
		}

		renderContent()
		{
			//Markup
			this.innerHTML = `
			<button id="${this.idKey}" class="icon-button"></button>
			`;

			//element properties
			this.buttonElement = document.getElementById(this.idKey);

			this.updateButtonIcon();
		}

		updateButtonIcon()
		{
			if (this.pauseIconUpdates) { return; }
			this.buttonElement.innerHTML = "";
			this.buttonElement.appendChild(
				!!this.getLinkedBE()
					? Common.SVGLib.createIcon(Common.SVGLib.Icons["link"], "Go to linked element")
					: Common.SVGLib.createIcon(Common.SVGLib.Icons["plus"], "Add linked element")
			);
		}

		getLinkedBE()
		{
			const searchValue = document.getElementById(this.inputElId)?.value;
			return [...document.getElementsByTagName(this.networkedBEName)].filter(
				boundEl => boundEl.dataId === searchValue
			)[0];
		}

		registerHandlers()
		{
			this.buttonElement.addEventListener("mousedown", () => { this.pauseIconUpdates = true; });
			this.buttonElement.addEventListener("mouseout", () =>
			{
				this.pauseIconUpdates = false;
				this.updateButtonIcon();
			});
			this.buttonElement.addEventListener("click", () =>
			{
				const inputEl = document.getElementById(this.inputElId);
				if (!inputEl || !inputEl.value) { return; }

				const linkedBE = this.getLinkedBE() || this.createDelegate(inputEl.value);

				this.linkDelegate(linkedBE);

				this.pauseIconUpdates = false;
				this.updateButtonIcon();
			});

			document.getElementById(this.inputElId).addEventListener(
				"change",
				() =>
				{
					this.updateButtonIcon();
				}
			);
		}
	};
	customElements.define("gw-be-link", ns.BELink);
});