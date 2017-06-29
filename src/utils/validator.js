// Check required
export const required = value => (value ? undefined : 'Trường bắt buộc');

// Check max length
export const maxLength = max => value => (value && value.length > max ? `Cần phải ${max} ký tự trở xuống` : undefined);
export const maxLength15 = maxLength(15);
export const maxLength25 = maxLength(25);

// Check min length
export const minLength = min => value => (value && value.length < min ? `Cần phải ${min} ký tự trở lên` : undefined);
export const minLength2 = minLength(2);
export const minLength6 = minLength(6);

// Check number
export const number = value => (value && isNaN(Number(value)) ? 'Cần phải nhập số' : undefined);

// Check min value
export const minValue = min => value => (value && value < min ? `Cần phải số lớn hơn ${min}` : undefined);
export const minValue16 = minValue(16);
export const minValue18 = minValue(18);

// Check email
export const email = value => (
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Email không hợp lệ'
    : undefined
);

export const alphaNumeric = value => (
  value && /[^a-zA-Z0-9 ]/i.test(value)
    ? 'Chỉ nhập ký tự chữ và số'
    : undefined
);

export const phoneNumber = value => (
  value && !/^(0|[1-9][0-9]{9})$/i.test(value)
    ? 'Số điện thoại không hợp lệ'
    : undefined
);
