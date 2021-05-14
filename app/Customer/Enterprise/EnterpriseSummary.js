import React from 'react';
import {DetailInfo, Message} from '../../../src/components';

export default class EnterpriseSummary extends React.Component {
    constructor(props) {
        super(props);
    }

    formReady = (voInfo) => {
        this.voInfo = voInfo;
    };

    summarySave = (callback,btn) => {
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
                    disabledContainer={this.props.disabledContainer}
                    dataFormId="customer-EnterpriseCustomerSummary"
                    formReady={this.formReady}
                />
            </div>

        );
    }
}

