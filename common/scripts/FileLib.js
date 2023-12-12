/**
 * Library functions for interacting with files on disk
 */
registerNamespace("Common.FileLib", function (ns)
{
	/**
	 * Prompts the user to select a file, then parses it as plaintext
	 * @param callback Callback to which the text is passed
	 * @param typelList List of filetypes and their allowed extensions
	 * @param fallbackExtension The filetype to use if showOpenFilePicker is unavailable
	 */
	ns.getFileFromUserAsText = function getFileFromUserAsText(callback, typeList, fallbackExtension)
	{
		getFileFromUser((file) => { loadFileAsText(file, callback); }, typeList, fallbackExtension);
	}

	/**
	 * Prompts the user to select a file, then parses it as JSON
	 * @param callback Callback to which the object is passed
	 * @param typelList List of filetypes and their allowed extensions
	 * @param fallbackExtension The filetype to use if showOpenFilePicker is unavailable
	 */
	ns.getFileFromUserAsObject = function getFileFromUserAsObject(callback, typeList, fallbackExtension)
	{
		getFileFromUser((file) => { parseJSONFile(file, callback); }, typeList, fallbackExtension);
	}

	/**
	 * Prompts the user to upload a file
	 * @param callback Invoked with the user specified File.
	 * @param typeList List of filetypes and their allowed extensions
	 *				e.g. [{'application/json': ['.json']}, {'text/plain': ['.txt']}]
	 * @param fallbackExtension The filetype to use if showOpenFilePicker is unavailable
	 */
	function getFileFromUser(callback, typeList, fallbackExtension)
	{
		if (!window.showOpenFilePicker)
		{
			getFileFromUserAlt(callback, fallbackExtension);
			return;
		}

		var filePickerTypes = [];
		typeList.forEach((typeObj) =>
		{
			filePickerTypes.push({ accept: typeObj });
		});

		window.showOpenFilePicker({
			multiple: false,
			types: filePickerTypes
		}).then(async (handles) =>
		{
			callback(await handles[0].getFile());
		});
	};
	ns.getFileFromUser = getFileFromUser;

	/**
	 * Reads a File's contents as JSON
	 * @param file The File object
	 * @param callback Callback to which the object is passed
	 */
	function parseJSONFile(file, callback)
	{
		loadFileAsText(file, (result) =>
		{
			var obj = JSON.parse(result);
			callback(obj);
		});
	};
	ns.parseJSONFile = parseJSONFile;

	/**
	 * Reads a File's contents as text
	 * @param file The File object
	 * @param callback Callback to which the text is passed
	 */
	function loadFileAsText(file, callback)
	{
		const reader = new FileReader();
		reader.addEventListener('load', (progressEv) =>
		{
			callback(progressEv.target.result);
		});
		reader.readAsText(file);
	};
	ns.loadFileAsText = loadFileAsText;

	/**
	 * Serilaizes a POJO to disk after prompting the user
	 * @param object The POJO to serialize
	 * @param suggestedName The name automatically populated in the file window
	 * @param extensions Allowed file extensions
	 */
	ns.saveJSONFile = async function saveJSONFile(object, suggestedName, extensions)
	{
		if (!window.showSaveFilePicker)
		{
			saveJSONFileAlt(object, suggestedName, extensions);
			return;
		}

		var extensions = extensions || ['.json'];

		const fileHandle = await window.showSaveFilePicker({
			types: [
				{ accept: { 'application/json': extensions } }
			],
			suggestedName: suggestedName
		});

		const writable = await fileHandle.createWritable();
		writable.write(JSON.stringify(object));
		await writable.close();
	};

	ns.loadJSONFileFromDirectory = async function (path)
	{
		const response = await fetch(path);
		if (!response.ok) { return null; }
		return JSON.parse(await response.text());
	};

	function saveJSONFileAlt(object, suggestedName, extensions)
	{
		let downloadLinkEl = document.getElementById("gwFileDownloadLink");
		if (!downloadLinkEl)
		{
			document.documentElement.insertAdjacentHTML("afterbegin", `<a id="gwFileDownloadLink" download></a>`);
			downloadLinkEl = document.getElementById("gwFileDownloadLink");
		}

		const file = new File([JSON.stringify(object)], suggestedName, { type: "application/json" });

		downloadLinkEl.href = window.URL.createObjectURL(file);
		downloadLinkEl.setAttribute("download", suggestedName + extensions[0]);
		downloadLinkEl.click();
	}

	function getFileFromUserAlt(callback, fallbackExtension)
	{
		let filePickerEl = document.getElementById("gwFilePickerInput");
		if (!filePickerEl)
		{
			document.documentElement.insertAdjacentHTML("afterbegin", `<input type="file" id="gwFilePickerInput">`);
			filePickerEl = document.getElementById("gwFilePickerInput");
		}

		filePickerEl.setAttribute("accept", fallbackExtension);

		filePickerEl.onchange = () =>
		{
			callback(filePickerEl.files[0]);
		};
		filePickerEl.click();
	}
});