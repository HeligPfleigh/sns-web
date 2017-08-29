import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

const mutationMultipleUploadFile = gql`
  mutation UploadMultiFile($files: [Upload!]!) {
    uploadMultiFile(files: $files) {
      files {
        name
        type
        size
        url
      }
    }
  }
`;

class MultipleUploadFile extends Component {
  constructor(...args) {
    super(...args);

    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    event.preventDefault();
    const { multipleUploadFile, onSuccess, onError } = this.props;
    const mutate = multipleUploadFile(event);
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
        multiple
        onChange={this.onChange}
        className={this.props.className}
        ref={this.props.inputRef}
        accept={this.props.accept}
      />
    );
  }
}

MultipleUploadFile.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  multipleUploadFile: PropTypes.func.isRequired,
  className: PropTypes.string,
  inputRef: PropTypes.func.isRequired,
  accept: PropTypes.string.isRequired,
};

MultipleUploadFile.defaultProps = {
  onSuccess: () => undefined,
  onError: () => undefined,
  inputRef: () => undefined,
  accept: 'image/*',
};

export default compose(graphql(mutationMultipleUploadFile, {
  props: ({ mutate }) => ({
    multipleUploadFile: ({ target }) => {
      if (!target.validity.valid) {
        return null;
      }
      return mutate({
        variables: {
          files: target.files,
        },
      });
    },
  }),
}))(MultipleUploadFile);
