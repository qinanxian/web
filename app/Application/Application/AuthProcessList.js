import React from "react";

import { DataTable, Message, openModal, Modal,Icon} from '../../../src/components';

import ApplicationTree from './ApplicationTree';
import AuthProcessInfo from './AuthProcessInfo';


export default class ProductList extends React.Component {

    static ApplicationTree = ApplicationTree;
    static AuthProcessInfo = AuthProcessInfo;


    constructor(props) {
        super(props);
        const {appId} = this.props.appId;
        this.appId = appId;
    }

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([{
            name: '新增',
            onClick: this.createAuthProcess
        }, {
            name: '删除',
            selectBind: true,
            onClick: this.deleteAuthProcess
        }, {
            name: '详情',
            selectBind: true,
            onClick: this.editAuthProcess
        }
        ]);

        this.voList.setColumnTemplate('allowHold', (text, record, i) => {
            return this.getIcon(record.allowHold);
        });
        this.voList.setColumnTemplate('allowBusiness', (text, record, i) => {
            return this.getIcon(record.allowBusiness);
        });
        this.voList.setColumnTemplate('allowEdit', (text, record, i) => {
            return this.getIcon(record.allowEdit);
        });
        this.voList.setColumnTemplate('allowView', (text, record, i) => {
            return this.getIcon(record.allowView);
        });
    };

    createAuthProcess = (voList) => {
        const row = this.voList.getSelectedRow();
        this.openAuthProcessModal(null,"新增认证流程");
    }

    editAuthProcess = (voList) => {
        const selectedRows = this.voList.getSelectedRows();
        const authProcessId = this.voList.getSelectedRows()[0].id;
        this.openAuthProcessModal(authProcessId, '修改认证流程');
    }

    openAuthProcessModal = (authProcessId, title) => {
        openModal(<AuthProcessInfo disabledContainer appId={this.props.appId}  readonly={this.props.readonly}/>, {
            title: title,
            authProcessId: authProcessId,
            defaultButton: this.props.readonly,
            refresh: this.tableRefresh,
            onOk: (a, b) => {
                b.authProcessInfoSave((err, value) => {
                    if (!err) {
                        a.close();
                    }
                });
            },
            onCancel: (a, b) => {
            }
        });
    };

    deleteAuthProcess = (voList) => {
        const row = this.voList.getSelectedRow();
        Modal.confirm({
            title: '删除确认',
            content: '是否确认删除', 
            onOk: () => {
                this.voList.deleteRows([row]);
            },
            onCancel: () => {
                return;
            },
        });
    };

    getIcon = (value) => {
        if (value === 'Y')
            return <Icon type="check" />
        return <Icon type="close" />
    };

    tableRefresh = () => {
        this.voList.refresh();
    };

    dataReady = (voList) => {
        // this.voList.setColumnTemplate('productName', (text, record, i) => {
        //     return (<a onClick={() => this.clickName(record)}>{text}</a>);
        // });
    };

    clickName = (row) => {
        // const id = row.id ? row.id : null;
        // const productName = row.productName ? row.productName : '产品详情';
        // const readonly = row.allowEdit === 'Y' ? false: true;
        // const {flexTabs} = this.props;
        // flexTabs.open(`产品名称：${productName}`, 'Application/Product/ProductTree', {
        //     id: id,
        //     readonly
        // });
    };

    render() {
        return (
            <div>
                <DataTable
                    dataFormId="application-AuthProcessList"
                    params = {{appId : this.props.appId}}
                    formReady={this.formReady}
                    dataReady={this.dataReady}
                />
            </div>
        );
    }
}