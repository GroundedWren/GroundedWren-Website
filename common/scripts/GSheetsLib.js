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

	ns.fetchRow = function (rowIdx, data)
	{
		var rowData = {};
		const cells = data.rows[rowIdx].c;

		for (let i = 0; i < cells.length; i++)
		{
			rowData[data.cols[i].label] = parseCellType(cells[i], data.cols[i].type);

		}
		return rowData;
	};

	function parseCellType(cellData, cellType)
	{
		switch (cellType)
		{
			case "string":
				return cellData ? cellData.v : cellData;
			case "datetime":
				const cellDate = new Date(cellData.f);
				return isNaN(cellDate) ? "" : cellDate;
			default:
				return cellData;
		}
	}
});