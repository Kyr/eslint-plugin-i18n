const rule = require('../../../lib/rules/translate-props-literals');
const RuleTester = require('eslint').RuleTester;
const parserOptions = {
    sourceType: 'module',
    ecmaFeatures: {
        jsx: true
    }
};

// const missingCurlyMessage = 'Need to wrap this literal in a JSX expression.';
const missingTranslationMessage = 'Need to translate this literal in JSX prop.';

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});

ruleTester.run('translate-props-literals', rule, {
    valid: [
        {
            code: '<App><Component /></App>'
        },
        {
            code: '<input placeholder={formatMessage(message)} />'
        }
    ],
    invalid: [
        {
            code: '<input name="inputElement" placeholder="untranslated message" />',
            output: '<input name="inputElement" placeholder={formatMessage(defineMessages({_: {id: "placeholder", defaultMessage: "untranslated message", description: "placeholder"}})._)} />',
            options: [{props: ['placeholder']}],
            errors: [{message: missingTranslationMessage}]
        }
    ]
});
