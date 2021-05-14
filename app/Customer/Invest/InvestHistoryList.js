/**
 * Created by jkwu on 18-1-24.
 */
import React from "react";

import { DataTable, Message, openModal, Modal, propsCompose} from '../../../src/components';

@propsCompose
export default class InvestHistoryList extends React.Component {
  dataReady = (voList) => {
    this.voList = voList;
    this.voList.addButton([{
      name: '收回',
      selectBind: true,
      onClick: this.deleteAsset
    }]);

    this.voList.setColumnTemplate('assetName', (text, record) => {
      return (<a onClick={() => this.openAssetInfo(record)}>{text}</a>);
    });
  };

  tableRefresh = () => {
    this.voList.refresh();
  };

  render() {
    return (
      <div>
        <DataTable
          dataFormId="customer-InvestHistoryList"
          params={{ custId: this.props.custId}}
          dataReady={this.dataReady}
        />
      </div>
    );
  }
}