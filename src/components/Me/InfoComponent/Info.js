import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Button } from 'react-bootstrap';
import s from './Info.scss';

function editProfile() {
      // move to edit profile screen
}

const Info = ({ profile: { birthday, phone, address, gender, email }, isMe }) => (
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
        {gender || ''}
      </li>
      <li>
        <i className="fa fa-birthday-cake fa-2x" aria-hidden="true"></i>
        <span>Ngày Sinh</span> {birthday || ''}
      </li>
      { isMe && <li>
        <Button className={s.button} >
          Thay đổi
        </Button></li>
         }
    </ul>
  </div>
);
Info.propTypes = {
  profile: PropTypes.shape({
    birthday: PropTypes.string.isRequired,
    gender: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
  }).isRequired,
  isMe: PropTypes.bool.isRequired,
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