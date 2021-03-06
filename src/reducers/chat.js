import _ from 'lodash';
import {
  CHAT_SET_USER,
  CONTROL_NEW_CONVERSATION,
  ADD_USER_NEW_CONVERSATION,
  CHAT_ACTIVE_CONVERSATION,
  CHAT_LOAD_CONVERSATION_HISTORY_SUCCESS,
  CHAT_ON_CONVERSATION_CHILD_ADD,
  CHAT_ON_MESSAGE_CHILD_ADD,
  CHAT_LOAD_MESSAGE_HISTORY_SUCCESS,
  CHAT_ON_CHANGE_ONLINE_STATE,
  CHAT_ON_NOTIFICATION,
  CHAT_ON_FAIL,
  CHAT_ON_DIRECT_MESSAGE_ADD,
} from '../constants';

const initialState = {
  newChat: {
    active: false,
  },
  conversations: [],
  messages: {},
  online: {},
  directMessages: {},
};
export default function chat(state = initialState, action) {
  switch (action.type) {
    case CHAT_SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    case CONTROL_NEW_CONVERSATION:
      return {
        ...state,
        newChat: {
          active: action.payload.active,
        },
        current: action.payload.active ? null : state.current,
      };
    case ADD_USER_NEW_CONVERSATION:
      return {
        ...state,
        newChat: {
          active: true,
          receiver: action.payload,
        },
      };
    case CHAT_ACTIVE_CONVERSATION:
      return {
        ...state,
        newChat: {
          active: false,
        },
        current: action.payload,
      };
    case CHAT_LOAD_CONVERSATION_HISTORY_SUCCESS:
      return {
        ...state,
        conversations: state.conversations.concat(action.payload),
      };
    case CHAT_ON_CONVERSATION_CHILD_ADD: {
      const currentConversations = state.conversations;
      const newConversation = action.payload;
      const oldIdx = _.findIndex(currentConversations, (o) => {
        if (Object.keys(o)[0] === Object.keys(newConversation)[0]) return true;
        return false;
      });
      if (oldIdx >= 0) {
        currentConversations.splice(oldIdx, 1);
      }
      return {
        ...state,
        conversations: [
          newConversation,
          ...currentConversations,
        ],
      };
    }
    case CHAT_ON_MESSAGE_CHILD_ADD: {
      const moc = (state.messages && state.messages[action.payload.conversationId]) || [];
      const newMoc = [
        ...moc,
        action.payload.message,
      ];
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.conversationId]: newMoc,
        },
      };
    }
    case CHAT_LOAD_MESSAGE_HISTORY_SUCCESS: {
      const moc = (state.messages && state.messages[action.payload.conversationId]) || [];
      const historys = action.payload.messages || {};
      const newMoc = _.map(Object.keys(historys), key => ({ [key]: historys[key] }));
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.conversationId]: newMoc.concat(moc),
        },
      };
    }
    case CHAT_ON_CHANGE_ONLINE_STATE:
      return {
        ...state,
        online: {
          ...state.online,
          ...action.payload,
        },
      };
    case CHAT_ON_NOTIFICATION: {
      const { value, removed } = action.payload;
      const currentNotification = value || state.notifications;
      if (removed && currentNotification && currentNotification[removed]) {
        delete currentNotification[removed];
      }
      return {
        ...state,
        notifications: Object.assign({}, currentNotification),
      };
    }
    case CHAT_ON_FAIL:
      return {
        ...state,
        error: action.error,
      };

    case CHAT_ON_DIRECT_MESSAGE_ADD: {
      const currentDirectMessages = state.directMessages;
      currentDirectMessages[action.payload.key] = action.payload.value;
      return {
        ...state,
        directMessages: Object.assign({}, currentDirectMessages),
      };
    }

    default:
      return state;
  }
}
