import React from 'react'

import {DataTable, Message, Notify, openModal, Modal, rest} from '../../../src/components';
import ActivityInfo from './ActivityInfo';
import LabelInfo from "../Label/LabelInfo";
export default class ActivityList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }


  dataReady = (voList) => {

  };

  formReady = (voList) => {
    this.voList = voList;
    this.voList.addButton([
      {
        name: '策划活动',
        onClick: this.createActivityInfo
      },
      {
        name: '活动详情',
        selectBind: true,
        onClick: this.ActivityInfo
      },
      {
        name: '导出EXCEL',
        type: 'default',
        onClick: () => this.exportExcel(true)
      }
    ]);

  };

  exportExcel = (isAll) => {
    this.voList.exportExcel(isAll, `营销活动信息.xlsx`);
  };

  createActivityInfo = (voList) => {
    this.addActivityInfo(null, "新增营销活动");
  }

  ActivityInfo = (voList) => {
    const id = this.voList.getSelectedRows()[0].id;
    this.openActivityModal(id, "营销活动详情");
  }

  openActivityModal = (id, title) => {
    openModal(<ActivityInfo readonly={this.props.readonly}/>, {
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


  addActivityInfo = (id, title) => {
    openModal(<ActivityInfo {...this.props} readonly={this.props.readonly}/>, {
      title: title,
      id: id,
      defaultButton: !this.props.readonly,
      refresh: this.tableRefresh,
      onOk: (a, b, c) => {
        b.addActivity((err, value) => {
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

  // LableInfo = (voList) => {
  //   const id = this.voList.getSelectedRows()[0].id;
  //   this.openLableInfoModal(id, "标签管理详情");
  // }

  // openLableInfoModal = (id, title) => {
  //   openModal(<LabelInfo readonly={this.props.readonly}/>, {
  //     title: title,
  //     id: id,
  //     defaultButton: !this.props.readonly,
  //     refresh: this.tableRefresh,
  //     onOk: (a, b) => {
  //       a.close();
  //     },
  //     onCancel: (a, b) => {
  //     }
  //   });
  // };


  tableRefresh = () => {
    this.voList.refresh();
  };

  render() {
    return (
      <div>
        <DataTable
          dataFormId="othapplications-acticityList"
          formReady={this.formReady}
          dataReady={this.dataReady}
          labelWidth={158}
        />
      </div>
    );
  }

}