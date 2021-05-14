import React from 'react';

import {DataTable, Message,Notify,Modal} from '../../../src/components';

export default class HomeBlockPickList extends React.Component {
    constructor(props) {
        super(props);
    }

    formReady = (voList) => {
        this.voList = voList;
    };

    dataReady = (voList) =>{
        this.pickedRow = this.props.pickedKey || [];
        this.voList.setSelectedRows(this.pickedRow);
    }

    infoSave = (cb) => {
        let err;
        const selectedRows = this.voList.getSelectedRows();
        selectedRows.forEach(element => {
            element.roleId = this.props.roleId;
        });
        this.voList.invoke('relateDashBoard', {...selectedRows})
            .then((data) => {
                Notify.success(data && `关联成功`);
                cb && cb(err);
            })
            .catch((error) => {
                Modal.info({
                    content: error.message,
                });
                cb && cb(error);
            });
    };

    render() {
        return (
            <div>
                <DataTable
                    dataFormId="configuration-HomeBlockPickList"
                    formReady={this.formReady}
                    dataReady={this.dataReady}
                    selectionType='multiple'
                    showPagination={false}
                    pageSize={999}
                    majorKey={'boardKey'}
                />
            </div>

        );
    }
}



