import validator from 'validator';
import isEmpty from 'lodash/isEmpty';

// required object value
export const objRequired = value => (isEmpty(value) ? 'Trường bắt buộc' : undefined);

// Check required
export const required = value => (value ? undefined : 'Trường bắt buộc');

// Check hasWhiteSpace
export const hasWhiteSpace = value => (
  value && validator.contains(value, ' ')
    ? 'Trường có chứa khoảng trắng'
    : undefined
);

// Check max length
export const maxLength = max => value => (
  value && value.length > max
    ? `Cần phải ${max} ký tự trở xuống`
    : undefined
);
export const maxLength9 = maxLength(9);
export const maxLength15 = maxLength(15);
export const maxLength25 = maxLength(25);

// Check min length
export const minLength = min => value => (
  value && value.length < min
    ? `Cần phải ${min} ký tự trở lên`
    : undefined
);
export const minLength2 = minLength(2);
export const minLength4 = minLength(4);
export const minLength6 = minLength(6);

export const strLength = (min = 5, max = 25) => value => (
  value && !validator.isLength(value, { min, max })
    ? `Chuỗi có độ dài từ ${min} đến ${max} ký tự`
    : undefined
);
export const normalLength = strLength();
export const longLength = strLength(5, 255);

// Check number
export const number = value => (
  value && !validator.isNumeric(value)
    ? 'Cần phải nhập số'
    : undefined
);

// Check min value
export const minValue = min => value => (
  value && value < min
    ? `Cần phải số lớn hơn ${min}`
    : undefined
);
export const minValue16 = minValue(16);
export const minValue18 = minValue(18);

export const comparePassword = (pattern, value) => (
  value && value === pattern
    ? undefined
    : 'Mật khẩu vừa nhập không giống nhau'
);

// Check email
export const email = value => (
  value && !validator.isEmail(value)
    ? 'Email không hợp lệ'
    : undefined
);

export const alphaNumeric = value => (
  value && !validator.isAlphanumeric(value)
    ? 'Chỉ nhập ký tự chữ và số'
    : undefined
);

// phone validate
export const phoneNumber = value => (
  value && !validator.isMobilePhone(value, 'vi-VN')
    ? 'Số điện thoại không hợp lệ'
    : undefined
);

// password validate
export const password = value => (
  value && (!(/\d/.test(value)) || !(/[A-Z]/.test(value)))
    ? 'Mật khẩu phải chứa kí tự in hoa và chữ số'
    : undefined
);

// username validate
export const hasSpecialChart = value => (
  value && (
    (!validator.isAlphanumeric(value) && !validator.isAlpha(value))
    && !validator.matches(value, /^[\w.]+$/g)
  )
    ? 'Tài khoản có chứa kí tự đặc biệt'
    : undefined
);

// username validate
export const chartFirstRequired = value => (
  value && validator.isNumeric(value.charAt(0))
    ? 'Kí tự đầu tiên phải là chữ'
    : undefined
);
