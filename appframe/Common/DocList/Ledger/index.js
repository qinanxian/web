import React from "react";

import {Row, Col, DataTable, Message, openModal, Icon} from '../../../../src/components';
import ItemLedgerList from "./ItemLedgerList";

export default class DocListLedger extends React.Component {

    static ItemLedgerList = ItemLedgerList;

    constructor(props) {
        super(props);
        // this.state = {
        //     doclistId: null,
        //     itemDisplayType: 'none'
        // };
    }

    formReady = (voList) => {
        this.voList = voList;
        const column = {
            title: '操作',
            key: 'buttonComponent',
            sortCode: '2000',
            width: 120,
            render: (text, record, index) => {
                return (<div style={{
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-around'
                }}>
                    <a onClick={() => this.viewItemList(record.doclistId)}><Icon type="fa-history"/>查看清单项</a>
                </div>)
            }
        };
        this.voList.addColumn(column);
    };

    viewItemList = (doclistId) => {
        const {flexTabs} = this.props;
        flexTabs.open(`查看清单项`, 'Common/DocList/Ledger/ItemLedgerList', {
            doclistId: doclistId
        });

        // openModal(<ItemLedgerList doclistId={doclistId}/>, {
        //     title: '查看清单项',
        //     defaultButton: false
        // });
    };

    // selectRow = (key, rows) => {
    //     this.setState({doclistId: rows[0].doclistId, itemDisplayType: ''});
    // };

    render() {
        return (
            <div>
                {/*<Row>*/}
                    {/*<Col span={8}>*/}
                        <DataTable
                            dataFormId="common-CmonDocListLedgerList"
                            formReady={this.formReady}
                            // onSelectRow={this.selectRow}
                        />
                    {/*</Col>*/}

                    {/*<Col span={16}>*/}
                        {/*<div style={{display: this.state.itemDisplayType}}>*/}
                            {/*<ItemLedgerList doclistId={this.state.doclistId}/>*/}
                        {/*</div>*/}
                    {/*</Col>*/}
                {/*</Row>*/}
            </div>
        );
    }
}