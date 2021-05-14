import React from 'react';
import {
    Button, Icon, Message, Modal, Notify, Popconfirm, Divider, Menu, Row, Col,
    openModal, openDrawer, DataTable
} from '../../../../src/components';
import './index.css';
import HelloWord from "../HelloWord";

const ButtonGroup = Button.Group;

export default class MessageCase extends React.Component {

    openNotice = (type, content, title) => {
        switch (type) {
            case 'info':
                Notify.info(content, title);
                break;
            case 'success':
                Notify.success(content, title);
                break;
            case 'warn':
                Notify.warn(content, title);
                break;
            case 'error':
                Notify.error(content, title);
                break;
        }

    }

    openNoticeCustomize1 = () => {
        Notify.info(<div style={{fontSize: '18px', color: '#FF0000'}}>这是通过DOM定义的消息内容</div>, <span
            style={{fontSize: '14px', color: '#0000FF'}}>自定义的标题头</span>);
    }

    openNoticeCustomize2 = () => {
        Notify.open('不会自动关闭的消息', '提示', 0)
    }

    openMessage = (type, content) => {
        switch (type) {
            case 'info':
                Message.info(content);
                break;
            case 'success':
                Message.success(content);
                break;
            case 'warn':
                Message.warn(content);
                break;
            case 'error':
                Message.error(content);
                break;
            case 'loading':
                const hide = Message.loading(content, 0);
                setTimeout(() => {
                    hide();
                    Message.info('设置为2.5秒后，手动消失了');
                }, 2500);
                break;
        }

    }

    openMessageByDuration = (content) => {
        Message.info(content, 10);
    };

    openModalAlert = (type, message, title) => {
        Modal[type]({
            title: title,
            content: message,
        });
    };

    openModalAlertCustomize1 = () => {
        Modal.info({
            title: <span
                style={{fontSize: '14px', color: '#0000FF'}}>自定义的标题头</span>,
            content: <div style={{fontSize: '18px', color: '#FF0000'}}>这是通过DOM定义的消息内容</div>,
            okText: '好的，我已经确定了',
            okType: 'danger',
        });
    };
    openModalAutoClose = () => {
        const modal = Modal.success({
            title: '自动关闭对话框',
            content: '这个模态框会在5秒后自动关闭'
        });

        setTimeout(() => modal.destroy(), 5000);
    };

    showConfirm = () => {
        Modal.confirm({
            title: '操作确认',
            content: '你确定要这样操作吗？',
            onOk() {
                Notify.success('您已确定完成XX操作，系统已经处理完成', '确认操作提示');
            },
            onCancel() {
                Notify.info('您已放弃XX操作', '取消操作提示');
            },
        });
    };

    showConfirmCustomize = () => {
        Modal.confirm({
            title: '操作确认',
            content: '你确定要这样操作吗？',
            okText: '我确定要这样做',
            okType: 'danger',
            cancelText: '放弃',
            onOk() {
                Notify.success('您已确定完成XX操作，系统已经处理完成', '确认操作提示');
            },
            onCancel() {
                Notify.info('您已放弃XX操作', '取消操作提示');
            },
        });
    };

    popConfirm = () => {
        Notify.success('确认操作');
    }

    popCancel = () => {
        Notify.error('放弃操作');
    }

    simpleModal = () => {
        openModal(
            <div>
                <div>这是最简单的基础对话框</div>
                <Divider dashed/>
                <div><HelloWord/></div>
            </div>
        );
    };

    defaultButtonModal = () => {
        openModal(
            <div>
                <div>有默认按钮的对话框</div>
                <Divider dashed/>
                <div><HelloWord/></div>
            </div>
            , {
                defaultButton: true,
                onOk(modal, component) {
                    Notify.success('你点击了确认');
                    modal.close();
                },
                onCancel(modal, component) {
                    Notify.error('你点击了取消！');
                }
            });
        console.log(ref);
    };

