import React from "react";
import {DataTable, Row, Col, Tabs} from "../../../src/components/index";
import DetectorList from "./DetectorList";
import DetectorItemList from "./DetectorItemList";

export default class DetectorMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: null,
        }
    }

    static DetectorList =DetectorList;
    static DetectorItemList = DetectorItemList;

    getSelected = (selectedRowKeys, selectedRows) => {
        this.setState({ code: (selectedRows[0] && selectedRows[0].code) || null });
    };


    render() {
        return (
            <div style={{marginLeft: '20px'}}>
                风险探测器配置
                <Row>
                    <Col span={10}>
                        <DetectorList
                            getSelected={this.getSelected}
                        />
                    </Col>
                    <Col span={14}>
                        <DetectorItemList
                            detectorCode={this.state.code}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}