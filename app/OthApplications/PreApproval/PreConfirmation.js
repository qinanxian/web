import React from "react";

import {Row, Col, DetailInfo, Message, openModal, Modal, Icon} from '../../../src/components';


export default class PreConfirmation extends React.Component {


  constructor(props) {
    super(props);
    const {loanId} = props;
    this.loanId = loanId;
  }

  dataReady = (voInfo) => {
    this.voInfo = voInfo;
    if (this.props.status===1){
      // this.voInfo.setValue("confirmStatus", this.props.status === 0 ? "NO" : "YES");
      this.voInfo.setValue("confirmStatus", "2");

    }
  };


  PreApprovalAdd = (cb) => {
    this.voInfo.saveData((err, values) => {
      if (err) {
        Message.error(err.message);
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
              dataFormId="othapplications-PreApprovalInfo"
              params={{loanId: this.loanId}}
              reading={this.props.confirmStatus}
              dataReady={this.dataReady}
              labelWidth={158}
          />
          {

          }<span style={{color:'red',marginLeft:'150px'}}>注：如你已进入"确认详情"页面，请认真核对详情信息，如点击确定则无法再次修改数据！！！</span>
        </div>
    );
  }

}
