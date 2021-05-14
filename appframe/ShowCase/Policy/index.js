import React from "react";

import { DataTable, Message, openModal, Modal, propsCompose} from '../../../src/components';
import CreditDemoSummary from './CreditDemoSummary';
import CreditDemoInfo from './CreditDemoInfo'

@propsCompose
export default class CreditDemoList extends React.Component {

    static CreditDemoInfo = CreditDemoInfo;

    formReady = (voList) => {
        this.voList = voList;
        if (!this.props.readonly) {
            this.voList.addButton([{
                name: '新增',
                onClick: () => this.openCreditSummary()
            }]);
        }
        this.voList.setColumnTemplate('planName', (text, record) => {
            return (<a onClick={() => this.openCreditInfo(record)}>{text}</a>);
        });
    };

    openCreditSummary = () => {
        openModal(<CreditDemoSummary />, {
          title: '新增授信信息',
          defaultButton: true,
          refresh: this.tableRefresh,
          onOk: (currentModal, currentCom) => {
            currentCom.summarySave((errors, values) => {
              if (!errors) {
                currentModal.close();
              }
            });
            this.tableRefresh();
          },
       });
    };



    openCreditInfo = (record) => {
        const {planId = null,prodPolicy = null} = record;
        const {flexTabs} = this.props;
        flexTabs.open(`授信详情`, 'ShowCase/Policy/CreditDemoInfo', {
            planId: planId,
            defaultButton:true,
            prodPolicy: prodPolicy

        });
    };

   tableRefresh = () => {
     this.voList && this.voList.refresh();
   };


    render() {
        return (
            <div>
                <DataTable
                    dataFormId="demo-PolicyDemoList"
                    formReady={this.formReady}
                />
            </div>
        );
    }
}