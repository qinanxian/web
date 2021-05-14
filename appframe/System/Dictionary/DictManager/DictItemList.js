import React from "react";

import {Row, Col, DataTable, Button, Message, Modal, openModal} from '../../../../src/components';
import DictItemInfo from "./DictItemInfo";

export default class DictItemList extends React.Component {

    static DictItemInfo = DictItemInfo;

    constructor(props) {
        super();
        this.state = {
            dictItemCode: null
        };
        this.dictCode = null;
    }

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([{
            name: '新增',
            onClick: () => this.openDictItemInfoModal(null, '新增数据字典条目')
        }, {
            selectBind: true,
            name: '删除',
            onClick: this.deleteDictItem
        }]);
        this.voList.setColumnTemplate('name', (text, record, i) => {
            return (<a onClick={() => this.openDictItemInfoModal(record.code, '查看数据字典条目')}>{text}</a>);
        });
    };

    selectRow = (key, rows) => {
        this.setState({dictItemCode: rows[0].code});
    };

    openDictItemInfoModal = (dictItemCode, title) => {
      // Modal.info({
      //   title: '温馨提示',
      //   content: '数据字典的配置已经移动到工具AmixBuilder，如果您没有该工具，请联系研发部',
      // });
        openModal(<DictItemInfo/>, {
            title: title,
            dictItemCode: dictItemCode,
            dictCode: this.dictCode,
            defaultButton: true,
            refresh: this.tableRefresh,
            onOk: (a, b) => {
                b.dictItemInfoSave((err, value) => {
                    if (!err) {
                        a.close();
                    }
                });
            }
        });
    };

    deleteDictItem = () => {
      // Modal.info({
      //   title: '温馨提示',
      //   content: '数据字典的配置已经移动到工具AmixBuilder，如果您没有该工具，请联系研发部',
      // });
        const selectedRows = this.voList.getSelectedRows();
        Modal.confirm({
            title: '删除确认',
            content: `您确定删除[${selectedRows[0].name}]吗？删除后数据不可恢复！`,
            onOk: () => {
                this.voList.deleteRows(selectedRows);
                this.voList.setSelectedRows([]);
            }
        });
    };

    tableRefresh = () => {
        this.voList.refresh();
    };

    render() {
        const {dictCode} = this.props;
        this.dictCode = dictCode;
        return (
            <div>
                <DataTable
                    dataFormId="system-DictItemList"
                    params={{dictCode: this.dictCode}}
                    formReady={this.formReady}
                />
            </div>
        );
    }
}