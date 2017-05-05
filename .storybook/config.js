import { configure, addDecorator } from '@kadira/storybook';
import ContextProvider from './ContextProvider';

function loadStories() {
  require('./stories/index.js');
  // You can require as many stories as you need.
}


const context = {
  insertCss: () => {

  }
};

addDecorator(story => (
  <ContextProvider context={context}>
    {story()}
  </ContextProvider>
));

configure(loadStories, module);
