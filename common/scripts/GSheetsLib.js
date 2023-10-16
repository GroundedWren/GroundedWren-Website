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
				const tableJSON = JSON.parse(targetData).table;
				tableJSON.cols.forEach(col =>
				{
					if (col.label === "Timestamp")
					{
						col.type = "timestamp";
					}
				});
				return tableJSON;
			});
		}
		return "";
	};

	ns.fetchAllRows = function (sheetData)
	{
		var rowList = [];
		for (let i = 0; i < sheetData.rows.length; i++)
		{
			rowList.push(ns.fetchRow(i, sheetData));
		}
		return rowList;
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
			case "number":
				return cellData ? cellData.v : cellData;
			case "datetime":
				const cellDate = new Date(cellData.f);
				return isNaN(cellDate) ? "" : cellDate;
			case "timestamp":
				const cellTimestamp = new Date(cellData.v);
				return isNaN(cellTimestamp) ? "" : cellTimestamp;
			default:
				return cellData;
		}
	}
});