import React from "react";
import {Col, Iframe, Row, Tabs} from "../../src/components";
import CreditLimitInfo from './CreditLimitInfo'


export default class CreditLimitView extends React.Component {
    static CreditLimitInfo = CreditLimitInfo

    constructor(props) {
        super(props);
        const {closeLoading, openLoading} = props;
        const {limitId} = props.param;
        this.state = {
            tabsOptions: []
        };

        const {rest} = this.props;
        const tabsOptions = [];

        rest.get(`/creditlimit/byId/${limitId}`)
            .then((creditLimitProfile) => {
                tabsOptions.push({
                    tab: '额度信息',
                    key: 'applicationInfo',
                    content: <CreditLimitInfo dataformId={creditLimitProfile.dataformId} limitId={limitId}/>
                });
                tabsOptions.push({
                    tab: '额度项下业务',
                    key: 'creditLimitUnderBiz',
                    content: <div>正在开发中...</div>
                });
            }).finally(() => {
            this.setState({tabsOptions: tabsOptions});
        });

    }

    componentDidMount() {
    }

    render() {
        return (
            <div>
                <Row>
                    <Col span={24}>
                        <Tabs type='line' style={{color: '#9fa1a3'}} options={this.state.tabsOptions}/>
                    </Col>
                </Row>
            </div>
        );
    }

}