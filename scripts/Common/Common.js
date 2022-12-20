/**
 * Top-level namespace for general use code
 */
registerNamespace("Common", function (ns)
{
	/**
	 * Key codes for quick reference
	 */
	const KeyCodes = {
		Tab: 9,
		Enter: 13,
		Esc: 27
	};
	ns.KeyCodes = KeyCodes;

	/**
	 * Function Create Delegate
	 * @param context context in which the method should be applied (usually this)
	 * @param method method to turn into a delegate
	 * @param args argument array to the method
	 */
	function fcd(context, method, args)
	{
		return () =>
		{
			method.apply(context, args);
		}
	}
	ns.fcd = fcd;
});
