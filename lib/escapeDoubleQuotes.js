module.exports = function escapeDoubleQuotes (text) {
    return text.replace(/\\"/g, '"').replace(/"/g, '\\"');
};
