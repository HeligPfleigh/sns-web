import React from 'react';
import PropTypes from 'prop-types';
import {
  HelpBlock,
 } from 'react-bootstrap';

import { DraftEditor } from '../Editor';

export default class ReduxFormEditorField extends DraftEditor {
  render() {
    const { meta: { touched, error, warn } } = this.props;
    return (<div>
      {super.render()}
      {touched && (error || warn) && <HelpBlock>{error || warn}</HelpBlock>}
    </div>);
  }
}

ReduxFormEditorField.propTypes = {
  meta: PropTypes.object.isRequired,
};
