import React from 'react';

import CommonFileList from '../../Common/CommonFileList';

export default class DocList extends React.Component{
  render() {
    return (
      <div>
        <CommonFileList
          isAutoDecompress
          selectionType={"multiple"}
          objectId ={"PEP0000251"}
          objectType={'INVEST_PLAN'}
          dataFormId={'invest-InvestPlanDocListItemList'}
          extendsParams={{procDefKey: 'dueDiligenceAndDecisionFlow', taskDefKey: '_205_1',readOnly:false}}
        />
      </div>
    );
  }
}