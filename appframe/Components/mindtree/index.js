import React from 'react';
import {Tree} from 'antd';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {Icon, Message, Divider, Row, Col, Tooltip} from '../../../src/components';
import {depthFirstSearch} from '../../../src/lib/menutransform';
import { addOnResize } from '../../../src/lib/listener';
/* eslint-disable */
import styles from './index.less'; // eslint-disable-line

const {TreeNode} = Tree;

class MindTree extends React.Component {
    constructor(props) {
        super(props);
        const {dataSource, dataEcho} = this.props;
        const treeData = dataSource;
        let flatData = [];
        depthFirstSearch(dataSource || [], (menuItem) => {
            flatData.push(menuItem);
        });
        this.flatData = flatData;
        this.treeData = treeData;
        this.leftSpan = dataEcho ? 14 : 24;
        this.rightSpan = dataEcho ? 10 : 0;
        this.state = {
            loading: false,
            open: false,
            selectedInfo: null,
            autoExpandParent: true,
            defaultExpandAll: true,
            treeData,
            clipboardData: [],
            checkedKeys: [],
            halfCheckedKeys: [],
            expandedKeys: ['root']
        };
    }


    componentDidMount() {
        this.checkHeight();
        addOnResize(this.checkHeight);
    }

    checkHeight = () => {
        if (this.treeInstance) {
            this.treeInstance.style.height = document.body.offsetHeight - 190 + 'px';
        }
        if (this.codeSelectedInstance) {
            this.codeSelectedInstance.style.height = document.body.offsetHeight - 230 + 'px';
        }
    };

    _toggleCopy = (isShow) => {
        const copyPre = document.getElementById('copy-pre');
        copyPre.style.opacity = isShow ? 1 : 0;
    };

    _idDepth = (id) => {
        const idArray = id && id.split('.') || [];
        return idArray.length;
    };

    _expandDepth = (depth) => {
        const tempExpandedKeys = this.flatData.filter(item => this._idDepth(item.path) <= depth);
        const expandedKeys = tempExpandedKeys
          .map(item => item.path)
          .sort((a, b) => a.split('.').length - b.split('.').length);
        this.setState({
            expandedKeys,
        });
    };

    _renderToolbar = () => {
        return (
            <Col span={24}>
                {/*<Divider type="vertical" />*/}
                {/*<Tooltip title="??????JSON??????" placement="bottom">*/}
                {/*<Icon type="fa-code" className="icon-jsmind" onClick={() => this._exportData()}/>*/}
                {/*</Tooltip>*/}
                {/*<Divider type="vertical" />*/}
                {/*<Tooltip title="??????Yaml??????" placement="bottom">*/}
                {/*<Icon type="fa-code" className="icon-jsmind" onClick={() => this._exportData('yaml')}/>*/}
                {/*</Tooltip>*/}
                <Divider type="vertical"/>
                <Tooltip title="????????????" placement="bottom" className="icon-jsmind" onClick={() => this._expandDepth(1)}>
                    <Icon type="fa-expand"> ??????</Icon>
                </Tooltip>
                <Divider type="vertical"/>
                <Tooltip title="????????????" placement="bottom" className="icon-jsmind" onClick={() => this._expandDepth(2)}>
                    <Icon type="fa-expand"> ??????</Icon>
                </Tooltip>
                <Divider type="vertical"/>
                <Tooltip title="????????????" placement="bottom" className="icon-jsmind" onClick={() => this._expandDepth(3)}>
                    <Icon type="fa-expand"> ??????</Icon>
                </Tooltip>
                <Divider type="vertical"/>
                <Tooltip title="????????????" placement="bottom" className="icon-jsmind" onClick={() => this._expandDepth(4)}>
                    <Icon type="fa-expand"> ??????</Icon>
                </Tooltip>
                <Divider type="vertical"/>
                {/*<Tooltip title="????????????" placement="bottom" className="icon-jsmind" onClick={() => this._expandDepth(5)}>*/}
                {/*<Icon type="fa-expand"> ??????</Icon>*/}
                {/*</Tooltip>*/}
                {/*<Divider type="vertical" />*/}
            </Col>
        );
    };

