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
		//"Palavenmoons": {
		//	link: "https://palavenmoons.tumblr.com/",
		//},
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
		//"Bonnie Guerra": {
		//	link: "https://www.patreon.com/Bonnieguerra",
		//},
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
		 * Builds a meta-info table
		 * @param parent the element to insert the table into
		 */
		buildMetaTable(parent)
		{
			var dce = Common.DOMLib.createElement;

			const { el: metaTable } = dce("table", parent);

			this.__addTableRow(
				metaTable,
				"Title",
				this.__title
			);
			this.__addTableRow(
				metaTable,
				"Artists",
				this.artists.map((artist) => this.__artistLinkDelegate(artist)).join(", ")
			);
			this.__addTableRow(
				metaTable,
				"Characters",
				this.characters.join(", ")
			);
			this.__addTableRow(
				metaTable,
				"Date",
				this.date.toLocaleDateString(undefined, { weekday: undefined, year: "numeric", month: "long", day: "numeric" })
			);
		}

		__addTableRow(tableEl, labelText, labelValueHTML)
		{
			var dce = Common.DOMLib.createElement;

			var { el: tableRow } = dce("tr", tableEl);
			var { el: rowLabel } = dce("td", tableRow, ["row-label"]);
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
			isExplicit: false,
		},
		"Framed Nocturna Cross Stitch": {
			src: "../img/Nocturna Cross Stitch Framed - Vera - 2022-07-18.jpg",
			characters: ["Nocturna"],
			artists: ["Vera"],
			date: new Date(2022, 06, 18),
			description: "A cross stitch project I completed as a gift for my partner.<br /><br />"
				+ "I am never stitching a white background again - it took forever and was not worth it!",
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
			isExplicit: false,
		},
		"Sindri Bust": {
			src: "../img/Sindri Bust - Despey - 2016-09-22.png",
			characters: ["Sindri"],
			artists: ["Despey"],
			date: new Date(2016, 08, 22),
			description: "A piece I won from a raffle almost as soon as I adopted Sindri's design! Something has perplexed the poor lad.",
			isExplicit: false,
		},
		"Gardener Sindri": {
			src: "../img/Sindri Garden Raiyk 2018-04-12.png",
			characters: ["Sindri"],
			artists: ["Despey"],
			date: new Date(2016, 08, 22),
			description: "A piece I won from a raffle almost as soon as I adopted Sindri's design! Something has perplexed the poor lad.",
			isExplicit: false,
		},
		"Gardener Sindri": {
			src: "../img/Sindri Garden Raiyk 2018-04-12.png",
			characters: ["Sindri"],
			artists: ["Raiyk"],
			date: new Date(2018, 03, 12),
			description: "There are lots of things to love about Andromeda, not least of which is the exciting new plethora of flora to raise and study!",
			isExplicit: false,
		},
		"Cowboy Sindri": {
			src: "../img/Sindri Hat - Despey - 2016-11-19.png",
			characters: ["Sindri"],
			artists: ["Despey"],
			date: new Date(2016, 10, 19),
			description: "During his time on Earth, Sindri would certainly have tried a cowboy hat or two.",
			isExplicit: false,
		},
		//"\"Care to join?\"": {
		//	src: "../img/Sindri Pinup - Palavenmoons - 2017-10-25.png",
		//	characters: ["Sindri"],
		//	artists: ["Palavenmoons"],
		//	date: new Date(2017, 09, 25),
		//	description: "",
		//	isExplicit: true,
		//},
		"Tangled up in Blue": {
			src: "../img/Sindri Profile - jesterdk & Vera - 2016-10-14.png",
			characters: ["Sindri"],
			artists: ["Vera", "JesterDK"],
			date: new Date(2016, 09, 14),
			description: "JesterDK was kind enough to post some free-to-use Turian lines I filled in!<br /><br />"
				+ "Background is from my at-the-time musical hyperfixation, Blood on the Tracks",
			isExplicit: false,
		},
		"Sindri Reference": {
			src: "../img/Sindri Reference - Raiyk - 2016-09-10.png",
			characters: ["Sindri"],
			artists: ["Raiyk"],
			date: new Date(2016, 08, 10),
			description: "A reference of Sindri designed by Raiyk as an adopt!<br /><br />"
				+ "I really love his ombre-fringe design - I've written it into his backstory as a subtle regional tattoo pattern.",
			isExplicit: false,
		},
		"Pondering Her Orb": {
			src: "../img/Vera Orb - ShrimpLoverCat - 2021-12-08.png",
			characters: ["Vera"],
			artists: ["ShrimpLoverCat"],
			date: new Date(2021, 11, 08),
			description: "A wonderfully shaded piece from Catty!<br /><br />"
				+ "Hmm, I wonder who she's scrying on...",
			isExplicit: false,
		},
		"Siblings": {
			src: "../img/Vera and Jack - ShrimpLoverCat - 2021-08-22.png",
			characters: ["Vera", "Jack"],
			artists: ["ShrimpLoverCat"],
			date: new Date(2021, 07, 22),
			description: "Vera posing for a photo with her non-canonical sibling, my real-sibling's character Jack!<br /><br />"
				+ "In canon, I bet they would (playfully!) fight as much as we do.",
			isExplicit: false,
		},
		"This Better be Good": {
			src: "../img/Vera Coffee - Chelsea Rhi - 2022-01-23.png",
			characters: ["Vera"],
			artists: ["Chelsea-Rhi"],
			date: new Date(2022, 0, 23),
			description: "A wonderful icon commission I got from Chelsea-Rhi on twitter. Do not mess with Vera before she's had her coffee!",
			isExplicit: false,
		},
		//"One of Your Tiefling Girls": {
		//	src: "../img/Vera Pinup - Bxxxnie - 2022-04-22.png",
		//	characters: ["Vera"],
		//	artists: ["Bonnie Guerra"],
		//	date: new Date(2022, 03, 22),
		//	description: "",
		//	isExplicit: true,
		//},
		"Studious": {
			src: "../img/Vera Reading - Ravenluck - 2021-02-11.png",
			characters: ["Vera"],
			artists: ["Berenice Borggrefe"],
			date: new Date(2021, 01, 11),
			description: "This is the very first piece of Vera I ever commissioned!<br /><br />"
				+ "Berenice only had some found reference images to work with and effectively created Vera's canon look from them.<br /><br />"
				+ "I consider this to be the authoritative depiction of Vera.",
			isExplicit: false,
		},
		"Confusion": {
			src: "../img/Vera Confusion - ShrimpLoverCat - 2023-01-20.png",
			characters: ["Vera"],
			artists: ["ShrimpLoverCat"],
			date: new Date(2023, 0, 20),
			description: "Whimiscal piece from Catty!<br /><br />"
				+ "Vera seems a bit perplexed, probably by some plan Serin has just pitched.",
			isExplicit: false,
		},
		"Inspiration, inspiration everywhere": {
			src: "../img/Inspiration, Inspiration Everywhere - ShrimpLoverCat - 2023-02-18.png",
			characters: ["Vera", "Serin"],
			artists: ["ShrimpLoverCat"],
			date: new Date(2023, 1, 18),
			description: "Meme draw-over from Catty!<br /><br />"
				+ "When Serin has cast Magnificient Mansion, he may have just a litttle too much power...",
			isExplicit: false,
		},
		"Melancholia": {
			src: "../img/Melancholia watermark - LiliVic Creations - 2023-02-19.png",
			characters: ["Vera"],
			artists: ["LiliVic Creations"],
			date: new Date(2023, 1, 19),
			description: "Wonderful depiction of Vera in a low moment by Lilian<br /><br />"
				+ "If she'd never done any of this, maybe he'd still be alive...",
			isExplicit: false,
		},
	};
	//#endregion
});