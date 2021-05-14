import React from 'react';
import {propsCompose,Row,Col,Notify} from '../../../../src/components/index';
import {openModal} from "../../../../src/components";
import HelloWord from "../HelloWord";

@propsCompose
export default class AnnotationCase extends React.Component {

    doLoading = () => {
        const {closeLoading,openLoading} = this.props;

        openLoading('数据正在加载中。。。');
        setTimeout(() => {
            closeLoading();
        }, 1000);
    };
    doOpenTab = () => {
        const {flexTabs} = this.props;
        flexTabs.open('案例标签页','ShowCase/Guide/HelloWord',{title:'--->>>这是传过来的参数<<<---'});
    };
    doOpenModal = () => {
        const {openModal} = this.props;
        const ref = openModal(
            <div style={{height:600}}>
                <HelloWord/>
            </div>
            , {
                title:'案例对话框,倒时时两秒自动关闭'
            });

            setTimeout(() => {
                ref.close();
            }, 2000);
    };
    doGetParam = () => {

    };
    doRefresh = () => {
        const {refresh} = this.props;
        refresh();
    };
    doRest = () => {
        const {closeLoading,openLoading,flexTabs,openModal,param,refresh,location,rest} = this.props;
        rest.get('/showcase/RestControllerDemo/now')
            .then((data) => {
            Notify.info(data);
        });
    };
    doGetUser = () => {
        const {rest} = this.props;
        rest.get('/showcase/RestControllerDemo/sessionUser')
            .then((user) => {
                if(user.id){
                    Notify.info(`${user.code}-${user.name}`);
                }else{
                    Notify.warn('没有取到用户信息');
                }

            });
    };

    render() {
        const {closeLoading,openLoading,flexTabs,openModal,param,refresh,location,rest} = this.props;
        console.log(this.props);
        return (
            <Row gutter={10}>
                这是一个通过@propsCompose注解，引入全局对象的案例
                <Col span={6}>
                    <div><a onClick={this.doLoading}>加载中</a> </div>
                    <div><a onClick={this.doOpenTab}>打开标签页</a> </div>
                    <div><a onClick={this.doOpenModal}>打开模态框</a> </div>
                    <div><a onClick={this.doGetParam}>获取参数[未完成]</a> </div>
                    <div><a onClick={this.doRefresh}>刷新当前页</a> </div>
                    <div><a onClick={this.doRest}>REST请求</a> </div>
                    <div><a onClick={this.doGetUser}>取登录用户</a> </div>
                </Col>
                <Col span={6}/>
                <Col span={6}/>
                <Col span={6}/>
            </Row>
        );
    }
}

