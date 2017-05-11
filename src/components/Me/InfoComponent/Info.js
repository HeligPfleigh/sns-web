import React, { PropTypes } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import update from 'immutability-helper';
import { Button } from 'react-bootstrap';

import s from './Info.scss';

const CHANGE = 'Thay đổi thông tin';
const SAVE = 'Lưu';
const UserFragment =
  gql`
  fragment UserView on UserSchemas {
    _id,
    username,
    profile {
      picture,
      firstName,
      lastName
    }
  }
  `;


const updateProfile = gql`mutation updateProfile ($profile: UpdateProfileInput!) {
  updateProfile(profile : $profile) {
    ...UserView
    }
  }
  ${UserFragment}`;

class Info extends React.Component {

  static propTypes = {
    profile: PropTypes.object.isRequired,
    updateProfile: PropTypes.func.isRequired,
    isMe: PropTypes.bool.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      profile: this.props.profile,
    };
  }
  editProfile = () => {
    this.setState({
      isEdit: !this.state.isEdit,

    });

    if (this.state.isEdit === true) {
      this.props.updateProfile(this.state.profile);
    }
  };
  genderChange =(e) => {
    const { profile: { picture, firstName, lastName } } = this.state;
    this.setState({
      profile: {
        picture,
        firstName,
        lastName,
        gender: e.target.value,
      },
    });
  };
  render() {
    const { address, email, gender, birthday, phone } = this.state.profile;
    const { isMe } = this.props;
    return (

      <div className={s.root}>

        <ul className={s.profile}>

          <li className={s.fixfont}>
            <i className="fa fa-mobile fa-3x " aria-hidden="true"></i><span>Số điện thoại</span> {phone || ''}
          </li>
          <li>
            <i className="fa fa-address-book-o fa-2x" aria-hidden="true"></i>
            <span>Địa Chỉ</span> {address || ''}
          </li>
          <li>
            <i className="fa fa-envelope-o fa-2x" aria-hidden="true"></i>
            <span>Email </span> { email || ''}
          </li>
          <li>
            <i className="fa fa-venus-mars fa-2x" aria-hidden="true"></i>
            <span>Giới tính</span>
            { this.state.isEdit && <input type="text" name="gender" value={gender} onChange={this.genderChange} /> }
            {!this.state.isEdit && gender && gender}
          </li>
          <li>
            <i className="fa fa-birthday-cake fa-2x" aria-hidden="true"></i>
            <span>Ngày Sinh</span> {birthday || ''}
          </li>
          { isMe && <li>
            <Button
              onClick={this.editProfile}
              className={s.button}
            >
              {this.state.isEdit ? SAVE : CHANGE}
            </Button></li>
         }
        </ul>
      </div>


    );
  }
}

export default compose(
  withStyles(s),
   graphql(updateProfile, {
     props: ({ mutate }) => ({
       updateProfile: profile => mutate({
         variables: { profile },
         optimisticResponse: {
           __typename: 'Mutation',
           profile: {
             picture: profile.picture,
             firstName: profile.firstName,
             lastName: profile.lastName,
             gender: profile.gender,
           },

         },
         updateQueries: {

           mePageQuery: (previousResult, { mutationResult }) => {
             const newProfile = mutationResult.data && mutationResult.data.profile;
             return update(previousResult, {
               me: {
                 $set: newProfile,
               },
             },
             );
           },
         },
       }),

     }),
   }),

)(Info);
