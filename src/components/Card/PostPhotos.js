import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PostPhotos.scss';
import { Image } from 'react-bootstrap';
import Gallery from 'react-grid-gallery';

class PostPhotos extends React.Component {

  render() {
    const { images } = this.props;
    const imagesToView = images.map(image => ({
      src: image,
      thumbnail: image,
      thumbnailWidth: 0,
      thumbnailHeight: 0,
    }));
    return (
      <div
        className={s.listImage}
      >
        {
        images.length > 1 ? <Gallery
          images={imagesToView}
          enableLightbox
          enableImageSelection={false}
        /> :
        <Image
          style={{
            margin: 'auto',
          }}
          src={images[0]}
          responsive
        />
      }

      </div>
    );
  }
}

PostPhotos.propTypes = {
  images: PropTypes.array,
};

export default withStyles(s)(PostPhotos);
