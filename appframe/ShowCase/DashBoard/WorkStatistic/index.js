import React from 'react';
import { Modal } from 'antd';
import UserInfo from './UserInfo';
import AccountInfo from './AccountInfo';
import MsgInfo from './MsgInfo';
import OrderInfo from './OrderInfo';
import PAInfo from './PAInfo';
import Password from "../../../Person/Password";
import {getUser, getCachePwd, rmCachePwd} from '../../../../src/lib/cache';
import moment from "moment";


import './index.less';

const painfo1 = {
    statistics:[
        {key:'key1',flag:false,icon:'roic-customer',title:'产品总数',value:1,bgColor:{outer:'rgb(235,249,254)',inner:'rgb(48,177,248)'}},
        {key:'key7',flag:true},
        {key:'key2',flag:false,icon:'roic-customer',title:'总房款金额',value:1630000.00,bgColor:{outer:'rgb(254,235,235)',inner:'rgb(239,92,113)'}},
        {key:'key8',flag:true},
        {key:'key3',flag:false,icon:'roic-customer',title:'总利润',value:1630000.00,bgColor:{outer:'rgb(236,247,244)',inner:'rgb(29,196,155)'}},
        {key:'key9',flag:true},
        {key:'key4',flag:false,icon:'roic-customer',title:'总成交单数',value:1630000.00,bgColor:{outer:'rgb(235,249,254)',inner:'rgb(48,177,248)'}},
        {key:'key10',flag:true},
        {key:'key5',flag:false,icon:'roic-customer',title:'平均还款期数',value:1630000.00,bgColor:{outer:'rgb(235,249,254)',inner:'rgb(48,177,248)'}},
        {key:'key11',flag:true},
        {key:'key6',flag:false,icon:'roic-customer',title:'平均放款金额',value:1630000.00,bgColor:{outer:'rgb(235,249,254)',inner:'rgb(48,177,248)'}}
    ],
    proportion:{
        col_1:'产品类型',
        col_2:'产品放款金额',
        col_3:'年华利率',
        col_1_value:'车抵贷产品A',
        col_2_value:'50%',
        col_2_num:'1234567.00',
        col_3_value:'100.00%',
    },
    timeStart:'',
    timeEnd:'',
    chartsData:{
        title:'车抵贷产品A'
    }
};

const painfo2 = {
    statistics:[
        {key:'key1',flag:false,icon:'roic-customer',title:'产品总数',value:1,bgColor:{outer:'rgb(235,249,254)',inner:'rgb(48,177,248)'}},
        {key:'key7',flag:true},
        {key:'key2',flag:false,icon:'roic-customer',title:'产品总房款金额',value:1630000.00,bgColor:{outer:'rgb(254,235,235)',inner:'rgb(239,92,113)'}},
        {key:'key8',flag:true},
        {key:'key3',flag:false,icon:'roic-customer',title:'逾期金额',value:1630000.00,bgColor:{outer:'rgb(236,247,244)',inner:'rgb(29,196,155)'}},
        {key:'key9',flag:true},
        {key:'key4',flag:false,icon:'roic-customer',title:'坏账金额',value:1630000.00,bgColor:{outer:'rgb(235,249,254)',inner:'rgb(48,177,248)'}},
        {key:'key10',flag:true},
        {key:'key5',flag:false,icon:'roic-customer',title:'放款订单数',value:1630000.00,bgColor:{outer:'rgb(235,249,254)',inner:'rgb(48,177,248)'}},
        {key:'key12',flag:true},
        {key:'key6',flag:false,icon:'roic-customer',title:'逾期订单数',value:1630000.00,bgColor:{outer:'rgb(235,249,254)',inner:'rgb(48,177,248)'}},
        {key:'key14',flag:true},
        {key:'key16',flag:false,icon:'roic-customer',title:'坏账订单数',value:1630000.00,bgColor:{outer:'rgb(235,249,254)',inner:'rgb(48,177,248)'}}
    ],
    proportion:{
        col_1:'承担分店数',
        col_2:'总放款金额',
        col_3:'业绩占比',
        col_1_value:'金华门店',
        col_2_value:'70%',
        col_2_num:'450009',
        col_3_value:'100.00%',
    },
    timeStart:'',
    timeEnd:'',
    chartsData:{
        title:'金华门店'
    }
};

class CheckInitPassWord extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: false }
  }

  componentDidMount() {
    const pwd = sessionStorage.getItem('userPwd');
    if (pwd) {
      const user = getUser();
      const { updateTime, id } = user;
      const now = moment(new Date());
      const judgeCondition = (pwd === `urcb${id}`)
        || moment(updateTime).add(90, 'd').isBefore(now);
      if(judgeCondition) {
        this.openModal();
      }
    }
  }

  openModal = () => this.setState({ visible: true });
  closeModal = () => this.setState({ visible: false });
  changePasswordSuccess = () => {
    this.closeModal();
    sessionStorage.removeItem('userPwd');
  }

  render() {
    return (
      <Modal
        title="请先修改密码"
        visible={this.state.visible}
        closable={false}
        width={800}
        footer={null}
      >
        <div>警告:由于您的密码是初始密码或者已超过90天有效期，请重新修改您的密码</div>
        <Password {...this.props} onSuccess={this.changePasswordSuccess}/>
      </Modal>
    );
  }
}

export default class ChartsThree extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data1:{},
            data2:{}
        };
    }
    componentDidMount(){
        this.setState({
            data1:painfo1,
            data2:painfo2
        })
    }

    checkInitPwd = () => {
      // openModal(<Password  />, {
      // });
    }

    render(){
        const { data1, data2 } = this.state;
        const { prefix = 'ro' } = this.props;
        return (
            <div className={`${prefix}-chartsw`}>
                --首页内容再完善，待更新........
                {/*<div className={`${prefix}-chartsw-brief`}>*/}
                    {/*<div className={`${prefix}-chartsw-brief-left ${prefix}-chartsw-box`}>*/}
                        {/*<UserInfo/>*/}
                    {/*</div>*/}
                    {/*<div className={`${prefix}-chartsw-brief-center ${prefix}-chartsw-box`}>*/}
                        {/*<AccountInfo/>*/}
                    {/*</div>*/}
                    {/*<div className={`${prefix}-chartsw-brief-right ${prefix}-chartsw-box`}>*/}
                        {/*<MsgInfo/>*/}
                    {/*</div>*/}
                {/*</div>*/}
                {/*<div className={`${prefix}-chartsw-order ${prefix}-chartsw-box`}>*/}
                    {/*<OrderInfo/>*/}
                {/*</div>*/}
                {/*<div className={`${prefix}-chartsw-painfo ${prefix}-chartsw-box`}>*/}
                    {/*<PAInfo title='产品情况一览' subTitle='产品放款金额比例' dataSource={data1}/>*/}
                {/*</div>*/}
                {/*<div className={`${prefix}-chartsw-painfo ${prefix}-chartsw-box`}>*/}
                    {/*<PAInfo title='业绩情况一览' subTitle='总放款金额比例' dataSource={data2}/>*/}
                {/*</div>*/}
                <CheckInitPassWord {...this.props}/>
            </div>
        );
    }
}
