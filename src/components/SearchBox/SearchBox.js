import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import debounce from 'lodash/debounce';
import Autosuggest from 'react-autosuggest';
// import queryString from 'query-string';
import AutosuggestHighlightParse from 'autosuggest-highlight/parse';
import Link from '../Link';
import history from '../../core/history';
import s from './SearchBox.scss';

// const wordCharacterRegex = /[a-z0-9_]/i;
const whitespacesRegex = /\s+/;

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function match(text, query) {
  // text = removeDiacritics(text);
  return (
    query
      .trim()
      .split(whitespacesRegex)
      // If query is blank, we'll get empty string here, so let's filter it out.
      .filter(word => word.length > 0)
      .reduce((result, word) => {
        const wordLen = word.length;
        // var prefix = wordCharacterRegex.test(word[0]) ? '\\b' : '';
        // var regex = new RegExp(prefix + escapeRegexCharacters(word), 'i');
        const regex = new RegExp(escapeRegexCharacters(word), 'i');
        const index = text.search(regex);
        if (index > -1) {
          result.push([index, index + wordLen]);
          // Replace what we just found with spaces so we don't find it again.
          text =
            text.slice(0, index) +
            new Array(wordLen + 1).join(' ') +
            text.slice(index + wordLen);
        }
        return result;
      }, [])
      .sort((match1, match2) => match1[0] - match2[0])
  );
}

function getSuggestionValue(suggestion) {
  return `${suggestion.firstName} ${suggestion.lastName}`;
}

function renderSuggestion(suggestion, { query }) {
  const suggestionText = `${suggestion.firstName} ${suggestion.lastName}`;
  const matches = match(suggestionText, query);
  const parts = AutosuggestHighlightParse(suggestionText, matches);
  return (
    <Link to={`/user/${suggestion.userId}`} style={{ textDecoration: 'none' }}>
      <span className={'suggestion-content '}>
        <img className={'suggestion-avatar'} src={suggestion.picture} alt={suggestion.picture} />
        <span className="name">
          {
            parts.map((part) => {
              const className = part.highlight ? 'highlight' : null;
              return (
                <span className={className} key={Math.random()}>{part.text}</span>
              );
            })
          }
        </span>
      </span>
    </Link>
  );
}

// function renderSuggestionsContainer({ containerProps, children, query }) {

//   return (
//     <div {... containerProps} onClick={handleClick}>
//       {children}
//       {query && children &&
//         <div className="react-autosuggest_footer">
//           <Link to={`/search?keyword=${query}`} style={{ textDecoration: 'none', color: '#337ab7' }}>
//             Hiển thị thêm kết quả
//           </Link>
//         </div>
//       }
//     </div>
//   );
// }

class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      suggestions: [],
      isMobile: this.props.isMobile,
      showForm: false,
    };
    this.handerSearchAPI = this.handerSearchAPI.bind(this);
  }

  onClick = () => {
    this.setState({ showForm: true });
  }

  onBlur = () => {
    const { value } = this.state;
    if (value === '') {
      this.setState({ showForm: false });
    }
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  onKeyDown = (event) => {
    const { value } = this.state;
    if (event.key === 'Enter' && value !== '') {
      history.push(`/search?keyword=${value}`);
    }
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      value,
    }, this.handerSearchAPI);
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  onClickAutoSuggestFooter = () => {
    this.setState({ suggestions: [] });
  };

  handerSearchAPI = debounce(() => {
    const { value } = this.state;
    if (!value) return;
    this.props.client.query({
      query: gql`query searchBoxQuery ($keyword: String!, $numberOfFriends: Int) {
        search (keyword: $keyword, numberOfFriends: $numberOfFriends){
          _id
          profile {
            picture
            firstName
            lastName
          }
        }
      }`,
      variables: {
        keyword: value,
        numberOfFriends: 5,
      },
    }).then((result) => {
      this.setState({
        suggestions: result.data.search.map(item => ({
          userId: item._id,
          firstName: item.profile.firstName,
          lastName: item.profile.lastName,
          picture: item.profile.picture,
        })),
      });
    });
  }, 300);

  renderSuggestionsContainer = ({ containerProps, children, query }) => (
    <div {... containerProps}>
      {children}
      {query && children &&
        <div
          className="react-autosuggest_footer"
          onClick={this.onClickAutoSuggestFooter}
        >
          <Link to={`/search?keyword=${query}`} style={{ textDecoration: 'none', color: '#337ab7' }}>
            Xem thêm
          </Link>
        </div>
      }
    </div>
  );

  render() {
    const { isMobile, showForm, value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Tìm kiếm...',
      value,
      onChange: this.onChange,
      onBlur: this.onBlur,
      onKeyDown: this.onKeyDown,
    };
    const theme = {
      container: 'react-autosuggest__container',
      containerOpen: 'react-autosuggest__container--open',
      input: 'react-autosuggest__input',
      inputOpen: 'react-autosuggest__input--open',
      inputFocused: 'react-autosuggest__input--focused',
      suggestionsContainer: 'react-autosuggest__suggestions-container',
      suggestionsContainerOpen: 'react-autosuggest__suggestions-container--open',
      suggestionsList: 'react-autosuggest__suggestions-list',
      suggestion: 'react-autosuggest__suggestion',
      suggestionFirst: 'react-autosuggest__suggestion--first',
      suggestionHighlighted: 'react-autosuggest__suggestion--highlighted',
      suggestionFocused: 'react-autosuggest__suggestion--focused',
    };
    if (!isMobile || showForm === true) {
      return (
        <Autosuggest
          theme={theme}
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestionsContainer={this.renderSuggestionsContainer}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
        />
      );
    }
    return (
      <div className={s.mSearchRoot}>
        <span onClick={this.onClick}>
          <i className="fa fa-search fa-lg" aria-hidden="true"></i>
        </span>
      </div>
    );
  }
}
SearchBox.defaultProps = {
  isMobile: false,
};
SearchBox.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  client: PropTypes.any,
};

export default withApollo(withStyles(s)(SearchBox));
