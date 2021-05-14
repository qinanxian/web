import React from 'react';
import {Button, Notify,Collapse,Message, Row, Col, Detector, openModal} from '../../../../src/components/index';

const Panel = Collapse.Panel;


export default class DetectorCase extends React.Component {

    detcReady = (detc) => {
        this.detc = detc;
    };

    showResult = (ret) => {
        if(ret){
            Notify.success('检查通过');
        }else{
            Notify.error('检查未通过');
        }
    }

    openDetector = () => {
        openModal(<Detector code={"DemoCheck"} param={{"objectType": 'customer', "customerId": "P001"}}
                            callback={(ret) => this.showResult(ret)}/>, {
            defaultButton: true,
            title: '风险探测',
        });
    };

    doStart = () => {
        this.detc.start();
    }

    doReStart = () => {
        this.detc.reset();
        this.detc.start();
    }

    doReset = () => {
        this.detc.reset();
    }

    doGetRet = () => {
        Notify.info("结果:"+this.detc.getResult());
    }

    doCallback = (ret) =>{
        if(ret){
            Notify.success('检查通过');
        }else{
            Notify.error('检查未通过');
        }
    }

    render() {
        return (
            <div>
                <Row gutter={10}>
                    <Col span={7} offset={1}>
                        <Collapse defaultActiveKey={['byBtn']}>
                            <Panel header="通过按钮打开" key="byBtn">
                                <Button type='primary' onClick={this.openDetector}>启动</Button>
                            </Panel>
                        </Collapse>
                    </Col>
                    <Col span={15}>
                      <div>
                        <Button onClick={this.doStart}>启动</Button>
                        <Button onClick={this.doReStart}>重新检查</Button>
                        <Button onClick={this.doReset}>复位</Button>
                        <Button onClick={this.doGetRet}>取运行结果</Button>
                      </div>
                        <Collapse defaultActiveKey={['innerCase']}>
                            <Panel header="直接嵌入" key="innerCase">
                                <Detector code={"DemoCheck"} param={{"objectType": 'customer', "customerId": "P001"}} detcReady={this.detcReady} autoStart={false} callback={this.doCallback}/>
                            </Panel>
                        </Collapse>
                    </Col>
                </Row>
            </div>

        );
    }
}