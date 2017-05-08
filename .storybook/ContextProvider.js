import React, { Component, PropTypes } from 'react';

export default class ContextProvider extends Component {

    static propTypes = {
        children: PropTypes.node.isRequired,
        context: PropTypes.object.isRequired
    };

    static contextTypes = {
        insertCss: PropTypes.func
    };

    static childContextTypes = {
        insertCss: PropTypes.func.isRequired
    };

    getChildContext() {
        return this.props.context;
    }

    render() {
        return this.props.children;
    }

}