import template from 'lodash/template';

export default (message, attributes) => template(message)({ ...attributes });
