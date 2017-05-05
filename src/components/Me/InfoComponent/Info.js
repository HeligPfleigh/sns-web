import React, { Component, PropTypes } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import update from 'immutability-helper';
import { Button } from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form';
import DateComponent from './DateComponent';

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

class Info extends Component {

  static propTypes = {
    profile: PropTypes.object.isRequired,
    updateProfile: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      profile: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    const { profile } = nextProps;
    if (profile && profile !== this.props.profile) {
      this.setState({ profile });
    }
  }
  handleOnSubmit = (values) => {
    console.log(values);
    const { isEdit } = this.state;
    this.setState({
      isEdit: !isEdit,
    });
  }
  handleEnableEdit = (e) => {
    e.preventDefault();
    const { isEdit } = this.state;
    this.setState({
      isEdit: !isEdit,
    });
    /*
    if (this.state.isEdit === true) {
      this.props.updateProfile(profile);
    }
    */
  }
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
  }
   

  render() {
    const {
      address,
      email,
      gender,
      birthday,
      phone } = this.state.profile;
    const { isEdit } = this.state;
    const { handleSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit(this.handleOnSubmit)}>
        <div className={s.root}>

          <ul className={s.profile}>

            <li className={s.fixfont}>
              <i className="fa fa-mobile fa-3x " aria-hidden="true"></i>
              <span>Số điện thoại</span>
              {isEdit
              ? <Field
                name="phone"
                component="input"
                type="text"
              />
              : phone || ''
              }
            </li>
            <li>
              <i className="fa fa-address-book-o fa-2x" aria-hidden="true"></i>
              <span>Địa Chỉ</span>
              {isEdit && <Field name="address" component="input" type="text" value={address || ''} /> }

            </li>
            <li>
              <i className="fa fa-envelope-o fa-2x" aria-hidden="true"></i>
              <span>Email </span>
              {isEdit
              && <Field
                name="email"
                component="input"
                type="text"
              />}
              {!isEdit && email && email}
            </li>
            <li>
              <i className="fa fa-venus-mars fa-2x" aria-hidden="true"></i>
              <span>Giới tính</span>
              {isEdit
              && (<label>
                <Field
                  name="gender"
                  component="input"
                  type="radio" value="male"
                />
                  Male
                </label>)}
              {isEdit
              && (<label>
                <Field
                  name="gender"
                  component="input"
                  type="radio"
                  value="female"
                />
               Female
               </label>)}
              {!this.state.isEdit && gender && gender}
            </li>
            <li>
              <i className="fa fa-birthday-cake fa-2x" aria-hidden="true"></i>
              <span>Ngày Sinh</span>
            {isEdit && <Field name="date" component={DateComponent} selected={new Date()} />}
              {birthday || ''}
            </li>
            <li>
              <Button
                type={isEdit ? 'submit' : 'button'}
                onClick={!isEdit ? this.handleEnableEdit : null}
                className={s.button}
              >
                {this.state.isEdit ? SAVE : CHANGE}
              </Button>
            </li>
          </ul>
        </div>
      </form>
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
             debugger;
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

reduxForm({ form: 'myform' }))(Info);
