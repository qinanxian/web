import React from "react";

import {Message, openModal, Modal,TreeTable} from '../../../../src/components';
import MenuInfo from "./MenuInfo";

export default class MenuConfig extends React.Component {

    static MenuInfo = MenuInfo;

    constructor(props) {
        super(props);
        this.state = {
            id: props.id
        };
    }

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([{
            name: '新增',
            onClick: this.openMenuInfo
        }, {
            selectBind: true,
            name: '详情',
            onClick: this.editMenuInfo
        }, {
            selectBind: true,
            name: '删除',
            onClick: this.deleteMenu
        }]);
    };

    openMenuInfo = () => {
        this.openMenuInfoModal(null, '新增菜单');
    };

    editMenuInfo = () => {
        const selectedRows = this.voList.getSelectedRows();
        const menuId = this.voList.getSelectedRows()[0].id;
        this.openMenuInfoModal(menuId, '编辑菜单');
    };

    openMenuInfoModal = (id, title) => {
        const that = this;
        openModal(<MenuInfo/>, {
            title:title,
            defaultButton: true,
            id: id,
            ...that.props,
            onOk: (modal, component,btn) => {
                component.menuInfoSave((errors, values) =>{
                    if (!errors) {
                        modal.close();
                    }
                },btn);
            },
            refresh: this.tableRefresh
        });
        refresh: this.tableRefresh
    };

    deleteMenu = () => {
        const selectedRows = this.voList.getSelectedRows();
        Modal.confirm({
            title: '删除确认',
            content: '您确定删除吗？删除后数据不可恢复！',
            onOk: () => {
                this.voList.deleteRows(selectedRows);
            },
            onCancel() {
                return;
            },
        });
    };

    tableRefresh = () => {
        this.voList.refresh();
    };

    render() {
        return (
            <TreeTable
                pageSize={0}
                dataFormId="system-MenuList"
                keyAttribute="id"
                parentAttribute="parentMenu"
                toggleAttribute="name"
                params={{id: this.state.id}}
                formReady={this.formReady}
                showPagination={false}
            />
        );
    }
}