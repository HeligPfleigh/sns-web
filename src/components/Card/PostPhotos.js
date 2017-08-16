import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Image, Row } from 'react-bootstrap';
import Gallery from './Gallery';
import s from './PostPhotos.scss';

class PostPhotos extends React.Component {

  render() {
    const { images } = this.props;
    const imagesToView = images.map(image => ({
      src: image,
      thumbnail: image,
    }));
    return (
      <Row>
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
      </Row>
    );
  }
}

PostPhotos.propTypes = {
  images: PropTypes.array,
};

export default withStyles(s)(PostPhotos);
