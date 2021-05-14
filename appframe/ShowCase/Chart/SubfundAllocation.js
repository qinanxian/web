import React from 'react';
import {Row, Col, Fieldset,Notify} from '../../../src/components';
import SubfundAllocationChart from './SubfundAllocationChart'
import SubfundAllocationData from './SubfundAllocationData'
import HisAssetAllocation from './HisAssetAllocation'

export default class SubfundAllocation extends React.Component {
    constructor(props) {
        super(props);

    }


    render() {
        return (
            <div>
                <Row >
                    <Col span={12}>
                        <Fieldset legend="子基金配置图" headerType='gist' toggle={true} showArrow={false} expanded={true}>
                            <SubfundAllocationChart/>
                        </Fieldset>
                    </Col>

                    <Col span={12}>
                        <Fieldset legend="子基金配置表" headerType='gist' toggle={true} showArrow={false} expanded={true}>
                            <SubfundAllocationData/>
                        </Fieldset>
                    </Col>
                </Row>
                <Row>
                    <Fieldset legend="历史资产配置" headerType='gist' toggle={true} showArrow={false} expanded={true}>
                        <HisAssetAllocation/>
                    </Fieldset>
                </Row>

            </div>

        );
    }
}

