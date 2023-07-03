/**
 * Library functions for interacting with files on disk
 */
registerNamespace("Common.FileLib", function (ns)
{
	/**
	 * Prompts the user to select a file, then parses it as plaintext
	 * @param callback Callback to which the text is passed
	 * @param typelList List of filetypes and their allowed extensions
	 */
	function getFileFromUserAsText(callback, typeList)
	{
		getFileFromUser((file) => { loadFileAsText(file, callback); }, typeList);
	}
	ns.getFileFromUserAsText = getFileFromUserAsText;

	/**
	 * Prompts the user to select a file, then parses it as JSON
	 * @param callback Callback to which the object is passed
	 * @param typelList List of filetypes and their allowed extensions
	 */
	function getFileFromUserAsObject(callback, typeList)
	{
		getFileFromUser((file) => { parseJSONFile(file, callback); }, typeList);
	}
	ns.getFileFromUserAsObject = getFileFromUserAsObject;

	/**
	 * Prompts the user to upload a file
	 * @param callback Invoked with the user specified File.
	 * @param typeList List of filetypes and their allowed extensions
	 *				e.g. [{'application/json': ['.json']}, {'text/plain': ['.txt']}]
	 */
	function getFileFromUser(callback, typeList)
	{
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
	async function saveJSONFile(object, suggestedName, extensions)
	{
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
	ns.saveJSONFile = saveJSONFile;

	ns.loadJSONFileFromDirectory = async function (path)
	{
		const response = await fetch(path);
		if (!response.ok) { return null; }
		return JSON.parse(await response.text());
	};
});