    _onExpand = (treeExpandedKeys) => {
        // ??????????????????????????????????????????????????????????????????
        // ???????????????????????????????????????root??????
        const sortedExpandedKeys = treeExpandedKeys.sort((a, b) => a.split('.').length - b.split('.').length);
        const tempExpandedKeys = sortedExpandedKeys
          .map(id => {
              let resultArray = this._getParentKeys(id);
              const flags = resultArray.map(item => sortedExpandedKeys.includes(item));
              return flags.some(item => !item) ? undefined : id;
          });
        this.setState({
            expandedKeys: [...new Set(tempExpandedKeys)],
            autoExpandParent: false,
        });
    };

    _getParentKeys = (key) => {
        const resultArray = [];
        if (key === 'root') return ['root'];
        const keyArray = key.split('.');
        for (let i = keyArray.length - 1; i > 0; i--) {
            const tempIds = keyArray.slice(0, i);
            const result = tempIds.join('.');
            resultArray.push(result);
        }
        return resultArray;
    };

    _onCheck = (checkedKeys, info) => {
        const halfCheckedKeys = info.halfCheckedKeys;
        const checkedNodes = info.checkedNodes;
        // ??????????????????
        const tempDataSource = this.removeNull(this._getData(this.treeData, checkedKeys, halfCheckedKeys));
        this.setState({checkedKeys, halfCheckedKeys, selectedData: tempDataSource, clipboardData: tempDataSource});
    };
    _getData = (treeData, checkedKeys, halfCheckedKeys) => {
        return treeData.map(item => {
            // ???????????????????????????????????????????????????????????????
            if (checkedKeys.includes(item.path) || halfCheckedKeys.includes(item.path)) {
                if (item.children) {
                    const itemChildren = this._getData(item.children, checkedKeys, halfCheckedKeys);
                    return {
                        id: item.path,
                        selected: checkedKeys.includes(item.path) ? 'Full' : 'Half',
                        children: itemChildren
                    };
                }
                return {
                    id: item.path,
                    selected: 'Full',
                };
            }
            return null;
        })
    };

    removeNull = (treeData) => {
        const filteTreeData = treeData.filter(item => !!item); // ?????????treeData???????????????
        if (filteTreeData.length) {
            filteTreeData.map(tempItem => {
                if (tempItem.children) {
                    tempItem.children.filter(item => !!item);
                    tempItem.children = this.removeNull(tempItem.children)
                }
            })
        }
        return filteTreeData;
    };

    _onDrop = (info) => {
        const {treeData} = this.state;
        const dropKey = info.node.props.eventKey;
        const dragKey = info.dragNode.props.eventKey;
        const dropPos = info.node.props.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
        this.setState({
            treeData
        })
    };

    copied = (text, result) => {
        if (result) {
            Message.success('????????????');
        } else {
            Message.success('????????????');
        }
    };

    getSelectedObjectList = () => {
        const {selectedData} = this.state;
        this.setState({
            clipboardData: selectedData
        });
        return selectedData;
    };
    getSelectedIdList = () => { //['id1','id2','id3']
        const {checkedKeys} = this.state;
        this.setState({
            clipboardData: checkedKeys
        });
        return checkedKeys;
    };
    setSelectdById = (dataList) => {
        // dataList??????????????????????????????????????????????????????????????????????????????????????????????????????????????????
        // ????????????????????????dataList?????????dataList?????????????????????????????????????????????????????????????????????
        const needSetFlatIds = this.flatData.filter(flatItem => dataList.includes(flatItem.path));
        const checkedKeys = this._filterHalfChecked(needSetFlatIds, dataList);
        const halfCheckedKeys = dataList.filter(item => !checkedKeys.includes(item));
        const pathStart = this.flatData[0] ? this.flatData[0].path.split('.')[0] : 'root';
        if (!checkedKeys.includes(pathStart)) {
            halfCheckedKeys.push(pathStart);
        }
        const tempDataSource = this.removeNull(this._getData(this.treeData, checkedKeys, halfCheckedKeys));
        this.setState({
            checkedKeys,
            halfCheckedKeys,
            selectedData: tempDataSource,
            clipboardData: checkedKeys,
        });
    };

