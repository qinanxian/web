import React from "react";

import {Row, Col, DetailInfo, Message, openModal, Modal, Icon, Fieldset} from '../../../src/components';


export default class FinancingInfo extends React.Component {


  constructor(props) {
    super(props);
    const {loanId, companyId} = props;
    this.loanId = loanId;
    this.companyId = companyId;
  }


  render() {
    return (
      <div>
        <Fieldset legend="融资订单基本信息" showArrow={true}>
          <DetailInfo
            dataFormId="othapplications-FinaInfo"
            params={{loanId: this.loanId}}
          />
        </Fieldset>
        <Fieldset legend="企业基本信息" showArrow={true}>
          <DetailInfo
            dataFormId="othapplications-EnterpriseInfo"
            params={{companyId: this.companyId}}
          />
        </Fieldset>
      </div>
    );
  }

}
