import React from "react";

import { DataTable, Message, openModal} from '../../../../src/components';
import HoldAllowSelectUserList from '../../../Customer/Base/HoldAllowSelectUserList';
import UserForShareCustomerAllow from '../../../Customer/Base/UserForShareCustomerAllow';


export default class MeetingList extends React.Component {


    constructor(props) {
        super(props);
    }

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([{
            type: 'default',
            name: '指定主办人',
            onClick: this.turnOverAllowHold,
            selectBind: true
        }, {
            type: 'default',
            name: '共享',
            onClick: this.shareCustomerAllow,
            selectBind: true
        }]);
    };

    turnOverAllowHold = () => {
        const selectedRows = this.voList.getSelectedRows();
        openModal(<HoldAllowSelectUserList custId={selectedRows[0].custId} refresh={this.tableRefresh} isAdmin={"Y"}/>,{
            defaultButton: true,
            title:"移交主办权" ,
            onOk: (modal, compnent ,but) => {
                compnent.saveInfo((err, value) => {
                    if (!err) {
                        modal.close();
                    } else {
                        but.setDisabled(false);
                    }
                });
            },
        });
    };

    shareCustomerAllow = () => {
        const selectedRows = this.voList.getSelectedRows();
        openModal(<UserForShareCustomerAllow  custId={selectedRows[0].custId} isAdmin={"Y"}/>,{
            defaultButton: true,
            width:'35%',
            title:"客户共享" ,
            onOk: (modal, compnent,but) => {
                compnent.saveInfo((err, value) => {
                    if (!err) {
                        modal.close();
                    } else {
                        but.setDisabled(false);
                    }
                });
            },
            refresh: this.tableRefresh,
        });
    };


    tableRefresh = () => {

        this.voList.refresh();

    };

    render() {
        return (
            <div>
                <DataTable
                    dataFormId="common-CustomerList"
                    formReady={this.formReady}
                />
            </div>
        );
    }
}