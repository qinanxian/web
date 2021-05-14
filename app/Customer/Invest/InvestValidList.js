/**
 * Created by jkwu on 18-1-24.
 */
import React from "react";

import { DataTable, Message, openModal, Modal, propsCompose} from '../../../src/components';
import InvestInfo from './InvestInfo';

@propsCompose
export default class InvestValidList extends React.Component {
  formReady = (volist) => {
    this.volist = volist;
    if(!this.props.readonly) {
        this.volist.addButton([{
            name: '新增',
            onClick: () => this.openInvestInfo()
        }, {
            name: '删除',
            selectBind: true,
            onClick: this.deleteInvest
        }]);
    }


    this.volist.setColumnTemplate('relationCustName', (text, record) => {
      return (<a onClick={() => this.openInvestInfo(record)}>{text}</a>);
    });
  };

  openInvestInfo = (row) => {
    const { custId } = this.props;
    openModal(<InvestInfo readonly = {this.props.readonly}/>, {
      title: row ? '对外投资信息详情' : '新增对外投资信息',
      defaultButton: !this.props.readonly,
      tableRefresh: this.tableRefresh,
      relationId: row && row.relationId,
      custId,
      onOk: (currModal, currCom) => {
        currCom.saveInvestData((errors, values) => {
          if (!errors) {
            currModal.close();
          }
        });
        this.tableRefresh();
      }
    });
  };

  tableRefresh = () => {
    this.volist.refresh();
  };

  deleteInvest = () => {
    const selectedRows = this.volist.getSelectedRows();
    Modal.confirm({
      title: '删除确认',
      content: '您确定删除吗？删除后数据不可恢复！',
      onOk: () => {
        this.volist.deleteRows(selectedRows);
      }
    });
  };

  render() {
    return (
        <DataTable
          dataFormId="customer-InvestValidList"
          params={{custId: this.props.custId}}
          formReady={this.formReady}
        />
    );
  }
}