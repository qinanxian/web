import React from 'react';

import './style/index.less';
import * as rest from '../../lib/rest';

export default class ImageViewer extends React.Component{
  constructor(props){
    super(props);
    this.containerId =  `ro-${Math.uuid(8)}`;
    this.state = {
      pick: props.pick,
      images: props.images || [],
    };
  }
  componentDidMount(){
    const { didMount } = this.props;
    this.generateImageView();
    didMount && didMount({setImages: this._setImages});
  }
  componentWillReceiveProps(nextProps){
    this._setImages(nextProps.images || [], nextProps.initialViewIndex);
  }
  componentDidUpdate(prevProps, prevState){
    if (prevState.images !== this.state.images) {
      this.generateImageView();
    }
  }
  generateImageView = () => {
    const { width = 500, height = 500 } = this.props;
    if (this.viewer) {
      this.viewer.destroy();
      this.viewer = null;
    }
    const galley = this.instance;
    /* eslint-disable */
    this.viewer = new Viewer(galley, {
      height: height,
      width: width,
      url: (image) => {
        const { images } = this.state;
        const index = image.getAttribute('index');
        const data = images[parseInt(index, 10)];
        return rest.getRequestURL(data.url, data.containSession);
      },
      container: `#${this.containerId}`,
      navbar: false,
      button: false,
      fullscreen: false,
      backdrop: false,
      view: (e) => {
        this.setState({
          pick: e.detail.index,
        });
      },
    });
    this.viewer.view(this.state.pick);
    this.viewer.show();
  };
  _setImages = (images, index = this.state.pick) => {
    this.setState({
      images,
      pick: index || 0
    });
  };
  imgClick = (k) => {
    this.setState({
      pick: k,
    }, () => {
      this.viewer.view(this.state.pick);
    })
  };
  render() {
    const { pick, images } = this.state;
    const { width = 500, height = 500 } = this.props;
    return (
      <div
        className="ro-image-viewer-container"
        style={{width: width + 110, height: height}}
      >
        <div
          className="ro-image-viewer-container-galley"
          ref={instance => this.instance = instance}
          style={{width: 100, height: height}}
        >
          <ul className="ro-image-viewer-container-pictures">
            {
              images.map((i, index) => (
                <li key={index} className={`${pick === index ? 'ro-image-viewer-container-img-active' : ''}`}>
                  <img
                    index={index}
                    onClick={() => this.imgClick(index)}
                    src={rest.getRequestURL(i.thumbnailUrl, i.containSession)}
                    alt={i.info}
                  />
                </li>
              ))
            }
          </ul>
        </div>
        <div
          id={this.containerId}
          className="ro-image-viewer-container-header-title-container"
          style={{width: width, height: height}}>
          <div
            className="viewer-title ro-image-viewer-container-header-title"
          >
            {images[pick] && images[pick].title}
          </div>
        </div>
      </div>
    );
  }
}
