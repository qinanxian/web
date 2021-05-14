import React from "react";

import { DataTable, Message, Modal, openModal, propsCompose} from '../../../src/components';


export default class BankCardList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            event: null
        };
        const {custId} = props;
        this.custId = custId;

    }

    formReady = (voList) => {
        this.voList = voList;
    };


    tableRefresh = () => {
        this.voList.refresh();
    };

    render() {
        return (
            <div>
                <DataTable
                    dataFormId="customer-BankCardList"
                    formReady={this.formReady}
                    params={{custId: this.props.custId}}
                    dataReady={this.dataReady}
                />
            </div>
        );
    }
}