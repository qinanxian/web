import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';

import config from '../../../src/lib/config';
import { addOnResize } from '../../../src/lib/listener';

const profileConfig = config.waterMark && config.waterMark.config || {};

export default class WaterMark extends React.Component{
  static defaultProps = {
    watermarkX:20,//水印起始位置x轴坐标
    watermarkY:20,//水印起始位置Y轴坐标
    rows:20,//水印行数
    cols:20,//水印列数
    xSpace:100,//水印x轴间隔
    ySpace:50,//水印y轴间隔
    color:'#aaa',//水印字体颜色
    alpha:0.4,//水印透明度
    fontsize:'15px',//水印字体大小
    font:'微软雅黑',//水印字体
    width:210,//水印宽度
    height:80,//水印长度
    angle:15,//水印倾斜度数
    ...profileConfig,
  };
  componentDidMount() {
    // 页面宽高发生变化时需要重新绘制
    addOnResize(() => {
      this.update();
    });
  }
  componentWillUnmount() {
    this.flag = true;
  }
  getStyle = (left, top) => {
    const { angle, alpha, fontsize, font, color, width, height } = this.props;
    return {
      WebkitTransform: `rotate(-${angle}deg)`,
      MozTransform: `rotate(-${angle}deg)`,
      msTransform: `rotate(-${angle}deg)`,
      OTransform: `rotate(-${angle}deg)`,
      transform: `rotate(-${angle}deg)`,
      visibility: '',
      position: 'absolute',
      left: `${left}px`,
      top: `${top}px`,
      overflow: 'hidden',
      zIndex: '9999',
      pointerEvents: 'none',
      opacity: alpha,
      fontSize: fontsize,
      fontFamily: font,
      color,
      textAlign: 'center',
      width: `${width}px`,
      height: `${height}px`,
      display: 'block',
    };
  };
  update = () => {
    if (!this.flag) {
      this.forceUpdate();
    }
  };
  number2Array = (number) => {
    const tempArray = [];
    for (let i = 0; i < number; i += 1) {
      tempArray.push(i);
    }
    return tempArray;
  };
  calcItem = (children) => {
    const { cols, watermarkX, width, xSpace, rows, watermarkY, ySpace, height } = this.props;
    const tempProps = {...this.props};
    let pageWidth = document.body.clientWidth;
    const cutWidth = pageWidth * 0.0150;
    pageWidth -= cutWidth;
    const pageHeight = document.body.clientHeight;
    //如果将水印列数设置为0，或水印列数设置过大，超过页面最大宽度，则重新计算水印列数和水印x轴间隔
    if (cols === 0 || (parseInt(watermarkX + width * cols + xSpace * (cols - 1), 10) > pageWidth)) {
      tempProps.cols = parseInt((pageWidth - watermarkX + xSpace) / (width + xSpace), 10);
      tempProps.xSpace = parseInt((pageWidth - watermarkX - width * tempProps.cols)
        / (tempProps.cols - 1), 10);
    }
    //如果将水印行数设置为0，或水印行数设置过大，超过页面最大长度，则重新计算水印行数和水印y轴间隔
    if (rows === 0 ||
      (parseInt(watermarkY + height * rows + ySpace * (rows - 1), 10) > pageHeight)) {
      tempProps.rows = parseInt((ySpace + pageHeight - watermarkY) / (height + ySpace),10);
      tempProps.ySpace = parseInt(((pageHeight - watermarkY) - height * tempProps.rows)
        / (tempProps.rows - 1), 10);
    }
    let left = 0;
    let top = 0;
    return (<div>
      {this.number2Array(tempProps.rows).map((row) => {
        top = tempProps.watermarkY + (tempProps.ySpace + tempProps.height) * row;
        return (<Fragment key={Math.uuid()}>{
          this.number2Array(tempProps.cols).map((col) => {
            left = tempProps.watermarkX + (tempProps.width + tempProps.xSpace) * col;
            return (<div key={Math.uuid()} id={`mask_div_${row}_${col}`} className='mask_div' style={this.getStyle(left, top)}>
              {children}
            </div>);
          })
        }</Fragment>);
      })}
    </div>);
  };
  render() {
    const { children } = this.props;
    return ReactDOM.createPortal(this.calcItem(children), document.body);
  }
}
