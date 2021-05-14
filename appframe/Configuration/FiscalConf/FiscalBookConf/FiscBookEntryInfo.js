import React from 'react';
import {DetailInfo, Message, ModalInput} from '../../../../src/components';

export default class FiscBookEntryInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bookEntryId:props.param ? props.param.bookEntryId:props.bookEntryId
        }
    }

    formReady = (voInfo) => {
        this.voInfo = voInfo;
    };



    infoSave = (cb) => {
        this.voInfo.saveData((err, values) => {
            if (err) {
                Message.error('保存失败！');
            } else {
            }
            cb(err, values);
        });
    };

    render() {
        return (
            <div>
                <DetailInfo
                    dataFormId="configuration-FiscBookEntryInfo"
                    formReady = {this.formReady}
                    params={{bookEntryId:this.state.bookEntryId}}
                />
            </div>

        );
    }
}