    customizeModal = () => {
        const do1 = (modal) => {
            Message.error('你点击了取消');
            modal.close();
        };
        const do2 = (modal) => {
            Message.success('你点击了确认');
            modal.close();
        };

        const ref = openModal(
            <div>
                <div>自定义标题及按钮的对话框</div>
            </div>
            , {
                title: <div><Icon type='info'/>&nbsp;<span
                    style={{fontSize: '14px', color: '#00FF00'}}>这是自定义的对话框标题</span></div>,
                footer: [
                    <Button key="back" onClick={() => do1(ref)}>取消X</Button>,
                    <Button key="submit" onClick={() => do2(ref)} type="primary">确定X</Button>,
                ]
            });
        console.log(ref);
    };

    dataListInModal = () => {
        let volist;
        const ref = openModal(
            <div style={{height: 600}}>
                <DataTable
                    dataFormId="demo-BeanPersonList"
                    params={{code: 'BeanPersonList'}}
                    formReady={(table) => {
                        volist = table;
                    }}
                />
            </div>
            , {
                title: '打开数据列表',
                defaultButton: true,
                onOk(modal, compnent) {
                    const row = volist.getSelectedRow();
                    Message.info(row.name);
                    modal.close();
                },
                onCancel(a, b) {
                }
            });
        console.log(ref);
    };


    openDrawerSimple = (placement) => {
        openDrawer(
            <div>
                <div>这是最简单的基础打开</div>
                <Divider dashed/>
                <div><HelloWord/></div>
            </div>, {
              placement
          }
        );
    }

    openDrawerWithTitle = () => {
        openDrawer(
            <div>
                <DataTable
                    dataFormId="demo-BeanPersonList"
                    params={{code: 'BeanPersonList'}}
                />
            </div>
            , {
                title: <div><Icon type='info'/>&nbsp;<span style={{fontSize: '14px', color: '#00FF00'}}>这是自定义标题</span>
                </div>,
                width: 1065
            });
    }

    openDrawerSimpleNoAutoClose = () => {
        openDrawer(
          <div>
              <div>这是最简单的基础打开</div>
              <Divider dashed/>
              <div><HelloWord/></div>
          </div>, {
              maskClosable: false

          }
        );
    }
    _enlarge = (type, isFullScreen) => {
        const { flexTabs: { enlarge }, param: { __id } } = this.props;
        if (type === 'tab') {
            enlarge(__id, false, isFullScreen);
        } else {
            // 第一个参数是dom的id或者是tab的id 第二个参数是否是dom的id 第三个参数是是否要浏览器全屏
            enlarge('opendrawer_test_id', true, isFullScreen);
        }
    }


