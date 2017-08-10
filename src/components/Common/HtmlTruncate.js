import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import PropTypes from 'prop-types';

export default class HtmlTruncate extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    maxLength: PropTypes.number.isRequired,
    options: PropTypes.shape({
      keepImageTag: PropTypes.bool,
      truncateLastWord: PropTypes.bool,
      slop: PropTypes.number,
      ellipsis: PropTypes.string,
    }),
  }

  static defaultProps = {
    options: {
      keepImageTag: false,
      truncateLastWord: true,
      slop: 10,
      ellipsis: '...',
    },
    maxLength: 20,
  };

  /**
   *
   */
  constructor(...args) {
    super(...args);

    this.options = {
      KEY_VALUE_REGEX: '([\\w|-]+\\s*(=\\s*"[^"]*")?\\s*)*',
      IS_CLOSE_REGEX: '\\s*\\/?\\s*',
      CLOSE_REGEX: '\\s*\\/\\s*',
    };

    this._removeImageTag = this._removeImageTag.bind(this);
    this._dumpCloseTag = this._dumpCloseTag.bind(this);
    this._getTag = this._getTag.bind(this);
    this._getEndPosition = this._getEndPosition.bind(this);
    this._truncate = this._truncate.bind(this);
  }

  /**
   * Remove image tag
   *
   * @param {String} string not-yet-processed string
   * @return {String} string without image tags
   */
  _removeImageTag(str) {
    const match = new RegExp(`<img\\s*${this.options.KEY_VALUE_REGEX}${this.options.IS_CLOSE_REGEX}>`).exec(str);
    if (!match) {
      return str;
    }

    const i = match.index;
    const len = match[0].length;
    return str.substring(0, i) + str.substring(i + len);
  }

  /**
   * Dump all close tags and append to truncated content while reaching upperbound
   *
   * @param {String[]} tags a list of tags which should be closed
   * @return {String} well-formatted html
   */
  _dumpCloseTag(tags) {
    let html = '';
    tags.reverse().forEach((t) => {
      // dump non-excluded tags only
      if (['img', 'br'].indexOf(t) === -1) {
        html += `</${t}>`;
      }
    });

    return html;
  }

  /**
   * Process tag string to get pure tag name
   *
   * @private
   * @param {String} string original html
   * @return {String} tag name
   */
  _getTag(str) {
    let t = str.indexOf(' ');
    // we have to figure out how to handle non-well-formatted HTML case
    if (t === -1) {
      t = str.indexOf('>');
      if (t === -1) {
        throw new Error(`HTML tag is not well-formed : ${str}`);
      }
    }

    return str.substring(1, t);
  }

  /**
   * Get the end position for String#substring()
   *
   * If options.truncateLastWord is FALSE, we try to the end position up to
   * options.slop characters to avoid breaking in the middle of a word.
   *
   * @private
   * @param {String} string original html
   * @param {Number} tailPos (optional) provided to avoid extending the slop into trailing HTML tag
   * @return {Number} maxLength
   */
  _getEndPosition(str, total, options, maxLength, tailPos) {
    const defaultPos = maxLength - total;
    let position = defaultPos;
    const isShort = defaultPos < options.slop;
    const slopPos = isShort ? defaultPos : options.slop - 1;
    const startSlice = isShort ? 0 : defaultPos - options.slop;
    const endSlice = tailPos || (defaultPos + options.slop);
    const WORD_BREAK_REGEX = new RegExp('\\W+', 'g');
    if (!options.truncateLastWord) {
      const substr = str.slice(startSlice, endSlice);
      if (tailPos && substr.length <= tailPos) {
        position = substr.length;
      } else {
        let result;
        while (!((result = WORD_BREAK_REGEX.exec(substr)) === null)) {
          // a natural break position before the hard break position
          if (result.index < slopPos) {
            position = defaultPos - (slopPos - result.index);
            // keep seeking closer to the hard break position
            // unless a natural break is at position 0
            if (result.index === 0 && defaultPos <= 1) break;
          } else if (result.index === slopPos) { // a natural break position exactly at the hard break position
            position = defaultPos;
            break; // seek no more
          } else { // a natural break position after the hard break position
            position = defaultPos + (result.index - slopPos);
            break; // seek no more
          }
        }
      }
      if (str.charAt(position - 1).match(/\s$/)) {
        position--;
      }
    }
    return position;
  }

  /**
   * Truncate HTML string and keep tag safe.
   *
   * @param {String} string string needs to be truncated
   * @param {Number} maxLength length of truncated string
   * @param {Object} options (optional)
   * @param {Boolean} [options.keepImageTag] flag to specify if keep image tag, false by default
   * @param {Boolean} [options.truncateLastWord] truncates last word, true by default
   * @param {Number} [options.slop] tolerance when options.truncateLastWord is false before we give up and just truncate at the maxLength position, 10 by default (but not greater than maxLength)
   * @param {Boolean|String} [options.ellipsis] omission symbol for truncated string, '...' by default
   * @return {String} truncated string
   */
  _truncate(string, maxLength, options) {
    const SELF_CLOSE_REGEX = new RegExp(`<\\/?\\w+\\s*${this.options.KEY_VALUE_REGEX}${this.options.CLOSE_REGEX}>`);
    const HTML_TAG_REGEX = new RegExp(`<\\/?\\w+\\s*${this.options.KEY_VALUE_REGEX}${this.options.IS_CLOSE_REGEX}>`);
    const URL_REGEX = new RegExp('(((ftp|https?)://)[-w@:%_+.~#?,&//=]+)|((mailto:)?[_.w-]+@([w][w-]+.)+[a-zA-Z]{2,3})>', 'g');
    const items = [];

    let matches = true;
    let total = 0;
    let content = '';
    while (matches) {
      let result;
      let index;
      let tag;
      let selfClose;

      matches = HTML_TAG_REGEX.exec(string);
      if (!matches) {
        if (total >= maxLength) {
          break;
        }

        matches = URL_REGEX.exec(string);
        if (!matches || matches.index >= maxLength) {
          content += string.substring(0, this._getEndPosition(string, total, options, maxLength));
          break;
        }

        while (matches) {
          result = matches[0];
          index = matches.index;
          content += string.substring(0, (index + result.length) - total);
          string = string.substring(index + result.length);
          matches = URL_REGEX.exec(string);
        }
        break;
      }

      result = matches[0];
      index = matches.index;

      if (total + index > maxLength) {
        // exceed given `maxLength`, dump everything to clear stack
        content += string.substring(0, this._getEndPosition(string, total, options, maxLength, index));
        break;
      }
      total += index;
      content += string.substring(0, index);

      if (result[1] === '/') {
        // move out open tag
        items.pop();
        selfClose = null;
      } else {
        selfClose = SELF_CLOSE_REGEX.exec(result);
        if (!selfClose) {
          tag = this._getTag(result);

          items.push(tag);
        }
      }

      if (selfClose) {
        content += selfClose[0];
      } else {
        content += result;
      }
      string = string.substring(index + result.length);
    }

    if (string.length > maxLength - total && options.ellipsis) {
      content += options.ellipsis;
    }
    content += this._dumpCloseTag(items);

    if (!options.keepImageTag) {
      content = this._removeImageTag(content);
    }

    return content;
  }

  /**
   *
   */
  render() {
    const { children, maxLength, options } = this.props;
    return <div dangerouslySetInnerHTML={{ __html: this._truncate(ReactDOMServer.renderToStaticMarkup(children), maxLength, options) }} />;
  }
}
