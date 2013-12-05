/**
 * @name sandbox
 */
(function (sb) {

    /**
     * Searches for modules in package
     *
     * @param {RegExp} regExp
     *
     * @returns {Array} [] list of module names matched by regExp
     */
    sb.require.names = function (regExp) {
        var result = [];

        if (!(regExp instanceof RegExp)) {
            return result;
        }

        for (var moduleName in sb.modules) {
            if (regExp.test(moduleName)) {
                result.push(moduleName);
            }
        }

        return result;
    };

}(sandbox));
