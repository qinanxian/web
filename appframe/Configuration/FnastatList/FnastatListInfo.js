import React from 'react';
import {Row, Col, DetailInfo, Button, Message} from '../../../src/components';

export default class FnastatListInfo extends React.Component {
    constructor(props) {
        super(props);
        this.fnastatDefId = props.fnastatDefId;
    }


    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        if (!this.fnastatDefId) {
            this.voInfo.setValueReadonly('fnastatDefId', false);
        }
    };

    FnastatListInfoSave = (cb) => {
        this.voInfo.saveData((err, values) => {
            cb(err, values);
        });
    };

    render() {
        return (
            <div>
                <DetailInfo
                    dataFormId="configuration-FnastatListInfo"
                    dataReady={this.dataReady}
                    params={{fnastatDefId: this.fnastatDefId}}
                />
            </div>

        );
    }
}

