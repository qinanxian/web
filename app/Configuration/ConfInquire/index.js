import React from "react";
import {Col, DataTable, Fieldset, Modal, openModal, Row, Tree} from "../../../src/components";
import FieldSet from "../../../src/components/fieldset";
import ConfInquireInfo from './ConfInquireInfo'
import ConfInquireItemList from './ConfInquireItemList'


export default class ConfInquire extends React.Component {
    static ConfInquireInfo = ConfInquireInfo;
    static ConfInquireItemList = ConfInquireItemList;

    constructor(props) {
        super(props);
        this.state = {
            renderItems: false,
            dossierDefKey: '',
        };
        this.dossierType = this.props.dossierType||'INQUIRE';
        this.title = this.props.title||'调查报告';
        this.titleDossier = `${this.title}目录`;
        this.titleDossierItems = `${this.title}明细`;
    }

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([{
            name: '新增',
            onClick: this.createNew
        }, {
            selectBind: true,
            name: '删除',
            onClick: this.deleteRow
        }]);
        this.voList.setColumnTemplate('dossierDefKey', (text, record, i) => {
            return (<a onClick={() => this.openInfoModal(record.dossierDefKey,'编辑详情')}>{text}</a>);
        });
    }

    createNew = () => {
        this.openInfoModal('NULL');
    }

    deleteRow = () => {
        const selectedRow = this.voList.getSelectedRow();
        const dossierName = selectedRow.dossierName;
        Modal.confirm({
            title: '删除确认',
            content: `您确定删除[${dossierName}]吗？删除后数据不可恢复！`,
            onOk: () => {
                this.voList.deleteRows([selectedRow]);
            },
            onCancel: () => {
                return;
            },
        });

    }

    openInfoModal = (dossierDefKey) => {
        openModal(<ConfInquireInfo dossierType={this.dossierType}/>, {
            title: dossierDefKey!=='NULL'?'编辑':'新建',
            dossierDefKey: dossierDefKey||'',
            width: '35%',
            defaultButton: true,
            refresh: this.tableRefresh,
            onOk: (modal, component, btn) => {
                component.saveInfoData((err, value) => {
                    if (!err) {
                        modal.close();
                    }
                }, btn);
            },
            onCancel: (a, b) => {
            }
        });
    }

    dataReady = (voList) => {
        this.voList = voList;
    }

    selectRow = (key, rows) => {
        if (rows.length > 0) {
            const row = rows[0];
            this.setState({renderItems: true});
            this.setState({dossierDefKey: row.dossierDefKey});
        } else {
            this.setState({renderItems: false});
        }
    };


    tableRefresh = () => {
        this.voList.refresh();
    };

    render() {
        return (
            <div>
                <Col span={9}>
                    <Row>
                        <FieldSet legend={this.titleDossier} showArrow={false}>
                            <div>
                                <DataTable
                                    dataFormId="configuration-InquireList"
                                    params={{dossierType: this.dossierType}}
                                    formReady={this.formReady}
                                    dataReady={this.dataReady}
                                    onSelectRow={this.selectRow}
                                    showPagination={false}
                                />
                            </div>
                        </FieldSet>
                    </Row>
                </Col>
                <Col span={15}>
                    <Row>
                        <div>
                            <Fieldset legend={this.titleDossierItems} showArrow={false} toggle={false} expanded={true}>
                                {
                                this.state.renderItems?<ConfInquireItemList dossierDefKey={this.state.dossierDefKey}/>:<span></span>
                                }
                            </Fieldset>
                        </div>
                    </Row>
                </Col>
            </div>
        );
    }
}