import React from "react";

import { DataTable, Message, openModal, Modal, propsCompose} from '../../../src/components';
import AssetInfo from './AssetInfo';

@propsCompose
export default class AssetList extends React.Component {
    formReady = (voList) => {
        this.voList = voList;
        if (!this.props.readonly) {
            this.voList.addButton([{
                name: '新增',
                onClick: () => this.openAssetInfo()
            }, {
                name: '删除',
                selectBind: true,
                onClick: this.deleteAsset
            }]);
        }
        this.voList.setColumnTemplate('assetName', (text, record) => {
            return (<a onClick={() => this.openAssetInfo(record)}>{text}</a>);
        });
    };

    openAssetInfo = (row) => {
        const { custId } = this.props;
        openModal(<AssetInfo readonly={this.props.readonly}/>, {
          title: row ? '资产信息详情' : '新增资产信息',
          defaultButton: !this.props.readonly,
          refresh: this.tableRefresh,
          id: row && row.id,
          custId,
          onOk: (currentModal, currentCom) => {
            currentCom.saveAssetData((errors, values) => {
              if (!errors) {
                currentModal.close();
              }
            });
            this.tableRefresh();
          },
       });
    };

   tableRefresh = () => {
     this.voList && this.voList.refresh();
   };

   deleteAsset = () => {
     const selectedRows = this.voList.getSelectedRows();
     Modal.confirm({
         title: '删除确认',
         content: '您确定删除吗？删除后数据不可恢复！',
         okText:'确定',
         cancelText:'取消',
         onOk: () => {
           this.voList.deleteRows(selectedRows);
         },
     });
   };

    render() {
        return (
            <div>
                <DataTable
                    dataFormId="customer-AssetList"
                    params={{custId: this.props.custId}}
                    formReady={this.formReady}
                />
            </div>
        );
    }
}