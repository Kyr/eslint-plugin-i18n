const rule = require('../../../lib/rules/translate-children-literals');
const RuleTester = require('eslint').RuleTester;
const parserOptions = {
    sourceType: 'module',
    ecmaFeatures: {
        jsx: true
    }
};

// const missingCurlyMessage = 'Need to wrap this literal in a JSX expression.';
const missingTranslationMessage = 'Need to translate this literal.';

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});

ruleTester.run('translate-children-literals', rule, {
    valid: [
        {
            code: '<App><Component /></App>'
        },
        {
            code: `<Component>
<FormattedMessage
    id="id"
    defaultMessage="translated message"
    description="description"
/>
</Component>`
        },
        {
            code: `<Component>
    <FormattedMessage
        id="id"
         defaultMessage="translated message"
          description="description"
          />
         </Component>`
        },
        {
            code: `<Component prop="some value">
    <FormattedMessage
        id="id"
         defaultMessage="translated message"
          description="description"
          />
         </Component>`
        },
        {
            code: '<Component>{"should be as is"}</Component>'
        },
        {
            code: `
            <div className="controlGroup">
                <label htmlFor="">
                    <FormattedMessage id="lable" defaultMessage="Name"/>
                    <Tooltip>
                        <FormattedMessage
                            id="tooltip"
                             defaultMessage="Please enter alphabets A-z, numbers 0-9, alphanumeric (combination of A-z & 0-9) or special characters (. , _ , -, &quot;, ’)"
                             />
                    </Tooltip>
                </label>
                <Input
                    name="profile.first_name"
                    value={value}
                    tabIndex="2"
                />
                <ErrorBlock error={errors} />
            </div>
            `
        }
    ],
    invalid: [
        {
            code: '<div>Untranslated text</div>',
            output: `<div>
<FormattedMessage
    id="TODO: update id"
    defaultMessage="Untranslated text"
    description="TODO: insert description"
/>
</div>`,
            // options: [],
            errors: [{message: missingTranslationMessage}]
        },
        {
            code: '<div className="should-not-trigger-rule">Untranslated text</div>',
            output: `<div className="should-not-trigger-rule">
<FormattedMessage
    id="TODO: update id"
    defaultMessage="Untranslated text"
    description="TODO: insert description"
/>
</div>`,
            // options: [],
            errors: [{message: missingTranslationMessage}]
        },
        {
            code: '<div><div>Untranslated text</div></div>',
            output: `<div><div>
<FormattedMessage
    id="TODO: update id"
    defaultMessage="Untranslated text"
    description="TODO: insert description"
/>
</div></div>`,
            // options: [],
            errors: [{message: missingTranslationMessage}]
        }
    ]
});
