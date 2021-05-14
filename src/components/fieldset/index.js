import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Collapse  } from '../index';
import config from '../../lib/config';
import './style/index.less';

import Lite from './lite';

const Panel = Collapse.Panel;
const pageStyle = config.surface.defaultOptions.pageStyle;

export default class FieldSet extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      type: props.expanded === false ? 'plus' : 'minus',
    };
  }
  componentWillReceiveProps(nextProps){
    if (nextProps.expanded !== this.props.expanded) {
      this.setState({
        type: nextProps.expanded === false ? 'plus' : 'minus',
      });
    }
  }
  _iconClick = () => {
    const { showArray, onToggle } = this.props;
    if (showArray !== false) {
        if (this.state.type === 'minus') {
        this.setState({
          type: 'plus',
        });
        onToggle && onToggle(false);
      } else {
        this.setState({
          type: 'minus',
        });
        onToggle && onToggle(true);
      }
    }
  };
  _renderField = (children,readOnly,reading) => {
    /* eslint-disable */
    if(this.flag && children){
      if(Object.prototype.toString.call(children).slice(8,-1) === 'Object'){
        return React.cloneElement(children, { readOnly, reading, ...children.props});
      }
      return children.map((item,index) => React.cloneElement(item,{readOnly, reading,key:index, ...item.props}));
    }
    return null;
  };
  render() {
    const { permission : { action = [] } = {} } = this.context;
    const { children, readonly, reading, style = {}, className, legend,
      prefix = 'ro', showArrow = true, headerType,expanded, permitCode } = this.props;
    if (permitCode && !action.map(a => a.permitCode).includes(permitCode)) {
      // 如果该内容块没有权限则不显示
      style.display = 'none';
    }
    const { type } = this.state;
    const panelStyle = expanded ? {borderTop: 'transparent solid 1px',borderLeft: '#EAEAEA solid 1px',borderRight: '#EAEAEA solid 1px',borderBottom: '#EAEAEA solid 1px'} : {border: '1px solid transparent'};
    let tempClassName = `${prefix}-field-set`;
    if (type === 'minus') {
      this.flag = true;
      tempClassName = `${tempClassName}-expanded`;
    } else {
      tempClassName = pageStyle ? `${tempClassName}-unexpanded${pageStyle}` : `${tempClassName}-unexpanded`;
    }
    if (headerType === 'lite') {
        return <Lite {...this.props} style={{...style}}/>;
    }
    return (
      headerType !== 'gist' ?
        <fieldset
          className={`${prefix}-field-set ${className || ''} ${tempClassName} fieldset`}
          style={{
            ...style,
            margin:'5px',
            padding:'5px',
          }}
        >
          {
            showArrow ?
              (<legend onClick={this._iconClick}>
                <div className={`${prefix}-field-set-legend`}>
                  <Icon type={this.state.type} className={`${prefix}-field-set-legend-icon`}/>
                  <div className={`${prefix}-field-set-legend-content`}>{legend}</div>
                </div>
              </legend>)
              :
              (<legend>
                <div className={`${prefix}-field-set-legend`}>
                  <div className={`${prefix}-field-set-legend-content`}>{legend}</div>
                </div>
              </legend>)
          }
          <div style={{display:type !== 'minus' ? 'none' : ''}}>
            {this._renderField(children,readonly,reading)}
          </div>
        </fieldset>
        :
        <Collapse
          style={{margin:'10px 5px 5px 5px',border: 0,background:'#fff'}}
          defaultActiveKey={expanded ? ['1'] : []}
        >
          <Panel
            header={legend}
            key="1"
            style={{...panelStyle,marginBottom:'6px',background:'#fafafa'}}
          >
            {this._renderField(children,readonly,reading)}
          </Panel>
        </Collapse>
    );
  }
}

FieldSet.contextTypes = {
  permission: PropTypes.object,
};
