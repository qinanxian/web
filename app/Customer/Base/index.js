import React from "react";

import {DataTable, Message, Notify} from '../../../src/components';
import HoldAllowSelectUserList from './HoldAllowSelectUserList'
import UserForShareCustomerAllow from './UserForShareCustomerAllow'

export default class InvestContractSupplement extends React.Component {

    static HoldAllowSelectUserList = HoldAllowSelectUserList;
    static UserForShareCustomerAllow = UserForShareCustomerAllow;


    constructor(props) {
        super(props);
    }

    formReady = (volist) => {
        this.volist = volist;
    };



    render() {
        return (
            <div>
                <DataTable
                    dataFormId="invest-DueDiligenceList"
                    formReady={this.formReady}
                />
            </div>
        );
    }
}