registerNamespace("Pages.Art", function (ns)
{
	/**
	 * Enum of all artists 
	 */
	ns.Artists = {
		ChelseaRhi: new ns.ArtistInfo("Chelsea-Rhi", "https://linktr.ee/chelsearhi"),
		Despey: new ns.ArtistInfo("Despey", "https://www.furaffinity.net/user/despey/"),
		Palavenmoons: new ns.ArtistInfo("Palavenmoons", "https://palavenmoons.tumblr.com/"),
		Raiyk: new ns.ArtistInfo("Raiyk", "https://www.furaffinity.net/user/Raiyk/"),
		ShrimpLoverCat: new ns.ArtistInfo("ShrimpLoverCat", "https://shrimplovercat.tumblr.com/"),
		BereniceBoggrefe: new ns.ArtistInfo("Berenice Borggrefe", "https://www.artstation.com/ravenluckarts"),
		Vera: new ns.ArtistInfo("Vera", "https://www.groundedwren.com"),
		BastienAufrere: new ns.ArtistInfo("Bastien Aufrere", "https://www.artstation.com/bastien_aufrere"),
		JesterDK: new ns.ArtistInfo("JesterDK", "https://www.deviantart.com/jesterdk"),
		BonnieGuerra: new ns.ArtistInfo("Bonnie Guerra", "https://www.patreon.com/Bonnieguerra"),
	};

	//#region frame loading
	/**
	 * Load Art frames
	 */
	function initializeFrames()
	{
		ns.ArtFrames = ns.ArtFrames.concat([
			new ns.ArtFrame(
				"Freya Shaded Half-body",
				"../img/Freya Shaded Halfbody - Chelsea-Rhi - 2022-02-24.png",
				["Freya"],
				["ChelseaRhi"],
				new Date(2022, 01, 24),
				"A depiction of my Human Paladin in a Tomb of Annhilation campaign I was in for years.<br /><br />"
				+ " Once driven from her home, Freya returned to Chult to cleanse it of the undead menace."
				+ " Tough but fair, Freya is a kind soul who is extremely protective of children in particular.<br /><br />"
				+ " News of her death has been greatly exaggerated.",
				false
			),
			new ns.ArtFrame(
				"Framed Nocturna Cross Stitch",
				"../img/Nocturna Cross Stitch Framed - Vera - 2022-07-18.jpg",
				["Nocturna"],
				["Vera"],
				new Date(2022, 06, 18),
				"A cross stitch project I completed as a gift for my partner.<br /><br />"
				+ "I am never stitching a white background again - it took forever and was not worth it!",
				false
			),
			new ns.ArtFrame(
				"The Original Risen",
				"../img/Original Group - Bastien Aufrere - 2019-04-25.png",
				["Eryn", "Serin", "Ghodukk", "Lightsong"],
				["BastienAufrere"],
				new Date(2019, 03, 25),
				"The Risen D&D Party as they once appeared years ago, before some could rise no more.<br /><br />"
				+ " Beginning at the left and moving clockwise, we have:<br /><br />"
				+ "- Eryn, my original character, a Half-Elf ranger. He is succeeded by Vera.<br /><br />"
				+ "- Lightsong, a Dwarven cleric who yet lives.<br /><br />"
				+ "- Serin, a Dragonborn bard who yet lives.<br /><br />"
				+ "- Ghodukk, a Human barbarian, who tragically fell at the culmination of his story.",
				false
			),
			new ns.ArtFrame(
				"Risen Brunch",
				"../img/Risen Brunch - ShrimpLoverCat - Shaded - 2022-03-12.png",
				["Vera", "Serin", "Luric", "Lightsong", "Percy"],
				["ShrimpLoverCat"],
				new Date(2022, 02, 12),
				"The Risen D&D party and their patron enjoying a light brunch between adventures.<br /><br />"
				+ "From left to right:<br /><br />"
				+ "- Lightsong, a Dwarven cleric<br /><br />"
				+ "- Vera, a smug Tiefling wizard<br /><br />"
				+ "- Serin, a Dragonborn bard<br /><br />"
				+ "- Luric, a Half-Elf warlock<br /><br />"
				+ "- Percy, an even more smug High-Elf wizard",
				false
			),
			new ns.ArtFrame(
				"Sindri Bust",
				"../img/Sindri Bust - Despey - 2016-09-22.png",
				["Sindri"],
				["Despey"],
				new Date(2016, 08, 22),
				"A piece I won from a raffle almost as soon as I adopted Sindri's design! Something has perplexed the poor lad.",
				false
			),
			new ns.ArtFrame(
				"Gardener Sindri",
				"../img/Sindri Garden Raiyk 2018-04-12.png",
				["Sindri"],
				["Raiyk"],
				new Date(2018, 03, 12),
				"There are lots of things to love about Andromeda, not least of which is the exciting new plethora of flora to raise and study!",
				false
			),
			new ns.ArtFrame(
				"Cowboy Sindri",
				"../img/Sindri Hat - Despey - 2016-11-19.png",
				["Sindri"],
				["Despey"],
				new Date(2016, 10, 19),
				"During his time on Earth, Sindri would certainly have tried a cowboy hat or two.",
				false
			),
			//new ns.ArtFrame(
			//	"\"Care to join?\"",
			//	"../img/Sindri Pinup - Palavenmoons - 2017-10-25.png",
			//	["Sindri"],
			//	["Palavenmoons"],
			//	new Date(2017, 09, 25),
			//	"",
			//	true
			//),
			new ns.ArtFrame(
				"Tangled up in Blue",
				"../img/Sindri Profile - jesterdk & Vera - 2016-10-14.png",
				["Sindri"],
				["Vera", "JesterDK"],
				new Date(2016, 09, 14),
				"JesterDK was kind enough to post some free-to-use Turian lines I filled in!<br /><br />" +
				"Background is from my at-the-time musical hyperfixation, Blood on the Tracks",
				false
			),
			new ns.ArtFrame(
				"Sindri Reference",
				"../img/Sindri Reference - Raiyk - 2016-09-10.png",
				["Sindri"],
				["Raiyk"],
				new Date(2016, 08, 10),
				"A reference of Sindri designed by Raiyk as an adopt!<br /><br />"
				+ "I really love his ombre-fringe design - I've written it into his backstory as a subtle regional tattoo pattern.",
				false
			),
			new ns.ArtFrame(
				"Pondering Her Orb",
				"../img/Vera Orb - ShrimpLoverCat - 2021-12-08.png",
				["Vera"],
				["ShrimpLoverCat"],
				new Date(2021, 11, 08),
				"A wonderfully shaded piece from Catty!<br /><br />"
				+ "Hmm, I wonder who she's scrying on...",
				false
			),
			new ns.ArtFrame(
				"Siblings",
				"../img/Vera and Jack - ShrimpLoverCat - 2021-08-22.png",
				["Vera", "Jack"],
				["ShrimpLoverCat"],
				new Date(2021, 07, 22),
				"Vera posing for a photo with her non-canonical sibling, my real-sibling's character Jack!<br /><br />"
				+ "In canon, I bet they would (playfully!) fight as much as we do.",
				false
			),
			new ns.ArtFrame(
				"This Better be Good",
				"../img/Vera Coffee - Chelsea Rhi - 2022-01-23.png",
				["Vera"],
				["ChelseaRhi"],
				new Date(2022, 0, 23),
				"A wonderful icon commission I got from Chelsea-Rhi on twitter. Do not mess with Vera before she's had her coffee!",
				false
			),
			//new ns.ArtFrame(
			//	"One of Your Tiefling Girls",
			//	"../img/Vera Pinup - Bxxxnie - 2022-04-22.png",
			//	["Vera"],
			//	["BonnieGuerra"],
			//	new Date(2022, 03, 22),
			//	"",
			//	true
			//),
			new ns.ArtFrame(
				"Studious",
				"../img/Vera Reading - Ravenluck - 2021-02-11.png",
				["Vera"],
				["BereniceBoggrefe"],
				new Date(2021, 01, 11),
				"This is the very first piece of Vera I ever commissioned!<br /><br />"
				+ "Berenice only had some found reference images to work with and effectively created Vera's canon look from them.<br /><br />"
				+ "I consider this to be the authoritative depiction of Vera.",
				false
			),
			new ns.ArtFrame(
				"Confusion",
				"../img/Vera Confusion - ShrimpLoverCat - 2023-01-20.png",
				["Vera"],
				["ShrimpLoverCat"],
				new Date(2023, 0, 23),
				"Whimiscal piece from Catty!<br /><br />"
				+ "Vera seems a bit perplexed, probably by some plan Serin has just pitched.",
				false
			),
		]);
	}
	ns.initializeFrames = initializeFrames;
	//#endregion
});