import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

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
  constructor(...args) {
    super(...args);

    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    event.preventDefault();
    const { singleUploadFile, onSuccess, onError } = this.props;
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
};

SingleUploadFile.defaultProps = {
  onSuccess: () => undefined,
  onError: () => undefined,
  inputRef: () => undefined,
  accept: 'image/*',
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
