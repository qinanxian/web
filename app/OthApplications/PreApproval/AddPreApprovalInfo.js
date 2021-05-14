import React from "react";

import {replace,Row, Col, DetailInfo, Message, openModal, Modal, Icon, TimeRangPicker} from '../../../src/components';
import NewNetWorkInfo from "../../CodeToDo/NetWork/NewNetWorkInfo";

import './index.less';
export default class AddPreApprovalInfo extends React.Component {


  constructor(props) {
    super(props);
    const {loanId} = props;
    this.loanId = loanId;
    this.state = {
      numberbank: '',
      numberbankcolor:'',
    }
  }


  dataReady = (voInfo) => {
    this.voInfo = voInfo;
    this.voInfo.setValue("confirmStatus", "1");
  };

  InfoAdd = (cb) => {
      this.voInfo.saveData((err, values) => {
        if (err) {
          Message.error(err.message);
        } else {
          const {refresh} = this.props;
          refresh && refresh();
        }
        cb(err, values);
      });
  };

  _onValuesChange = (field, value, allValues) => {
    const {rest} = this.props;
    const { numberbank,numberbankcolor }=this.state;
    if (value && value.loanStatus === '05' && value.loanId !== '') {
      rest.post(`/zry/getPreQuota/${allValues.loanId}`)
        .then((response) => {
          this.voInfo.setValue("preQuota", response)
        }).catch((error) => {
        Message.error("获取错误");
      })
    }
    if (allValues.preQuota > this.voInfo.getValue("preQuota")) {
      Message.error("预授信额度不可大于显示额度");
      this.voInfo.setValue("preQuota", this.voInfo.getValue("preQuota"))
      value && value.preQuota.setState({
        preQuota: this.voInfo.getValue("preQuota")
      })
    }
    if (value && value.loanStatus === '11') {
      this.voInfo.setValue("preQuota", "0.00")
    }
    if(allValues.backAccount !== '' && allValues.backAccount !== null){
      this.setState({
        numberbank:allValues.backAccount
      })
      console.log(numberbank.length+"lihu")
      console.log(numberbank.length > 16 && numberbank.length < 19,"大小")

      if (numberbank.length+1 >= 16 && numberbank.length+1 <= 19) {
        console.log(this.checkBankCard(allValues.backAccount))
        if(this.checkBankCard(allValues.backAccount)===false){
          this.setState({
            numberbank:'',
            numberbankcolor:false
          })
        }else {
          this.setState({
            numberbankcolor:true
          })
        }
      }else {
        this.setState({
          numberbankcolor:false
        })

      }
    }else {
      this.setState({
        numberbankcolor:true
      })
    }
  }


  checkBankCard = (bankCard) => {
    var bankno = bankCard.replace(/\s/g,'');
    if(!bankCard)return false;
    if(bankno == "") {
      return false;
    }
    if(bankno.length < 16 || bankno.length > 19) {
      return false;
    }
    var num = /^\d*$/;//全数字
    if(!num.exec(bankno)) {
      return false;
    }
    //开头6位
    var strBin = "10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";
    if(strBin.indexOf(bankno.substring(0, 2)) == -1) {
      return false;
    }
    //Luhn校验
    if(!this.luhnCheck(bankno)){
      return false;
    }
    return true;
  }
  luhnCheck = (bankno) => {
    var lastNum=bankno.substr(bankno.length-1,1);//取出最后一位（与luhn进行比较）

    var first15Num=bankno.substr(0,bankno.length-1);//前15或18位
    var newArr=new Array();
    for(var i=first15Num.length-1;i>-1;i--){    //前15或18位倒序存进数组
      newArr.push(first15Num.substr(i,1));
    }
    var arrJiShu=new Array();  //奇数位*2的积 <9
    var arrJiShu2=new Array(); //奇数位*2的积 >9

    var arrOuShu=new Array();  //偶数位数组
    for(var j=0;j<newArr.length;j++){
      if((j+1)%2==1){//奇数位
        if(parseInt(newArr[j])*2<9)
          arrJiShu.push(parseInt(newArr[j])*2);
        else
          arrJiShu2.push(parseInt(newArr[j])*2);
      }
      else //偶数位
        arrOuShu.push(newArr[j]);
    }

    var jishu_child1=new Array();//奇数位*2 >9 的分割之后的数组个位数
    var jishu_child2=new Array();//奇数位*2 >9 的分割之后的数组十位数
    for(var h=0;h<arrJiShu2.length;h++){
      jishu_child1.push(parseInt(arrJiShu2[h])%10);
      jishu_child2.push(parseInt(arrJiShu2[h])/10);
    }
    var sumJiShu=0; //奇数位*2 < 9 的数组之和
    var sumOuShu=0; //偶数位数组之和
    var sumJiShuChild1=0; //奇数位*2 >9 的分割之后的数组个位数之和
    var sumJiShuChild2=0; //奇数位*2 >9 的分割之后的数组十位数之和
    var sumTotal=0;
    for(var m=0;m<arrJiShu.length;m++){
      sumJiShu=sumJiShu+parseInt(arrJiShu[m]);
    }

    for(var n=0;n<arrOuShu.length;n++){
      sumOuShu=sumOuShu+parseInt(arrOuShu[n]);
    }

    for(var p=0;p<jishu_child1.length;p++){
      sumJiShuChild1=sumJiShuChild1+parseInt(jishu_child1[p]);
      sumJiShuChild2=sumJiShuChild2+parseInt(jishu_child2[p]);
    }
    //计算总和
    sumTotal=parseInt(sumJiShu)+parseInt(sumOuShu)+parseInt(sumJiShuChild1)+parseInt(sumJiShuChild2);

    //计算luhn值
    var k= parseInt(sumTotal)%10==0?10:parseInt(sumTotal)%10;
    var luhn= 10-k;

    if(lastNum==luhn){
      return true;
    }else{
      return false;
    }
  }




  render() {
    const { numberbankcolor }=this.state;
    return (
      <div>
        <DetailInfo
          dataFormId="othapplications-AddPreApproval"
          params={{loanId: this.loanId}}
          reading={false}
          dataReady={this.dataReady}
          labelWidth={158}
          onValuesChange={this._onValuesChange}
        />
        {
          numberbankcolor==false ? <div className="xw-nihao">注:请输入完成银行卡卡号</div> : <div className="xw-nihao"></div>
        }


      </div>
    );
  }

}
