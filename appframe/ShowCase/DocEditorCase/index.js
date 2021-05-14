import React from "react";
import ReactDOM from 'react-dom';
import {Button, Modal, openMask, openDrawer} from '../../../src/components';
import { Input } from 'antd';

const { TextArea } = Input;
import DocEditor from 'doc-editor-react'


export default class DocEditorCase extends React.Component {
    constructor(props) {
        super(props);
        this.editor = {};
        this.initValue = '<p style="overflow-wrap: normal; padding: 0px; margin-top: 0px; margin-bottom: 10px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255); text-align: center;"><strong><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 36px;">个人贷款调查报告</span></strong></p><p style="overflow-wrap: normal; padding: 0px; margin-top: 0px; margin-bottom: 10px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><strong><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 36px;"><br/></span></strong></p><p><span style="text-indent: 2rem; font-size: 20px;"></span></p><h1 style="white-space: normal; overflow-wrap: normal; padding: 0px; margin-top: 0px; margin-bottom: 10px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px;"><span style="text-indent: 2rem; font-size: 20px;">借款申请人概况</span></h1><p style="overflow-wrap: normal; padding: 0px; margin-top: 0px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255); margin-bottom: 25px; line-height: 2em;"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">借款申请人（姓名）<input value="测试用11户" style="background: rgb(255, 255, 255); cursor: text; width: 100px;" desc="姓名" contenteditable="false" class="form-component form-text" id="103" onmouseover="document.__showFormPop(event, &#39;103&#39;)" placeholder="姓名" name="applyName"/>,性别<span requestdata="{}" type="staticData" desc="性别" style="background: #FFFFFF; cursor: text;" contenteditable="false" class="form-component form-radio" id="52" onmouseover="document.__showFormPop(event, &#39;52&#39;)" value="2" options="男,1;女,2" name="sex"><label><input name="sex" type="radio" value="1"/>男</label><label><input name="sex" type="radio" value="2" checked="checked"/>女</label></span>,年龄<input value="30" style="width: 50px; background: rgb(255, 255, 255); cursor: text;" desc="年龄" contenteditable="false" class="form-component form-text" id="33" onmouseover="document.__showFormPop(event, &#39;33&#39;)" placeholder="年龄" name="age"/>,身份证号码<input placeholder="身份证号码" value="1111" style="width: 200px; background: rgb(255, 255, 255); cursor: text;" desc="身份证号码" contenteditable="false" class="form-component form-text" id="50" onmouseover="document.__showFormPop(event, &#39;50&#39;)" name="idCardNumber"/>,户籍所在地<input placeholder="户籍所在地" value="1111" style="width: 200px; background: rgb(255, 255, 255); cursor: text;" desc="户籍所在地" contenteditable="false" class="form-component form-text" id="13" onmouseover="document.__showFormPop(event, &#39;13&#39;)" name="address"/>,财产共有人（含配偶）为（姓名）<input placeholder="财产共有人" value="11" style="width: 100px; background: rgb(255, 255, 255); cursor: text;" desc="财产共有人" contenteditable="false" class="form-component form-text" id="20" onmouseover="document.__showFormPop(event, &#39;20&#39;)" name="coOwnerOfProperty"/>,供养人口共<input placeholder="供养人口" value="22" style="width: 60px; background: rgb(255, 255, 255); cursor: text;" desc="供养人口" contenteditable="false" class="form-component form-text" id="27" onmouseover="document.__showFormPop(event, &#39;27&#39;)" name="supportingPopulation"/>人。本次借款用途为<input placeholder="本次借款用途" value="买房" style="width: 150px; background: rgb(255, 255, 255); cursor: text;" desc="本次借款用途" contenteditable="false" class="form-component form-text" id="38" onmouseover="document.__showFormPop(event, &#39;38&#39;)" name="usageOfLoan"/>,现已支付首期款<input placeholder="首期款" value="500000" style="width: 100px; background: rgb(255, 255, 255); cursor: text;" desc="首期款" contenteditable="false" class="form-component form-text" id="49" onmouseover="document.__showFormPop(event, &#39;49&#39;)" name="downpayment" format="0,0.00"/>元，占所购资产总价元的<input placeholder="占比" value="50" style="width: 50px; background: rgb(255, 255, 255); cursor: text;" desc="占比" contenteditable="false" class="form-component form-text" id="56" onmouseover="document.__showFormPop(event, &#39;56&#39;)" name="assetsRatio" format="0.00"/>%,申请个人贷款金额为<input placeholder="金额" value="500000" style="width: 100px; background: rgb(255, 255, 255); cursor: text;" desc="金额" contenteditable="false" class="form-component form-text" id="67" onmouseover="document.__showFormPop(event, &#39;67&#39;)" name="amountOfLoans" format="0,0.00"/>元，期限<input placeholder="期限" value="20" style="width: 50px; background: rgb(255, 255, 255); cursor: text;" desc="期限" contenteditable="false" class="form-component form-text" id="74" onmouseover="document.__showFormPop(event, &#39;74&#39;)" name="timeLimit"/>年，借款额度占所购资产总价的<input placeholder="占比" value="50" style="width: 50px; background: rgb(255, 255, 255); cursor: text;" desc="占比" contenteditable="false" class="form-component form-text" id="81" onmouseover="document.__showFormPop(event, &#39;81&#39;)" name="borrowingRatio" format="0.00"/>%.</span></p><h1 style="overflow-wrap: normal; padding: 0px; margin-top: 0px; margin-bottom: 10px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal;"><span style="text-indent: 2rem; font-size: 20px;">借款申请人还款保障状况</span></h1><p style="overflow-wrap: normal; padding: 0px; margin-top: 0px; margin-bottom: 10px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255); line-height: 2em;"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">1、根据借款申请人提供的资料，经本人实地调查核实后，其经济收入（月）<input placeholder="月收入" value="10000" style="width: 80px; background: rgb(255, 255, 255); cursor: text;" desc="月收入" contenteditable="false" class="form-component form-text" id="92" onmouseover="document.__showFormPop(event, &#39;92&#39;)" name="monthlyIncome" format="0,0.00"/>元，加上配偶收入（月）<input placeholder="月收入" value="5000" style="width: 80px; background: rgb(255, 255, 255); cursor: text;" desc="月收入" contenteditable="false" class="form-component form-text" id="1000" onmouseover="document.__showFormPop(event, &#39;1000&#39;)" name="monthlyIncomeOfSpouse" format="0,0.00"/>元，家庭月收入合计为元，而借款申请人按月支付我行贷款本息为元，占月收入的<input placeholder="占比" value="30" style="width: 50px; background: rgb(255, 255, 255); cursor: text;" desc="占比" contenteditable="false" class="form-component form-text" id="124" onmouseover="document.__showFormPop(event, &#39;124&#39;)" name="monthlyIncomeRatio" format="0.00"/>%,因此本人认为借款申请人经济状况较好，收入较稳定，第一还款来源充足。</span></p><p style="overflow-wrap: normal; padding: 0px; margin-top: 0px; margin-bottom: 10px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">2、借款申请人以作为借款的（<checkbox requestdata="{}" type="staticData" style="background: rgb(255, 255, 255); cursor: text;" contenteditable="false" class="form-component form-checkbox" id="146" onmouseover="document.__showFormPop(event, &#39;146&#39;)" value="2" options="保证,1;抵押,2;质押,3" name="guaranteeMode" desc="担保方式"><label><input name="guaranteeMode" type="checkbox" value="1"/>保证</label><label><input name="guaranteeMode" type="checkbox" value="2" checked="checked"/>抵押</label><label><input name="guaranteeMode" type="checkbox" value="3"/>质押</label></checkbox>）担保，第二还款来源充足，有关手续合法有效。</span></p><p style="overflow-wrap: normal; padding: 0px; margin-top: 0px; margin-bottom: 10px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">保证人（姓名），评定得分为<input placeholder="评分" value="80" style="width: 50px; background: rgb(255, 255, 255); cursor: text;" desc="评分" contenteditable="false" class="form-component form-text" id="131" onmouseover="document.__showFormPop(event, &#39;131&#39;)" name="grade" format="0.0"/>分；</span></p><p style="overflow-wrap: normal; padding: 0px; margin-top: 0px; margin-bottom: 10px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">抵押物为，评估价值为<input placeholder="价值" value="100000" style="width: 100px; background: rgb(255, 255, 255); cursor: text;" desc="价值" contenteditable="false" class="form-component form-text" id="155" onmouseover="document.__showFormPop(event, &#39;155&#39;)" name="valueOfEstateUnderMortgage" format="0,0.00"/>元；</span></p><p style="overflow-wrap: normal; padding: 0px; margin-top: 0px; margin-bottom: 10px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">质物为，质物价值<input placeholder="价值" value="100000" style="width: 100px; background: rgb(255, 255, 255); cursor: text;" desc="价值" contenteditable="false" class="form-component form-text" id="162" onmouseover="document.__showFormPop(event, &#39;162&#39;)" name="qualityValue" format="0,0.00"/>元；</span></p><p style="overflow-wrap: normal; padding: 0px; margin-top: 0px; margin-bottom: 10px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">3、借款申请人负债金额<input placeholder="金额" value="100000" style="width: 100px; background: rgb(255, 255, 255); cursor: text;" desc="金额" contenteditable="false" class="form-component form-text" id="169" onmouseover="document.__showFormPop(event, &#39;169&#39;)" name="amountOfLiabilities" format="0,0.00"/>,占家庭年收入的<input placeholder="占比" value="20" style="width: 50px; background: rgb(255, 255, 255); cursor: text;" desc="占比" contenteditable="false" class="form-component form-text" id="176" onmouseover="document.__showFormPop(event, &#39;176&#39;)" name="debtRatio" format="0.00"/>%,处于（<span requestdata="{}" type="staticData" desc="负债状况" style="background: #FFFFFF; cursor: text;" contenteditable="false" class="form-component form-radio" id="188" onmouseover="document.__showFormPop(event, &#39;188&#39;)" value="2" options="过度,1;适度,2" name="indebtedness "><label><input name="indebtedness" type="radio" value="1"/>过度</label><label><input name="indebtedness" type="radio" value="2" checked="checked"/>适度</label></span>）负债状况。</span></p><h1 style="overflow-wrap: normal; padding: 0px; margin-top: 0px; margin-bottom: 10px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal;"><span style="text-indent: 2rem; font-size: 20px;">借款人综合分析</span></h1><p style="overflow-wrap: normal; padding: 0px; margin-top: 0px; margin-bottom: 10px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">1、借款申请人向本行提交的购销合同及其首期款收据，借款申请人及配偶身份证明、经济收入证明、财产共有人出具的申明书，经律师协查，本人核实，均为真实、合法、有效。</span></p><p style="overflow-wrap: normal; padding: 0px; margin-top: 0px; margin-bottom: 10px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">2、本人经电话查询、实地走访，借款申请人基本情况如下：</span></p><p style="overflow-wrap: normal; padding: 0px; margin-top: 0px; margin-bottom: 10px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">1）现居住房系：<span requestdata="{}" type="staticData" desc="居住房系" style="background: #FFFFFF; cursor: text;" contenteditable="false" class="form-component form-radio" id="195" onmouseover="document.__showFormPop(event, &#39;195&#39;)" value="3" options="自有房,1;租住房,2;无房,3" name="housingDepartment"><label><input name="housingDepartment" type="radio" value="1"/>自有房</label><label><input name="housingDepartment" type="radio" value="2"/>租住房</label><label><input name="housingDepartment" type="radio" value="3" checked="checked"/>无房</label></span></span></p><p style="overflow-wrap: normal; padding: 0px; margin-top: 0px; margin-bottom: 10px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">其现居住房详细地址：<input placeholder="居住详细地址" value="的身份是的范德萨" style="width: 200px; background: rgb(255, 255, 255); cursor: text;" desc="居住详细地址" contenteditable="false" class="form-component form-text" id="203" onmouseover="document.__showFormPop(event, &#39;203&#39;)" name="fullAddress"/>,已居住<input placeholder="居住年限" value="5" style="width: 60px; background: rgb(255, 255, 255); cursor: text;" desc="居住年限" contenteditable="false" class="form-component form-text" id="209" onmouseover="document.__showFormPop(event, &#39;209&#39;)" name="lengthOfResidence"/>年；</span></p><p style="overflow-wrap: normal; padding: 0px; margin-top: 0px; margin-bottom: 10px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">2）现工作单位为：<input placeholder="工作单位" value="是的发送到" style="width: 100px; background: rgb(255, 255, 255); cursor: text;" desc="工作单位" contenteditable="false" class="form-component form-text" id="220" onmouseover="document.__showFormPop(event, &#39;220&#39;)" name="company"/>,在现单位工作时间为<input placeholder="工作年限" value="5" style="width: 60px; background: rgb(255, 255, 255); cursor: text;" desc="工作年限" contenteditable="false" class="form-component form-text" id="227" onmouseover="document.__showFormPop(event, &#39;227&#39;)" name="workingSeniority"/>年；</span></p><p style="overflow-wrap: normal; padding: 0px; margin-top: 0px; margin-bottom: 10px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">3）现有效联系方式（住宅电话）：<input placeholder="住宅电话" value="222222" style="width: 100px; background: rgb(255, 255, 255); cursor: text;" desc="住宅电话" contenteditable="false" class="form-component form-text" id="235" onmouseover="document.__showFormPop(event, &#39;235&#39;)" name="homePhone"/>;其它方式<input placeholder="其他方式" value="111111" style="width: 100px; background: rgb(255, 255, 255); cursor: text;" desc="其他方式" contenteditable="false" class="form-component form-text" id="242" onmouseover="document.__showFormPop(event, &#39;242&#39;)" name="otherPhone"/>;</span></p><p style="overflow-wrap: normal; padding: 0px; margin-top: 0px; margin-bottom: 10px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">4）学历（职称）为：<span requestdata="{}" type="staticData" desc="学历" style="background: #FFFFFF; cursor: text;" contenteditable="false" class="form-component form-radio" id="249" onmouseover="document.__showFormPop(event, &#39;249&#39;)" value="3" options="博士（注册资格）,1;硕士（高级职称）,2;本科（中级职称）,3;大专（初级职称或有特殊技能）,4;中专以下,5" name="recordOfFormalSchooling"><label><input name="recordOfFormalSchooling" type="radio" value="1"/>博士（注册资格）</label><label><input name="recordOfFormalSchooling" type="radio" value="2"/>硕士（高级职称）</label><label><input name="recordOfFormalSchooling" type="radio" value="3" checked="checked"/>本科（中级职称）</label><label><input name="recordOfFormalSchooling" type="radio" value="4"/>大专（初级职称或有特殊技能）</label><label><input name="recordOfFormalSchooling" type="radio" value="5"/>中专以下</label></span></span></p><p style="overflow-wrap: normal; padding: 0px; margin-top: 0px; margin-bottom: 10px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">5）信用卡：<span requestdata="{}" type="staticData" desc="信用卡" style="background: #FFFFFF; cursor: text;" contenteditable="false" class="form-component form-radio" id="14" onmouseover="document.__showFormPop(event, &#39;14&#39;)" value="1" options="有,1;无,2" name="creditCard"><label><input name="creditCard" type="radio" value="1" checked="checked"/>有</label><label><input name="creditCard" type="radio" value="2"/>无</label></span> <span style="color: #333333; font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; text-indent: 32px; background-color: #FFFFFF;">卡号<input placeholder="卡号" value="12222222" style="width: 200px; background: rgb(255, 255, 255); cursor: text;" desc="卡号" contenteditable="false" class="form-component form-text" id="24" onmouseover="document.__showFormPop(event, &#39;24&#39;)" name="creditCardNumber"/></span>；</span></p><p style="overflow-wrap: normal; padding: 0px; margin-top: 0px; margin-bottom: 10px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">6）基本生活设施有：<checkbox requestdata="{}" type="staticData" style="background: rgb(255, 255, 255); cursor: text;" contenteditable="false" class="form-component form-checkbox" id="35" onmouseover="document.__showFormPop(event, &#39;35&#39;)" value="1,2,3" options="彩电,1;冰箱,2;空调,3;电话,4;钢琴,5;音响,6;洗衣机,7;其他大件耐用消费品,8" name="amenities" desc="基本生活设施"><label><input name="amenities" type="checkbox" value="1" checked="checked"/>彩电</label><label><input name="amenities" type="checkbox" value="2" checked="checked"/>冰箱</label><label><input name="amenities" type="checkbox" value="3" checked="checked"/>空调</label><label><input name="amenities" type="checkbox" value="4"/>电话</label><label><input name="amenities" type="checkbox" value="5"/>钢琴</label><label><input name="amenities" type="checkbox" value="6"/>音响</label><label><input name="amenities" type="checkbox" value="7"/>洗衣机</label><label><input name="amenities" type="checkbox" value="8"/>其他大件耐用消费品</label></checkbox></span></p><p style="overflow-wrap: normal; padding: 0px; margin-top: 0px; margin-bottom: 10px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">7）身体健康状况：<span requestdata="{}" type="staticData" desc="身体健康状况" style="background: #FFFFFF; cursor: text;" contenteditable="false" class="form-component form-radio" id="43" onmouseover="document.__showFormPop(event, &#39;43&#39;)" value="1" options="良好,1;一般,2;较差,3" name="healthCondition"><label><input name="healthCondition" type="radio" value="1" checked="checked"/>良好</label><label><input name="healthCondition" type="radio" value="2"/>一般</label><label><input name="healthCondition" type="radio" value="3"/>较差</label></span></span></p><p style="overflow-wrap: normal; padding: 0px; margin-top: 0px; margin-bottom: 10px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">8）不良嗜好：<span requestdata="{}" type="staticData" desc="不良嗜好" style="background: #FFFFFF; cursor: text;" contenteditable="false" class="form-component form-radio" id="51" onmouseover="document.__showFormPop(event, &#39;51&#39;)" value="2" options="有,1;无,2" name="badHabit"><label><input name="badHabit" type="radio" value="1"/>有</label><label><input name="badHabit" type="radio" value="2" checked="checked"/>无</label></span></span></p><p style="overflow-wrap: normal; padding: 0px; margin-top: 0px; margin-bottom: 10px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">9）不良信用记录：a、有（<checkbox requestdata="{}" type="staticData" style="background: rgb(255, 255, 255); cursor: text;" contenteditable="false" class="form-component form-checkbox" id="58" onmouseover="document.__showFormPop(event, &#39;58&#39;)" value="1,2" options="欠水费,1;欠电费,2;欠煤气费,3;欠话费,4;恶意透支,5" name="poorCreditRecord" desc="不良信用记录"><label><input name="poorCreditRecord" type="checkbox" value="1" checked="checked"/>欠水费</label><label><input name="poorCreditRecord" type="checkbox" value="2" checked="checked"/>欠电费</label><label><input name="poorCreditRecord" type="checkbox" value="3"/>欠煤气费</label><label><input name="poorCreditRecord" type="checkbox" value="4"/>欠话费</label><label><input name="poorCreditRecord" type="checkbox" value="5"/>恶意透支</label></checkbox>）b、无</span></p><p style="overflow-wrap: normal; padding: 0px; margin-top: 0px; margin-bottom: 10px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">四、其它需要说明的情况<input placeholder="其他需要说明的情况" value="暂无" style="width: 300px; background: rgb(255, 255, 255); cursor: text;" desc="其他需要说明的情况" contenteditable="false" class="form-component form-text" id="68" onmouseover="document.__showFormPop(event, &#39;68&#39;)" name="otherComment"/>.</span></p><p style="overflow-wrap: normal; padding: 0px; margin-top: 0px; margin-bottom: 10px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">五、综合意见</span></p><p style="overflow-wrap: normal; padding: 0px; margin-top: 0px; margin-bottom: 10px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">根据以上调查，经本人核实、评定，借款申请人综合得分为分<input placeholder="得分" value="75" style="width: 50px; background: rgb(255, 255, 255); cursor: text;" desc="得分" contenteditable="false" class="form-component form-text" id="75" onmouseover="document.__showFormPop(event, &#39;75&#39;)" name="overallScore" format="0.0"/>,其第一和第二还款来源均有保障，符合个人贷款条，贷款安全性、流动性和效益性良好。本人拟同意对借款申请人（姓名）<input placeholder="姓名" value="测试用11户" style="width: 100px; background: rgb(255, 255, 255); cursor: text;" desc="姓名" contenteditable="false" class="form-component form-text" id="82" onmouseover="document.__showFormPop(event, &#39;82&#39;)" name="applyNameAgain"/>发放个人消费贷款（金额）<input placeholder="金额" value="1000000" style="width: 100px; background: rgb(255, 255, 255); cursor: text;" desc="金额" contenteditable="false" class="form-component form-text" id="89" onmouseover="document.__showFormPop(event, &#39;89&#39;)" name="totalLending" format="0,0.00"/>元，贷款成数为<input placeholder="成数" value="5" style="width: 50px; background: rgb(255, 255, 255); cursor: text;" desc="成数" contenteditable="false" class="form-component form-text" id="96" onmouseover="document.__showFormPop(event, &#39;96&#39;)" name="loanToValue"/>成，贷款期限<input placeholder="期限" value="20" style="width: 50px; background: rgb(255, 255, 255); cursor: text;" desc="期限" contenteditable="false" class="form-component form-text" id="998" onmouseover="document.__showFormPop(event, &#39;998&#39;)" name="realityTimeLimit"/>年，（自<span style="background: #FFFFFF" contenteditable="false" enddate="2039-06-21" startdate="2019-06-21" class="form-component form-datepicker flatpickr-input" id="997" onmouseover="document.__showFormPop(event, &#39;997&#39;)" onclick="document.__showFormDate(event, &#39;997&#39;)" value="1561046400000" desc="贷款开始时间" name="loanStartDate" format="YYYY-MM-DD" readonly="readonly">2019-06-21</span>至<span style="background: #FFFFFF" contenteditable="false" enddate="2039-07-01" startdate="2039-06-21" class="form-component form-datepicker flatpickr-input" id="214" onmouseover="document.__showFormPop(event, &#39;214&#39;)" onclick="document.__showFormDate(event, &#39;214&#39;)" value="2192198400000" desc="贷款结束时间" name="loanEndDate" readonly="readonly" format="YYYY-MM-DD">2039-06-21</span>），年利率<input placeholder="年利率" value="5" style="width: 50px; background: rgb(255, 255, 255); cursor: text;" desc="年利率" contenteditable="false" class="form-component form-text" id="157" onmouseover="document.__showFormPop(event, &#39;157&#39;)" name="rate" format="0.00"/>%.同时在贷款审批完毕后，本人将及时办妥抵押登记及保险等相关手续，从而全面防范贷款风险。</span></p><p style="overflow-wrap: normal; padding: 0px; margin-top: 0px; margin-bottom: 10px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">调查人（签字）：</span></p><p style="overflow-wrap: normal; padding: 0px; margin-top: 0px; margin-bottom: 10px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="background: #FFFFFF" contenteditable="false" enddate="2019-07-01" startdate="2019-06-21" class="form-component form-datepicker flatpickr-input" id="177" onmouseover="document.__showFormPop(event, &#39;177&#39;)" onclick="document.__showFormDate(event, &#39;177&#39;)" value="1561046400000" desc="签字日期" name="signDate" format="YYYY-MM-DD" readonly="readonly">2019-06-21</span></p><p><br/></p>';
    }
    componentDidMount() {
        this.textArea = ReactDOM.findDOMNode(this.textArea);
    }

