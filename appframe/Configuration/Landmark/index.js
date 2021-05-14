import React from 'react';

import {DataTable,DetailInfo, Row, Col, openModal, Modal, Message} from '../../../src/components';
import LandmarkItem from './LandmarkItem';
import './style.css'

export default class LandmarkList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDefKey: null,
        };
    }


    formReady = (vm) => {
        this.dataTable = vm;
        this.dataTable.addButton([{
            name: '新增',
            onClick: this.landmarkSummary
        }, {
            name: '详情',
            selectBind: true,
            onClick: this.editLandmarkInfo
        },{
            selectBind: true,
            name: '删除',
            onClick: this.deleteLandmark
        }]);
    };

    infoFormReady = (vm) =>{
        this.infoObj = vm;
    }

    landmarkSummary =() =>{
        openModal(<div><DetailInfo dataFormId='configuration-LandmarkInfo'
                                   formReady={this.infoFormReady}/></div>,
            {title:'新增里程碑',width:'50%',defaultButton:true,
                onOk: (modal, compnent,but) =>  {
                    this.infoObj.saveData().then((res)=>{
                        modal.close();
                        this.dataTable.refresh();
                    });
                },
                onCancel(a, b) {
                }
            });
    };

    editLandmarkInfo =() =>{
        const row = this.dataTable.getSelectedRow();
        if (!row)
            return ;
        openModal(<div><DetailInfo dataFormId='configuration-LandmarkInfo'
                                   formReady={this.infoFormReady}
                                   params={{defKey: row.defKey}}/></div>,
            {title:'新增里程碑',width:'50%',defaultButton:true,
                onOk: (modal, compnent,but) =>  {
                    this.infoObj.saveData().then((res)=>{
                        modal.close();
                        this.dataTable.refresh();
                    });
                },
                onCancel(a, b) {
                }
            });
    };




    deleteLandmark =() =>{
        const selectedRows = this.dataTable.getSelectedRows();
        Modal.confirm({
            title: '删除确认',
            content: `您确定删除吗？删除后数据不可恢复！`,
            onOk: () => {
                this.dataTable.deleteRows(selectedRows);
            },
            onCancel: () => {
                return;
            },
        });
    }

    saveLandmarkList =() =>{
        this.dataTable.saveData().then((res)=>{
            this.dataTable.refresh();
        });
    }

    rowSelected = (k, row) => {
        console.log("aaaa");
        this.setState({selectedDefKey: row[0]?row[0].defKey:null});
    }

    render() {
        return (
            <div>
                <Col span={8}>
                    <Row>
                        <DataTable
                            dataFormId="configuration-LandmarkList"
                            formReady={this.formReady}
                            onSelectRow={this.rowSelected}
                            //editMode
                        />
                    </Row>
                </Col>
                <Col span={16}>
                    <Row>
                        <LandmarkItem defKey={this.state.selectedDefKey}/>
                    </Row>
                </Col>
            </div>
        );
    }
}



