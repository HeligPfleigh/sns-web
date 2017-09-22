import isFunction from 'lodash/isFunction';
import Alpha from './Alpha';
import AlphaDash from './AlphaDash';
import AlphaNumeric from './AlphaNumeric';
import AlphaSpaces from './AlphaSpaces';
import Ascii from './Ascii';
import Base64 from './Base64';
import * as Between from './Between';
import Contains from './Contains';
import Date from './Date';
import Decimal from './Decimal';
import Digits from './Digits';
import Dimensions from './Dimensions';
import Email from './Email';
import Equals from './Equals';
import Hexadecimal from './Hexadecimal';
import HexColor from './HexColor';
import Image from './Image';
import In from './In';
import Int from './Int';
import IP from './IP';
import * as Max from './Max';
import * as Min from './Min';
import MongoId from './MongoId';
import NotIn from './NotIn';
import Numeric from './Numeric';
import Regex from './Regex';
import Required from './Required';
import * as Size from './Size';
import Url from './Url';
import UUID from './UUID';

const Validator = (callback) => {
  if (!isFunction(callback)) {
    return undefined;
  }

  return (...args) => callback.call(Validator, ...args);
};

Validator.Alpha = Alpha;
Validator.AlphaDash = AlphaDash;
Validator.AlphaNumeric = AlphaNumeric;
Validator.AlphaSpaces = AlphaSpaces;
Validator.Ascii = Ascii;
Validator.Base64 = Base64;
Validator.Between = Between;
Validator.Contains = Contains;
Validator.Date = Date;
Validator.Decimal = Decimal;
Validator.Digits = Digits;
Validator.Dimensions = Dimensions;
Validator.Email = Email;
Validator.Equals = Equals;
Validator.Hexadecimal = Hexadecimal;
Validator.HexColor = HexColor;
Validator.Image = Image;
Validator.In = In;
Validator.Int = Int;
Validator.IP = IP;
Validator.Max = Max;
Validator.Min = Min;
Validator.MongoId = MongoId;
Validator.NotIn = NotIn;
Validator.Numeric = Numeric;
Validator.Regex = Regex;
Validator.Required = Required;
Validator.Size = Size;
Validator.Url = Url;
Validator.UUID = UUID;

export default Validator;
