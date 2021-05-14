import React from 'react';
import {DetailInfo, Message,Notify} from '../../../src/components';

export default class LimitApplyDetail extends React.Component {

    
    constructor(props) {
        super(props);
        const { param, custId } = this.props;
        this.state = {
            custId: custId || (param && param.custId),
        };
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
    };

    formReady = (voinfo) => {
        this.voinfo = voinfo;
        if(!this.props.readonly) {
            this.voinfo.addButton([{
                name: '保存',
                onClick: this.saveInfo
            }]);
        }
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
                    dataFormId="business-LimitApplyDetail"
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

