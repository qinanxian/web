import React from 'react';
import {DetailInfo, Button, Message, Notify, DataTable, Modal} from '../../../src/components/index';
import IndHouseList from "./IndHouseList";
import IndContactList from "./IndContactList";

export default class IndividualInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            custId: props.param.custId ? props.param.custId : null,
        };
    }

    dataReady = (voinfo) => {
        this.voinfo = voinfo;
    };

    formReady = (voinfo) => {
        this.voinfo = voinfo;
        this.voinfo.addButton([{
            type:'primary',
            icon:'roic-apply',
            name: '暂存',
            onClick: this.tempSaveInfo
        }, {
            type:'success',
            icon:'fa-save',
            name: '保存',
            onClick: this.saveInfo
        }]);

        this.voinfo.setGroupTemplate("0020", <IndHouseList {...this.props}/>);
        this.voinfo.setGroupTemplate("0030", <IndContactList {...this.props}/>);
        this.voinfo.setGroupTemplate("0040", <p>尚未查询</p>);
    };



    tempSaveInfo = () => {
        this.voinfo.setValue("isDraft","Y");
        this.voinfo.saveWithoutValidate((hasError)=>{
            if(hasError){
                Notify.error('保存失败');
            } else {
              Notify.success({
                message: '暂存成功',
              })
            }
        })
    };

    saveInfo = () => {
        this.voinfo.setValue("isDraft","N");
        this.voinfo.saveData((err, values) => {
            if (err) {
                Message.error('保存失败！');
            } else {
                const {refresh} = this.props;
                refresh && refresh();
                Notify.success({
                    message: '保存成功',
                })
            }
        });
    };

    render() {
        return (
            <div>
                <DetailInfo
                    dataFormId="customer-IndividualCustomerInfo"
                    params={{custId: this.state.custId}}
                    dataReady={this.dataReady}
                    formReady={this.formReady}
                    saveMessageEnable={false}
                    reading = {this.props.readonly}
                />
            </div>
        );
    }
}

