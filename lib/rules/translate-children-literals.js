/**
 * @fileoverview Rule to disallow using (untranslated) literals in element attributes, like placeholder
 * @author Kyrylo F. Fedorov
 */

'use strict';

const uuid = require('../uuid');
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
                    // const propName = literalNode.parent.name.name;
                    // const elem = literalNode.parent.parent.name;
                    // const elemType = elem.name;
                    // const elemName = elem.type;
                    const defaultMessage = literalNode.value.replace(/^\n/, '').replace(/\n$/, '').trim();
                    const expression = `<FormattedMessage id="${uuid()}" defaultMessage="${defaultMessage}" description="TODO: insert description" />`;

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
