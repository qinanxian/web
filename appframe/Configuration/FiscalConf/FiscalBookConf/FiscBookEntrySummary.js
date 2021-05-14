import React from 'react';
import {DetailInfo, Message, ModalInput} from '../../../../src/components';

export default class FiscBookEntrySummary extends React.Component {
    constructor(props) {
        super(props);
    }

    formReady = (voInfo) => {
        this.voInfo = voInfo;
    };



    summarySave = (cb) => {
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
                    dataFormId="configuration-FiscBookEntrySummary"
                    formReady = {this.formReady}
                    params={{bookEntryId:null,bookCode:this.props.bookCode}}
                />
            </div>

        );
    }
}

