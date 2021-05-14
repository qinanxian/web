import React from 'react';
import {DetailInfo, Button, Message, DataTablePicker, TreeSelect,Modal, Notify} from '../../../../src/components/index';
import './style/index.less';


export default class CreditInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            planId: props.param.workflowTask.workflowProc.objectId,
            readOnly: props.readOnly?props.readOnly:false,
        };
    }

    formReady = (formInfo) => {
        this.formInfo = formInfo;
    };

    saveData = () =>{
        this.formInfo.saveData((hasError)=>{
            if(hasError){
                Notify.error('保存失败');
            }
        })
    };

    render() {
        return (
            <div className='invest-container'>
                <div className='invest-container-btn'>
                    {this.state.readOnly===false?
                    <Button onClick={() => this.saveData()}>保存</Button>
                        :<span></span>}
                </div>
                <DetailInfo
                    labelWidth={"85px"}
                    dataFormId="demo-WKFLCreditInfo"
                    formReady={this.formReady}
                    params={{planId: this.state.planId}}
                    reading={this.state.readOnly}
                />
            </div>
        );
    }
}

