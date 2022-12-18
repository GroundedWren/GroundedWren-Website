/** All pages need this script! */

/**
 * Fetches or creates a namespace at the path, then passes it to the nsFunc
 * @param {string} path Period delmited namespace path
 * @param {Function} nsFunc Function to modify the namespace
 */
function registerNamespace(path, nsFunc)
{
	var ancestors = path.split(".");

	var ns = window;
	for (var i = 0; i < ancestors.length; i++)
	{
		ns[ancestors[i]] = ns[ancestors[i]] || {};
		ns = ns[ancestors[i]];
	}
	nsFunc(ns);
};