import React from 'react';
import {DetailInfo,Message} from '../../../src/components';

export default class AccountInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            custId: props.custId ? props.custId : null,
            id: props.id ? props.id : null
        };
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
    };

    accountInfo = (cb) => {
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
                    dataFormId="customer-AccountInfo"
                    params={{custId: this.state.custId, id: this.state.id}}
                    dataReady={this.dataReady}
                    reading = {this.props.readonly}
                />
            </div>

        );
    }
}

