import React from 'react';
import {DetailInfo, Message,Notify} from '../../../src/components';

export default class WechatInfo extends React.Component {
    constructor(props) {
        super(props);
        const { param, custId } = this.props;
        this.state = {
            custId: custId || (param && param.custId),
        };
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        this.voInfo.setItemTemplate("headImgUrl",<img src={this.voInfo.getValue("headImgUrl")} />)
    };

    formReady = (voinfo) => {
        this.voinfo = voinfo;
        if(!this.props.readonly) {
            this.voinfo.addButton([{
                name: '暂存',
                onClick: this.tempSaveInfo
            }, {
                name: '保存',
                onClick: this.saveInfo
            }]);
        }
    };

    tempSaveInfo = () => {
        this.voinfo.setValue("isDraft","Y");
        this.voinfo.saveWithoutValidate((hasError)=>{
            if(hasError){
                Notify.error('暂存失败');
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
                    dataFormId="customer-WechatInfo"
                    params={{custId: this.state.custId}}
                    dataReady={this.dataReady}
                    formReady={this.formReady}
                    //defaultButton={!this.props.isReadOnly}
                    reading = {this.props.readonly}
                    labelWidth={150}
                    saveMessageEnable={false}
                />
            </div>
        );
    }
}

