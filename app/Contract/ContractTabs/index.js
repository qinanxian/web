import React from "react";
import {DataTable, Tabs} from "../../../src/components";
import ContractList from "../ContractList";
import ContractClosedList from "../ContractClosedList";
const TabPane = Tabs.TabPane;


export default class ContractTabs extends React.Component {

    render() {
        return (
            <div>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="合同列表" key="1">
                       <ContractList />
                    </TabPane>
                    <TabPane tab="已结清合同" key="2">
                        <ContractClosedList />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
