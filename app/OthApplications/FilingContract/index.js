import React from "react";


import {DataTable, Message, openModal, Modal, Icon, Upload, DetailInfo} from '../../../src/components/index';
import {Notify, rest} from "../../../src/components";
import {getUser} from "../../../src/lib/cache";
import FilingContractInfo from './FilingContractInfo';

export default class FilingContractList extends React.Component {


  constructor(props) {
    super(props);
    this.state = {};
    this.userOrg = getUser().orgId;
  }

  formReady = (voList) => {
    $('.ro-ad-container-search-label').css("width", "140px");
    this.voList = voList;
    this.voList.addButton([
      {
        name: '详情',
        selectBind: true,
        onClick: this.openFilingContract
      },
    ]);

  };

  openFilingContract = (voList) => {
    const id = this.voList.getSelectedRows()[0].loanId;
    const contractId = this.voList.getSelectedRows()[0].contractId;
    this.openFilingContractInfo(id,contractId, "备案合同信息详情");
  }

  // dataReady = (voList) => {
  //   this.voList.setColumnTemplate('loanId', (text, record, i) => {
  //     return (<a onClick={() => this.clickName(record)}>{text}</a>);
  //   });
  // };

  clickName = (row) => {
    //NETWORK_INFO表中的主键id
    const loanId = row.loanId
    //NETWORK_INFO表中的字段ORG_ID，该字段与AUTH_ORG表中的ID进行关联
    // const orgId = row.orgId;
    // const readonly = row.allowEdit === 'Y' ? false: true;
    const {flexTabs} = this.props;
    flexTabs.open(`申贷编号：${loanId}`, 'OthApplications/FilingContract/FilingContractInfo', {
      loanId: loanId,
    });
  };

  tableRefresh = () => {
    this.voList.refresh();
  }


  openFilingContractInfo = (id,contractId, title) => {
    openModal(<FilingContractInfo {...this.props} readonly={this.props.readonly}/>, {
      title: title,
      loanId: id,
      contractId: contractId,
      defaultButton: !this.props.readonly,
      refresh: this.tableRefresh,
        onOk: (a, b, c) => {
          // b.FilingContractInfoSave((err, value) => {
          //   c.setLoading(false);
          //   if (!err) {
              a.close();
          //   }
          // });
        },
      onCancel: (a, b) => {
      }
    });
  };


  render() {
    return (
        <div>
          <DataTable
              dataFormId="othapplications-FilingContractList"
              formReady={this.formReady}
              dataReady={this.dataReady}
              params={{userOrg: this.userOrg}}
          />
        </div>
    );
  }
}