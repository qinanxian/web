import React from 'react';
import {DetailInfo, Message,DataTablePicker,openModal} from '../../../src/components';
import IndividualSummary from '../Individual/IndividualSummary';
export default class KeymanInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            custId: props.custId || null,
            id: props.id || null
        };
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        this.voInfo.setItemSuffix('relationCustName', () => {
            const data = voInfo.getData();
            return (
                <DataTablePicker
                    dataFormId="customer-IndividualCustomerList"
                    title="选择自然人"
                    pageSize={5}
                    formReady={
                        (volist) => {
                            this.volist = volist;
                            this.volist.addButton([{
                                name: '新增',
                                onClick: this.openIndividualSummary
                            }]);
                        }
                    }
                    onOk={(e, row) => {
                        row && this.voInfo.setData({
                            relationCustName: row.custName,
                            relationCertType: row.certType,
                            relationCertId: row.certId
                        });
                    }}
                />
            );
        })
    };

    openIndividualSummary = () => {
        openModal(<IndividualSummary refresh={this.dataTablePickerRefresh}/> , {
            title: "新增自然人信息",
            defaultButton: true,
            onOk(modal, compnent) {
                compnent.individualSummarySave((err, value) => {
                    if (!err) {
                        modal.close();
                    }
                });
            },
            onCancel(a, b) {
            },
        });
    };

    dataTablePickerRefresh = () => {
        this.volist.refresh();
    };

    infoSave = (cb) => {
        this.voInfo.saveData((err, values) => {
            if (err) {
                Message.error('保存失败！');
            } else {
                const {refresh} = this.props;
                refresh && refresh();
            }
            cb(err,values);
        });
    };

    render() {
        return (
            <div>
                <DetailInfo
                    dataFormId="customer-KeymanInfo"
                    params={{custId: this.state.custId, id: this.state.id}}
                    dataReady={this.dataReady}
                    reading = {this.props.readonly}
                    labelWidth={158}
                />
            </div>

        );
    }
}

