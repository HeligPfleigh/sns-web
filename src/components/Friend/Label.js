import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './FriendStyle.scss';

class Label extends React.Component {
    static propTypes = {
        label: PropTypes.string.isRequired,
        isBold: PropTypes.bool
    }
    render() {
        const { label } = this.props;
        return (
            <h4>{label}</h4>
        );
    }
}

export default withStyles(s)(Label);
