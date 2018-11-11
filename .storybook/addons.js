require('@storybook/addon-knobs/register');

require('@storybook/addon-actions/register');

require('@storybook/addon-links/register');

require('@storybook/addon-options/register');

const { register } = require('@stoplight/ui-kit/storybook-addon/register');
const themes = require('@stoplight/ui-kit/storybook-addon/themes');
register(themes);
