registerNamespace("Pages.Art.Data", function (ns)
{
	//#region Artists
	/**
	 * Class for storing information about an artist
	 */
	ns.ArtistInfo = class ArtistInfo
	{
		//Display name
		name;
		//Url where to find them
		link;
		constructor(name, link)
		{
			this.name = name;
			this.link = link;
		}

		/**
		 * Gets a link to display
		 */
		getLink()
		{
			return `<a target="_blank" href=${this.link}>${this.name}</a>`;
		}
	};

	/**
	 * Populate artists from Data
	 * @param toNS Target namespace
	 * @param as load artists into this property
	 */
	ns.InitializeArtists = function (toNS, as)
	{
		toNS[as] = toNS[as] || {};
		Object.keys(ns.Artists).forEach(artistName =>
		{
			const artistObj = ns.Artists[artistName];
			toNS[as][artistName] = new ns.ArtistInfo(artistName, artistObj.link);
		});
	};

	ns.Artists = {
		"Chelsea-Rhi": {
			link: "https://linktr.ee/chelsearhi",
		},
		"Despey": {
			link: "https://www.furaffinity.net/user/despey/",
		},
		"Raiyk": {
			link: "https://www.furaffinity.net/user/Raiyk/",
		},
		"ShrimpLoverCat": {
			link: "https://shrimplovercat.tumblr.com/",
		},
		"Berenice Borggrefe": {
			link: "https://www.artstation.com/ravenluckarts",
		},
		"Vera": {
			link: "https://www.groundedwren.com",
		},
		"Bastien Aufrere": {
			link: "https://www.artstation.com/bastien_aufrere",
		},
		"JesterDK": {
			link: "https://www.deviantart.com/jesterdk",
		},
		"LiliVic Creations": {
			link: "https://liliviccreationsart.carrd.co/",
		},
	};
	//#endregion

	//#region ArtFrames
	ns.ArtFrame = class ArtFrame
	{
		//#region fields
		// Display name
		__title;
		// link to the art
		__artLink;
		// List of represented characters
		characters = [];
		// List of represented artists
		artists = [];
		// Date the art was created or posted
		date;
		// A description of the work
		description;
		// Alt text for the image
		altText;
		// Whether the art is explicit, sexually or otherwise
		__isExplicit;
		// Delegate to get an artist's link from their identifer
		__artistLinkDelegate;
		//#endregion

		/**
		 * Creates an art frame for display
		 * @param title The display title of the work
		 * @param artLink A link to the art file
		 * @param characters An array of characters depicted
		 * @param artists An array of artist names who contributed to the work
		 * @param date A date object of when the art was produced
		 * @param description A description of the work
		 * @param altText Alt text for the image
		 * @param isExplicit Whehter the art is explicit
		 * @param artistLinkDelegate Delegate to get an artist's link from their identifer
		 */
		constructor(
			title,
			artLink,
			characters,
			artists,
			date,
			description,
			altText,
			isExplicit,
			artistLinkDelegate
		)
		{
			this.__title = title;
			this.__artLink = artLink;
			this.characters = characters;
			this.artists = artists;
			this.date = date;
			this.description = description;
			this.altText = altText;
			this.__isExplicit = isExplicit;
			this.__artistLinkDelegate = artistLinkDelegate;
		}

		/**
		 * Fetches the identifying title
		 */
		getTitle()
		{
			return this.__title;
		}

		/**
		 * Fetches the link to the image
		 */
		getArtLink()
		{
			return this.__artLink;
		}

		/**
		 * Fetches image alternat text
		 */
		getAltText()
		{
			return this.altText;
		}

		/**
		 * Builds a meta-info table
		 * @param parent the element to insert the table into
		 */
		buildMetaTable(parent)
		{
			var dce = Common.DOMLib.createElement;

			const { el: metaTable } = dce("table", parent);
			const tBody = dce("tbody", metaTable).el;

			this.__addTableRow(
				tBody,
				"Title",
				this.__title
			);
			this.__addTableRow(
				tBody,
				"Artists",
				this.artists.map((artist) => this.__artistLinkDelegate(artist)).join(", ")
			);
			this.__addTableRow(
				tBody,
				"Characters",
				this.characters.join(", ")
			);
			this.__addTableRow(
				tBody,
				"Date",
				this.date.toLocaleDateString(undefined, { weekday: undefined, year: "numeric", month: "long", day: "numeric" })
			);
		}

		__addTableRow(tableEl, labelText, labelValueHTML)
		{
			var dce = Common.DOMLib.createElement;

			var { el: tableRow } = dce("tr", tableEl);
			var { el: rowLabel } = dce("th", tableRow, ["row-label"]);
			rowLabel.setAttribute("scope", "row");
			rowLabel.innerText = labelText;
			var { el: rowValue } = dce("td", tableRow);
			rowValue.innerHTML = labelValueHTML;
		}
	};

	ns.ArtFrames = {
		"Freya Shaded Half-body": {
			src: "../img/Freya Shaded Halfbody - Chelsea-Rhi - 2022-02-24.png",
			characters: ["Freya"],
			artists: ["Chelsea-Rhi"],
			date: new Date(2022, 01, 24),
			description: "A depiction of my Human Paladin in a Tomb of Annhilation campaign I was in for years.<br /><br />"
				+ " Once driven from her home, Freya returned to Chult to cleanse it of the undead menace."
				+ " Tough but fair, Freya is a kind soul who is extremely protective of children in particular.<br /><br />"
				+ " News of her death has been greatly exaggerated.",
			altText: "A Chultan Human woman in splint armor holding an axe over her left shoulder. She has brown skin, green eyes, and braided black hair. She looks determined.",
			isExplicit: false,
		},
		"Framed Nocturna Cross Stitch": {
			src: "../img/Nocturna Cross Stitch Framed - Vera - 2022-07-18.jpg",
			characters: ["Nocturna"],
			artists: ["Vera"],
			date: new Date(2022, 06, 18),
			description: "A cross stitch project I completed as a gift for my partner.<br /><br />"
				+ "I am never stitching a white background again - it took forever and was not worth it!",
			altText: "A framed pixel-art style cross-stitching of a vampiric woman with blue skin and orange hair standing at the ready. She is above three red hearts.",
			isExplicit: false,
		},
		"The Original Risen": {
			src: "../img/Original Group - Bastien Aufrere - 2019-04-25.png",
			characters: ["Eryn", "Serin", "Ghodukk", "Lightsong"],
			artists: ["Bastien Aufrere"],
			date: new Date(2019, 03, 25),
			description: "The Risen D&D Party as they once appeared years ago, before some could rise no more.<br /><br />"
				+ " Beginning at the left and moving clockwise, we have:<br /><br />"
				+ "- Eryn, my original character, a Half-Elf ranger. He is succeeded by Vera.<br /><br />"
				+ "- Lightsong, a Dwarven cleric who yet lives.<br /><br />"
				+ "- Serin, a Dragonborn bard who yet lives.<br /><br />"
				+ "- Ghodukk, a Human barbarian, who tragically fell at the culmination of his story.",
			altText: "A circle of four heroic adventurers lunging towards danger.",
			isExplicit: false,
		},
		"Risen Brunch": {
			src: "../img/Risen Brunch - ShrimpLoverCat - Shaded - 2022-03-12.png",
			characters: ["Vera", "Serin", "Luric", "Lightsong", "Percy"],
			artists: ["ShrimpLoverCat"],
			date: new Date(2022, 02, 12),
			description: "The Risen D&D party and their patron enjoying a light brunch between adventures.<br /><br />"
				+ "From left to right:<br /><br />"
				+ "- Lightsong, a Dwarven cleric<br /><br />"
				+ "- Vera, a smug Tiefling wizard<br /><br />"
				+ "- Serin, a Dragonborn bard<br /><br />"
				+ "- Luric, a Half-Elf warlock<br /><br />"
				+ "- Percy, an even more smug High-Elf wizard",
			altText: "Four members of the Risen and Percy seated on the same side of a table eating eggs and bacon.",
			isExplicit: false,
		},
		"Sindri Bust": {
			src: "https://d.furaffinity.net/art/groundedwren/1690126429/1690126429.groundedwren_sindri_bust_-_despey_-_2016-09-22.jpg",
			characters: ["Sindri"],
			artists: ["Despey"],
			date: new Date(2016, 08, 22),
			description: "A piece I won from a raffle almost as soon as I adopted Sindri's design! Something has perplexed the poor lad.",
			altText: "A bust drawing of a purple male Turian with piercings on his left brow looking confused.",
			isExplicit: false,
		},
		"Gardener Sindri": {
			src: "../img/Sindri Garden Raiyk 2018-04-12.png",
			characters: ["Sindri"],
			artists: ["Raiyk"],
			date: new Date(2018, 03, 12),
			description: "There are lots of things to love about Andromeda, not least of which is the exciting new plethora of flora to raise and study!",
			altText: "A chibi-style depiction of a purple turian Male in overalls and flannel planting exotic plants with a hand shovel.",
			isExplicit: false,
		},
		"Cowboy Sindri": {
			src: "https://d.furaffinity.net/art/groundedwren/1690126951/1690126951.groundedwren_sindri_hat_-_despey_-_2016-11-19.png",
			characters: ["Sindri"],
			artists: ["Despey"],
			date: new Date(2016, 10, 19),
			description: "During his time on Earth, Sindri would certainly have tried a cowboy hat or two.",
			altText: "A smiling purple Turian male with a brown cowboy hat perched precariously atop his head.",
			isExplicit: false,
		},
		"Tangled up in Blue": {
			src: "../img/Sindri Profile - jesterdk & Vera - 2016-10-14.png",
			characters: ["Sindri"],
			artists: ["Vera", "JesterDK"],
			date: new Date(2016, 09, 14),
			description: "JesterDK was kind enough to post some free-to-use Turian lines I filled in!<br /><br />"
				+ "Background is from my at-the-time musical hyperfixation, Blood on the Tracks",
			altText: "A portrait of a purple Turian male looking left. The background is from the 1975 album 'Blood on the Tracks' by Bob Dylan.",
			isExplicit: false,
		},
		"Sindri Reference": {
			src: "https://d.furaffinity.net/art/groundedwren/1689654127/1689654127.groundedwren_sindri_reference_-_raiyk_-_2016-09-10.png",
			characters: ["Sindri"],
			artists: ["Raiyk"],
			date: new Date(2016, 08, 10),
			description: "A reference of Sindri designed by Raiyk as an adopt!<br /><br />"
				+ "I really love his ombre-fringe design - I've written it into his backstory as a subtle regional tattoo pattern.",
			altText: "A chibi character-sheet style depiction of a purple Turian male with two piercings in his left brow. ",
			isExplicit: false,
		},
		"Pondering Her Orb": {
			src: "../img/Vera Orb - ShrimpLoverCat - 2021-12-08.png",
			characters: ["Vera"],
			artists: ["ShrimpLoverCat"],
			date: new Date(2021, 11, 08),
			description: "A wonderfully shaded piece from Catty!<br /><br />"
				+ "Hmm, I wonder who she's scrying on...",
			altText: "A tiefling woman in blue robes looks deeply into a glowing blue orb.",
			isExplicit: false,
		},
		"Siblings": {
			src: "../img/Vera and Jack - ShrimpLoverCat - 2021-08-22.png",
			characters: ["Vera", "Jack"],
			artists: ["ShrimpLoverCat"],
			date: new Date(2021, 07, 22),
			description: "Vera posing for a photo with her non-canonical sibling, my real-sibling's character Jack!<br /><br />"
				+ "In canon, I bet they would (playfully!) fight as much as we do.",
			altText: "A anthropomorphic orange and white canine with a blue bandana with his arm around a Tiefling woman in purple robes flashing the peace sign.",
			isExplicit: false,
		},
		"This Better be Good": {
			src: "../img/Vera Coffee - Chelsea Rhi - 2022-01-23.png",
			characters: ["Vera"],
			artists: ["Chelsea-Rhi"],
			date: new Date(2022, 0, 23),
			description: "A wonderful icon commission I got from Chelsea-Rhi on twitter. Do not mess with Vera before she's had her coffee!",
			altText: "An annoyed Tiefling woman holding a mug of coffee with the word 'NO' printed on it.",
			isExplicit: false,
		},
		"Studious": {
			src: "../img/Vera Reading - Ravenluck - 2021-02-11.png",
			characters: ["Vera"],
			artists: ["Berenice Borggrefe"],
			date: new Date(2021, 01, 11),
			description: "This is the very first piece of Vera I ever commissioned!<br /><br />"
				+ "Berenice only had some found reference images to work with and effectively created Vera's canon look from them.<br /><br />"
				+ "I consider this to be the authoritative depiction of Vera.",
			altText: "A smirking tiefling woman wrapped in a purple blanket with a spellbook laid across her lap.",
			isExplicit: false,
		},
		"Confusion": {
			src: "../img/Vera Confusion - ShrimpLoverCat - 2023-01-20.png",
			characters: ["Vera"],
			artists: ["ShrimpLoverCat"],
			date: new Date(2023, 0, 20),
			description: "Whimiscal piece from Catty!<br /><br />"
				+ "Vera seems a bit perplexed, probably by some plan Serin has just pitched.",
			altText: "A confused tiefling woman stares perplexedly at trigonometry equations.",
			isExplicit: false,
		},
		"Inspiration, inspiration everywhere": {
			src: "../img/Inspiration, Inspiration Everywhere - ShrimpLoverCat - 2023-02-18.png",
			characters: ["Vera", "Serin"],
			artists: ["ShrimpLoverCat"],
			date: new Date(2023, 1, 18),
			description: "Meme draw-over from Catty!<br /><br />"
				+ "When Serin has cast Magnificient Mansion, he may have just a litttle too much power...",
			altText: "A confident brass dragonborn man gestures ahead while speaking with his right arm around a very concerned Tiefling woman.",
			isExplicit: false,
		},
		"Melancholia": {
			src: "../img/Melancholia watermark - LiliVic Creations - 2023-02-19.png",
			characters: ["Vera"],
			artists: ["LiliVic Creations"],
			date: new Date(2023, 1, 19),
			description: "Wonderful depiction of Vera in a low moment by Lilian<br /><br />"
				+ "If she'd never done any of this, maybe he'd still be alive...",
			altText: "A bust of a sad-looking Tiefling woman.",
			isExplicit: false,
		},
	};
	//#endregion
});