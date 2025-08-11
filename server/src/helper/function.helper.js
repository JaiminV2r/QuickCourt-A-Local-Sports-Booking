module.exports = {
    /**
     * Generate response/error message with localization.
     * @param {Object} req
     * @param {String} validation
     * @param {String} attribute
     * @returns
     */

    /**
     * The search string is converted to a regex string.
     * @param {String} searchStr
     * @returns
     */
    str2regex: (searchStr) => {
        const regexStr = searchStr.split(''); // Search string split (convert in array)

        regexStr.forEach((ele, ind) => {
            if (
                ['.', '+', '*', '?', '^', '$', '(', ')', '[', ']', '{', '}', '|', '\\'].find(
                    (e) => ele === e
                )
            )
                regexStr[ind] = `\\${regexStr[ind]}`;
        });

        return regexStr.join('');
    },

    /**
     * Generate slug.
     * @param {*} str
     * @returns
     */
    generateSlug: (str) => {
        return str
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
    },
};
