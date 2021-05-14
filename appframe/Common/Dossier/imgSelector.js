/**
 * Created by dpcui on 2019/3/13.
 */

import React, { Component } from 'react';
import { Icon } from 'roface';
import './style/index.less';

class ImgSelector extends Component {
  static defaultProps = {
    fileArray: []
  };

  constructor(props) {
    super(props);
    const arr = props.fileArray.concat().map(item => ({ ...item, __selected:false }));
    this.state = {
      selectedArray: arr,
    };
  }

  _setSelected = (i, bool) => {
    const { selectedArray } = this.state;
    selectedArray[i].__selected = bool;
    this.setState({ selectedArray });
    this.props.onChange && this.props.onChange(selectedArray.filter(item => item.__selected));
  };

  render() {
    const { selectedArray } = this.state;
    const { rest } = this.props;
    return(
      <div className='crops-pic-card-list-container-item-box'>
        {selectedArray.map((ob, i) =>
          <div style={{ position: 'relative' }} key={i}>
            <div
              className='crops-pic-card-list-container-item-box-modal'
              onClick={() => this._setSelected(i, false)}
              style={{
                opacity: ob.__selected ? 1 : 0,
                display: ob.__selected ? '' : 'none'
              }}
            >
              <Icon type='check' style={{ fontSize: 40, color: '#0f0' }} />
            </div>
            <img
              key={ob.showCode}
              onClick={() => this._setSelected(i, true)}
              className='crops-pic-card-list-container-item-box-img'
              alt={ob.fileId}
              src={rest.getRequestURL(`/common/dossier/showFile/${ob.showCode}`, true)}
            />
          </div>
        )}
      </div>
    )
  }
}

export default ImgSelector;
