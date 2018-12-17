import { addDecorator, configure } from '@storybook/react';
import { setupDecorators } from '@stoplight/storybook-config/config';
import { themes } from './themes';

setupDecorators(addDecorator, themes, {
  app: ({ base }) => ({
    canvas:
      base === 'light'
        ? {
          fg: '#111',
          bg: '#fff',
        }
        : {
          fg: '#fff',
          bg: '#111',
        },
  }),
});

function loadStories() {
  require('../src/__stories__/');
}

configure(loadStories, module);
