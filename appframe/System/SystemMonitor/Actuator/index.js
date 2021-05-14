import React from "react";
import {Row, Col} from '../../../../src/components';
import DiskChart from './DiskChart';
import StackChart from './StackChart';
import RadarChart from './RadarChart';
import GCGroupChart from './GCGroupChart';
import HeapGroupChart from './HeapGroupChart';
import NonHeapGroupChart from './NonHeapGroupChart';

export default class Actuator extends React.Component {
    //<Col span={8}><StackChart/></Col>
    render() {
        return (
            <div>
                <Row gutter={30}>
                    <Col span={8}><DiskChart/></Col>
                    <Col span={8}><RadarChart/></Col>
                    <Col span={8}><StackChart/></Col>
                </Row>
                <div style={{height:"20px"}}></div>
                <Row gutter={30}>
                    <Col span={8}>垃圾回收统计<GCGroupChart/></Col>
                    <Col span={8}>堆内存使用情况<HeapGroupChart/></Col>
                    <Col span={8}>非堆内存使用情况<NonHeapGroupChart/></Col>
                </Row>
            </div>
        );
    }
}