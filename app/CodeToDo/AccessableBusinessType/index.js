import React from 'react'

import {DataTable, Message, Notify, openModal, Modal, rest} from '../../../src/components';

import BusinessTypeInfo from './BusinessTypeInfo';

export default class BusinessTypeList extends React.Component {

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
      onClick: this.createBusinessType
    },
      {
        name: '删除',
        selectBind: true,
        onClick: this.deleteBusinessType
      },
      {
        name: '编辑',
        selectBind: true,
        onClick: this.editBusinessTypeInfo
      },
      {
        name: '导出EXCEL',
        type: 'default',
        onClick: () => this.exportExcel(true)
      }
    ]);

  };

  createBusinessType = (voList) => {
    const row = this.voList.getSelectedRow();
    this.openBusinessTypeModal(null, "新增业务类型");
  }

  editBusinessTypeInfo = (voList) => {
    const selectedRows = this.voList.getSelectedRows();
    const id = this.voList.getSelectedRows()[0].id;
    this.openBusinessTypeModal(id, "修改业务类型");
  }

  openBusinessTypeModal = (id, title) => {
    openModal(<BusinessTypeInfo readonly={this.props.readonly}/>, {
      title: title,
      businessTypeId: id,
      defaultButton: !this.props.readonly,
      refresh: this.tableRefresh,
      onOk: (a, b, c) => {
        b.businessTypeInfoSave((err, value) => {
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
  exportExcel = (isAll) => {
    this.voList.exportExcel(isAll, `自助银行网点信息列表.xlsx`);
  };

  deleteBusinessType = (voList) => {
    const row = this.voList.getSelectedRow();
    Modal.confirm({
      title: '删除确认',
      content: '是否确认删除',
      onOk: () => {
        // this.voList.deleteRows([row]);
        rest.get(`/businessType/deleteDelFlagById/${row.id}`)
            .then((data) => {
              console.log(data);
              if (data.status === 1) {
                Notify.info("删除成功！");
                this.tableRefresh();
              } else {
                Notify.error("删除失败！");
              }
            }).catch((error) => {
              Notify.error("出现异常");
            }
        )
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
              dataFormId="codetodo-BusinessTypeList"
              formReady={this.formReady}
              dataReady={this.dataReady}
              labelWidth={158}
          />
        </div>
    );
  }

}