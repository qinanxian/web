import React from 'react';
import {Row, Col, Fieldset,Notify} from '../../../src/components';
import AssetAllocationChart from './AssetAllocationChart'
import AssetAllocationData from './AssetAllocationData'

export default class AssetAllocation extends React.Component {
    constructor(props) {
        super(props);

    }


    render() {
        return (
            <div>
                <Row >
                    <Col span={12}>
                        <Fieldset legend="资产配置图" headerType='gist' toggle={true} showArrow={false} expanded={true}>
                            <AssetAllocationChart/>
                        </Fieldset>
                    </Col>

                    <Col span={12}>
                        <Fieldset legend="资产配置表" headerType='gist' toggle={true} showArrow={false} expanded={true}>
                            <AssetAllocationData/>
                        </Fieldset>
                    </Col>
                </Row>
            </div>

        );
    }
}

