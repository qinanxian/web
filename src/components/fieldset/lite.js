import React from 'react';
import { Icon } from '../index';

import './style/index.less';

export default class Lite extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            expand: props.expanded,
        };
    }
    _iconClick = () => {
        this.setState({
            expand: !this.state.expand,
        });
    };
    _renderField = (children,readOnly,reading) => {
        /* eslint-disable */
        if(children){
            if(Object.prototype.toString.call(children).slice(8,-1) === 'Object'){
                return React.cloneElement(children, { readOnly, reading, ...children.props});
            }
            return children.map((item,index) => React.cloneElement(item,{readOnly, reading,key:index, ...item.props}));
        }
        return null;
    };
    render() {
        const { expand } = this.state;
        const { prefix = 'ro', showArrow, children, readonly, reading, legend, style } = this.props;
        const otherClass = expand ? ` ${prefix}-field-set-lite-header-icon-expand` : '';
        return (
          <div className={`${prefix}-field-set-lite-container fieldset`} style={style}>
            <div
                className={`${prefix}-field-set-lite-header`}
                onClick={this._iconClick}
            >
              <span
                className={`${prefix}-field-set-lite-header-icon${otherClass}`}
                style={{display: showArrow ? 'inline' : 'none'}}
              >
                <Icon type="right"/>
              </span>
              <span className={`${prefix}-field-set-lite-header-title`}>{legend}</span>
            </div>
            <div
                className={`${prefix}-field-set-lite-content`}
                style={{display: expand ? 'block' : 'none'}}
            >
                {this._renderField(children,readonly,reading)}
            </div>
            <div className={`${prefix}-field-set-lite-border`}>{}</div>
          </div>
        );
    }
}
