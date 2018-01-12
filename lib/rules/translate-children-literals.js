/**
 * @fileoverview Rule to disallow using (untranslated) literals in element attributes, like placeholder
 * @author Kyrylo F. Fedorov
 */

'use strict';

const uuid = require('../uuid');
const escapeDoubleQuotes = require('../escapeDoubleQuotes');
const DEFAULT_CONFIG = {};

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: 'disallow using (untranslated) literals in element attributes',
            category: 'Possible Errors',
            recommended: true
        },
        fixable: 'code', // for the moment
        schema: [
            {
                type: 'object',
                /*
                                properties: {
                                    props: {
                                        type:    'array',
                                        default: ['placeholder'],
                                    },
                                },
                */
                additionalProperties: false
            }
        ] // no options
    },
    create: function (context) {
        const ruleOptions = context.options[0];
        const userConfig = Object.assign({}, DEFAULT_CONFIG, ruleOptions);
        const translationRequired = /[^\s\d]+/;

        function shouldCheckForMissingTranslation(node/*, config*/) {
            const parent = node.parent;

            if (!parent) {
                return false;
            }
            const parentType = parent.type;
            // const parentName = parent.name && parent.name.name;
            const isValidParentType = parentType === 'JSXElement';
            const isTranslationRequired = translationRequired.test(node.value);

            // const isHandledAttribute = config.props.includes(parentName);

            return isValidParentType && isTranslationRequired;
        }

        function reportMissingTranslation(literalNode) {
            context.report({
                node: literalNode,
                message: 'Need to translate this literal.',
                fix: function (fixer) {
                    const defaultMessage = literalNode.value
                        .replace(/^\n/, '') // starting line break
                        .replace(/\n$/, '') // ending line break
                        .replace(/\n\s*/, '\\n') // inner line break
                        .trim();
                    const escapedMessage = escapeDoubleQuotes(defaultMessage);
                    const expression = `<FormattedMessage id="${uuid()}" defaultMessage={"${escapedMessage}"} description="" /* TODO: insert description */ />`;

                    return fixer.replaceText(literalNode, expression);
                }
            });
        }

        // --------------------------------------------------------------------------
        // Public
        // --------------------------------------------------------------------------

        return {
            // callback functions
            Literal: node => {
                if (shouldCheckForMissingTranslation(node, userConfig)) {
                    reportMissingTranslation(node);
                }
            }
        };
    }
};
