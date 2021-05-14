import React from 'react';
import {DetailInfo, Button, Message} from '../../../src/components';

export default class InvoiceInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            custId: props.custId ? props.custId : null,
            id: props.id ? props.id : null
        };
    }

    invoiceInfoDataReady = (infoApi) => {
        this.infoApi = infoApi;
    };

    invoiceInfo = (cb) => {
        this.infoApi.saveData((err, values) => {
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
                    dataFormId="customer-InvoiceInfo"
                    params={{custId: this.state.custId, id: this.state.id}}
                    dataReady={this.invoiceInfoDataReady}
                    reading = {this.props.readonly}
                    labelWidth={158}
                />
            </div>

        );
    }
}

