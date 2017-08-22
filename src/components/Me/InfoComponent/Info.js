import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Button, Col } from 'react-bootstrap';
import s from './Info.scss';

const Info = ({ profile: { firstName, lastName, gender }, isMe, openInfoUpdate }) => (
  <div className={s.root}>
    <ul className={s.profile}>
      <li>
        <i className="fa fa-address-book-o fa-2x" aria-hidden="true"></i>
        <span>Họ</span> {lastName || ''}
      </li>
      <li>
        <i className="fa fa-envelope-o fa-2x" aria-hidden="true"></i>
        <span>Tên </span> { firstName || ''}
      </li>
      <li>
        <i className="fa fa-venus-mars fa-2x" aria-hidden="true"></i>
        <span>Giới tính</span>
        {gender === 'male' ? 'Nam' : 'Nữ'}
      </li>
      { isMe &&
        <li>
          <Col sm={2}></Col>
          <Col sm={10}>
            <Button bsStyle="primary" bsSize="large" className={s.button} onClick={openInfoUpdate}>
              Thay đổi
            </Button>
          </Col>
        </li>
         }
    </ul>
  </div>
);

Info.propTypes = {
  profile: PropTypes.shape({
    birthday: PropTypes.string,
    gender: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
  }).isRequired,
  isMe: PropTypes.bool.isRequired,
  openInfoUpdate: PropTypes.func,
};
Info.defaultProps = {
  birthday: '',
  phone: '',
  address: '',
  gender: '',
  email: '',
};
export default withStyles(s)(Info);

//  graphql(updateProfile, {
//      props: ({ mutate }) => ({
//        updateProfile: profile => mutate({
//          variables: { profile },
//          optimisticResponse: {
//            __typename: 'Mutation',
//            profile: {
//              picture: profile.picture,
//              firstName: profile.firstName,
//              lastName: profile.lastName,
//              gender: profile.gender,
//            },
//          },
//          updateQueries: {
//            mePageQuery: (previousResult, { mutationResult }) => {
//              const newProfile = mutationResult.data && mutationResult.data.profile;
//              return update(previousResult, {
//                me: {
//                  $set: newProfile,
//                },
//              },
//              );
//            },
//          },
//        }),
//      }),
//    }),
// )