    _filterHalfChecked = (needSetFlatIds, dataList) => {
        let checkedKeys = [];
        needSetFlatIds.map(flatItem => {
            if (flatItem.children) {
                const isChecked = this._checkChecked(flatItem, dataList);
                // ?????????????????????????????????????????????????????????
                if (isChecked) {
                    checkedKeys.push(flatItem.path);
                }
            } else {
                checkedKeys.push(flatItem.path);
            }
        });
        return checkedKeys;
    };

    _checkChecked = (flatItem, dataList) => {
        let flag = false;
        const childrenIds = flatItem.children.map(item => item.path); // ????????????????????????id??????
        const childrenIdsInDataList = dataList.filter(item => childrenIds.includes(item)); // ???????????????????????????????????????id??????
        const childrenLength = flatItem.children.length;
        const childrenIdsInDataListLength = childrenIdsInDataList.length;
        if (childrenLength === childrenIdsInDataListLength) {
            flatItem.children.map(item => {
                if (item.children) {
                    this._checkChecked(item, dataList)
                }
                else {
                    flag = true
                }
            })
        } else {
            flag = false;
        }
        return flag;
    };

    _renderDetail = () => {
        const {checkedKeys, halfCheckedKeys, selectedData, clipboardData} = this.state;
        const data = JSON.stringify(clipboardData, '', 2);
        return <pre
            className="ro-develop-console-right-bash"
            onMouseOver={() => this._toggleCopy(true)}
            onMouseOut={() => this._toggleCopy(false)}
        >
      <CopyToClipboard
          text={data}
          onCopy={this.copied}
      >
        <span id='copy-pre' className='mindtree-copy-pre'> ??????</span>
      </CopyToClipboard>
            {data}
    </pre>;
    };

    renderTreeNodes = data => data.map((item) => {
        if (item.children) {
            return (
                <TreeNode title={item.topic} key={item.path} dataRef={item}
                          icon={<Icon type={item.icon || 'file1'} size="small"/>}>
                    {this.renderTreeNodes(item.children)}
                </TreeNode>
            );
        }
        return <TreeNode title={item.topic} key={item.path} dataRef={item}
                         icon={<Icon type={item.icon || 'file1'} size="small"/>}/>;
    });

    render() {
        const treeData = this.state.treeData;
        return (
            <div style={{margin: '5px', background: '#fff'}} id="mind-tree-container">
                <Row type="flex" className='jsmind-hd'>
                    {this._renderToolbar()}
                </Row>
                <Row>
                    <Col span={this.leftSpan}>
                        <div
                          ref={instance => this.treeInstance = instance}
                          style={{minWidth: '300px', overflow: 'auto' }}
                        >
                            <Tree
                                checkable
                                onExpand={this._onExpand}
                                expandedKeys={this.state.expandedKeys}
                                autoExpandParent={true}
                                defaultExpandedKeys={['root']}
                                // defaultSelectedKeys={['root']}
                                defaultExpandAll={true}
                                onCheck={this._onCheck}
                                checkedKeys={this.state.checkedKeys}
                                onDrop={this._onDrop}
                                draggable
                                blockNode
                                showIcon
                            >
                                {this.renderTreeNodes(treeData)}
                            </Tree>
                        </div>
                    </Col>
                    {this.rightSpan > 0 ?
                        <Col span={this.rightSpan}>
                            <div style={{margin: 10}}>???????????????</div>
                            <div
                              ref={instance => this.codeSelectedInstance = instance}
                              style={{
                                margin: 5,
                                width: '100%',
                                wordWrap: 'break-word',
                                overflowY: 'auto'
                              }}
                            >
                                {this._renderDetail()}
                            </div>
                        </Col> : ''
                    }
                </Row>
            </div>
        );
    }
}

export default MindTree;

