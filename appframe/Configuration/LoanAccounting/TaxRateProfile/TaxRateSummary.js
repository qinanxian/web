import React from 'react';
import {DetailInfo, Message} from '../../../../src/components';

export default class TaxRateSummer extends React.Component {
    constructor(props) {
        super(props)
    }

    formReady = (voinfo) => {
        this.voinfo = voinfo;
        // statusDict[0]对应VALID, statusDict[1]对应INVALID
        this.voinfo.setData({'status': this.props.statusDict[0].code});
    };

    summarySave = (cb) => {
        this.voinfo.saveData((err, values) => {
                if (err) {
                    Message.error('保存失败！');
                } else {
                    const {refresh} = this.props;
                    refresh && refresh();
                }
                cb(err, values);
            })
    };

    render() {
        return(
            <DetailInfo
                dataFormId="configuration-TaxRateSummary"
                formReady={this.formReady}
            />
        );
    }
}