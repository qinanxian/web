import React from 'react';
import {DataTablePicker, DetailInfo, Message} from '../../../../src/components';

export default class ChaseTaskUserInfo extends React.Component {

    constructor(props) {
        super(props);
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
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
        let chaseTaskId = this.props.chaseTaskId || this.props.param.chaseTaskId;
        return (
            <div>
                <DetailInfo
                    params={{chaseTaskId:chaseTaskId}}
                    dataFormId="obiz-ChaseTaskUserInfo"
                    formReady={this.dataReady}
                />
            </div>

        );
    }
}

