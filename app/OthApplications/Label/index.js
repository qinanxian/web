import React from 'react'

import {DataTable, Message, Notify, openModal, Modal, rest} from '../../../src/components';
import LabelInfo from './LabelInfo';
export default class LableList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {

  }

  dataReady = (voList) => {

  };

  formReady = (voList) => {
    this.voList = voList;
    this.voList.addButton([{
      name: '新增',
      onClick: this.createLableInfo
    },
      {
        name: '删除',
        selectBind: true,
        onClick: this.deleteLableInfo
      },
      {
        name: '详情',
        selectBind: true,
        onClick: this.LableInfo
      },
    ]);

  };

  createLableInfo = (voList) => {
    this.LableInfoModal(null, "新增标签信息");
  }


  LableInfoModal = (id, title) => {
    openModal(<LabelInfo {...this.props} readonly={this.props.readonly}/>, {
      title: title,
      loanId: id,
      userOrg: this.userOrg,
      defaultButton: !this.props.readonly,
      refresh: this.tableRefresh,
      onOk: (a, b, c) => {
          b.InfoAddLabelInfo((err, value) => {
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

  LableInfo = (voList) => {
    const id = this.voList.getSelectedRows()[0].id;
    this.openLableInfoModal(id, "标签管理详情");
  }

  openLableInfoModal = (id, title) => {
    openModal(<LabelInfo readonly={this.props.readonly}/>, {
      title: title,
      id: id,
      defaultButton: !this.props.readonly,
      refresh: this.tableRefresh,
      onOk: (a, b) => {
        a.close();
      },
      onCancel: (a, b) => {
      }
    });
  };

  deleteLableInfo = (voList) => {
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
  };

  render() {
    return (
        <div>
          <DataTable
              dataFormId="othapplications-labelList"
              formReady={this.formReady}
              dataReady={this.dataReady}
              labelWidth={158}
          />
        </div>
    );
  }

}