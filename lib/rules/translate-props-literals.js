/**
 * @fileoverview Rule to disallow using (untranslated) literals in element attributes, like placeholder
 * @author Kyrylo F. Fedorov
 */

'use strict';

const DEFAULT_CONFIG = {props: ['placeholder']};

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
                properties: {
                    props: {
                        type: 'array',
                        default: ['placeholder']
                    }
                },
                additionalProperties: false
            }
        ] // no options
    },
    create: function (context) {
        const ruleOptions = context.options[0];
        const userConfig = Object.assign({}, DEFAULT_CONFIG, ruleOptions);

        function shouldCheckForMissingTranslation(parent, config) {
            const parentType = parent.type;
            const parentName = parent.name && parent.name.name;
            const isAttributeValue = parentType === 'JSXAttribute';
            const isHandledAttribute = config.props.includes(parentName);

            return isAttributeValue && isHandledAttribute;
        }

        function reportMissingTranslation(literalNode) {
            context.report({
                node: literalNode,
                message: 'Need to translate this literal in JSX prop.',
                fix: function (fixer) {
                    const propName = literalNode.parent.name.name;
                    // const elem = literalNode.parent.parent.name;
                    // const elemType = elem.name;
                    // const elemName = elem.type;

                    const expression = `{formatMessage(defineMessages({_: {id: "${propName}", defaultMessage: "${literalNode.value}", description: "${propName}"}})._)}`;

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
                if (shouldCheckForMissingTranslation(node.parent, userConfig)) {
                    reportMissingTranslation(node);
                }
            }
        };
    }
};
