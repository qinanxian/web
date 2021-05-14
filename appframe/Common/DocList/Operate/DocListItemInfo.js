import React from 'react';
import {Row, Col, DetailInfo, DataTablePicker, Message} from '../../../../src/components';

export default class DocListItemInfo extends React.Component {
    constructor(props) {
        super(props);
        super(props);
        const {itemId, objectId, objectType} = props;
        this.itemId = itemId;
        this.objectId = objectId ? objectId : '0001';
        this.objectType = objectType ? objectType : 'INVEST_PLAN';
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        this.voInfo.setItemSuffix('groupName', (value, item) => {
            return this.appendModalInput();
        });
    };

    appendModalInput = () => {
        return (
            <DataTablePicker
                dataFormId="common-CmonDocListGroupList"
                params={{objectId: this.objectId, objectType: this.objectType}}
                showPagination={false}
                pageSize={999}
                title="选择文档清单分组"
                onOk={(e, row) => {
                    this.voInfo.setData({
                        groupId: row.groupId,
                        groupCode: row.groupCode,
                        groupName: row.groupName,
                    });
                }}
            />
        );
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
                    dataFormId="common-CmonDocListItemInfo"
                    params={{itemId: this.itemId, objectId: this.objectId, objectType: this.objectType}}
                    dataReady={this.dataReady}
                    labelWidth={158}
                />
            </div>

        );
    }
}

