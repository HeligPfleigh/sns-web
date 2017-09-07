import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Image, Col } from 'react-bootstrap';
import Gallery from './Gallery';
import s from './PostPhotos.scss';

class PostPhotos extends Component {

  render() {
    const { images } = this.props;
    const imagesToView = images.map(image => ({
      src: image,
      thumbnail: image,
    }));
    return (
      <Col>
        {
          images.length > 1 ? <Gallery
            images={imagesToView}
          /> :
          <Image
            style={{
              margin: 'auto',
            }}
            src={images[0]}
            responsive
          />
        }
      </Col>
    );
  }
}

PostPhotos.propTypes = {
  images: PropTypes.array,
};

export default withStyles(s)(PostPhotos);
