import React from 'react';
import {Card, Select} from 'antd';
import { Form } from '@ant-design/compatible';
import {
    Icon,
    Message,
    Notify,
    Divider,
    Row,
    Col,
    Tooltip,
    Input,
    InputNumber,
    Switch,
    openModal,
    Button
} from '../../../src/components';
import profile from '../../../profile';
import jsMind from './components/js/jsmind';
import ExportData from './exportData';
import CheckList from './checkList';
import LayoutIcon from './Icon';
import {addProperties} from './utils';

/* eslint-disable */
global.jsMind = require('./components/js/jsmind'); // eslint-disable-line
require('./components/js/jsmind.draggable');
require('./components/js/jsmind.screenshot');
import datajsmind from './datajsmind.json';
import formatdata from './formatdata.json';

import './components/style/jsmind.css';
import styles from './index.less'; // eslint-disable-line

const {Item} = Form;
const {Option} = Select;

class JSMind extends React.Component {
    constructor(props) {
        super(props);
        this.currentIconModal = null;
        this.currentModal = null;
        this.selectedIds = [];
        this.state = {
            loading: false,
            open: false,
            selectedNode: null,
        };
    }

    componentDidMount() {
        this.instance.onkeydown = this._onKeyDown;
        const options = {
            container: 'jsmind_container',
            theme: 'roprimary',
            editable: true,
            shortcut: {
                enable: false,        // 是否启用快捷键
                handles: {},         // 命名的快捷键事件处理器
                mapping: {           // 快捷键映射
                    addchild: 45,    // <Insert>
                    addbrother: 13,    // <Enter>
                    editnode: 113,   // <F2>
                    delnode: 46,    // <Delete>
                    toggle: 32,    // <Space>
                    left: 37,    // <Left>
                    up: 38,    // <Up>
                    right: 39,    // <Right>
                    down: 40,    // <Down>
                }
            },
        };
        this.jm = new jsMind(options, this._setIcon);
        // 构造初始数据
        const constructData = {
            meta: {
                'name': 'jsMind',
                'author': 'jsmind',
                'version': '1.0'
            },
            format: 'node_tree',
            // data: addProperties(formatdata, { direction: 'right', expanded: false }, jsMind.util.uuid )
            data: addProperties(this.props.dataSource, {
                direction: 'right',
                expanded: false
            }, jsMind.util.uuid)
        };
        this.dataSourcePermitCopyTpl = constructData.data.properties.permitCopyTpl;


        // 重新构造数据
        // 添加direction，expanded
        // const constructData = {
        //   ...datajsmind,
        //   data: addProperties(datajsmind.data, { direction: 'right', expanded: false }, jsMind.util.uuid )
        // };
        this.jm.show(constructData);
    }

    _setIcon = (n, t, i) => {
        const {icons = []} = profile;
        if (i) {
            n.innerHTML = `${this.getIcon(icons, i)} ${t}`;
        } else {
            n.innerHTML = t;
        }
    };

    getIcon = (icons, type) => {
        const customerIcon = icons.filter(i => type.startsWith(`${i.name}-`))[0];
        const valid = 'icon-valid';
        let className = '';
        if (type.startsWith('roic-') || type.startsWith('roic_')) {
            className = `${valid} icon roic ${type} ro-icon`;
        } else if (type.startsWith('fa-')) {
            className = `${valid} fa ${type} ro-icon`;
        } else if (customerIcon) {
            className = `${valid} ${customerIcon.prefix}${type} ro-icon`;
        } else {
            className = `${valid} icon anticon icon-${type}`;
        }
        return `<i type=${type} style="float: left" class="${className}">${''}</i>`;
    };

    _clickNode = (e) => {
        const selected_node = this.jm && this.jm.get_selected_node();
        if (selected_node) {
            if (e && (e.ctrlKey || e.metaKey)) {
                if (this.selectedIds.includes(selected_node.id)) {
                    this.selectedIds = this.selectedIds.filter(item => item !== selected_node.id);
                    this.jm.view.clear_multiple_select_node([selected_node.id]);
                } else {
                    this.selectedIds.push(selected_node.id);
                }
            } else {
                this.jm.view.clear_multiple_select_node(this.selectedIds);
                this.selectedIds = [selected_node.id];
            }
            this.jm.view.set_multiple_select_node(this.selectedIds);
            if (this.flag) {
                const type = selected_node.data.type;
                if (type === 'start') {
                    this.props.form.setFieldsValue({
                        topic: selected_node.topic,
                        path: selected_node.data.path,
                        permitCode: selected_node.data.permitCode,
                        contextId: selected_node.data.contextId,
                        fullName: selected_node.data.fullName,
                        type: selected_node.data.type,
                        icon: selected_node.data.icon,
                        enabled: selected_node.data.enabled === 'Y'
                    });
                } else if (type === 'menu') {
                    this.props.form.setFieldsValue({
                        topic: selected_node.topic,
                        path: selected_node.data.path,
                        permitCode: selected_node.data.permitCode,
                        contextId: selected_node.data.contextId,
                        fullName: selected_node.data.fullName,
                        type: selected_node.data.type,
                        icon: selected_node.data.icon,
                        url: selected_node.data.url,
                        param: selected_node.data.param,
                        enabled: selected_node.data.enabled === 'Y'
                    });
                } else if (type === 'datascope') {
                    this.props.form.setFieldsValue({
                        topic: selected_node.topic,
                        path: selected_node.data.path,
                        permitCode: selected_node.data.permitCode,
                        contextId: selected_node.data.contextId,
                        type: selected_node.data.type,
                        icon: selected_node.data.icon,
                    });
                } else if (type === 'action') {
                    this.props.form.setFieldsValue({
                        topic: selected_node.topic,
                        path: selected_node.data.path,
                        permitCode: selected_node.data.permitCode,
                        contextId: selected_node.data.contextId,
                        type: selected_node.data.type,
                        icon: selected_node.data.icon,
                    });
                }
            }
            this.setState({selectedNode: selected_node, currentIcon: selected_node.data.icon});
        } else {
            this.setState({selectedNode: null});
        }
    };

