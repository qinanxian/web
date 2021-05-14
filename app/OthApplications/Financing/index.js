import React from "react";


import {DataTable, Message, openModal, Modal, Icon} from '../../../src/components/index';
import {getUser} from '../../../src/lib/cache';
import FinancingInfo from './FinancingInfo';
import Distribute from './Distribute';
import * as permission from '../../../src/lib/permission';
import {Notify} from "../../../src/components";


export default class FinancingList extends React.Component {

  constructor(props) {
    super(props);
    this.userRoleId = [];
    this.state = {};
    this.userOrg = getUser().orgId;
    console.log(this.userOrg,"000000")
    this.id = getUser().id;
  }

  formReady = (voList) => {
    this.voList = voList;
    this.voList.addButton([{
      name: '详情',
      selectBind: true,
      onClick: this.openFinancingInfo
    },
      {
        name: '分发',
        permitCode: 'Editable',
        selectBind: true,
        onClick: this.openDistribute
      }
    ]);
  };


  openDistribute = (voList) => {
      const id = this.voList.getSelectedRows()[0].loanId;
      const distributionStatus = this.voList.getSelectedRows()[0].distributionStatus;
      if(distributionStatus==='NO' || distributionStatus==='FAIL'){
        this.openDistributeModal(id, "融资订单分发",this.userOrg);
      }else if(distributionStatus === 'WAIT'){
        Notify.success({
          message: '订单分发中......',
        })      }else{
        Notify.success({
          message: '该订单已发送',
        })
      }
  }

  tableRefresh = () => {
    this.voList.refresh();
  }


  openFinancingInfo = (voList) => {
    const id = this.voList.getSelectedRows()[0].loanId;
    const companyId = this.voList.getSelectedRows()[0].companyId;
    this.openFinancingModal(id,companyId, "详情");
  }

  openFinancingModal = (id,companyId, title) => {
    openModal(<FinancingInfo readonly={this.props.readonly}/>, {
      title: title,
      loanId: id,
      companyId: companyId,
      defaultButton: !this.props.readonly,
      refresh: this.tableRefresh,
      onOk: (a, b) => {
        a.close();
      },
      onCancel: (a, b) => {
      }
    });
  };
    openDistributeModal = (id, title,userOrg) => {
    openModal(<Distribute readonly={this.props.readonly} rest={this.props.rest}/>, {
      title: title,
      loanId: id,
      userOrg: userOrg,
      defaultButton: !this.props.readonly,
      refresh: this.tableRefresh,
      onOk: (a, b,c) => {
        b.DistributeSave((err, value) => {
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

  render() {
    return (
        <div>
          <DataTable
              dataFormId="othapplications-FinancingList"
              formReady={this.formReady}
              dataReady={this.dataReady}
              params={{userOrg: this.userOrg}}
          />
        </div>
    );
  }
}