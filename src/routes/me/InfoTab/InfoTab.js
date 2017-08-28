import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import ProfileReduxForm from './ProfileReduxForm';
import updateProfileMutation from './updateProfileMutation.graphql';

class InfoTab extends Component {

  constructor(props) {
    super(props);
    this.state = {
      firstName: props.profile.firstName,
      lastName: props.profile.lastName,
      gender: props.profile.gender,
      isInfoUpdate: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      firstName: nextProps.profile.firstName,
      lastName: nextProps.profile.lastName,
      gender: nextProps.profile.gender,
    });
  }

  openInfoUpdate = () => {
    this.setState({
      isInfoUpdate: true,
    });
  }

  closeInfoUpdate = () => {
    this.setState({
      isInfoUpdate: false,
    });
  }

  submit = (values) => {
    // print the form values to the console
    // evt.preventDefault();
    const {
      userId,
      queryData,
      paramData,
    } = this.props;
    const {
      firstName,
      lastName,
      gender,
    } = values;
    this.props.client.mutate({
      mutation: updateProfileMutation,
      variables: {
        input: {
          userId,
          profile: {
            firstName,
            lastName,
            gender,
          },
        },
      },
      update: (store, { data: { updateUserProfile } }) => {
        // Read the data from our cache for this query.
        const data = store.readQuery({
          query: queryData,
          variables: paramData,
        });

        data.me.profile.firstName = updateUserProfile.user.profile.firstName;
        data.me.profile.lastName = updateUserProfile.user.profile.lastName;
        data.me.profile.gender = updateUserProfile.user.profile.gender;

        // Write our data back to the cache.
        store.writeQuery({
          query: queryData,
          variables: paramData,
          data,
        });
      },
    });
    this.closeInfoUpdate();
  }

  render() {
    return (
      <div style={{ marginTop: '-5px', marginBottom: '100px', backgroundColor: '#fff', clear: 'both', padding: '20px 15px' }}>
        <ProfileReduxForm
          onSubmit={this.submit}
          firstName={this.state.firstName}
          lastName={this.state.lastName}
          gender={this.state.gender}
          isInfoUpdate={this.state.isInfoUpdate}
          openInfoUpdate={this.openInfoUpdate}
          closeInfoUpdate={this.closeInfoUpdate}
        />
      </div>
    );
  }
}

InfoTab.propTypes = {
  userId: PropTypes.string,
  profile: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    gender: PropTypes.string,
  }).isRequired,
  client: PropTypes.object.isRequired,
  queryData: PropTypes.object.isRequired,
  paramData: PropTypes.object.isRequired,
};

InfoTab.defaultProps = {
  profile: {
    firstName: '',
    lastName: '',
    gender: '',
  },
};

export default withApollo(InfoTab);

