import React from "react";
import {DataTable, DetailInfo, Message, Modal, openModal} from '../../../src/components';

export class FunderInfo extends React.Component {
    dataReady = (voInfo) => {
        this.voInfo = voInfo;
    }

    saveFunderInfoData = (callback,btn) => {
        this.voInfo.saveData((err, values) => {
            if (err) {
                Message.error('保存失败！');
                btn.setLoading(false);
            } else {
                const {refresh} = this.props;
                refresh && refresh();
            }
            callback(err, values);
        });
    };

    render() {
        const {param} = this.props;
        return (
            <DetailInfo dataFormId="obiz-FunderInfo" dataReady={this.dataReady} params={{funderId: this.props.funderId}} />
        );
    }
}

export default class FunderList extends React.Component {
    static FunderInfo = FunderInfo;


    formReady = (voList) => {
        this.voList = voList;
        //添加按钮
        this.voList.addButton([
            {name: '添加资金方', type:'primary',icon:'fa-plus',onClick: () => this.openFunderInfo('NULL')},
            {name: '删除',selectBind: true, icon:'fa-trash-o',onClick: () => this.deleteFunderData()}
        ]);

        this.voList.setColumnTemplate('funderName', (text, record, i) => {
            return <a onClick={() => this.clickName(text, record, i)}>{text}</a>
        });
    };
    /**
     * 表格源数据（表头信息）加载完成后，调用
     * @param formList
     */
    dataReady = (voList) => {
        this.voList = voList;

    };

    dataListRefresh = () => {
        this.voList.refresh();
    }

    openFunderInfo = (funderId) => {
        openModal(<FunderInfo disabledContainer funderId={funderId}/>,{
            defaultButton: true,
            title:"添加资金方" ,
            isDragact: true,
            onOk: (modal, component,btn) => {
                component.saveFunderInfoData((err, value) => {
                    if (!err) {
                        modal.close();
                    }
                },btn);
            },
            refresh: this.dataListRefresh,
        });

    }

    deleteFunderData = () => {
        const that = this;
        const row = that.voList.getSelectedRow();

        Modal.confirm({
            title: '删除确认',
            content: `您确定删除吗？删除后数据不可恢复！`,
            onOk() {
                that.voList.deleteRows([row]);
            },
            onCancel() {
                return;
            },
        });
    }

    clickName = (text, record, i) => {
        this.openFunderInfo(record.funderId);
    };

    render() {
        return (
            <DataTable
                majorKey="funderId"
                dataFormId="obiz-FunderList"
                dataReady={this.dataReady}
                formReady={this.formReady}
            />
        );
    }
}
