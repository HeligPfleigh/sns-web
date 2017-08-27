import isArray from 'lodash/isArray';
import Message from './Helper/Message';

export const isImage = (file) => {
  if (isArray(file)) {
    return file.every(val => isImage(val));
  }

  return /\.(jpg|svg|jpeg|png|bmp|gif)$/i.test(file.name);
};

export default (attribute, message = 'The :attribute must be an image.') => value => isImage(value) ? undefined : Message(message, { attribute });
