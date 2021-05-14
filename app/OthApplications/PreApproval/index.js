import React from "react";


import {DataTable, Message, openModal, Modal, Icon, Upload, DetailInfo} from '../../../src/components/index';
import {Notify, rest} from "../../../src/components";
import {getUser} from "../../../src/lib/cache";
import AddPreApprovalInfo from './AddPreApprovalInfo';
import PreConfirmation from './PreConfirmation';
import PreApprovaInfo from './PreApprovaInfo';
import './index.less';

export default class PreApprovalList extends React.Component {


  constructor(props) {
    super(props);
    this.state = {};
    this.userOrg = getUser().orgId;
    this.code = getUser().code;
  }

  formReady = (voList) => {
    $('.ro-ad-container-search-label').css("width", "140px");
    this.voList = voList;
    this.voList.addButton([
      {
        name: '新增',
        onClick: this.createPreApprovaInfo
      },
      {
        name: '删除',
        type: 'danger',
        disabled: this.readonly,
        selectBind: true,
        onClick: this.deleteApplication
      },
      {
        name: '编辑',
        selectBind: true,
        onClick: this.approvaInfo
      },
      {
        name: '确认',
        permitCode: 'Editable',
        selectBind: true,
        onClick: this.confirm
      },
    ]);

  };


  createPreApprovaInfo = (voList) => {
    this.addPreApprovaInfo(null, "新增预授信信息");
  }

  approvaInfo = (voList) => {
    const id = this.voList.getSelectedRows()[0].loanId;
    const status = this.voList.getSelectedRows()[0].confirmStatus;
    const confirmStatus = status === '2' ? true : false;
    this.openPreApprovaInfo(id, "预授信信息详情", 0, confirmStatus);
  }

  confirm = (voList) => {
    const id = this.voList.getSelectedRows()[0].loanId;
    const status = this.voList.getSelectedRows()[0].confirmStatus;
    const confirmStatus = status === '2' ? true : false;
    this.openConfirmation(id, "确认详情", 1, confirmStatus);
  }


  transferData = () => {
    rest.post('/comn/file/uploadParseDataListToDB/network', null, this.uploadTestDataCallback());
  }

  openConfirmation = (id, title, status, confirmStatus) => {
    openModal(<PreConfirmation {...this.props} readonly={this.props.readonly}/>, {
      title: title,
      loanId: id,
      userOrg: this.userOrg,
      status: status,
      confirmStatus: confirmStatus,
      defaultButton: !this.props.readonly,
      refresh: this.tableRefresh,
      onOk: (a, b, c) => {
        b.PreApprovalAdd((err, value) => {
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
  //编辑
  openPreApprovaInfo = (id, title, status, confirmStatus) => {
    openModal(<PreApprovaInfo {...this.props} readonly={this.props.readonly}/>, {
      title: title,
      loanId: id,
      userOrg: this.userOrg,
      status: status,
      confirmStatus: confirmStatus,
      defaultButton: !this.props.readonly,
      refresh: this.tableRefresh,
      onOk: (a, b, c) => {
        if (b.state.numberbankcolor == true) {
          b.PreAdd((err, value) => {
            c.setLoading(false);
            if (!err) {
              a.close();
            }
          });
        } else {
          Notify.error({
            message: '银行卡卡号错误，请重新输入正确的银行卡卡号！！！',
          })
          c.setLoading(false);
        }
      },
      onCancel: (a, b) => {
      }
    });
  };


  addPreApprovaInfo = (id, title) => {
    openModal(<AddPreApprovalInfo {...this.props} readonly={this.props.readonly}/>, {
      title: title,
      loanId: id,
      userOrg: this.userOrg,
      defaultButton: !this.props.readonly,
      refresh: this.tableRefresh,
      onOk: (a, b, c) => {
        if (b.state.numberbankcolor == true) {
          b.InfoAdd((err, value) => {
            c.setLoading(false);
            if (!err) {
              a.close();
            }
          });
        } else {
          Notify.error({
            message: '银行卡卡号错误，请重新输入正确的银行卡卡号！！！',
          })
          c.setLoading(false);
        }

      },
      onCancel: (a, b) => {
      }
    });
  };

  deleteApplication = (voList) => {
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

  tableRefresh = () => {
    this.voList.refresh();
  }


  render() {
    return (
      <div>
        <DataTable
          dataFormId="othapplications-PreApprovalList"
          formReady={this.formReady}
          dataReady={this.dataReady}
          params={{userOrg: this.userOrg}}
          reading={true}
        />
      </div>
    );
  }
}