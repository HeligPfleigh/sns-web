import template from 'lodash/template';

const interpolate = /:([\s\S]+?)/g;
export default (message, attributes) => template(message, { interpolate })({ ...attributes });
