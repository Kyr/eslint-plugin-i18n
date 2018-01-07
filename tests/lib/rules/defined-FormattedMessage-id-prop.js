const rule = require('../../../lib/rules/defined-FormattedMessage-id-prop');
const RuleTester = require('eslint').RuleTester;
const parserOptions = {
    sourceType: 'module',
    ecmaFeatures: {
        jsx: true
    }
};

// const missingCurlyMessage = 'Need to wrap this literal in a JSX expression.';
const missingTranslationDescriptorId = 'Need to define translate descriptor id as FormattedMessage prop.';

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});

ruleTester.run('translate-props-literals', rule, {
    valid: [
        {
            code: '<FormattedMessage id="description_id" defaultMessage="default message" description="description for translators">'
        }
    ],
    invalid: [
        {
            code: '<FormattedMessage defaultMessage="default message" description="description for translators">',
            // output: '',
            // options: [{props: ['placeholder']}],
            errors: [{message: missingTranslationDescriptorId}]
        }
    ]
});
