registerNamespace("Common.Components", function (ns)
{
	ns.BoundElement = class BoundElement extends HTMLElement
	{
		static instanceCount = 0;
		static instanceMap = {};

		instanceId;
		initialized;
		dataId;

		constructor()
		{
			super();

			this.instanceId = BoundElement.instanceCount++
			BoundElement.instanceMap[this.instanceId] = this;
			this.initialized = false;
		}

		get boundElementName()
		{
			return "BoundElement";
		}

		get idKey() { throw new Error("get idKey is not implemented"); }

		get data() { throw new Error("get data is not implemented"); }
		set data(value) { throw new Error("set data is not implemented"); }
		get dataParent() { throw new Error("get dataParent is not implemented"); }
		discardData() { throw new Error("discardData is not implemented"); }
		get dataPath() { throw new Error("get dataPath is not implemented"); }

		tryMoveData(toLoc)
		{
			if (this.dataParent[toLoc])
			{
				return false;
			}

			this.saveData();
			const myData = this.data;
			this.discardData();
			this.dataId = toLoc;
			this.data = myData;

			return true;
		}

		connectedCallback()
		{
			if (this.initialized) { return; }

			if (this.hasAttribute("dataId"))
			{
				this.dataId = this.getAttribute("dataId");
				this.data = this.data || {};
			}
			else
			{
				this.dataId = 0;
				while (this.data)
				{
					this.dataId += 1;
				}
				this.data = {};
			}

			this.renderContent();
			this.registerHandlers();

			this.setBasicInputData();
		}
		renderContent() { throw new Error("renderContent is not implemented"); }
		registerHandlers() { }

		saveData()
		{
			this.data = { ...this.getSaveData(), ...this.getBasicInputData() };
		}
		getSaveData() { return {}; }

		getBasicInputData()
		{
			let data = {};
			for (let inputEl of ns.getAllInputUIEls(this))
			{
				if (!inputEl.hasAttribute("data-prop") || inputEl.getAttribute("data-owner") !== this.idKey)
				{
					continue;
				}
				switch (inputEl.type)
				{
					case "checkbox":
						data[inputEl.getAttribute("data-prop")] = inputEl.checked || false;
						break;
					default:
						data[inputEl.getAttribute("data-prop")] = inputEl.value || null;
						break;
				}
			}
			return data;
		}

		setBasicInputData()
		{
			for (let inputEl of ns.getAllInputUIEls(this))
			{
				if (!inputEl.hasAttribute("data-prop") || !inputEl.getAttribute("data-owner") === this.idKey)
				{
					continue;
				}
				switch (inputEl.type)
				{
					case "checkbox":
						inputEl.checked = this.data[inputEl.getAttribute("data-prop")] || false;
						break;
					case "select-one":
						inputEl.value = this.data[inputEl.getAttribute("data-prop")] || ""
						break;
					default:
						inputEl.value = this.data[inputEl.getAttribute("data-prop")] || null;
						break;
				}
				inputEl.dispatchEvent(new Event("change", { "bubbles": true }));
			}
		}
	};

	ns.getAllInputUIEls = function (owner)
	{
		owner = owner || document;
		return [
			...owner.getElementsByTagName("input"),
			...owner.getElementsByTagName("textarea"),
			...owner.getElementsByTagName("select")
		];
	};
});