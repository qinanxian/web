import React from 'react'

import {DataTable, Message, Notify, openModal, Modal, rest, Upload} from '../../../src/components';
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
        name: '发起活动',
        selectBind: true,
        onClick: this.ActivityStart
      },
      {
        name: '撤销活动',
        selectBind: true,
        onClick: this.ActivityEnd
      },
      {
        name: '导出EXCEL',
        type: 'default',
        onClick: () => this.exportExcel(true)
      }
    ]);
      this.voList.addTemplate([
        <Upload
          name={"导入EXCEL"}
          action={`/comn/file/uploadParseDataListToDB/downloadActivi`}
          onChange={this.upload}
        />
      ]);
      this.voList.addButton([
        {
          name: '下载模版',
          icon:'fa-download',
          type: 'primary',
          selectBind: false,
          onClick: () => this.downloadTemplate()
        }
      ]);
  };

  upload = (status,ret) => {
    console.log(status);
    if(status === 'done'){
      const count = ret.response;
      Message.success(`成功导入记录[${count}]条`);
      this.tableRefresh();
    }
  };

  downloadTemplate = () => {
    rest.download('/comn/file/downloadActivityList','get',{templateName:'营销活动模板.xlsx'});
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

  ActivityEnd = (voList) => {
    const id = this.voList.getSelectedRows()[0].id;
    Modal.confirm({
      title: '',
      content: '是否确认发起活动',
      onOk: () => {
        rest.post('/Activity/activityEnd',{id: id})
          .then((res) => {
            if (res == 0) {
              Message.success("活动撤销成功");
              const {refresh} = this.props;
              refresh && refresh();
            } else {
              Message.success("数据正在跑批中......请稍后再试！！！！！请勿重复点击。");
            }
          })
      },
      onCancel: () => {
      },
    });
  }

  ActivityStart = (voList) => {
    const targetCustomer = this.voList.getSelectedRows()[0].targetCustomer;
    const id = this.voList.getSelectedRows()[0].id;
      Modal.confirm({
        title: '',
        content: '是否确认发起活动',
        onOk: () => {
          rest.post('/Activity/activityStart', {targetCustomer: targetCustomer,id: id})
            .then((res) => {
              if (res == 0) {
                Message.success("消息发送成功");
                const {refresh} = this.props;
                refresh && refresh();
              } else if(res==1) {
                Message.error("活动已失效，不可发起！");
              }
            })
        },
        onCancel: () => {
        },
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