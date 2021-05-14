import React from 'react';
import {DetailInfo, Message} from '../../../src/components';

export default class DossierInfo extends React.Component {
    constructor(props) {
        super(props);
        this.dossierDefKey = props.dossierDefKey;
        const {classification} = this.props;
        this.classification = classification;
    }


    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        if (!this.dossierDefKey) {
            this.voInfo.setValue('classification', this.classification);
        }
    };

    docListInfoSave = (callback, btn) => {
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
            <DetailInfo
                dataFormId="configuration-DossierInfo"
                dataReady={this.dataReady}
                params={{dossierDefKey: this.dossierDefKey}}
            />
        );
    }
}
