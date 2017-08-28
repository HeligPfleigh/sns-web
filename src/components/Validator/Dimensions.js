import { isImage } from './Image';
import Message from './Helper/Message';

const validateImage = (file, width, height) => {
  const URL = window.URL || window.webkitURL;
  return new Promise((resolve) => {
    const image = new Image();
    image.onerror = () => resolve({ valid: false });
    image.onload = () => resolve({
      valid: image.width === Number(width) && image.height === Number(height),
    });

    image.src = URL.createObjectURL(file);
  });
};

const validate = (files, [width, height]) => {
  const list = [];
  for (let i = 0; i < files.length; i++) {
    // if file is not an image, reject.
    if (!isImage(files[i].name)) {
      return false;
    }

    list.push(files[i]);
  }

  return Promise.all(list.map(file => validateImage(file, width, height)));
};

export default (attribute, message = 'The ${ attribute } has invalid image dimensions.', width, height) => value => validate(value, [width, height]) ? undefined : Message(message, { attribute });
