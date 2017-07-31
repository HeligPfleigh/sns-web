import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ListImagePreview.scss';
import { Image } from 'react-bootstrap';


class ListImagePreview extends React.Component {
  render() {
    const { images } = this.props;
    return (
      <div
        className={s.listImage}
      >
        {
          images.map((element, index) => (
            <div
              className={s.wrapperImage}
            >
              <Image
                className={s.imageCrop}
                src={typeof element === 'string' ? element : null}
                responsive
              />
              <i
                onClick={() => {
                  this.props.onDeleteImage(index);
                }}
                className={`${s.deleteButton} fa fa-times`}
                aria-hidden="true"
              ></i>
            </div>
          ))
        }
      </div>
    );
  }
}

ListImagePreview.propTypes = {
  images: PropTypes.array.isRequired,
  onDeleteImage: PropTypes.func.isRequired,
};

export default withStyles(s)(ListImagePreview);
