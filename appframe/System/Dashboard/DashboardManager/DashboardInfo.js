import React from 'react';
import {DetailInfo, Button, Message} from '../../../../src/components/index';

export default class DashboardInfo extends React.Component {
    constructor(props) {
        super(props);
        this.id = props.param ? props.param.id : props.id;
    }

    formReady = (voInfo) => {
        this.voInfo = voInfo;
    };

    infoSave = (cb) => {
        this.voInfo.saveData((err, values) => {
            if (err) {
                Message.error('保存失败！');
            } else {
                const {refresh} = this.props;
                refresh && refresh();
            }
            cb(err, values);
        });
    };

    render() {
        return (
            <div>
                <DetailInfo
                    dataFormId="system-DashboardInfo"
                    formReady={this.formReady}
                    params={{id: this.id}}
                />
            </div>

        );
    }
}

