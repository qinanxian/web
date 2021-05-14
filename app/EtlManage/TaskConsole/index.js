import React from "react";
import {
    DataTable,
    openModal,
    Fieldset,
    Button,
    Row,
    Dropdown, Menu, Upload, Modal, Message, Col, rest
} from '../../../src/components';

import InputModal from "./InputModal";

export default class TaskConsole extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            logHtml: '操作输出日志',
            inputValue: null,
        }
    }


    componentDidMount() {
    }

    testTimeWork =()=> {
        this.appendLog("----------------测试定时任务添加用户开始...----------------");
        const {openLoading, closeLoading} = this.props;
        openLoading&&openLoading();
        rest.get(`/comn/file/getCustomer`).then((ret) => {
            closeLoading&&closeLoading();
            if(ret){
                Message.success("测试定时任务添加用户完成");

                this.appendLog("----------------测试定时任务添加用户结束----------------");
            }

        }).catch((error)=>{
            closeLoading&&closeLoading();
            Message.error(`${error.message}`);
            this.appendLog(`错误信息:${error.message}`);
            this.appendLog("----------------测试定时任务添加用户结束----------------");

        });
    }


    // ------------------------------------公共方法-------------------------------------------------------------------//

    openInput = (labelName, excFunc) => {
        openModal(<InputModal />, {
            title:"请输入",
            defaultButton: true,
            labelName:labelName,
            onOk: (modal, compnent,but) => {
                compnent.inputText((value) => {
                    excFunc(value);
                    modal.close();
                });
            },

        });
    };

    appendLog = (msg)=>{
        const logHtml = this.state.logHtml;
        const newlogHtml = `${logHtml}<br/>${msg}`;

        this.setState({logHtml: newlogHtml});
    }

    render() {
        return (
            <span>
              <Row>
                  <Col span={12}>
                    <Fieldset legend={"日志显示"} expanded={true}>
                        <div style={{overflowY:"scroll",height:"500px"}}
                             dangerouslySetInnerHTML={{__html: this.state.logHtml}}></div>
                    </Fieldset>
                  </Col>
                  <Col span={8} offset={1}>
                        <Fieldset legend={"测试定时任务"} showArrow={true}>
                            <Button onClick={()=>this.testTimeWork()} type="primary">测试定时任务</Button>
                        </Fieldset>
                        <br/>
                        <p>注意: 请谨慎使用！！！</p>
                  </Col>
              </Row>


            </span>


    );
}
}


