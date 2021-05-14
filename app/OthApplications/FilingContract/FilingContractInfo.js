import React from "react";

import {Row, Col, DetailInfo, Message, openModal, Modal, Icon, DataTable, Fieldset} from '../../../src/components';
import AddRepaymentInfo from "./AddRepaymentInfo";
import UpdateRepaymentInfo from "./UpdateRepaymentInfo";


export default class FilingContractInfo extends React.Component {


  constructor(props) {
    super(props);
    const {loanId, contractId} = props;
    this.loanId = loanId;
    this.contractId = contractId;
  }

  dataReady = (voInfo) => {
    this.voInfo = voInfo;
  };

  FilingContractInfoSave = (cb) => {
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

  formReady = (voList) => {
    this.voList = voList;
    this.voList.addButton([{
      name: '新增',
      onClick: this.create
    },
      {
        name: '删除',
        type: 'danger',
        disabled: this.readonly,
        selectBind: true,
        onClick: this.delete
      },
      {
        name: '编辑',
        selectBind: true,
        onClick: this.update
      }
    ]);
  };

  update = (voList) => {
    const id = this.voList.getSelectedRows()[0].id;
    this.UpdateRepayment(id, "编辑还款信息");
  }


  UpdateRepayment = (id,title) => {
    openModal(<UpdateRepaymentInfo {...this.props} readonly={this.props.readonly}/>, {
      title: title,
      id: id,
      defaultButton: !this.props.readonly,
      refresh: this.tableRefresh,
      onOk: (a, b, c) => {
        b.RepaymentAdd((err, value) => {
          c.setLoading(false);
          if (!err) {
            a.close();
          }
        });
      },
      onCancel: (a, b) => {
      }
    });
  };

  create = (voList) => {
    this.add(null, "新增预授信信息");
  }

  tableRefresh = () => {
    this.voList.refresh();
  }

  add = (id, title) => {
    openModal(<AddRepaymentInfo {...this.props} readonly={this.props.readonly}/>, {
      title: title,
      id: id,
      loanId: this.loanId,
      contractId: this.contractId,
      defaultButton: !this.props.readonly,
      refresh: this.tableRefresh,
      onOk: (a, b, c) => {
        b.AddRepaymentInfos((err, value) => {
          c.setLoading(false);
          if (!err) {
            a.close();
          }
        });
      },
      onCancel: (a, b) => {
      }
    });
  };

  delete = (voList) => {
    const row = this.voList.getSelectedRow();
    Modal.confirm({
      title: '删除确认',
      content: '是否确认删除',
      onOk: () => {
        this.voList.deleteRows([row]);
      },
      onCancel: () => {
        return;
      },
    });
  };


  render() {
    return (
      <div>
        <Fieldset legend="详情信息" showArrow={true}>
          <DetailInfo
            dataFormId="othapplications-FilingContractInfo"
            params={{loanId: this.loanId}}
            dataReady={this.dataReady}
          />
        </Fieldset>
        <Fieldset legend="支付信息" showArrow={true}>
          <DataTable
            dataFormId="othapplications-PaymentInfo"
            params={{contractId: this.contractId}}
          />
        </Fieldset>
        <Fieldset legend="还款信息" showArrow={true}>
          <DataTable
            dataFormId="othapplications-RepaymentInfo"
            params={{contractId: this.contractId}}
            formReady={this.formReady}
            dataReady={this.dataReady}
          />
        </Fieldset>
      </div>
    );
  }

}
