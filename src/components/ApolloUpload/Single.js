import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import isEmpty from 'lodash/isEmpty';
import includes from 'lodash/includes';

import uploadFileValidator from '../../utils/valid.upload.file';

const mutationSingleUploadFile = gql`
  mutation UploadSingleFile($file: Upload!) {
    uploadSingleFile(file: $file) {
      file {
        name
        type
        size
        url
      }
    }
  }
`;

class SingleUploadFile extends Component {

  onChange = (event) => {
    event.preventDefault();
    const {
      onError,
      fileSize,
      onSuccess,
      allowedFormats,
      singleUploadFile,
    } = this.props;
    const { files } = event.target;
    if (isEmpty(files)) {
      return onError('Bạn chưa chọn tập tin đính kèm cho văn bản');
    }

    const validMessage = uploadFileValidator(
      files[0],
      {
        fileSize: fileSize || 1,
        allowedFormats: allowedFormats || [],
      },
    );

    if (validMessage) {
      return onError(validMessage);
    }

    onError(null);

    const mutate = singleUploadFile(event);
    if (mutate) {
      mutate.then(({ data }) => onSuccess(data));
      mutate.catch(onError);
    }
  }

  render() {
    return (
      <input
        type="file"
        required
        onChange={this.onChange}
        className={this.props.className}
        ref={this.props.inputRef}
        accept={this.props.accept}
      />
    );
  }
}

SingleUploadFile.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  singleUploadFile: PropTypes.func.isRequired,
  className: PropTypes.string,
  inputRef: PropTypes.func.isRequired,
  accept: PropTypes.string.isRequired,
  fileSize: PropTypes.number,
  allowedFormats: PropTypes.array,
};

SingleUploadFile.defaultProps = {
  onSuccess: () => undefined,
  onError: () => undefined,
  inputRef: () => undefined,
  accept: 'image/*',
  fileSize: 1,
  allowedFormats: [],
};

export default compose(graphql(mutationSingleUploadFile, {
  props: ({ mutate }) => ({
    singleUploadFile: ({ target }) => {
      if (!target.validity.valid) {
        return null;
      }
      return mutate({
        variables: {
          file: target.files[0],
        },
      });
    },
  }),
}))(SingleUploadFile);
