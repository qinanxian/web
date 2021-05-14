import React from 'react';

import { DetailInfo, Fieldset } from 'roface';

export default class PolcDefinitionBaseInfo extends React.Component{
  formReady = (voInfo) => {
    const { formReady } = this.props;
    formReady && formReady(voInfo);
  };
  render(){
    return (
      <Fieldset legend={"产品基础信息"} expanded={true}>
        <DetailInfo
          reading
          dataFormId="configuration-PolcDefinitionBaseInfo"
          params={{policyId: this.props.policyId}}
          formReady={this.formReady}
        />
      </Fieldset>
    );
  }
}