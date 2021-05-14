import React from "react";

import {Row, Col, Message, DetailInfo, Button,} from '../../../src/components';

export default class ScheduleJobHistInfo extends React.Component {

    constructor(props) {
        super(props);
        const {id} = props;

        this.state = {
            id:id
        }
    }

    dataReady = (voinfo)=> {
        this.voinfo = voinfo;

        this.voinfo.setItemTemplate('zzErrorMsg', (text, record, i) => {
            if(!text) return (<span></span>);

            let contents = [];
            if(!this.isJsonString(text)) {
                const textReplace = text.replace(/\n/g,"<br/>");
                contents = textReplace.split("<br/>");
            } else {
                contents = JSON.parse(text);
            }

            return (
                <span style={{color: "#DC143C",paddingLeft:"10px"}}>
                    {contents.map((value)=>{
                        if(value){
                            return (<div style={{lineHeight: "20px"}}>{value}</div>)
                        }
                    })
                    }
                </span>);
        });

        this.voinfo.setItemTemplate('stepStatus', (text, record, i) => {

            if(!text) return (<span></span>);

            if(!this.isJsonString(text)) {
                return (<span>{text}</span>);
            }

            const steps = JSON.parse(text);

            if(!steps[0]||!steps[0].stepName) return (<span>{text}</span>);

            return (<div>
                <table border="1">
                    <tr>
                        <th>步骤名称</th>
                        <th>复制记录行</th>
                        <th>读</th>
                        <th>写</th>
                        <th>输入</th>
                        <th>输出</th>
                        <th>更新</th>
                        <th>拒绝</th>
                        <th>错误</th>
                        <th>激活</th>
                        <th>时间</th>
                        <th>速度(条记录/秒)</th>
                    </tr>
                    <tbody>
                    {steps.map((value)=>{
                        if(value){
                            return (<tr>
                                <td>{value.stepName}</td>
                                <td>{value.copyRow}</td>
                                <td>{value.readRow}</td>
                                <td>{value.writeNum}</td>
                                <td>{value.inputNum}</td>
                                <td>{value.outputNum}</td>
                                <td>{value.updataNum}</td>
                                <td>{value.rejectNum}</td>
                                <td>{value.errorNum}</td>
                                <td>{value.statues}</td>
                                <td>{value.useTime}</td>
                                <td>{value.speed}</td>
                            </tr>)
                        }
                    })
                    }
                    </tbody>
                </table>
            </div>);
        });
    }

    isJsonString = (str) => {
        if (typeof str == 'string') {
            try {
                var obj=JSON.parse(str);
                if(typeof obj == 'object' && obj ){
                    return true;
                }else{
                    return false;
                }

            } catch(e) {
                return false;
            }
        }
    }

    render() {
        return (
            <div>
                <Row>
                    <Col span={24}>
                        <DetailInfo
                            dataFormId="etl-ScheduleJobHistInfo"
                            dataReady={this.dataReady}
                            params={{id: this.state.id}}
                            reading = {true}
                        />
                    </Col>
                </Row>
            </div>

        );
    }

}
