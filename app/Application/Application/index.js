import React from "react";

import { DataTable, Message, openModal, Modal,Icon} from '../../../src/components';
import ApplicationInfo from './ApplicationInfo';
import ApplicationTree from './ApplicationTree';
import ProductList from './ProductList';
import AuthProcessList from './AuthProcessList';

export default class ApplicationList extends React.Component {

    static ApplicationInfo = ApplicationInfo;
    static ApplicationTree = ApplicationTree;
    static ProductList = ProductList;
    static AuthProcessList = AuthProcessList;

    constructor(props) {
        super(props);
    }

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([{
            name: '新增',
            onClick: this.createApplication
        }, {
            name: '删除',
            selectBind: true,
            onClick: this.deleteApplication
        }, {
            name: '详情',
            selectBind: true,
            onClick: this.editApplicationInfo
        }
        ]);

    };

    createApplication = (voList) => {
        const row = this.voList.getSelectedRow();
        this.openApplicationInfoModal(null,"新增应用");
    }

    editApplicationInfo = (voList) => {
        const selectedRows = this.voList.getSelectedRows();
        const appId = this.voList.getSelectedRows()[0].id;
        this.openApplicationInfoModal(appId, '修改应用名称');
    }

    openApplicationInfoModal = (appId, title) => {
        openModal(<ApplicationInfo readonly={this.props.readonly}/>, {
            title: title,
            appId: appId,
            defaultButton: !this.props.readonly,
            refresh: this.tableRefresh,
            onOk: (a, b) => {
                b.applicationInfoSave((err, value) => {
                    if (!err) {
                        a.close();
                    }
                });
            },
            onCancel: (a, b) => {
            }
        });
    };

    deleteApplication = (voList) => {
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
        this.voList.setColumnTemplate('appName', (text, record, i) => {
            return (<a onClick={() => this.clickName(record)}>{text}</a>);
        });
    };

    clickName = (row) => {
        const appId = row.id ? row.id : null;
        const appName = row.appName;
        const readonly = row.allowEdit === 'Y' ? false: true;
        const {flexTabs} = this.props;
        flexTabs.open(`应用名称：${appName}`, 'Application/Application/ApplicationTree', {
            appId: appId,
            readonly
        });
    };

    render() {
        return (
            <div>
                <DataTable
                    dataFormId="application-ApplicationList"
                    formReady={this.formReady}
                    dataReady={this.dataReady}
                />
            </div>
        );
    }
}