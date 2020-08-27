import { linkTo } from '@storybook/addon-links';
import { storiesOf } from '@storybook/react';
// @ts-ignore
import { Welcome } from '@storybook/react/demo';
import * as React from 'react';

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);
