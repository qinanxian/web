import React from "react";

import './index.css';
import {Row, Col, Message, DetailInfo, Button,} from '../../../src/components';

export default class ScheduleJobInfo extends React.Component {

    constructor(props) {
        super(props);
        const {jobId} = props;

        this.state = {
            jobId:jobId,
        };
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        if(this.state.jobId){
            this.voInfo.setValueReadonly('jobName', true);
            this.voInfo.setValueReadonly('jobGroup', true);
        }
    };

    infoSave = (cb) => {
        this.voInfo.saveData((err, values) => {
            if (err) {
                Message.info('保存失败！');
            } else {
                const {refresh} = this.props;
                refresh && refresh();
            }
            cb(err, values);
        });
    };

    render() {
        return (
            <div>
                <Row>
                    <Col span={24}>
                        <DetailInfo
                            dataFormId="etl-ScheduleJobInfo"
                            dataReady={this.dataReady}
                            params={{jobId: this.state.jobId}}
                            reading = {this.props.readonly}
                        />
                    </Col>
                </Row>
                <Row>
                    <hr/>
                    <div  className='cron-examples-title'>Cron表达式示例</div>
                    <div className='cron-examples-content'>
                        <Row><span>10 * * ? * *</span><span className='cron-examples-left'>每分钟的第10秒执行</span></Row>
                        <Row><span>0 30 6 * * ?</span><span className='cron-examples-left'>每天06:30:00执行</span></Row>
                        <Row><span>0 0,30 7,8,9 * * ?</span><span className='cron-examples-left'>每天7,8,9中的0,30分执行</span></Row>
                        <Row><span>0 0 5 ? ? 7 *</span><span className='cron-examples-left'>每周六的05:00:00执行</span></Row>
                        <Row><span>0 0 8 1 * ?</span><span className='cron-examples-left'>每月1号的08:00:00执行</span></Row>
                        <Row><span>0 0 8 L * ?</span><span className='cron-examples-left'>每月月末的08:00:00执行</span></Row>
                        <Row><span>0 0 0 1 1 ? 2050</span><span className='cron-examples-left'>2050年1月1日执行</span></Row>
                    </div>

                </Row>
            </div>

        );
    }

}
