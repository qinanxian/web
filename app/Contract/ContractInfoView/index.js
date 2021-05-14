import React from "react";
import {DataTable, Button, Divider, Tabs, Message, Notify} from "../../../src/components";
import ContractInfo from "../ContractInfo"
import LactLoanInfo from "../LactLoanInfo"
import Formatdoc from "../../Common/Formatdoc";
import PublicExporter from "../../Customer/PublicExporter"

const TabPane = Tabs.TabPane;


export default class ContractInfoView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contractId: this.props.params.contractId,
            applicationId: undefined,
            custId: undefined,
            custName: undefined,
            custType: undefined,
            editable: this.props.params.editable,
            loadComplete: false,
            tabsOptions: []
        }
    }

    componentDidMount() {
        const {contractId} = this.state;
        const {rest} = this.props;
        const tabsOptions = [];

        tabsOptions.push({
            tab: '合同详情',
            key: 'contractInfo',
            content: <ContractInfo {...this.props} ref={(comp) => {
                this.contractInfo = comp;
            }} saveCallback={this.contractSaveCallback} contractId={this.state.contractId}/>
        });

        rest.get(`/contract/byId/${contractId}`)
            .then((contract) => {
                const {custId, contractDocId, contractStatus, lactLoanId} = contract;
                this.setState({
                    custId,
                    editable: contractStatus === 'READY',
                    custName: contract.custName,
                    applicationId: contract.applicationId
                });

                tabsOptions.push({
                    tab: '贷款核算',
                    key: 'lactLoanInfo',
                    content: <LactLoanInfo {...this.props} ref={(comp) => {
                        this.lactLoanInfo = comp;
                    }} lactLoanId={lactLoanId}/>
                });

                if (contractDocId) {
                    tabsOptions.push({
                        tab: '格式化合同',
                        key: 'contractFormatDoc',
                        content: <Formatdoc {...this.props} formatdocId={contractDocId}/>
                    });
                }
            })
            .finally(() => {
                this.setState({tabsOptions: tabsOptions, loadComplete: true});
            });
    }

    saveAll = () => {
        if (this.contractInfo) {
            this.contractInfo.saveInfo(() => {
                Notify.success('保存成功');
            });
        }
    }

    contractSaveCallback = () => {
        if (this.contractInfo) {
            Message.success('合同明细保存成功！');
            // this.contractInfo.saveInfo();
        }
        if (this.lactLoanInfo) {
            Message.success('还款计划保存成功！');
            this.lactLoanInfo.refreshMe();
        }
    }

    openCustomerView = () => {
        const {flexTabs, rest} = this.props;
        PublicExporter.openCustomerViewById(flexTabs, rest, this.state.custId)
    }

    openApplicationView = () => {
        const {flexTabs} = this.props;
        flexTabs.open(`[${this.state.custName}]-业务`, 'BizApplication/ApplicationView', {applicationId: this.state.applicationId});
    }

    render() {
        return (
            <div>
                {this.state.editable ?
                    (
                        <div style={{'marginTop': '5px', 'marginLeft': '10px'}}>
                            <Button type="primary" loading={!this.state.loadComplete} onClick={this.saveAll}
                                    icon="fa-save">保存</Button>
                            <Divider type="vertical"/>
                            <Button type="link" size="small" onClick={this.openApplicationView}
                                    loading={!this.state.loadComplete} style={{'border': 'none'}}>查看申请</Button>
                            <Button type="link" size="small" onClick={this.openCustomerView}
                                    loading={!this.state.loadComplete} style={{'border': 'none'}}>查看客户</Button>
                            <Divider type="vertical"/>
                        </div>
                    ) : ''
                }
                <Tabs type='line' style={{color: '#9fa1a3'}} options={this.state.tabsOptions}/>
            </div>
        );
    }
}
