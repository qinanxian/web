import React from 'react';
import {DetailInfo, Message} from '../../../../src/components/index';

export default class FiscEventInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            eventDef: props.eventDef || null
        }
    }

    formReady = (voInfo) => {
        this.voInfo = voInfo;
    }

    fiscEventSave = (cb) => {
        this.voInfo.saveData((err, values) => {
            if (err) {
                Message.error('保存失败！');
            }
            cb && cb(err,values);
        });
    };

    render() {
        return (
            <div>
                <DetailInfo
                    dataFormId="configuration-FiscEventInfo"
                    formReady={this.formReady}
                    params={{eventDef:this.state.eventDef}}
                />
            </div>
        );
    }
}

