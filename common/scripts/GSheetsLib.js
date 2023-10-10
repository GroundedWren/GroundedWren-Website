/**
 * Library functions for interacting with google sheet APIs
 */
registerNamespace("Common.GSheetsLib", function (ns)
{
	ns.loadSheet = async function (spreadsheetId, sheetId)
	{
		const SHEET_URL = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?sheet=${sheetId}`;

		var response = await fetch(SHEET_URL);
		if (response.ok)
		{
			return response.text().then((unparsedData) =>
			{
				const targetData = unparsedData.split("setResponse(")[1].split(");")[0];
				return JSON.parse(targetData).table;
			});
		}
		return "";
	};
});