import React from "react";

import {Row, Col, DataTable, Button, Message, Modal, openModal} from '../../../../src/components';
import ParamTab from "./ParamTab";
import ParamInfo from "./ParamInfo";

export default class ParamManager extends React.Component {

    static ParamInfo = ParamInfo;

    constructor(props) {
        super();
        this.state = {
            paramCode: null,
            paramTabDisplayType: 'none'
        };
    }

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([{
            name: '新增',
            onClick: this.openParamInfo
        },{
            selectBind: true,
            name: '删除',
            onClick: this.deleteParam
        }
        ]);
    };

    selectRow = (key, rows) => {
        rows.length > 0 && this.setState({paramCode: rows[0].code, paramTabDisplayType: ''});
    };

    openParamInfo = () => {
        openModal(<ParamInfo  refresh={this.tableRefresh} />,{
            defaultButton: true,
            title:"新增参数" ,
            width:'35%',
            onOk: (modal, compnent, btn) => {
                compnent.summarySave((err, value) => {
                    if (!err) {
                        modal.close();
                    } else  {
                        btn.setLoading(false);
                    }
                });
                this.tableRefresh();
            },
        });
    };

    deleteParam = () => {
        const selectedRows = this.voList.getSelectedRows();
        Modal.confirm({
            title: '删除确认',
            content: `您确定删除[${selectedRows[0].name}]吗？删除后数据不可恢复！`,
            onOk: () => {
                this.voList.deleteRows(selectedRows);
            },
            onCancel: () => {
                return;
            },
        });
    };

    tableRefresh = () => {
        this.setState({paramCode: null, paramTabDisplayType: 'none'});
        this.voList.refresh();
    };

    render() {
        return (
            <div>
                <Row>
                    <Col span={12}>
                        <DataTable
                            dataFormId="system-ParamList"
                            formReady={this.formReady}
                            onSelectRow={this.selectRow}
                            hideAdBtn={true}
                        />
                    </Col>

                    <Col span={12}>
                        <div style={{display: this.state.paramTabDisplayType}}>
                            <ParamTab {...this.props} paramCode={this.state.paramCode}/>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}