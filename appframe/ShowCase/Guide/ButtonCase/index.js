import React from 'react';
import {Button, Icon, Message, Divider, Menu, Row, Col,EmebedButton,Upload,Iframe} from '../../../../src/components/index';
import {Dropdown,Input} from 'antd';
import {rest} from "../../../../src/components";

const ButtonGroup = Button.Group;
const EmbedGroup = EmebedButton.Group;

export default class ButtonCase extends React.Component {
    state = {
        loading: false,
        open:false,
    }
    /**
     * 改变按钮为加载中状态，1秒之后复原
     */
    enterLoading = () => {
        this.setState({loading: true});
        setTimeout(() => {
            this.setState({loading: false});
        }, 1000);
    }

    download = () => {
        const { rest } = this.props;
        rest.download('/showcase/pageoffice/show/amarsoft-seal-demo.png')
    }
    loadingClick = (e, btn) => {
      btn.setLoading(true);
      // 延迟三秒后禁用按钮
      setTimeout(() => {
        btn.setDisabled(true);
        // 再延迟三秒关闭loading和禁用
        setTimeout(() => {
          btn.setLoading(false);
          btn.setDisabled(false);
        }, 3000)
      }, 3000)
    }
    handleClick = () => {
        this.setState({
          open:!this.state.open
        });
    };
    render() {
        return (
            <div style={{margin: '15px'}}>
                <Row>
                    <Col span={12} style={{padding: "10px"}}>
                        <fieldset>
                            <legend>基础按钮</legend>
                            <div>
                                <Button>默认按钮</Button>
                                <Divider type="vertical"/>
                                <Button type="primary">主要按钮</Button>
                                <Divider type="vertical"/>
                                <Button type="dashed">虚线按钮</Button>
                                <Divider type="vertical"/>
                                <Button type="danger">易冲动的按钮</Button>
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>按钮样式</legend>
                            <div>
                                <Button>Default</Button>
                                <Divider type="vertical"/>
                                <Button type="primary">Primary</Button>
                                <Divider type="vertical"/>
                                <Button type="success">Success</Button>
                                <Divider type="vertical"/>
                                <Button type="warning">Warning</Button>
                                <Divider type="vertical"/>
                                <Button type="danger">Danger</Button>
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>带图标的按钮</legend>
                            <div>
                                <Button type="primary" shape="circle" icon="search"/>
                                <Divider type="vertical"/>
                                <Button type="primary" icon="search">搜索</Button>
                                <br/>
                                <Button shape="circle" icon="search"/>
                                <Divider type="vertical"/>
                                <Button icon="search">搜索</Button>
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>分组的按钮</legend>
                            <div>
                                <ButtonGroup>
                                    <Button>左</Button>
                                    <Button>中</Button>
                                    <Button>右</Button>
                                </ButtonGroup>

                                <Divider type="vertical"/>
                                <ButtonGroup>
                                    <Button type="primary">
                                        <Icon type="left"/>后退
                                    </Button>
                                    <Button type="primary">
                                        前进<Icon type="right"/>
                                    </Button>
                                </ButtonGroup>
                                <Divider type="vertical"/>
                                <ButtonGroup>
                                    <Button type="primary" icon="cloud"/>
                                    <Button type="primary" icon="cloud-download"/>
                                </ButtonGroup>

                            </div>
                        </fieldset>


                        <fieldset>
                            <legend>下拉按钮</legend>
                            <div>
                                <Dropdown overlay={
                                    <Menu>
                                        <Menu.Item>功能项1</Menu.Item>
                                        <Menu.Item>功能项2</Menu.Item>
                                    </Menu>
                                }>
                                    <Button>
                                        按钮拉菜单 <Icon type="down"/>
                                    </Button>
                                </Dropdown>
                                <Divider type="vertical"/>
                                <Dropdown.Button overlay={
                                    <Menu>
                                        <Menu.Item>下拉按钮项1</Menu.Item>
                                        <Menu.Item>下拉按钮项2</Menu.Item>
                                        <Menu.Divider/>
                                        <Menu.Item key="3">下拉按钮项3</Menu.Item>
                                    </Menu>
                                }>
                                    分裂式按钮
                                </Dropdown.Button>
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>按钮大小及状态</legend>
                            <div>

                                <Dropdown.Button overlay={
                                    <Menu>
                                        <Menu.Item>下拉按钮项1</Menu.Item>
                                        <Menu.Item disabled>下拉按钮项2</Menu.Item>
                                        <Menu.Divider/>
                                        <Menu.Item key="3">下拉按钮项3</Menu.Item>
                                    </Menu>
                                }>
                                    部分不可用
                                </Dropdown.Button>
                                <Divider type="vertical"/>
                                <Dropdown disabled overlay={
                                    <Menu>
                                        <Menu.Item>功能项1</Menu.Item>
                                        <Menu.Item>功能项2</Menu.Item>
                                    </Menu>
                                }>
                                    <Button>
                                        下拉按钮 <Icon type="down"/>
                                    </Button>
                                </Dropdown>
                                <Divider type="vertical"/>
                                <Dropdown.Button disabled overlay={
                                    <Menu>
                                        <Menu.Item>功能项1</Menu.Item>
                                        <Menu.Item>功能项2</Menu.Item>
                                    </Menu>
                                }>
                                    分裂下拉
                                </Dropdown.Button>
                                <Divider type="vertical"/>
                                <Button type="primary" disabled>主要按钮不可用</Button>
                            </div>
                        </fieldset>
                    </Col>
                    <Col span={12} style={{padding: "10px"}}>
                        <Divider>按钮大小</Divider>

                        <Button type="primary">默认大小</Button>
                        <Divider type="vertical"/>
                        <Button type="primary" size={'large'}>大按钮</Button>
                        <Divider type="vertical"/>
                        <Button type="primary" size={'default'}>默认按钮(SIZE默认值）</Button>
                        <Divider type="vertical"/>
                        <Button type="primary" size="small">小按钮</Button>

                        <Divider>按钮加载状态</Divider>
                      <Button type="primary" loading>加载中</Button>
                      <Divider type="vertical"/>
                        <Button type="primary" loading={this.state.loading}
                                onClick={this.enterLoading}>点击之后变成加载中</Button>
                        <Button
                          style={{ marginLeft: 20 }}
                          icon={'fa-download'}
                          type="primary"
                          onClick={this.download}
                        >
                          点击下载
                        </Button>
                      <Button
                        style={{ marginLeft: 20 }}
                        type="primary"
                        onClick={this.loadingClick}
                      >
                        手动设置按钮loading
                      </Button>
                      <Divider>內嵌按鈕</Divider>
                      <EmebedButton type="primary" icon={"fa-save"}>办理</EmebedButton>
                      <EmbedGroup style={{margin:0}}>
                        <EmebedButton>业务信息</EmebedButton>
                        <EmebedButton>撤回</EmebedButton>
                      </EmbedGroup>
                      <div style={{marginTop:'10px'}}>
                        <Upload
                          action=''
                          listType='picture-card'
                          number={1}
                        />
                      </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

