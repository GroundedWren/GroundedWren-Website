/**
 * Data for Writing.html
 */
registerNamespace("Pages.Writing.Data", function (ns)
{
	ns.Folders = {
		Blog: {
			entriesDirectory: "./blog_entries/",
			entryExtension: ".html",
			entries: {
				"2023_01_22": {
					title: "Memories and Bedrooms",
					author: "Vera",
					date: new Date(2023, 0, 22),
				},
				"2022_12_31": {
					title: "Fate of the Flightless",
					author: "Vera",
					date: new Date(2022, 11, 31),
				},
				"2022_12_20": {
					title: "Hello blog!",
					author: "Vera",
					date: new Date(2022, 11, 20),
				},
			},
		},
		Fiction: {
			entriesDirectory: "./fiction_entries/",
			entryExtension: ".html",
			entries: {
				"ARoadToChult": {
					title: "A Road to Chult",
					author: "Vera",
					date: new Date(2022, 6, 12),
					characters: ["Orianna, Vera"],
				},
				"EmbarkingTheBrusco": {
					title: "Embarking the Brusco",
					author: "Vera",
					date: new Date(2017),
					characters: ["Sindri"],
				},
			},
		},
	};
});
