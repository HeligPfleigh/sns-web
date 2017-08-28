import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Col, Image } from 'react-bootstrap';
import s from './ApartmentItem.scss';
import history from '../../../../core/history';

class ApartmentItem extends Component {

  onRedirect = () => {
    const { apartment: { _id } } = this.props;
    history.push(`/apartment/${_id}`);
  }

  render() {
    const { apartment } = this.props;

    return (
      <Col style={{ marginBottom: 10 }} md={6} >
        <div className={s.building} onClick={this.onRedirect}>
          <div className={s.photo}>
            <Image responsive alt={apartment.display} src={apartment.avarta || '/bg.jpg'} />
          </div>
          <div className={s.content}>
            <h5 className={s.title}>{apartment.display}</h5>
            <p>
              <strong>
                <p>{apartment.name}</p>
              </strong>
            </p>
          </div>
        </div>
      </Col>
    );
  }
}

ApartmentItem.propTypes = {
  apartment: PropTypes.object.isRequired,
};

export default withStyles(s)(ApartmentItem);

