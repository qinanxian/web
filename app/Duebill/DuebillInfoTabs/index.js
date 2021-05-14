import React from "react";
import {Button, Divider, propsCompose, Tabs} from "../../../src/components";
import PublicExporter from "../../Customer/PublicExporter"
import DuebillInfo from "../DuebillInfo"
import LactLoanInfo from "../../Contract/LactLoanInfo";
import DuebillTradeTallyList from "../../TradeTally/DuebillTradeTallyList";
import ContractFiscalEventLogView from "../../FiscalEventLog/ContractFiscalEventLogView";


@propsCompose
export default class DuebillInfoTabs extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            duebillId: this.props.params.duebillId,
            duebill: {},
            loadComplete: false,
            tabsOptions: []
        }
    }

    componentDidMount() {
        const {rest} = this.props;
        const {duebillId} = this.state;
        const tabsOptions = [];
        rest.get(`/duebill/byId/${duebillId}`)
            .then((duebill) => {
                const {lactLoanId,contractId} = duebill;
                this.setState({duebill, loadComplete: true});
                tabsOptions.push({
                    tab: '借据详情',
                    key: 'duebillInfo',
                    content: <div>
                        <div style={{'marginTop': '5px', 'marginLeft': '10px'}}>
                            <Button type="link" size="small" onClick={this.openCustomerView}
                                    loading={!this.state.loadComplete} style={{'border': 'none'}}>查看客户</Button>
                            <Divider type="vertical"/>
                            <Button type="link" size="small" onClick={this.openApplicationView}
                                    loading={!this.state.loadComplete} style={{'border': 'none'}}>查看申请</Button>
                            <Divider type="vertical"/>
                            <Button type="link" size="small" onClick={this.openContractView}
                                    loading={!this.state.loadComplete} style={{'border': 'none'}}>查看合同</Button>
                            <Divider/>
                        </div>
                        <DuebillInfo {...this.props} duebillId={duebillId} />
                    </div>
                });
                tabsOptions.push({
                    tab: '还款情况',
                    key: 'repaymentScheduleList',
                    content: <LactLoanInfo {...this.props} lactLoanId={lactLoanId}/>
                });
                tabsOptions.push({
                    tab: '交易流流水',
                    key: 'tradeTallyList',
                    content: <DuebillTradeTallyList {...this.props} duebillId={duebillId}/>
                });
                tabsOptions.push({
                    tab: '财务记账',
                    key: 'fisicalBook',
                    content: <ContractFiscalEventLogView {...this.props}  contractId={contractId}/>
                });

            }).finally(() => {
            this.setState({tabsOptions: tabsOptions});
        });
    }

    openCustomerView = () => {
        const {flexTabs, rest} = this.props;
        PublicExporter.openCustomerViewById(flexTabs, rest, this.state.duebill.custId)
    }

    openApplicationView = () => {
        const {flexTabs} = this.props;
        const {custName,applicationId} = this.state.duebill;
        flexTabs.open(`[${custName}]-业务`, 'BizApplication/ApplicationView', {applicationId});
    }

    openContractView = () => {
        const {flexTabs} = this.props;
        const {custName,contractId} = this.state.duebill;
        flexTabs.open(`[${custName}]-合同`, 'Contract/ContractInfoView', {
            contractId: contractId,
            editable: false
        });
    }


    render() {
        return (
            <div>
                <Tabs tabPosition={'left'} type='line' style={{ color: '#9fa1a3' }} options={this.state.tabsOptions}/>
            </div>
        );
    }

}
