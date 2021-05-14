import React from "react";
import FnastatSheet from '../../../appframe/Common/Fnastat/FnastatSheet';
import {propsCompose} from '../../../src/components';
/**
 * Created by dswang on 2018/3/15.获取客户项下财务指标
 * 条件:年报，合并报表 类型：indictor
 */
@propsCompose
export default class FnastatIndictor extends React.Component {

    constructor(props) {
        super(props);
        const {param, custId} = this.props;
        this.custId = custId;
        if (param && param.custId) {
            this.custId = param.custId;
        }
        this.state={
            fnastat:null
        }
    }

    componentDidMount(){
        const { rest } = this.props;
        //获取客户项下最新的财务报表(年报)
        rest.get(`/cust/Fnastat/getCustFnatstatIndictor/${this.custId}`).then((data) => {
            this.state.fnastat = data;
            this.setState(this.state);
        });
    }

    render() {
        return (
                this.state.fnastat?
                (<FnastatSheet fnastat={this.state.fnastat}/>):<div>请添加一份财务报表</div>
            )
    }

}