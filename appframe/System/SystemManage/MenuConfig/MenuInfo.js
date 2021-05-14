import React from "react";

import {Message, DetailInfo, Button,} from '../../../../src/components';

export default class MenuInfo extends React.Component {

    constructor(props) {
        super(props);
        const {id} = props;
        this.id = id;
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        if (this.id) {
            this.voInfo.setItemVisible('id', true);
        }
        this.voInfo.setValue('id', this.id);
    };

    menuInfoSave = (callback,btn) => {
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
                dataFormId="system-MenuInfo"
                dataReady={this.dataReady}
                params={{id: this.id}}
            />
        );
    }
}