    getContent = () => {
        this.textArea.value = this.editor.getContent();
    }
    setContent = () => {
        this.editor.setContent(this.textArea.value);
    }
    getFormData = () => {
        this.textArea.value = JSON.stringify(this.editor.getFormData(), null, 2);
    }
    setFormData = () => {
        const data = JSON.parse(this.textArea.value);
        this.editor.setFormData(data);
    }

    setModel = (model) => {
        if(model === 'READONLY'){
            this.editor.setToolbarVisible(false);
        }else{
            this.editor.setToolbarVisible(true);
        }
        this.editor.setModel(model);
    }

    setWatermark = () => {
        this.editor.setWatermark("水印测试");
    }

    openNavCatalogList = () => {
        this.editor.setNavCatalogListVisible();
    }
    editorDidMount = (editor) => {
        this.editor = editor;
        /*
            this.editor.setToolbarButtonVisible(buttonName, visible)

            按钮列表：
                drafts 草稿箱
                undo 撤销
                redo 恢复
                fontfamily 字体
                paragraph 段落
                removeformat 清除格式
                formatmatch 格式刷
                fontsize 字体大小
                up 增大字体
                down 减小字体
                superscript 上标
                subscript 下标
                bold 加粗
                italic 倾斜
                underline 下划线
                strikethrough 删除线
                forecolor 字体颜色
                backcolor 背景颜色
                insertorderedlist 有序列表
                insertunorderedlist 无序列表
                rowspacingtop 段前距
                rowspacingbottom 段后距
                lineheight 行高
                justifyleft 向左
                justifycenter 居中
                justifyright 向右
                justify 两端
                blockquote 引用
                indentupdateincrease 增加缩进
                indentupdatedecrease 减少缩进
                pagebreak 分页符
                spechars 字符
                link 添加链接
                unlink 取消链接
                insertimage 图片管理
                simpleupload 插入图片
                emotion 表情
                snapscreen 截屏
                scrawl 涂鸦
                inserttable 表格
                kityformula 公式
                revisestatus 批注
                deletetable 删除表格
                insertrow 插入行
                insertcol 插入列
                deleterow 删除行
                deletecol 删除列
                mergecells 合并单元格
                mergeright 向右合并单元格
                mergedown 向下合并单元格
                splittocells 拆分单元格
                splittorows 拆分单元格成列
                splittocols 拆分单元格成行
                cellvaligntop 顶端对其
                cellvalignmiddle 垂直居中
                cellvalignbottom 底端对其
                cellalignleft 左对齐
                cellaligncenter 居中
                cellalignright 右对齐
                tableborderconfig 表格样式
                tablelowerframeline 下框线
                tableupperframeline 上框线
                tableleftframeline 左框线
                tablerightframeline 右框线
                tablenoborder 无框线
                tableinternaltransverseline 内部横线
                tableinternalverticalline 内部竖线
                tableinsideborder 内部框线
                tablelateralframeline 外侧框线
                tableallframelines 所有框线
                showindex 显示目录
                setrevisestatus 显示批注/修订
                preview 预览文档
                print 普通打印
                searchreplace 查找替换
                insertlabel 标签控件
                inserttext 文本控件
                insertselect 下拉选择
                insertdate 日期控件
                insertradio 单选框
                insertcheckbox 复选框
                modelconfig 模式设置
                save 保存

        */
    };
    onSave = (html, data) => {
        // html 编辑器的htm内容
        // form 编辑器的表单内容
        console.log(html, data);
    };
    _openMask = () => {
        openMask(<div style={{width: 1000, background: '#FFFFFF', margin: '0 auto'}}>
            <DocEditor
              editorDidMount={this.editorDidMount}
              onSave={this.onSave}
              initialContent={this.initValue}
              initialFrameHeight={document.documentElement.clientHeight - 190}
            />
        </div>, {
            onClose: () => {
                // 关闭确认操作
                return new Promise((resolve, reject) => {
                    if (this.editor.getContent() !== this.initValue) {
                        // 目前只是对html进行判断，后面可自已对前后的表单数据进行判断，都是相同的原理
                        Modal.confirm({
                            title: '关闭确认',
                            content: `当前编辑器内容已经发生了变化，是否关闭！`,
                            okText: '关闭',
                            cancelText: '取消',
                            onOk() {
                                resolve();
                            },
                        });
                    } else {
                        resolve();
                    }
                });
            }
        })
    };
    _openDrawer = () => {
        openDrawer(<DocEditor
          editorDidMount={this.editorDidMount}
          onSave={this.onSave}
          initialContent={this.initValue}
          initialFrameHeight={document.documentElement.clientHeight - 300}
        />, {
            width: 1065
        });
    };
    render() {
        return (
            <div>
                <div style={{display: 'inline-block'}}>
                <DocEditor editorDidMount={this.editorDidMount} onSave={this.onSave} initialContent={this.initValue}/>
                </div>
                <div style={{display: 'inline-block',verticalAlign: 'top'}}>
                    <div>
                        <Button onClick={()=>this.getContent()}>获取内容</Button>
                        <Button onClick={()=>this.setContent()}>设置内容</Button>
                        <Button onClick={()=>this.getFormData()}>取表单值</Button>
                        <Button onClick={()=>this.setFormData()}>设表单值</Button>
                    </div>
                    <div>
                        <Button onClick={()=>this.setModel('READONLY')}>阅读模式</Button>
                        <Button onClick={()=>this.setModel('EDITOR')}>编辑模式</Button>
                        <Button onClick={()=>this.setModel('DESIGN')}>设计模式</Button>
                    </div>
                    <div>
                        <Button onClick={this.setWatermark}>设置水印</Button>
                        <Button onClick={this.openNavCatalogList}>打开或关闭目录</Button>
                    </div>
                    <div>
                        <Button onClick={this._openMask}>弹窗打开</Button>
                        <Button onClick={this._openDrawer}>侧滑打开</Button>
                    </div>
                    <div>
                        <TextArea style={{width: 500}} ref={instance => this.textArea = instance} autosize={{ minRows: 15, maxRows: 20 }}>
                            {}
                        </TextArea>
                    </div>
                </div>
            </div>
        );
    }
}
