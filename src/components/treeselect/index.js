import React from 'react';
import { TreeSelect } from 'antd';
import config from '../../lib/config';
import { getDictItemTree } from '../../lib/base';
import { compose } from '../compose';

const TreeNode = TreeSelect.TreeNode;

@compose
export default class RoTreeSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.options || [],
        };
    }
    componentDidMount() {
        const { item, param, id, isTable,params } = this.props;
        const { elementUIHint } = item;
        const { dictCodeMode, dictCodeLazy, dict } = elementUIHint;
        if (dictCodeMode === 'DictCode' && dictCodeLazy && !isTable) {
            getDictItemTree(param && param.dataFormId || item.dataformId,
                id || item.code, this._serializeParam(param && param.params || params))
                .then((res) => {
                    if (!this.unMount) {
                        this.setState({
                            data: dict && dict(res) || res,
                        });
                    }
            });
        }
    }
    componentWillUnmount() {
        this.unMount = true;
    }

    onChange = (value) => {
        const { onChange } = this.props;
        onChange && onChange((value && value.value) || value);
    };
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
    _renderChildrenTree = (children) => {
        const { nodeTitle = 'name', nodeKey = 'code' } = this.props;
        return children.map((d) => {
            return (<TreeNode
                value={d[nodeKey]}
                title={d[nodeTitle]}
                key={d[nodeKey]}
                selectable={this._checkSelectable(d)}
            >{
                (d.children && d.children.length > 0) ? this._renderChildrenTree(d.children) : null
            }</TreeNode>);
        });
    };
    _checkSelectable = (d) => {
        const { dictCodeTreeLeafOnly } = this.props;
        if (dictCodeTreeLeafOnly) {
            return (!d.children || d.children.length === 0);
        }
        return true;
    };
    findPath = (value, data) => {
        const { nodeKey = 'code' } = this.props;
        const sel = [];
        function loop(selected, children) {
            for (let i = 0; i < children.length; i += 1) {
                const item = children[i];
                if (selected === item[nodeKey]) {
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
    _changeValue = (dictCodeTreeFull) => {
        const { value, nodeTitle = 'name' } = this.props;
        const { data } = this.state;
        let path = this.findPath(value, data).map(i => i[nodeTitle]).reverse();
        if (dictCodeTreeFull) {
            path = path.join(' / ');
        } else {
            path = path[path.length - 1];
        }
        return { value: value, label: path };
    };
    _filterTreeNode = (inputValue = '', treeNode) => {
        const title = treeNode.props.title || '';
        return title.includes(inputValue);
    };
    /* eslint-disable */
    render() {
        const { style, nodeTitle = 'name', nodeKey = 'code', readOnly, reading, item,isTable,valuenullholder, prefix = 'ro', disabledContainer, containerId } = this.props;
        const valueHolder = valuenullholder ? valuenullholder : config.valueNullHolder;
        const { dictCodeTreeFull } = item.elementUIHint;
        const styleObj = {
            ...style,
            minWidth:300
        };
        const tempValue = this._changeValue(dictCodeTreeFull);
        const value = tempValue.value;
        if (reading) {
            const retStyle = !isTable ? {paddingBottom: '10px',height: 'auto',lineHeight: '22px',paddingTop: '10px',whiteSpace: 'pre-wrap',wordWrap: 'break-word'} : {};
            return (
                !isTable && !value ?
                    <div className={`${prefix}-under-line-${config.readingInfoUnderLine}`} style={{color:'rgba(150,150,150,0.4)'}}>{valueHolder}</div>
                    :
                    <div
                        className={`${prefix}-under-line-${!isTable && config.readingInfoUnderLine}`}
                        style={retStyle}
                    >{tempValue.label}</div>
            )
        }
        return (
            <TreeSelect
                style={styleObj}
                value={(dictCodeTreeFull && tempValue && tempValue.value) ? tempValue : tempValue.value}
                readOnly={readOnly}
                disabled={readOnly}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="请选择"
                allowClear
                onChange={this.onChange}
                labelInValue={dictCodeTreeFull}
                getPopupContainer={triggerNode => {
                    if (disabledContainer) {
                        return document.body;
                    } else if(containerId) {
                      return document.getElementById(containerId);
                    }
                    return triggerNode.parentNode;
                }}
                showSearch
                searchPlaceholder='搜索'
                filterTreeNode={this._filterTreeNode}
            >
                {
                    this.state.data.map((d) => {
                        return (<TreeNode
                            value={d[nodeKey]}
                            title={d[nodeTitle]}
                            key={d[nodeKey]}
                            selectable={this._checkSelectable(d)}
                        >{
                            (d.children && d.children.length > 0) ? this._renderChildrenTree(d.children) : null
                        }</TreeNode>);
                    })
                }
            </TreeSelect>
        );
    }
}