    render() {
        return (
            <Row gutter={0}>
                <Col span={8}>
                    <h3>提示</h3>
                    <h4>通知提示</h4>
                    <div>
                        <ButtonGroup>
                            <Button type="primary" onClick={() => this.openNotice('info', '一般信息反馈消息')}>一般信息</Button>
                            <Button type="primary" onClick={() => this.openNotice('success', '成功反馈消息')}>成功</Button>
                            <Button type="primary" onClick={() => this.openNotice('warn', '警告反馈消息')}>警告</Button>
                            <Button type="primary" onClick={() => this.openNotice('error', '错误反馈消息')}>错误</Button>
                        </ButtonGroup>

                        <ButtonGroup>
                            <Button type="primary"
                                    onClick={() => this.openNotice('info', '这里是消息内容', '这里是消息标题')}>定义消息标题</Button>
                            <Button type="primary" onClick={() => this.openNoticeCustomize1()}>使用DOM自定义</Button>
                        </ButtonGroup>

                        <ButtonGroup>
                            <Button type="primary"
                                    onClick={() => this.openNotice('info', '这里是消息内容', '这里是消息标题')}>定义消息标题</Button>
                            <Button type="primary" onClick={() => this.openNoticeCustomize1()}>使用DOM自定义</Button>
                            <Button type="primary" onClick={() => this.openNoticeCustomize2()}>不自动关闭的通知</Button>
                        </ButtonGroup>

                    </div>
                    <h4>全局提示</h4>
                    <div>
                        <ButtonGroup>
                            <Button type="primary" onClick={() => this.openMessage('info', '一般信息反馈消息')}>一般信息</Button>
                            <Button type="primary" onClick={() => this.openMessage('success', '成功反馈消息')}>成功</Button>
                            <Button type="primary" onClick={() => this.openMessage('warn', '警告反馈消息')}>警告</Button>
                            <Button type="primary" onClick={() => this.openMessage('error', '错误反馈消息')}>错误</Button>
                        </ButtonGroup>

                        <ButtonGroup>
                            <Button type="primary" onClick={() => this.openMessage('loading', '加载中反馈消息')}>加载中</Button>
                        </ButtonGroup>

                        <ButtonGroup>
                            <Button type="primary"
                                    onClick={() => this.openMessageByDuration('成功反馈消息，10秒后自动消失')}>10秒后消失</Button>
                        </ButtonGroup>
                    </div>
                </Col>
                <Col span={8}>
                    <h3>交互对话框</h3>
                    <h4>信息提示框</h4>
                    <div>
                        <ButtonGroup>
                            <Button type="primary" onClick={() => this.openModalAlert('info', '信息提示，一般')}>一般信息</Button>
                            <Button type="primary" onClick={() => this.openModalAlert('success', '信息提示，成功')}>成功</Button>
                            <Button type="primary" onClick={() => this.openModalAlert('warn', '信息提示，警告')}>警告</Button>
                            <Button type="primary" onClick={() => this.openModalAlert('error', '信息提示，出错')}>错误</Button>
                        </ButtonGroup>
                        <ButtonGroup>
                            <Button type="primary" onClick={() => this.openModalAlertCustomize1()}>定义标题和内容</Button>
                            <Button type="primary" onClick={() => this.openModalAutoClose()}>5秒后自动关闭</Button>
                        </ButtonGroup>
                    </div>
                    <h4>确认框</h4>
                    <div>
                        <ButtonGroup>
                            <Button type="primary" onClick={() => this.showConfirm()}>默认</Button>
                            <Button type="primary" onClick={() => this.showConfirmCustomize()}>自定义样式</Button>
                        </ButtonGroup>
                        <ButtonGroup>
                        </ButtonGroup>
                    </div>
                    <h4>气泡确认框</h4>
                    <div>
                        <Popconfirm title="确定删除吗?" onConfirm={() => this.popConfirm()} onCancel={() => this.popCancel()}
                                    okText="确定" cancelText="放弃">
                            <Button type="primary">删除</Button>
                        </Popconfirm>
                    </div>
                </Col>
                <Col span={8}>
                    <h3>交互对话框</h3>
                    <div>
                        <ButtonGroup>
                            <Button type="primary" onClick={() => this.simpleModal()}>最简单</Button>
                            <Button type="primary" onClick={() => this.defaultButtonModal()}>有默认按钮</Button>
                        </ButtonGroup>
                        <ButtonGroup>
                            <Button type="primary" onClick={() => this.customizeModal()}>自定义标题及按钮</Button>
                        </ButtonGroup>
                        <ButtonGroup>
                            <Button type="primary" onClick={() => this.dataListInModal()}>对话框放入列表</Button>
                        </ButtonGroup>
                    </div>
                    <h3>侧滑打开</h3>
                    <div id='opendrawer_test_id'>
                        <ButtonGroup>
                            <Button type="primary" onClick={() => this.openDrawerSimple()}>最简单</Button>
                            <Button type="primary" onClick={() => this.openDrawerSimple('left')}>左侧</Button>
                            <Button type="primary" onClick={() => this.openDrawerSimple('bottom')}>下方</Button>
                            <Button type="primary" onClick={() => this.openDrawerSimple('top')}>上方</Button>
                        </ButtonGroup>
                        <ButtonGroup>
                            <Button type="primary" onClick={() => this.openDrawerWithTitle()}>标题</Button>
                            <Button type="primary" onClick={() => this.openDrawerSimpleNoAutoClose()}>不允许自动关闭</Button>
                        </ButtonGroup>
                    </div>
                    <h3>页面放大</h3>
                    <div>
                        <ButtonGroup>
                            <Button type="primary" onClick={() => this._enlarge('tab')}>放大tab</Button>
                            <Button type="primary" onClick={() => this._enlarge('dom')}>放大dom</Button>
                            <Button type="primary" onClick={() => this._enlarge('tab', true)}>全屏tab</Button>
                            <Button type="primary" onClick={() => this._enlarge('dom', true)}>全屏dom</Button>
                        </ButtonGroup>
                    </div>
                </Col>
            </Row>


        );
    }
}

