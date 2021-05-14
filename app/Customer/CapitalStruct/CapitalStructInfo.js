import React from 'react';
import { DetailInfo, Message, DataTablePicker } from '../../../src/components';

export default class CapitalStructInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            custId: props.custId ? props.custId: null,
            relationId: props.relationId ? props.relationId: null,
            isAdded: props.isAdded
        };
    }

    formReady = (voInfo) => {
        this.voInfo = voInfo;

        if (!this.state.isAdded) {
            this.voInfo.setValueReadonly("stockholderType",true)
            this.voInfo.setValueReadonly("stockholderName",true)
            this.voInfo.setValueReadonly("stockholderCertType",true)
            this.voInfo.setValueReadonly("stockholderCertId",true)
        }

        if(!this.props.readonly) {
            this.voInfo.setItemSuffix('stockholderName', () => {
                return (
                    <DataTablePicker
                        dataFormId="customer-CustBaseSummaryList"
                        pageSize={5}
                        title="选择股东信息"
                        params={{custId:this.state.custId,custType:this.voInfo.getValue("stockholderType") ? this.voInfo.getValue("stockholderType"): ""}}
                        onOk={(e, row) => {
                            if (row) {
                                this.voInfo.setData({
                                    stockholderCustId: row.custId,
                                    stockholderCertId: row.certId,
                                    stockholderName: row.custName,
                                    stockholderCertType: row.certType,
                                    stockholderType: row.custType=='ENT'?'10':'20'
                                });
                                //this.voInfo.setValueReadonly("stockholderCertType",true)
                                //this.voInfo.setValueReadonly("stockholderCertId",true)
                            }
                        }}
                    />
                );
            })
        }
    };

    infoSave = (cb) => {
        this.voInfo.saveData((err, values) => {
            if (err) {
                Message.error('保存失败！');
            } else {
                const {refresh} = this.props;
                refresh && refresh();
            }
            cb(err, values);
        });
    };

    render() {
        return (
            <div>
                <DetailInfo
                    dataFormId="customer-CapitalStructInfo"
                    params={{custId: this.state.custId, relationId: this.state.relationId}}
                    formReady={this.formReady}
                    reading = {this.props.readonly}
                    labelWidth={158}
                />
            </div>

        );
    }
}

