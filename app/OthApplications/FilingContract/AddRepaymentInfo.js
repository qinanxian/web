import React from "react";

import {Row, Col, DetailInfo, Message, openModal, Modal, Icon} from '../../../src/components';


export default class AddRepaymentInfo extends React.Component {


  constructor(props) {
    super(props);
    const {id,loanId,contractId} = props;
    this.id = id;
    this.loanId = loanId;
    this.contractId = contractId;
  }


  AddRepaymentInfos = (cb) => {
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

  dataReady = (voInfo) => {
    this.voInfo = voInfo;
    this.voInfo.setValue("loanId", this.loanId);
    this.voInfo.setValue("contractId", this.contractId);
  };


  render() {
    return (
        <div>
          <DetailInfo
              dataFormId="othapplications-AddRepaymentInfo"
              params={{id: this.id}}
              dataReady={this.dataReady}
              labelWidth={158}
          />
        </div>
    );
  }

}
