import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import { generate as idRandom } from 'shortid';
import Loading from '../../components/Loading';
import FriendList from '../../components/Friend/FriendList';
import Friend from '../../components/Friend/Friend';
import { ACCEPTED } from '../../constants';
import s from './Conversation.scss';
import { addNewUserToConversation } from '../../actions/chat';

const newMessageQuery = gql`query newMessageQuery {
  me {
    _id,
    username,
    profile {
      picture,
      firstName,
      lastName
    }
    friends {
      _id
      profile {
        picture,
        firstName,
        lastName
      }
      chatId
    }
  }
}
`;

@graphql(newMessageQuery)
@connect(
  null,
  { addNewUserToConversation })
class NewMessage extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    addNewUserToConversation: PropTypes.func.isRequired,
  };
  constructor() {
    super();
    this.state = {
      searchText: null,
    };
  }
  componentDidMount() {
    this.input.focus();
  }
  handleChangeSearch = (e) => {
    this.setState({
      searchText: e.target.value,
    });
  }
  handleFriendAction = (friend) => {
    this.props.addNewUserToConversation(friend);
  }
  render() {
    const { data: { loading, me } } = this.props;
    const { searchText } = this.state;
    return (
      <div className={s.toNewMess}>
        <div className={s.searchBox}>
          <label htmlFor="searchToMess">Chát với: </label>
          <input id="searchToMess" ref={(node) => { this.input = node; }} onChange={this.handleChangeSearch} placeholder="Nhập tên một người bạn..." />
        </div>
        {
          searchText &&
          <div className={`${s.listPeopleBox} col-md-4 col-xs-12`}>
            <Loading show={loading} />
            {
              me && me.friends &&
              <FriendList className={s.listPeople}>
                {
                  me.friends.map(friend => <Friend
                    key={idRandom()}
                    friend={friend}
                    friendType={ACCEPTED}
                    handleFriendAction={this.handleFriendAction}
                  />)
                }
              </FriendList>
            }
          </div>
        }
      </div>
    );
  }
}

export default withStyles(s)(NewMessage);
