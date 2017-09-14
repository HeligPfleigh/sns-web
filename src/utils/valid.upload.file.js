import isNumber from 'lodash/isNumber';
import isEmpty from 'lodash/isEmpty';
import includes from 'lodash/includes';

export default (file, { fileSize, allowedFormats }) => {
  const fileName = file.name;
  const extension = fileName.split('.').pop().toLowerCase();

  // Valid extensions file
  if (!isEmpty(allowedFormats) && !includes(allowedFormats, extension)) {
    return 'Định dạng tập tin không hợp lệ';
  }

  // Valid size of file
  if (fileSize) {
    const size = file.size;
    fileSize = isNumber(fileSize) ? fileSize : 1;
    if (size > (1024 * 1024 * fileSize)) {
      return `Kích thước tập tin lớn hơn ${fileSize}MB`;
    }
  }

  return false;
};
