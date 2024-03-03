registerNamespace("Common.Components", function (ns)
{
	ns.CardBE = class CardBE extends ns.BoundElement
	{
		hName;
		txtName;
		lastValidName;

		focusAnchor;
		openCloseBtnId;
		togEl;

		startClosed;

		constructor()
		{
			super();

			this.lastValidName = "";
		}

		connectedCallback()
		{
			this.startClosed = this.getAttribute("startClosed") === "true";
			super.connectedCallback();
		}

		get_cardHeader(hTag)
		{
			this.openCloseBtnId = `${this.idKey}-ocBtn`;
			return `
			<div class="card-header btn-header">
				<${hTag} id="${this.idKey}-hName">${this.data.Name}</${hTag}>
				<button id="${this.openCloseBtnId}"
					aria-pressed="false"
					aria-describedby="${this.idKey}-hName"
					class="icon-button"
				>${this.#getIcon(true)}</button>
			</div>
			`;
		}

		#getIcon(expanded)
		{
			if (expanded)
			{
				return `<gw-icon iconKey="chevron-up" title="collapse"></gw-icon>`;
			}
			else
			{
				return `<gw-icon iconKey="chevron-down" title="expand"></gw-icon>`;
			}
		}

		registerHandlers()
		{
			this.txtName.addEventListener("change", () =>
			{
				if (!this.initialized || this.txtName.value && this.tryMoveData(this.txtName.value))
				{
					this.lastValidName = this.txtName.value;
				}
				else if (this.txtName.value)
				{
					this.txtName.value = this.lastValidName;
					alert("Name conflict!");
				}

				this.hName.innerText = this.lastValidName || ("New " + this.boundElementName);
			});

			if (this.openCloseBtnId && this.togEl)
			{
				const ocBtn = document.getElementById(this.openCloseBtnId);
				this.#setExpandedStyle(!this.startClosed);
				ocBtn.addEventListener("click", () =>
				{
					this.#setExpandedStyle(ocBtn.getAttribute("aria-pressed") === "true");
				});
			}
		}

		#setExpandedStyle(expanded)
		{
			const ocBtn = document.getElementById(this.openCloseBtnId);
			if (expanded)
			{
				ocBtn.setAttribute("aria-pressed", "false");
				ocBtn.innerHTML = this.#getIcon(true);
				this.togEl.classList.remove("hidden");
			}
			else
			{
				ocBtn.setAttribute("aria-pressed", "true");
				ocBtn.innerHTML = this.#getIcon(false);
				this.togEl.classList.add("hidden");
			}
		}
	};
});