    _onKeyDown = (e) => {
        const selected_node = this.jm && this.jm.get_selected_node();
        const is_editing = this.jm && this.jm.view.is_editing();
        switch (e.keyCode) {
            case 13: {
                this._add_brother_node(e);
                break;
            }
            case 46: // win-delete
            case 8: // mac-back
            {
                if (!is_editing) {
                    this._remove_node(e);
                }
                break;
            }
            case 45: // insert
            case 9: {
                this._add_node(e);
                e.preventDefault();
                break;
            }
            case 37: //向左👈
            {
                this._handleLeft(e);
                break;
            }
            case 38: //向上👆
            {
                this._handleUp(e);
                break;
            }
            case 39: //向右👉
            {
                this._handleRight(e);
                break;
            }
            case 40: //向下👇
            {
                this._handleDown(e);
                break;
            }
            default: {
                break;
            }
        }
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const {form} = this.props;
        const {selectedNode} = this.state;
        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }
            const nodeId = selectedNode.id;
            const pathArray = values.path.replace(':', '.').split('.') || [];
            pathArray.pop();
            const tempPath = pathArray.join('.');
            const contextId = values.contextId;
            const topic = values.topic;
            const path = tempPath ? `${tempPath}.${contextId}` : `${contextId}`;

            this.updateDataSource(nodeId, {...values, path, contextId});
            this.jm.update_node(nodeId, topic, true);
        });
    };

    handleSelectSubmit = (value) => {
        const {form} = this.props;
        const {selectedNode} = this.state;
        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }

            const nodeId = selectedNode.id;
            const topic = values.topic;
            if (value === 'start') {
                const root = this.jm.get_root();
                const selected_node = this.jm.get_node(nodeId);
                if (root && root.data.type === 'start') {
                    Message.error('根节点已存在');
                    this.props.form.setFieldsValue({type: selected_node.data.type,});
                    return;
                }
            }
            this.updateDataSource(nodeId, {...values, type: value});
            this.jm.update_node(nodeId, topic, true);
        });
    };

    validatorType = (value) => {
        const {form} = this.props;
        const {selectedNode} = this.state;
        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }
            const nodeId = selectedNode.id;
            if (value === 'start') {
                const root = this.jm.get_root();
                const selected_node = this.jm.get_node(nodeId);
                if (root && root.data.type === 'start') {
                    this.props.form.setFieldsValue({type: selected_node.data.type,});
                    return null;
                }
            }
        });
    };

    handleSwitchChangeSubmit = (value) => {
        const {form} = this.props;
        const {selectedNode} = this.state;
        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }
            const nodeId = selectedNode.id;
            const topic = values.topic;

            this.updateDataSource(nodeId, {...values, enabled: value});
            this.jm.update_node(nodeId, topic, true);
        });
    };

    handleIconChangeSubmit = (icon) => {
        const {form} = this.props;
        const {selectedNode} = this.state;
        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }
            const nodeId = selectedNode.id;
            const topic = values.topic;

            this.currentIconModal && this.currentIconModal.close();
            this.updateDataSource(nodeId, {...values, icon});
            this.jm.update_node(nodeId, topic, true);
        });
    };

    updateDataSource = (nodeId, values) => {
        const selected_node = this.jm.get_node(nodeId);
        if (selected_node) {
            selected_node.data = {
                ...selected_node.data,
                ...values,
                enabled: values.enabled ? 'Y' : 'N'
            };
            selected_node.children = this.jm.mind.set_children_path(selected_node, this.jm.view);
            this.setState({currentIcon: values.icon}, this._clickNode);
        }
    };

    _print = (value) => {
        if (value === 'meta') {
            const meta = this.jm.get_meta();
            console.log(meta);
        } else if (value === 'data') {
            const data = this.jm.get_data('node_tree');
            console.log(data);
        }
    };

    _exportData = (type) => {
        const metaData = this.jm.get_data('node_tree');
        openModal(<ExportData
                dataSource={metaData && metaData.data || null}
                type={type}
            />,
            {
                title: <span><Icon type="API"/>菜单数据</span>,
                width: '70%',
            });
    };

    _fullScreen = () => {
        // const mindContainer = document.getElementById('app');
        // if (mindContainer.requestFullscreen || mindContainer.webkitRequestFullscreen || mindContainer.mozRequestFullScreen || mindContainer.msRequestFullscreen) {
        //   mindContainer.requestFullscreen() || mindContainer.webkitRequestFullscreen() || mindContainer.mozRequestFullScreen() || mindContainer.msRequestFullscreen();
        // }
        this._toggleFullScreen();
    };

    _toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    _add_node = () => {
        const selected_node = this.jm.get_selected_node(); // as parent of new node
        if (!selected_node) {
            Message.error('请先选择一个节点');
            return;
        }
        const path = selected_node.data.path;
        const contextId = jsMind.util.uuid.newid();
        const topic = '新节点' + contextId.substr(0, 5) + ' *';
        const data = {
            'topic': topic,
            'expanded': false,
            'type': 'menu',
            'id': `${selected_node.isroot ? selected_node.data.path : path}.${contextId}`,
            'path': `${selected_node.isroot ? selected_node.data.path : path}.${contextId}`,
            'permitCode': '',
            'contextId': `${contextId}`,
            'fullName': topic,
            'enabled': 'Y',
            'icon': '',
            'url': '',
            'param': '',
            'children': []
        };
        const node = this.jm.add_node(selected_node, `${selected_node.isroot ?
            selected_node.data.path : path}.${contextId}`, topic, data);
    };

    _add_multiple_sub_node = (e) => {
        const selected_node = this.jm.get_selected_node(); // as parent of new node
        if (!selected_node) {
            return Message.error('请先选择一个节点');
        }
        // 获取增加节点的数量
        this.currentModal = openModal(
            <div className="modal-node-container">
                <span>输入新增节点数量:</span>
                <InputNumber
                    style={{marginLeft: 10, width: 200}}
                    onChange={(value) => this.handleAddNodeChange('subNode', value)}
                />
            </div>, {
                defaultButton: true,
                title: ' 输入新增节点数量',
                onOk: (modal, compnent) => {
                    const nodeNumber = this.subNode;
                    const path = selected_node.data.path;
                    for (let i = 0; i < nodeNumber; i++) {
                        const contextId = i + jsMind.util.uuid.newid();
                        const topic = '新节点' + contextId.substr(0, 5) + ' *';
                        const data = {
                            'topic': topic,
                            'expanded': false,
                            'type': 'menu',
                            'id': `${selected_node.isroot ? selected_node.data.path : path}.${contextId}`,
                            'path': `${selected_node.isroot ? selected_node.data.path : path}.${contextId}`,
                            'permitCode': '',
                            'contextId': `${contextId}`,
                            'fullName': topic,
                            'enabled': 'Y',
                            'icon': '',
                            'url': '',
                            'param': '',
                            'children': []
                        };
                        const node = this.jm.add_node(selected_node, `${selected_node.isroot ? selected_node.data.path : path}.${contextId}`, topic, data);
                    }
                    modal.close();
                    this.subNode = 0;
                },
            });
    };

    _add_multiple_sub_template_node = (e) => {
        const selected_node = this.jm.get_selected_node(); // as parent of new node
        if (!selected_node) {
            return Message.error('请先选择一个节点');
        }
        // 获取增加节点的数量
        const nodeNumber = this.subNode;
        const templateData = this.dataSourcePermitCopyTpl || [];
        const path = selected_node.data.path;
        for (let i = 0; i < templateData.length; i++) {
            const contextId = i + jsMind.util.uuid.newid();
            const topic = templateData[i].topic;
            const icon = templateData[i].icon || '';
            const permitCode = templateData[i].permitCode || '';
            const data = {
                ...templateData[i],
                direction: 'right',
                expanded: false,
                id: `${selected_node.isroot ? selected_node.data.path : path}.${contextId}`,
                path: `${selected_node.isroot ? selected_node.data.path : path}.${contextId}`,
                permitCode: permitCode,
                contextId: `${contextId}`,
                fullName: topic,
                enabled: 'Y',
                icon,
                url: '',
                param: '',
                children: []
            };
            const node = this.jm.add_node(selected_node, `${selected_node.isroot ? selected_node.data.path : path}.${contextId}`, topic, data);
        }
    };

    _add_multiple_sub_children_template_node = (e) => {
        const selected_node = this.jm.get_selected_node(); // as parent of new node
        if (!selected_node) {
            return Message.error('请先选择一个节点');
        }
        const templateData = this.dataSourcePermitCopyTpl || [];
        const path = selected_node.data.path;
        for (let i = 0; i < templateData.length; i++) {
            const contextId = i + jsMind.util.uuid.newid();
            const topic = templateData[i].topic;
            const icon = templateData[i].icon || '';
            const permitCode = templateData[i].permitCode || '';
            const children = templateData[i].children || [];
            const data = {
                ...templateData[i],
                direction: 'right',
                expanded: false,
                id: `${selected_node.isroot ? selected_node.data.path : path}.${contextId}`,
                path: `${selected_node.isroot ? selected_node.data.path : path}.${contextId}`,
                permitCode: permitCode,
                contextId: `${contextId}`,
                fullName: topic,
                enabled: 'Y',
                icon,
                url: '',
                param: '',
                children: []
            };
            const node = this.jm.add_node(selected_node, `${selected_node.isroot ? selected_node.data.path : path}.${contextId}`, topic, data);
            this._add_children_node(node, children);
        }
    };

    _add_children_node = (node, children) => {
        // 增加子节点
        if (node && children && children.length) {
            const path = node.data.path;
            for (let i = 0; i < children.length; i++) {
                const contextId = i + jsMind.util.uuid.newid();
                const topic = children[i].topic;
                const icon = children[i].icon || '';
                const permitCode = children[i].permitCode || '';
                const tempChildren = children[i].children || [];
                const data = {
                    ...children[i],
                    direction: 'right',
                    expanded: false,
                    id: `${node.isroot ? node.data.path : path}.${contextId}`,
                    path: `${node.isroot ? node.data.path : path}.${contextId}`,
                    permitCode: permitCode,
                    contextId: `${contextId}`,
                    fullName: topic,
                    enabled: 'Y',
                    icon,
                    url: '',
                    param: '',
                    children: []
                };
                const resultNode = this.jm.add_node(node, `${node.isroot ? node.data.path : path}.${contextId}`, topic, data);
                if (tempChildren && tempChildren.length) {
                    this._add_children_node(resultNode, tempChildren);
                }
            }
        }
    };

    _add_brother_node = (e) => {
        const selected_node = this.jm.get_selected_node(); // as parent of new node
        if (!selected_node) {
            Message.error('请先选择一个节点');
            return;
        } else if (selected_node.isroot) {
            return Message.error('根节点无法新增同级节点');
        }
        const parentPath = selected_node.parent.data.path;
        const contextId = jsMind.util.uuid.newid();
        const topic = '新节点' + contextId.substr(0, 5) + ' *';
        const data = {
            'topic': topic,
            'expanded': false,
            'type': 'menu',
            'id': `${selected_node.parent.isroot ? parentPath : parentPath}.${contextId}`,
            'path': `${selected_node.parent.isroot ? parentPath : parentPath}.${contextId}`,
            'permitCode': '',
            'contextId': `${contextId}`,
            'fullName': topic,
            'enabled': 'Y',
            'icon': '',
            'url': '',
            'param': '',
            'children': []
        };
        const node = this.jm.add_node(selected_node.parent, `${selected_node.parent.isroot ? parentPath : parentPath}.${contextId}`, topic, data);
    };

    _add_multiple_brother_node = (e) => {
        const selected_node = this.jm.get_selected_node(); // as parent of new node
        if (!selected_node) {
            return Message.error('请先选择一个节点');
        } else if (selected_node.isroot) {
            return Message.error('根节点无法新增同级节点');
        }
        // 获取增加节点的数量
        this.currentModal = openModal(
            <div className="modal-node-container">
                <span>输入新增节点数量:</span>
                <InputNumber
                    style={{marginLeft: 10, width: 200}}
                    onChange={(value) => this.handleAddNodeChange('brotherNode', value)}
                />
            </div>, {
                defaultButton: true,
                title: ' 输入新增节点数量',
                onOk: (modal, compnent) => {
                    const nodeNumber = this.brotherNode;
                    const parentId = selected_node.parent.id;
                    for (let i = 0; i < nodeNumber; i++) {
                        const contextId = i + jsMind.util.uuid.newid();
                        const topic = '新节点' + contextId.substr(0, 5) + ' *';
                        const data = {
                            'topic': topic,
                            'expanded': false,
                            'type': 'menu',
                            'id': `${selected_node.parent.isroot ? parentId : parentId}.${contextId}`,
                            'path': `${selected_node.parent.isroot ? parentId : parentId}.${contextId}`,
                            'permitCode': '',
                            'contextId': `${contextId}`,
                            'fullName': topic,
                            'enabled': 'Y',
                            'icon': '',
                            'url': '',
                            'param': '',
                            'children': []
                        };
                        const node = this.jm.add_node(selected_node.parent, `${selected_node.parent.isroot ? parentId : parentId}.${contextId}`, topic, data);
                    }
                    modal.close();
                    this.brotherNode = 0;
                },
            });
    };

    handleAddNodeChange = (type, value) => {
        this[type] = value;
    };

    update_node = (e) => {
        const selected_node = this.jm.get_selected_node(); // as parent of new node
        if (!selected_node) {
            Message.error('请先选择一个节点');
            return;
        }
        const nodeid = jsMind.util.uuid.newid();
        const topic = '新节点' + nodeid.substr(0, 5) + ' *';
        const node = this.jm.add_node({...selected_node.parent, direction: 'right'}, nodeid, topic);
    };

    _remove_node = () => {
        const selected_node = this.jm.get_selected_node();
        if (!selected_node) {
            Message.error('请先选择一个节点');
            return;
        }
        this.jm.remove_node(selected_node.id);
    };

    _remove_node_batch = () => {
        const selectedIds = this.selectedIds;
        if (selectedIds && selectedIds.length) {
            // 处理警告can not be found：删除之前进行检查id，如果需要删除的数组已经包含了父节点，则不需要删除子节点
            selectedIds
                .sort((a, b) => b.split('.').length - a.split('.').length)
                .map(selectedId => this.jm.remove_node(selectedId));
            this.selectedIds = [];
        } else {
            return Message.error('请至少选择一个节点');
        }
    };

    _zoomIn = () => { // 放大
        if (this.jm.view.zoomIn()) {
            // zoomOutButton.disabled = false;
        } else {
            // zoomInButton.disabled = true;
        }
    };

    _zoomOut = () => { // 缩小
        if (this.jm.view.zoomOut()) {
            // zoomInButton.disabled = false;
        } else {
            // zoomOutButton.disabled = true;
        }
    };

    _resize = () => {
        console.log(this.jm, this.jm.view);
        this.jm.resize();
        this.jm.view.expand_size();
        this.jm.view._center_root();
    };

    _expand = () => {
        const selected_node = this.jm.get_selected_node();
        if (!selected_node) {
            Message.error('请先选择一个节点');
            return;
        }
        this.jm.expand_node(selected_node.id);
    };

    _expandAll = () => {
        this.jm.expand_all();
    };

    _expandDepth = (depth) => {
        this.jm.expand_to_depth(depth);
    };

    _exportImg = (type) => {
        try {
            // png jpeg
            this.jm.screenshot.shootDownload();
        } catch (e) {
            console.error(e);
        }
    };

    _collapse = () => {
        const selected_node = this.jm.get_selected_node();
        if (!selected_node) {
            Message.error('请先选择一个节点');
            return;
        }
        this.jm.collapse_node(selected_node.id);
    };

    _collapseAll = () => {
        this.jm.collapse_all();
    };

    _handleUp = (e) => {
        const _jm = this.jm;
        const evt = e || event;
        const selected_node = _jm.get_selected_node();
        if (!!selected_node) {
            let up_node = _jm.find_node_before(selected_node);
            if (!up_node) {
                const np = _jm.find_node_before(selected_node.parent);
                if (!!np && np.children.length > 0) {
                    up_node = np.children[np.children.length - 1];
                }
            }
            if (!!up_node) {
                _jm.select_node(up_node);
            }
            evt.stopPropagation();
            evt.preventDefault();
        }
    };

    _handleDown = (e) => {
        const _jm = this.jm;
        const evt = e || event;
        const selected_node = _jm.get_selected_node();
        if (!!selected_node) {
            let down_node = _jm.find_node_after(selected_node);
            if (!down_node) {
                const np = _jm.find_node_after(selected_node.parent);
                if (!!np && np.children.length > 0) {
                    down_node = np.children[0];
                }
            }
            if (!!down_node) {
                _jm.select_node(down_node);
            }
            evt.stopPropagation();
            evt.preventDefault();
        }
    };

    _handleLeft = (e) => {
        const _jm = this.jm;
        this._handle_direction(_jm, e, -1);
    };

    _handleRight = (e) => {
        const _jm = this.jm;
        this._handle_direction(_jm, e, 1);
    };

    _handle_direction = (_jm, e, d) => {
        const evt = e || event;
        const selected_node = _jm.get_selected_node();
        let node = null;
        if (!!selected_node) {
            if (selected_node.ismindContainer) {
                const c = selected_node.children;
                let children = [];
                for (let i = 0; i < c.length; i++) {
                    if (c[i].direction === d) {
                        children.push(i);
                    }
                }
                node = c[children[Math.floor((children.length - 1) / 2)]];
            }
            else if (selected_node.direction === d) {
                let children = selected_node.children;
                let childrencount = children.length;
                if (childrencount > 0) {
                    node = children[Math.floor((childrencount - 1) / 2)];
                }
            } else {
                node = selected_node.parent;
            }
            if (!!node) {
                _jm.select_node(node);
            }
            evt.stopPropagation();
            evt.preventDefault();
        }
    };

    _showLayoutIcon = () => {
        this.currentIconModal = openModal(<LayoutIcon onClick={this.handleIconChangeSubmit}/>, {
            defaultButton: false,
            width: '80%',
            title: ' 图标选择',
            footer: <Button key="back"
                            onClick={() => this.currentIconModal && this.currentIconModal.close()}>取消</Button>,
        });
    };

    _checkPermitCode = () => {
        // 检查-permitCode
        setTimeout(() => {
            const permitCode = this.props.form.getFieldValue('permitCode');
            // if (permitCode) {
            //   const tempNodes = this.jm.mind.nodes;
            //   const keys = Object.keys(tempNodes);
            //   console.log('keys.length=' + keys.length);
            //   const result = keys.filter(key => tempNodes[key].data.permitCode === permitCode);
            //   const contentArray = result.map(resultKey => tempNodes[resultKey].topic);
            //   if (contentArray.length) {
            //     openModal(<CheckList dataSource={contentArray || []} />,
            //       {
            //         title: <span><Icon type="API"/>&nbsp;权限检查结果：</span>,
            //         width: '50%',
            //       });
            //   } else {
            //     Notify.info({
            //       description: '没有相同的权限标识',
            //       message: '权限检查结果',
            //       duration: 3,
            //       icon: <Icon type="infocirlceo" style={{ width: 20, height: 20, color: '#90c9ff' }} />,
            //     });
            //   }
            // }

            if (permitCode) {
                const tempNodes = this.jm.mind.nodes;
                const keys = Object.keys(tempNodes);
                const result = keys.filter(key => tempNodes[key].data.permitCode === permitCode);
                const contentArray = result.map(resultKey => {
                    // 通过当前节点计算所有父节点
                    const parentTopicArray = this._getParentTopic(resultKey, tempNodes);
                    return parentTopicArray.join('->');
                });
                if (contentArray.length) {
                    openModal(<CheckList dataSource={contentArray || []}/>,
                        {
                            title: <span><Icon type="API"/>&nbsp;权限检查结果：</span>,
                            width: '50%',
                        });
                } else {
                    Notify.info({
                        description: '没有相同的权限标识',
                        message: '权限检查结果',
                        duration: 3,
                        icon: <Icon type="infocirlceo"
                                    style={{width: 20, height: 20, color: '#90c9ff'}}/>,
                    });
                }
            }
        }, 100);
    };

    _getParentTopic = (key, nodes, tempTopic = []) => {
        if (key in nodes) {
            if (nodes[key].parent) {
                this._getParentTopic(nodes[key].parent.id, nodes, tempTopic);
            }
            tempTopic.push(nodes[key].topic);
        }
        return tempTopic;
    };

    _renderToolbar = () => {
        return (
            <Col span={24}>
                <Tooltip title="放大" placement="bottom" className="hover">
                    <Icon type="fa-search-plus" className="icon-jsmind"
                          onClick={this._zoomIn}> 放大</Icon>
                </Tooltip>
                <Divider type="vertical"/>
                <Tooltip title="缩小" placement="bottom" className="hover">
                    <Icon type="fa-search-minus" className="icon-jsmind hover"
                          onClick={this._zoomOut}> 缩小</Icon>
                </Tooltip>
                <Divider type="vertical"/>
                <Tooltip title="适应画布" placement="bottom">
                    <Icon type="fa-dot-circle-o" className="icon-jsmind"
                          onClick={this._resize}> 适应画布</Icon>
                </Tooltip>
                {/*<Divider type="vertical" />*/}
                {/*<Tooltip title="插入同级" placement="bottom">*/}
                {/*<Icon type="icon anticon icon-totop" onClick={this._add_brother_node}/>*/}
                {/*</Tooltip>*/}
                {/*<Divider type="vertical" />*/}
                {/*<Tooltip title="插入同级节点" placement="bottom">*/}
                {/*<i className="i-image add-multiple-brother-node" onClick={this._add_multiple_brother_node}/>*/}
                {/*</Tooltip>*/}
                {/*<Divider type="vertical" />*/}
                {/*<Tooltip title="插入子级" placement="bottom">*/}
                {/*<i className="i-image" onClick={this._add_node}/>*/}
                {/*</Tooltip>*/}
                {/*<Divider type="vertical" />*/}
                {/*<Tooltip title="插入子级节点" placement="bottom">*/}
                {/*<i className="i-image add-multiple-sub-node" onClick={this._add_multiple_sub_node}/>*/}
                {/*</Tooltip>*/}
                {/*<Divider type="vertical" />*/}
                {/*<Tooltip title="插入子级模版节点" placement="bottom" className="hover">*/}
                {/*<i className="i-image add-multiple-sub-node" onClick={this._add_multiple_sub_template_node}/>*/}
                {/*</Tooltip>*/}
                <Divider type="vertical"/>
                <Tooltip title="插入模版子节点" placement="bottom" className="hover">
                    <i className="i-image add-multiple-sub-node fa icon-valid icon-jsmind ro-icon"
                       onClick={this._add_multiple_sub_children_template_node}/>
                    <i className="icon-valid icon-jsmind fa ro-icon"
                       onClick={this._add_multiple_sub_children_template_node}> 模版子节点</i>
                </Tooltip>
                {/*<Divider type="vertical" />*/}
                {/*<Tooltip title="删除节点" placement="bottom">*/}
                {/*<Icon type="fa-close" className="icon-JsMind" onClick={this._remove_node}/>*/}
                {/*</Tooltip>*/}
                <Divider type="vertical"/>
                <Tooltip title="删除" placement="bottom">
                    <Icon type="fa-close" className="icon-jsmind"
                          onClick={this._remove_node_batch}> 删除</Icon>
                </Tooltip>
                {/*<Divider type="vertical" />*/}
                {/*<Tooltip title="折叠" placement="bottom" className="icon-JsMind" onClick={this._collapse}>*/}
                {/*<Icon type="fa-compress"/>*/}
                {/*</Tooltip>*/}
                {/*<Divider type="vertical" />*/}
                {/*<Tooltip title="全部折叠" placement="bottom" className="icon-JsMind" onClick={this._collapseAll}>*/}
                {/*<Icon type="fa-compress"/>*/}
                {/*</Tooltip>*/}
                {/*<Divider type="vertical" />*/}
                {/*<Tooltip title="展开" placement="bottom" className="icon-JsMind" onClick={this._expand}>*/}
                {/*<Icon type="fa-expand"/>*/}
                {/*</Tooltip>*/}
                {/*<Divider type="vertical" />*/}
                {/*<Tooltip title="全部展开" placement="bottom" onClick={this._expandAll}>*/}
                {/*<Icon type="fa-expand"/>*/}
                {/*</Tooltip>*/}
                {/*<Divider type="vertical" />*/}
                {/*<Tooltip title="打印元数据" placement="bottom">*/}
                {/*<Icon type="fa-save" onClick={() => this._print('meta')}/>*/}
                {/*</Tooltip>*/}
                <Divider type="vertical"/>
                <Tooltip title="导出JSON数据" placement="bottom">
                    <Icon type="fa-code" className="icon-jsmind"
                          onClick={() => this._exportData()}> JSON</Icon>
                </Tooltip>
                <Divider type="vertical"/>
                <Tooltip title="导出YAML数据" placement="bottom">
                    <Icon type="fa-code" className="icon-jsmind"
                          onClick={() => this._exportData('yaml')}> YAML</Icon>
                </Tooltip>
                <Divider type="vertical"/>
                <Tooltip title="展开一级" placement="bottom" className="icon-jsmind"
                         onClick={() => this._expandDepth(1)}>
                    <Icon type="fa-expand"> 一级</Icon>
                </Tooltip>
                <Divider type="vertical"/>
                <Tooltip title="展开二级" placement="bottom" className="icon-jsmind"
                         onClick={() => this._expandDepth(2)}>
                    <Icon type="fa-expand"> 二级</Icon>
                </Tooltip>
                <Divider type="vertical"/>
                <Tooltip title="展开三级" placement="bottom" className="icon-jsmind"
                         onClick={() => this._expandDepth(3)}>
                    <Icon type="fa-expand"> 三级</Icon>
                </Tooltip>
                <Divider type="vertical"/>
                <Tooltip title="展开四级" placement="bottom" className="icon-jsmind"
                         onClick={() => this._expandDepth(4)}>
                    <Icon type="fa-expand"> 四级</Icon>
                </Tooltip>
                <Divider type="vertical"/>
                <Tooltip title="展开五级" placement="bottom" className="icon-jsmind"
                         onClick={() => this._expandDepth(5)}>
                    <Icon type="fa-expand"> 五级</Icon>
                </Tooltip>
                {/*<Divider type="vertical" />*/}
                {/*<Tooltip title="全部折叠" placement="bottom" className="icon-JsMind" onClick={this._collapseAll}>*/}
                {/*<Icon type="fa-compress"> 折叠</Icon>*/}
                {/*</Tooltip>*/}
                <Divider type="vertical"/>
                <Tooltip title="导出png格式图片" placement="bottom" className="icon-jsmind"
                         onClick={() => this._exportImg('png')}>
                    <Icon type="fa-file-image-o"> 导出图片</Icon>
                </Tooltip>
                <Divider type="vertical"/>
                <Tooltip title="全屏显示" placement="bottom">
                    <Icon type="fa-arrows-alt" className="icon-jsmind"
                          onClick={() => this._fullScreen()}/>
                </Tooltip>
                <Divider type="vertical"/>
            </Col>
        );
    };

    _renderDetail = () => {
        const formLayout = {labelcol: 2, wrappercol: 22};
        const {form} = this.props;
        const {getFieldDecorator} = form;
        const {selectedNode} = this.state;
        this.flag = false;
        if (!selectedNode) return null;
        this.flag = true;
        const {path = '', data = {}, topic} = selectedNode;

        return (
            <Card type="inner" title="节点属性" bordered={false} size="default"
                  className="card-container-mind">
                <Form
                    onSubmit={this.handleSubmit}
                    layout="inline"
                    {...formLayout}
                >
                    <Item
                        label="类型"
                    >
                        {
                            getFieldDecorator('type', {
                                initialValue: data && data.type,
                            })(
                                <Select onChange={this.handleSelectSubmit}
                                        onBlur={this.validatorType} placeholder="请选择类型"
                                        size="default" style={{width: '260px'}}
                                        disabled={data.type === 'start'}>
                                    <Option value="start">start</Option>
                                    <Option value="menu">menu</Option>
                                    <Option value="datascope">datascope</Option>
                                    <Option value="action">action</Option>
                                </Select>
                            )
                        }
                    </Item>
                    <Item
                        label="简称"
                    >
                        {
                            getFieldDecorator('topic', {
                                initialValue: topic,
                            })(<Input onBlur={this.handleSubmit} placeholder="请输入简称" size="default"
                                      style={{width: '260px'}}/>)
                        }
                    </Item>
                    {
                        (data && data.type === 'start' || data && data.type === 'menu') ? <Item
                            label="全名称"
                        >
                            {
                                getFieldDecorator('fullName', {
                                    initialValue: data && data.fullName,
                                })(<Input onBlur={this.handleSubmit} placeholder="请输入全名称"
                                          size="default" style={{width: '260px'}}/>)
                            }
                        </Item> : null
                    }
                    <Item
                        label="权限标识"
                    >
                        <Row gutter={24}>
                            <Col span={18}>
                                {
                                    getFieldDecorator('permitCode', {
                                        initialValue: data && data.permitCode,
                                    })(<Input onBlur={this.handleSubmit} addonAfter={<a onClick={() => this._checkPermitCode()}>检查</a>} placeholder="权限标识" size="default" style={{width: '260px'}}/>)
                                }
                            </Col>
                        </Row>
                    </Item>
                    <Item
                        label="上下文id"
                    >
                        {
                            getFieldDecorator('contextId', {
                                initialValue: data && data.contextId,
                                rules: [{required: true}]
                            })(<Input onBlur={this.handleSubmit} placeholder="上下文id" size="default"
                                      style={{width: '260px'}}/>)
                        }
                    </Item>
                    <Item
                        label="路径"
                    >
                        {
                            getFieldDecorator('path', {
                                initialValue: path,
                                rules: [{required: true}]
                            })(<Input onBlur={this.handleSubmit} placeholder="路径" size="default"
                                      style={{width: '260px'}} disabled/>)
                        }
                    </Item>
                    {
                        (data && data.type === 'start' || data && data.type === 'menu' ||
                            data && data.type === 'datascope' || data && data.type === 'action') ?
                            <Item
                                label={(
                                    <span>
                  图标&nbsp;
                                        <Tooltip title="查看系统图标库">
                      <Icon type="questioncircleo" onClick={this._showLayoutIcon}/>
                    </Tooltip>
                  </span>
                                )}
                                style={{display: 'flex', flexDirection: 'row'}}
                            >
                                <Row gutter={24}>
                                    <Col span={16}>
                                        {
                                            getFieldDecorator('icon', {
                                                initialValue: data && data.icon,
                                            })(<Input onBlur={this.handleSubmit} placeholder="图标"
                                                      size="default" style={{width: '200px'}}/>)
                                        }
                                    </Col>
                                    <Col span={8}>
                                        {
                                            (this.state.currentIcon || data && data.icon) ?
                                                <Icon
                                                    type={this.state.currentIcon || data && data.icon}
                                                    style={{width: 20, height: 20}}
                                                    onClick={this._showLayoutIcon}
                                                /> :
                                                <div onClick={this._showLayoutIcon}
                                                     className='select-tips'>点击选取</div>
                                        }
                                    </Col>
                                </Row>
                            </Item> : null
                    }
                    {
                        (data && data.type === 'start' || data && data.type === 'menu') ?
                            <Item
                                label="enabled"
                            >
                                {
                                    getFieldDecorator('enabled', {
                                        initialValue: data && data.enabled === 'Y',
                                        valuePropName: 'checked'
                                    })(<Switch
                                        checkedChildren="Y"
                                        unCheckedChildren="N"
                                        onChange={this.handleSwitchChangeSubmit}
                                    />)
                                }
                            </Item> : null
                    }
                    {
                        (data && data.type === 'menu') ?
                            <Item
                                label="url地址"
                            >
                                {
                                    getFieldDecorator('url', {
                                        initialValue: data && data.url,
                                    })(<Input onBlur={this.handleSubmit} placeholder="url地址"
                                              size="default" style={{width: '260px'}}/>)
                                }
                            </Item> : null
                    }
                    {
                        (data && data.type === 'menu') ?
                            <Item
                                label="参数"
                            >
                                {
                                    getFieldDecorator('param', {
                                        initialValue: data && data.param,
                                    })(<Input onBlur={this.handleSubmit} placeholder="参数"
                                              size="default" style={{width: '260px'}}/>)
                                }
                            </Item> : null
                    }
                </Form>
            </Card>
        );
    };

    render() {
        return (
            <div style={{margin: '15px', background: '#fff'}} id="mind-container">
                <Row type="flex" className='jsmind-hd'>
                    {this._renderToolbar()}
                </Row>
                <Row>
                    <Col span={16}>
                        <div
                            id="jsmind_container"
                            tabIndex="1"
                            ref={instance => this.instance = instance}
                            style={{
                                width: '100%',
                                height: document.body.offsetHeight - 180,
                                outline: 'none'
                            }}
                            onClick={this._clickNode}
                        />
                    </Col>
                    <Col span={8}>
                        {this._renderDetail()}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Form.create()(JSMind);

