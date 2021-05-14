import React from 'react';

import {DataTable,DetailInfo, Row, Col, openModal, Modal, Message} from '../../../src/components';

export default class LandmarkItem extends React.Component {
    constructor(props) {
        super(props);
    }

    formReady = (vm) => {
        this.dataTable = vm;
        this.dataTable.addButton([{
            name: '新增',
            onClick: this.openLandmarkItemInfo
        }, {
            name: '保存列表',
            onClick: this.saveLandmarkItem
        },{
            selectBind: true,
            name: '删除',
            onClick: this.deleteLandmarkItem
        }]);
        // this.dataTable.setColFixed(['__i','itemKey'],'left');
    };

    infoFormReady = (vm) =>{
        this.infoObj = vm;
        console.log(this.infoObj);
        //defKey
        this.infoObj.setValue('defKey',this.props.defKey);
    }

    openLandmarkItemInfo = ()=>{
        openModal(<div><DetailInfo 
            dataFormId='configuration-LandmarkItemInfo' 
            formReady={this.infoFormReady}/></div>,
            {title:'新增里程碑子项',width:'50%',defaultButton:true,
            onOk: (modal, compnent,but) =>  {
                this.infoObj.saveData().then((res)=>{
                    modal.close();
                    this.dataTable.refresh();
                });
            },
            onCancel(a, b) {
            }
        });
    }

    deleteLandmarkItem = ()=>{
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

    saveLandmarkItem = ()=>{
        this.dataTable.saveData().then((res)=>{
            this.dataTable.refresh();
        });
    }

    render() {
        return (
            this.props.defKey?
                <DataTable
                    dataFormId="configuration-LandmarkItem"
                    formReady={this.formReady}
                    params={{defKey:this.props.defKey}}
                    showPagination={false}
                    pageSize={999}
                    editMode
                    scroll={{x:880}}
                />:'请选择一个里程碑主项'
        );
    }
}



