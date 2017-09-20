import isArray from 'lodash/isArray';
import Message from './Helper/Message';

const validate = (file) => {
  if (isArray(file)) {
    return file.every(val => validate(val));
  }

  return /\.(jpg|svg|jpeg|png|bmp|gif)$/i.test(file.name);
};

const Img = (attribute, message = 'The ${ attribute } must be an image.') => value => (validate(value) ? undefined : Message(message, { attribute }));
Img.validate = validate;

export default Img;
