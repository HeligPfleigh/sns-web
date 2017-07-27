import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { withApollo } from 'react-apollo';
import {
  Button,
  FormControl,
  FormGroup,
  Radio,
} from 'react-bootstrap';
import s from './InfoTab.scss';
import {
  MALE,
  FEMALE,
  // GENDER,
} from '../../../constants';
import updateProfileMutation from './updateProfileMutation.graphql';

class InfoTab extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      firstName: props.profile.firstName,
      lastName: props.profile.lastName,
      gender: props.profile.gender,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      firstName: nextProps.profile.firstName,
      lastName: nextProps.profile.lastName,
      gender: nextProps.profile.gender,
    });
  }

  openInfoUpdate = (evt) => {
    evt.preventDefault();
    const {
      userId,
      queryData,
      paramData,
    } = this.props;
    const {
      firstName,
      lastName,
    } = this.state;
    this.props.client.mutate({
      mutation: updateProfileMutation,
      variables: {
        input: {
          userId,
          profile: {
            firstName,
            lastName,
            gender: MALE,
          },
        },
      },
      update: (store, { data: { updateUserProfile } }) => {
        // Read the data from our cache for this query.
        const data = store.readQuery({
          query: queryData,
          variables: paramData,
        });

        data.resident.profile.firstName = updateUserProfile.user.profile.firstName;
        data.resident.profile.lastName = updateUserProfile.user.profile.lastName;
        data.resident.profile.gender = updateUserProfile.user.profile.gender;

        // Write our data back to the cache.
        store.writeQuery({
          query: queryData,
          variables: paramData,
          data,
        });
      },
    });
  }

  handleChangeLastName = (e) => {
    this.setState({
      lastName: e.target.value,
    });
  }

  handleChangeFirstName = (e) => {
    this.setState({
      firstName: e.target.value,
    });
  }

  render() {
    return (
      <div className={s.root}>
        <form>
          <ul className={s.profile}>
            <li>
              <i className="fa fa-address-book-o fa-2x" aria-hidden="true"></i>
              <span>Họ</span>
              <FormControl
                type="text"
                value={this.state.lastName}
                placeholder="Enter text"
                onChange={this.handleChangeLastName}
              />
            </li>
            <li>
              <i className="fa fa-envelope-o fa-2x" aria-hidden="true"></i>
              <span>Tên</span>
              <FormControl
                type="text"
                value={this.state.firstName}
                placeholder="Enter text"
                onChange={this.handleChangeFirstName}
              />
            </li>
            <li>
              <i className="fa fa-venus-mars fa-2x" aria-hidden="true"></i>
              <span>Giới tính</span>
              <FormGroup>
                <Radio value={MALE} name="radioGroup" inline>
                  Nam
                </Radio>
                {' '}
                <Radio value={FEMALE} name="radioGroup" inline>
                  Nữ
                </Radio>
              </FormGroup>
            </li>
            <li>
              <Button className={s.button} onClick={this.openInfoUpdate}>
                Thay đổi
              </Button>
            </li>
          </ul>
        </form>
      </div>
    );
  }
}

InfoTab.propTypes = {};

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

export default withStyles(s)(withApollo(InfoTab));

