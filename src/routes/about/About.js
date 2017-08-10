import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';

// Graphqls
import fetchUserById from './graphql/fetchUserById.graphql';

class About extends Component {
  static propTypes = {
    data: PropTypes.shape({
      error: PropTypes.string,
      loading: PropTypes.bool,
      user: PropTypes.object,
    }).isRequired,
  };

  static defaultProps = {
    data: {
      error: undefined,
      loading: false,
      user: {},
    },
  };

  /**
   *
   * @param {*} args
   */
  constructor(...args) {
    super(...args);

    // Default state
    this.state = {
      showModal: false,
    };
  }

  /**
   * Render view
   */
  render() {
    return <div dangerouslySetInnerHTML={{ __html: JSON.stringify(this.props.data.user) }} />;
  }
}

export default compose(graphql(fetchUserById, {
  options: () => ({
    variables: {
      fetchPolicy: 'cache-and-netword',
      userId: '58f9ca042d4581000484b197',
    },
  }),
  props: ({ data }) => ({
    data,
  }),
}))(About);
