import React from 'react';

import {DetailInfo, Message} from '../../src/components';

export default class BatchJobExecutionDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            jobExecutionId: this.props.params?this.props.params.jobExecutionId:'0',
        }
    }

    formReady = (voInfo) => {
        this.voInfo = voInfo;
    };

    dataReady = (voInfo) => {
        this.voInfo = voInfo;

    };


    addSave = (cb) => {
        this.voInfo.saveData((err, values) => {
            if (err) {
                Message.info('保存失败,'+err+"!");
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
                    dataFormId="system-BatchJobExecutionInfo"
                    formReady={this.formReady}
                    dataReady={this.dataReady}
                    params={{jobExecutionId:this.state.jobExecutionId}}
                    reading
                />
            </div>
        );
    }
}