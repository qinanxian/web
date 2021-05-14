import React from 'react';
import { Cascader } from 'antd';

import { getDictItemTree } from '../../lib/base';
import config from '../../lib/config';
import { compose } from '../compose';
@compose
export default class RoCascader extends React.Component {
  constructor(props) {
    super(props);
    this.trees = [];
    this.state = {
      data: props.options || [],
    };
  }
  componentDidMount() {
    const { item, id, param, isTable } = this.props;
    this.transformTree();
    const { elementUIHint } = item;
    const { dictCodeMode, dictCodeLazy, dict } = elementUIHint;
    if (dictCodeMode === 'DictCode' && dictCodeLazy && !isTable) {
      getDictItemTree(param.dataFormId,
        id || item.code, this._serializeParam(param.params)).then((res) => {
        this.setState({
          data: dict && dict(res) || res,
        });
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.changeValue) {
      this.trees = [];
      this.flag = true;
    }
  }
  /* eslint-disable */
  _serializeParam = (params = {}, field) => {
    let str = '';
    if (typeof params === 'string') {
      str = params;
    } else {
      if (Array.isArray(params) && field) {
        params.forEach(p => {
          if (typeof p === 'string' || typeof p === 'number') {
            str = `${str};${field}=${p}`;
          }
        })
      } else {
        Object.keys(params).forEach(p => {
          if (Array.isArray(params[p])) {
            str = `${str};${this._serializeParam(params[p], p)}`;
          } else {
            str = `${str};${p}=${params[p]}`;
          }
        })
      }
    }
    return encodeURIComponent(str.replace(/^;/g, ''));
  };
  _optChildren = (children, data, allData, value) => {
    if (children.length === 1) {
      data.push(children[0].code);
      if (children[0].children && value !== children[0].code) {
        this._optChildren(children[0].children, data, allData, value);
      }
    } else {
      children.forEach((opt) => {
        let tempData = [].concat(data);
        tempData.push(opt.code);
        if (opt.children && value !== opt.code) {
          this._optChildren(opt.children, tempData, allData, value);
        }
        allData.push(tempData);
      });
    }
  };
  transformTree = () => {
    const data = [];
    const { options, value } = this.props;
    let tempOptions = [];
    if (this.flag) {
      tempOptions = [].concat(this.state.data);
    } else {
      tempOptions = [].concat(options);
    }
    tempOptions.forEach((opt) => {
      let tempData = [];
      tempData.push(opt.code);
      if (opt.children && value !== opt.code) {
        this._optChildren(opt.children, tempData, data, value);
      }
      data.push(tempData);
    });
    if (value) {
      return data.filter(d => d.includes(value))[0] || [];
    }
    return [];
  };
  findPath = (value, data) => {
    const { valueField = 'code' } = this.props;
    const sel = [];
    function loop(selected, children) {
      for (let i = 0; i < children.length; i += 1) {
        const item = children[i];
        if (selected === item[valueField]) {
          sel.push(item);
          return;
        }
        if (item.children) {
          loop(selected, item.children, item);
          if (sel.length) {
            sel.push(item);
            return;
          }
        }
      }
    }
    loop(value, data);
    return sel;
  };
  _getName = (value, data) => {
    const { labelField = 'name', item } = this.props;
    const { dictCodeTreeFull } = item.elementUIHint;
    let path = this.findPath(value, data).map(i => i[labelField]).reverse();
    if (dictCodeTreeFull) {
      return path.join(' / ');
    }
    return path[path.length - 1];
  };
  _onChange = (value, trees) => {
    const { onChange, valueField = 'code' } = this.props;
    this.trees = trees.map(tree => tree[valueField]);
    this.changeValue = value[value.length - 1];
    onChange && onChange(this.changeValue);
  };
  _displayRender = (label) => {
    const { item } = this.props;
    const { dictCodeTreeFull } = item.elementUIHint;
    if (dictCodeTreeFull) {
      return label.join(' / ');
    }
    return label[label.length - 1];
  };
  render() {
    const data = this.trees.length > 0 ? this.trees : this.transformTree();
    const { prefix = 'ro',labelField = 'name', valueField = 'code', style, readOnly, reading, value,isTable,valuenullholder } = this.props;
    const valueHolder = valuenullholder ? valuenullholder : config.valueNullHolder;
    if(reading){
      return (
        !isTable && !value ?
          <div style={{color:'rgba(150,150,150,0.4)'}} className={`${prefix}-under-line-${config.readingInfoUnderLine}`}>{valueHolder}</div>
          :
          <div className={`${prefix}-under-line-${!isTable && config.readingInfoUnderLine}`}>{value && this._getName(value, this.state.data)}</div>
      );
    }
    return (<Cascader
      readOnly={readOnly}
      options={this.state.data}
      fieldNames={{ label: labelField, value: valueField, children: 'children' }}
      style={style}
      placeholder='请选择'
      value={data}
      onChange={this._onChange}
      displayRender={this._displayRender}
    />);
  }
}
