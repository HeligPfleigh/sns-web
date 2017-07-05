import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Button } from 'react-bootstrap';
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
      { isMe && <li>
        <Button className={s.button} onClick={openInfoUpdate}>
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
  openInfoUpdate: PropTypes.func.isRequired,
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
