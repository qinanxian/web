import React from 'react';
import {Row, Col, DetailInfo, DataTablePicker, Message} from '../../../../src/components';

export default class DocListItemInfoHidingGroup extends React.Component {
    constructor(props) {
        super(props);
        const {itemId, objectId, objectType, groupCode} = props;
        this.itemId = itemId;
        this.objectId = objectId;
        this.objectType = objectType;
        this.groupCode = groupCode;
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        this.voInfo.setValue('groupCode', this.groupCode);
    };

    docListItemInfoSave = (cb) => {
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
                    dataFormId="common-CmonDocListItemInfoHidingGroup"
                    params={{itemId: this.itemId, objectId: this.objectId, objectType: this.objectType}}
                    dataReady={this.dataReady}
                />
            </div>
        );
    }
}

