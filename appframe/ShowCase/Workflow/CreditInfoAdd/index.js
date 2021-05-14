import React from 'react';
import {DetailInfo, Button, Message, DataTablePicker, TreeSelect} from '../../../../src/components/index';


export default class CreditInfoAdd extends React.Component {
        formReady = (formInfo) => {
        this.formInfo = formInfo;

        this.formInfo.setReadingMode('certType',true);
        this.formInfo.setReadingMode('certId',true);
        // this.voInfo.setLabelWidth('custName','200px');
        // this.voInfo.setLabelWidth('prodPolicy','140px');
        // this.voInfo.setLabelWidth('purpose','140px');


        this.formInfo.setItemSuffix('custName', () => {
            return (
                <DataTablePicker
                    dataFormId="customer-IndividualCustomerList"
                    pageSize={10}
                    title='请选择客户'
                    onOk={(e, row) => {
                        if(row){
                            this.formInfo.setValue('custId', row.custId);
                            this.formInfo.setValue('custName', row.custName);
                            this.formInfo.setValue('certType', row.certType);
                            this.formInfo.setValue('certId', row.certId);
                        }
                    }}
                />
            );
        });
    };

    addSave = (cb) => {
        this.formInfo.saveData((err, values) => {
            if (err) {
                Message.info('保存失败,'+err+"!");
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
                    labelWidth={"85px"}
                    dataFormId="demo-WKFLCreditAdd"
                    formReady={this.formReady}
                />
            </div>
        );
    }
}

