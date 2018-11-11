import { withInfo } from '@storybook/addon-info';
import { withOptions } from '@storybook/addon-options';
import { addDecorator, configure } from '@storybook/react';
import * as themes from '@stoplight/ui-kit/storybook-addon/themes';
import { withThemes } from '@stoplight/ui-kit/storybook-addon/withThemes';

import pkg from '../../../../package.json';

withOptions({
  addonPanelInRight: true,
  goFullScreen: false,
  name: pkg.name || '@stoplight/ui-kit',
  showAddonPanel: true,
  showStoriesPanel: true,
  sortStoriesByKind: true,
  url: pkg.homepage || 'https://github.com/stoplightio/ui-kit',
});

addDecorator(
  withInfo({
    header: false,
    inline: true,
    source: false, // not that helpful?
    styles: {
      infoBody: {
        backgroundColor: 'white',
        margin: '50px 0 0 0',
        padding: '0 25px 25px 25px',
        lineHeight: '2',
        width: 800,
        fontSize: 12,
      },
    },
  })
);

addDecorator(withThemes(themes));

function loadStories() {
  require('../../../../stories');
}

configure(loadStories, module);
