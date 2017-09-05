import React from 'react';
import PropTypes from 'prop-types';
import {
  HelpBlock,
 } from 'react-bootstrap';

import { DraftEditor } from '../Editor';

export default class ReduxFormEditorField extends DraftEditor {
  constructor(...args) {
    super(...args);

    this.firstFocusing = 0;
  }

  onFocus(...args) {
    this.firstFocusing++;
    super.onFocus(...args);
  }

  onBlur(...args) {
    this.firstFocusing++;
    super.onBlur(...args);
  }

  render() {
    const { meta: { touched, error, warn } } = this.props;
    return (<div>
      {super.render()}
      {touched && this.firstFocusing > 1 && (error || warn) && <HelpBlock>{error || warn}</HelpBlock>}
    </div>);
  }
}

ReduxFormEditorField.propTypes = {
  meta: PropTypes.object.isRequired,
};
