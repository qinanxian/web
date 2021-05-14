import React from "react";
import { DataTable, Message,openModal,propsCompose, Modal,Col,Row} from '../../../../src/components';
import FiscBookEntryInfo from './FiscBookEntryInfo';
import FiscalBookAssistSummary from './FiscalBookAssistSummary'

@propsCompose
export default class FiscBookEntryList extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            assistDisplayType: 'none',
            bookEntryId:null
        };

    }

    entryFormReady = (voInfo) => {
        this.entryVoList = voInfo;
        this.entryVoList.addButton([{
            name: '新增',
            type: 'primary',
            onClick: this.addFiscalBookEntryRows
        },{
            name: '详情',
            selectBind: true,
            type: 'primary',
            onClick: this.openFiscBookEntryInfo
        },{
            name: '删除',
            selectBind: true,
            type: 'primary',
            onClick: this.deleteFiscBookEntry
        }, {
            name: '保存',
            type: 'primary',
            onClick: this.saveFiscBookEntry
        }]);
    };

    assistFormReady = (voInfo) => {
        this.assistVoInfo = voInfo;

        this.assistVoInfo.addButton([{
            name: '新增',
            type: 'primary',
            onClick: this.addFiscalBookAssistRows
        }, {
            selectBind: true,
            name: '删除',
            type: 'primary',
            onClick: this.deleteFiscalBookAssist
        }, {
            name: '保存',
            type: 'primary',
            onClick: this.saveFiscalBookAssist
        }]);
    };

    deleteFiscalBookAssist = () => {
        const dataList = this.assistVoInfo.getSelectedRows();
        Modal.confirm({
            title: '删除确认',
            content: '您确定删除吗？删除后数据不可恢复！',
            onOk: () => {
                this.assistVoInfo.deleteRows(dataList);
            }
        });

    };

    saveFiscBookEntry = () => {
        const dataList = this.entryVoList.getData().map(item => {
            return {
                ...item,
                "bookCode":this.props.bookCode,
                "status":'VALID'
            };
        });
        this.entryVoList.saveData(dataList)
            .then(()=>{
                Message.success('保存成功');
                this.tableRefresh && this.tableRefresh();
            });
    };

    saveFiscalBookAssist = () => {
        const dataList = this.assistVoInfo.getData().map(item => {
            return {
                ...item,
                "bookEntryId":this.state.bookEntryId
            };
        });
        this.assistVoInfo.saveData(dataList)
            .then(()=>{
                Message.success('保存成功');
            });
    };

    addFiscalBookAssistRows = () => {
        this.assistVoInfo.addRow([{"bookEntryId":this.state.bookEntryId}]);
    };

    openFiscBookEntryInfo = () => {
        const dataList = this.entryVoList.getSelectedRows();
        const row =dataList[0];
        const {bookEntryId} = row;

        openModal(<FiscBookEntryInfo bookEntryId={bookEntryId}/>, {
            title: "记账科目详情",
            defaultButton: true,
            onOk: (modal, compnent,but) => {
                compnent.infoSave((err, value) => {
                    if (!err) {
                        modal.close();
                        this.tableRefresh && this.tableRefresh();
                    } else {
                        but.setDisabled(false)
                    }
                });
            },
            onCancel(a, b) {
            }
        });
    };

    addFiscalBookEntryRows = () => {
        this.entryVoList.addRow([{"bookCode":this.props.bookCode,"status":'VALID'}]);
    };


    deleteFiscBookEntry = () => {
        const selectedRows = this.entryVoList.getSelectedRows();
        if (selectedRows.length < 1) {
            Message.info('请先选择一行！');
            return;
        }
        const selectedRow = selectedRows[0];
        if (selectedRow.gaapEntryDef) {
            Message.error('只能删除手动新增的明细科目！');
            return;
        }

        Modal.confirm({
            title: '删除确认',
            content: '您确定删除吗？删除后数据不可恢复！',
            onOk:() => {
                this.entryVoList.deleteRows([selectedRow]);
                this.setState({bookEntryId: null, entryDisplayType: 'none'});

            }
        });
    };

    tableRefresh = () => {
        this.entryVoList.refresh();
    };

    selectRow = (key, rows) => {
        if(rows.length > 0 && rows[0].gaapEntryDef != null) {
            this.setState({bookEntryId: rows[0].bookEntryId, entryDisplayType: ''});
        }else {
            this.setState({bookEntryId: null , entryDisplayType: 'none'});
        }
    };

    render() {
        return (
            <div>
                <Col span={12}>
                    <Row>
                        <DataTable
                            dataFormId="configuration-FiscBookEntryList"
                            formReady={this.entryFormReady}
                            params={{bookCode: this.props.bookCode}}
                            editMode={true}
                            showPagination={false}
                            pageSize={999}
                            onSelectRow={this.selectRow}
                            buttonFixed = {false}
                        />
                    </Row>
                </Col>
                <Col span={12}>
                    <Row>
                        <div style={{display: this.state.entryDisplayType}}>
                            <DataTable
                                dataFormId="configuration-FiscalBookAssistSummary"
                                formReady={this.assistFormReady}
                                params={{bookEntryId: this.state.bookEntryId}}
                                editMode={true}
                                showPagination={false}
                                pageSize={999}
                            />
                        </div>
                    </Row>
                </Col>

            </div>
        );
    }
}
