module.exports = {
    rules: {
        'translate-props-literals': require('./lib/rules/translate-props-literals'),
        'translate-children-literals': require('./lib/rules/translate-children-literals'),
        'formatted-message-attributes': require('./lib/rules/defined-FormattedMessage-id-prop')
    }
};
