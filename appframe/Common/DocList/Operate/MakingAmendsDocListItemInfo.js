/**
 * 后补资料清单新增页面，无分组新增
 */
import React from 'react';
import {Row, Col, DetailInfo, DataTablePicker, Message} from 'roface';

export default class MakingAmendsDocListItemInfo extends React.Component {
    constructor(props) {
        super(props);
        const {itemId, itemCode, itemReading, objectId, objectType} = props;
        this.itemId = itemId;
        this.itemCode = itemCode;
        this.itemReading = itemReading;
        this.objectId = objectId;
        this.objectType = objectType;
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        if (this.itemReading) {
            this.voInfo.setValueReadonly('makeAmends', true);
            this.voInfo.setValueReadonly('amendDate', true);
        }
        if (this.itemReading || this.itemCode) {
            this.voInfo.setValueReadonly('itemName', true);
            this.voInfo.setValueReadonly('importance', true);
        }
        this.voInfo.setItemOnChange('makeAmends', this.makeAmendsOnChange);
        this.makeAmendsOnChange(this.voInfo.getValue('makeAmends'));
    };

    makeAmendsOnChange = (value) => {
        if (value === 'Y') {
            this.voInfo.setItemRequired('amendDate', true);
            this.voInfo.setValue('amendStatus', '10');
        } else {
            this.voInfo.setItemRequired('amendDate', false);
            this.voInfo.setValue('amendStatus', '');
        }
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
                    dataFormId="common-CmonMakingAmendsDocListItemInfo"
                    params={{itemId: this.itemId, objectId: this.objectId, objectType: this.objectType}}
                    dataReady={this.dataReady}
                />
            </div>
        );
    }
}

