import React from "react";

import {Row, Col, DetailInfo, Message, openModal, Modal, Icon} from '../../../src/components';


export default class UpdateRepaymentInfo extends React.Component {


  constructor(props) {
    super(props);
    const {id} = props;
    this.id = id;
  }

  dataReady = (voInfo) => {
    this.voInfo = voInfo;
  };


  RepaymentAdd = (cb) => {
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
              dataFormId="othapplications-UpdateRepaymentInfo"
              params={{id: this.id}}
              dataReady={this.dataReady}
              labelWidth={158}
          />
        </div>
    );
  }

}
