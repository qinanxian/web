import React from 'react';
import {DataTablePicker, DetailInfo, Message} from '../../../src/components';

export default class ChaseInfo extends React.Component {

    constructor(props) {
        super(props);
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        if(this.props.hideOperate){
            this.voInfo.setGroupVisible("30",false);
        }
    };

    saveInfo = (callback, btn) => {
        this.voInfo.saveData((err, values) => {
            if (err) {
                Message.error('保存失败！');
                btn.setLoading(false);
            } else {
                const {refresh} = this.props;
                refresh && refresh();
            }
            callback(err, values);
        });
    };

    render() {
        return (
            <div>
                <DetailInfo
                    params={{chaseId:this.props.chaseId}}
                    dataFormId="obiz-ChaseInfo"
                    formReady={this.dataReady}
                />
            </div>

        );
    }
}

