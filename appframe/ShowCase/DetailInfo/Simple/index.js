import React from 'react';

import {DetailInfo, Message, DataTablePicker} from '../../../../src/components';
import ModalInput from "../../../../src/components/modalInput";

export default class Simple extends React.Component {
    getParams = () => {
        console.log('data：',this.dataInfo.getData());
    };
    getParams2 = () => {
        console.log('data2：',this.dataInfo.getData());
    };
    dataReady = (dataInfo) => {
        this.dataInfo = dataInfo;
        dataInfo.setValue('birth',new Date());
        const name = dataInfo.getValue('name');
        dataInfo.setValue('chnName', `${name}-${Math.random()}`);
        dataInfo.setItemSuffix('name', () => {
            return (
                <DataTablePicker
                    params={this.getParams}
                    dataFormId="customer-EnterpriseCustomerSummaryList"
                    pageSize={5}
                    title="选择投资企业信息"
                    onOk={(e, row) => {
                        dataInfo.setData({name:'rkxie'})
                    }}
                />
            );
        });
        dataInfo.setItemSuffix('email', () => {
            return (
                <DataTablePicker
                    params={this.getParams2}
                    dataFormId="customer-EnterpriseCustomerSummaryList"
                    pageSize={5}
                    title="选择投资企业信息"
                    onOk={(e, row) => {

                    }}
                />
            );
        })
        // dataInfo.setItemTemplate('email',() => {
        //    return (
        //       <ModalInput
        //         dataTable={{dataFormId:"customer-EnterpriseCustomerSummaryList"}}
        //         modal={{
        //            title:"选择投资企业信息",
        //            onOk:(e,row) => {
        //                dataInfo.setData({email:'rkxie——email'})
        //            }
        //         }}
        //       />
        //    );
        // });
    };
    saveRecord = () => {
      this.dataInfo.saveData((err, values) => {
        if (err) {
          Message.error('保存失败！');
        }
        Message.error('保存成功sssss！');
      });
    };
    render() {
        return (
            <DetailInfo
                params={{id: 18}}
                dataFormId="demo-PersonSimpleInfo"
                dataReady={this.dataReady}
            />
        );
    }
}

