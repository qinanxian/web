import React from "react";
import {Row, Col, DetailInfo, Message, openModal, Modal, Icon, DataTable} from '../../../src/components';

export default class GetProductInfo extends React.Component {


    constructor(props) {
        super(props);
        const {comId} = props;
        this.comId = comId;
    }

    dataReady = (v) =>{
        const { dataReady } = this.props;
        dataReady && dataReady(v)
    };

    render() {
        return (
            <div>
                <DataTable
                    dataFormId="insure-ProductList"
                    params={{id: this.comId}}
                    dataReady={this.dataReady}
                />
            </div>
        );
    }
}
