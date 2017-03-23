import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLBoolean as Boolean,
} from 'graphql';

import UserSchemas from '../../schemas/UserSchemas';
import { UsersModel, FriendsRelationModel } from '../../models';

const addFriend = {
  type: UserSchemas,
  args: {
    _id: { type: StringType },
  },
  resolve: async ({ request }, { _id }) => {
    console.warn('handing error');
    const r = await FriendsRelationModel.create({
      user: request.user.id,
      friend: _id
    });
    return UsersModel.findOne({
      _id
    });
  },
};

export default addFriend;
