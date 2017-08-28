import isString from 'lodash/isString';
import merge from 'lodash/merge';
import isFQDN from './FQDN';

const defaultEmailOptions = {
  allow_display_name: false,
  require_display_name: false,
  allow_utf8_local_part: true,
  require_tld: true,
};

const displayName = /^[a-z\d!#$%&'*+\-/=?^_`{|}~.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+[a-z\d!#$%&'*+\-/=?^_`{|}~,.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\s]*<(.+)>$/i;
const emailUserPart = /^[a-z\d!#$%&'*+\-/=?^_`{|}~]+$/i;
const quotedEmailUser = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f]))*$/i;
const emailUserUtf8Part = /^[a-z\d!#$%&'*+\-/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/i;
const quotedEmailUserUtf8 = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i;

const isByteLength = (str, options) => {
  if (!isString(str)) {
    return false;
  }

  let min;
  let max;
  if (typeof (options) === 'object') {
    min = options.min || 0;
    max = options.max;
  } else { // backwards compatibility: isByteLength(str, min [, max])
    min = arguments[1];
    max = arguments[2];
  }
  const len = encodeURI(str).split(/%..|./).length - 1;
  return len >= min && (typeof max === 'undefined' || len <= max);
};

export default (str, options) => {
  if (!isString(str)) {
    return false;
  }

  options = merge(options, defaultEmailOptions);
  if (options.require_display_name || options.allow_display_name) {
    const displayEmail = str.match(displayName);
    if (displayEmail) {
      str = displayEmail[1];
    } else if (options.require_display_name) {
      return false;
    }
  }

  const parts = str.split('@');
  const domain = parts.pop();
  let user = parts.join('@');

  const lowerDomain = domain.toLowerCase();
  if (lowerDomain === 'gmail.com' || lowerDomain === 'googlemail.com') {
    user = user.replace(/\./g, '').toLowerCase();
  }

  if (!isByteLength(user, { max: 64 }) || !isByteLength(domain, { max: 254 })) {
    return false;
  }

  if (!isFQDN(domain, { require_tld: options.require_tld })) {
    return false;
  }

  if (user[0] === '"') {
    user = user.slice(1, user.length - 1);
    return options.allow_utf8_local_part ? quotedEmailUserUtf8.test(user) : quotedEmailUser.test(user);
  }

  const pattern = options.allow_utf8_local_part ? emailUserUtf8Part : emailUserPart;
  const userParts = user.split('.');

  for (let i = 0; i < userParts.length; i++) {
    if (!pattern.test(userParts[i])) {
      return false;
    }
  }

  return true;
};
