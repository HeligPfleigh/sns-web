import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Link from '../../src/components/Link';
import CommentContent from '../../src/components/CommentContent/CommentContent';

storiesOf('Button', module)
.add('with text', () => (
    <button onClick={action('clicked')}>Hello Button</button>
))
.add('with some emoji', () => (
    <button onClick={action('clicked')}>😀 😎 👍 💯</button>
))
.add('<Link />', () => (
    <Link to="/" onClick={action('clicked')}>Link</Link>
))
.add('<CommentContent />', () => (
    <CommentContent />
));
