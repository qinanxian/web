import React from "react";

import {Message, DetailInfo,DataTablePicker} from '../../../src/components';

export default class CustRelationInfo extends React.Component {

    constructor(props) {
        super(props);
        const {id, custId} = props;
        this.id = id;
        this.custId = custId;
    }

    dataReady = (voinfo) => {
        this.voinfo = voinfo;
        this.voinfo.setValue('custId', this.custId);
        this.voinfo.setItemSuffix('relationCustName', () => {
            return (
                <DataTablePicker
                    dataFormId="customer-CustBaseSummaryList"
                    params={{custId:this.custId}}
                    pageSize={5}
                    title="选择关联客户信息"
                    onOk={(e, row) => {
                        row && this.voinfo.setData({
                            relationCustId: row.custId,
                            relationCertId: row.certId,
                            relationCustName: row.custName,
                            relationCertType: row.certType
                        });
                    }}
                />
            );
        })
    };

    relationInfoSave = (cb) => {
        this.voinfo.saveData((err, values) => {
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
            <DetailInfo
                dataFormId="customer-CustRelationInfo"
                dataReady={this.dataReady}
                params={{id: this.id}}
                labelWidth={158}
                reading = {this.props.readonly}
            />
        );
    }
}