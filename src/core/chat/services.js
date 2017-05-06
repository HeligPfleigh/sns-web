import * as firebase from 'firebase';
import EventEmitter from 'events';

export class FirebaseProvider {

  constructor(config) {
    const defaultApp = firebase.initializeApp(config);
    this.service = defaultApp;
  }
  async getStaticData(ref) {
    if (typeof ref === 'string') {
      ref = this.service.database().ref(ref);
    }
    const promise = new Promise((resolve, reject) => {
      ref.once('value').then((snapshot) => {
        resolve(snapshot.val());
      }).catch((error) => {
        reject(error);
      });
    });
    const data = await promise;
    return data;
  }
  async auth(token) {
    try {
      await this.service.auth().signInWithCustomToken(token);
      let user = await this.service.auth().currentUser;
      user = await this.getStaticData(`users/${user.uid}`);
      this.user = user;
      const amOnline = this.service.database().ref('/.info/connected');
      const userRef = this.service.database().ref(`/online/${user.uid}`);
      amOnline.on('value', (snapshot) => {
        if (snapshot.val()) {
          userRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
          userRef.set(true);
        }
      });
      return user;
    } catch (error) {
      return error;
    }
  }
  async setUser(user) {
    if (this.user) {
      await this.service.database().ref(`users/${this.user.uid}`).set(user);
    }
  }
  async getUser(chatId) {
    if (this.user && chatId) {
      const user = await this.getStaticData(`users/${chatId}`);
      return user;
    }
    return this.user;
  }
  async onMessage({ conversationId }, cb) {
    if (this.user) {
      const messengerRef = this.service.database().ref(`messages/${conversationId}`);
      messengerRef.limitToLast(20).on('child_added', (snapshot) => {
        cb(null, { [snapshot.key]: snapshot.val() });
      });
    }
  }
  async sendMessage(data) {
    if (this.user) {
      const updates = {};
      if (!data.conversationId) {
        data.conversationId = await this.service.database().ref().child('conversations').push().key;
        updates[`/members/${data.conversationId}`] = {
          [this.user.uid]: true,
          [data.to.uid]: true,
        };
        updates[`/conversations/${data.conversationId}`] = {
          meta: {
            lastMessage: data.message,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
          },
          user: this.user,
          receiver: data.to,
        };
      } else {
        updates[`/conversations/${data.conversationId}/meta`] = {
          lastMessage: data.message,
          timestamp: firebase.database.ServerValue.TIMESTAMP,
        };
      }
      const messageId = await this.service.database().ref().child('messages').push().key;
      updates[`/messages/${data.conversationId}/${messageId}`] = {
        message: data.message,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        user: this.user.uid,
      };

      await this.service.database().ref().update(updates);
      this.makeNotification(data, messageId);
      return data.conversationId;
    }
    return null;
  }
  onConversation(cb) {
    if (this.user) {
      const ref = this.service.database().ref('members/');
      ref.orderByChild(this.user.uid).equalTo(true).on('child_added', (snapshot) => {
        const refConversation = this.service.database().ref(`conversations/${snapshot.key}`);
        refConversation.on('value', (chatSnap) => {
          const value = chatSnap.val();
          if (value && value.meta) {
            const conversation = { [chatSnap.key]: value };
            cb(null, conversation);
          }
        });
      });
    }
  }
  onChangeStatus(friend, cb) {
    if (this.user && friend) {
      const refOnlineFriend = this.service.database().ref(`online/${friend.uid}`);
      refOnlineFriend.on('value', (chatSnap) => {
        const value = chatSnap.val();
        if (value) {
          const status = { [chatSnap.key]: value };
          cb(null, status);
        }
      });
    }
  }
  onNotification(cb) {
    if (this.user) {
      const refNotification = this.service.database().ref(`notifications/${this.user.uid}`);
      refNotification.on('value', (chatSnap) => {
        const value = chatSnap.val();
        if (value) {
          cb(null, value);
        }
      });
    }
  }
  async makeNotification(data, messageId) {
    if (this.user) {
      const { conversationId } = data;
      let { to } = data;
      if (!to) {
        const conversation = await this.getStaticData(`conversations/${conversationId}`);
        if (conversation && conversation.user && conversation.receiver) {
          to = conversation.receiver;
          if (to.uid === this.user.uid) {
            to = conversation.user;
          }
        }
      }
      this.service.database().ref(`notifications/${to.uid}/${conversationId}`).set(messageId);
    }
  }
  makeNotificationRead(data) {
    if (this.user) {
      const { conversationId } = data;
      this.service.database().ref(`notifications/${this.user.uid}/${conversationId}`).remove();
    }
  }
  dataEvent(params) {
    const eventEmitter = new EventEmitter();
    if (this.user) {
      let dataRef;
      if (!params) {
        dataRef = this.service.database().ref();
        dataRef.on('value', (snapshot) => {
          eventEmitter.emit('data', snapshot.val());
        });
      }
      if (params && params.conversations) {
        dataRef = this.service.database().ref('conversations');
        dataRef.on('value', (snapshot) => {
          eventEmitter.emit('data', snapshot.val());
        });
      }
    }
    return eventEmitter;
  }
}
const serviceChatFactory = {
  createClient: (Provider, config) => new Provider(config),
};
export default serviceChatFactory;
