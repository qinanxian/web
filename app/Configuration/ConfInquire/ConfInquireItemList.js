import React from "react";
import {
    DataTable,
    Message,
    openModal,
    Iframe,
    Modal,
    Upload,
    Download,
    Icon,
    LinkButton,
    Divider,
    propsCompose, CellRef, openMask
} from '../../../src/components';
import ConfInquireItemInfo from './ConfInquireItemInfo'
import ConfInquireDocEditor from './ConfInquireDocEditor'
import DocEditor from "doc-editor-react";

@propsCompose
export default class ConfInquireItemList extends React.Component {
    static ConfInquireItemInfo = ConfInquireItemInfo;
    static ConfInquireDocEditor = ConfInquireDocEditor;

    constructor(props) {
        super(props);
        this.editorInitContent = "";
        this.headerRender = (meta, dict) => {
            return (
                <tr>
                    <th>
                        <div><CellRef name="itemDefKey"/></div>
                        <div><CellRef name="sortCode"/></div>
                    </th>
                    <th>
                        <div><CellRef name="itemName"/></div>
                    </th>
                    <th>操作</th>
                </tr>
            );
        };
        this.bodyRowRender = (row, index) => {
            return (
                <tr>
                    <td>
                        <div><CellRef name="itemDefKey"/></div>
                        <div><CellRef name="sortCode"/></div>
                    </td>
                    <td>
                        <div><CellRef name="itemName"/></div>
                    </td>
                    <td>
                        <LinkButton icon={"fa-pencil-square-o"} onClick={() => this.openDocEditor(row)}>模板</LinkButton>
                        <Divider type="vertical"/>
                        <LinkButton icon={"fa-trash-o"} onClick={() => {
                            this.deleteItem(row)
                        }}>删除</LinkButton>
                    </td>
                </tr>
            );
        }
    }

    editorDidMount = (editor) => {
        this.editor = editor;
    };

    saveDocEditorContent = (itemDefId, html, data) => {
        console.log(itemDefId, html, data);
        const {rest} = this.props;

        let dataObject = {contentRaw: html, contentData: data};
        rest.post(`/conf/dossier/saveMediaText/${itemDefId}`, dataObject)
            .then((ret) => {
                this.editorInitContent = html;
                Message.success("保存成功！");
            });
    }


    openDocEditor = (row) => {
        const {rest} = this.props;

        const itemDefId = row.itemDefId;
        rest.get(`/conf/dossier/getMediaText/${itemDefId}`).then((ret) => {
            this.editorInitContent = ret.contentRaw ||'';
            // this.editorInitContent = '<p style="margin-top: 0px; margin-bottom: 10px; overflow-wrap: normal; padding: 0px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255); text-align: center;"><strong><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 36px;">个人贷款调查报告</span></strong></p><p style="margin-top: 0px; margin-bottom: 10px; overflow-wrap: normal; padding: 0px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><strong><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 36px;"><br/></span></strong></p><p><span style="text-indent: 2rem; font-size: 20px;"></span></p><h1 style="white-space: normal; overflow-wrap: normal; padding: 0px; margin-top: 0px; margin-bottom: 10px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px;"><span style="text-indent: 2rem; font-size: 20px;">借款申请人概况</span></h1><p style="margin-top: 0px; margin-bottom: 25px; overflow-wrap: normal; padding: 0px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255); line-height: 2em;"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">借款申请人（姓名）<input value="测试用11户" desc="姓名" contenteditable="false" class="form-component form-text" id="103" placeholder="姓名" name="applyName" style="cursor: text; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial; width: 100px;" onmouseover="document.__showFormPop(event, &#39;103&#39;)"/>,性别<span requestdata="{}" type="staticData" desc="性别" contenteditable="false" class="form-component form-radio" id="52" value="2" options="男,1;女,2" name="sex" style="cursor: text; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;52&#39;)"><label><input name="sex" type="radio" value="1"/>男</label><label><input name="sex" type="radio" value="2" checked="checked"/>女</label></span>,年龄<input value="30" desc="年龄" contenteditable="false" class="form-component form-text" id="33" placeholder="年龄" name="age" style="cursor: text; width: 50px; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;33&#39;)"/>,身份证号码<input placeholder="身份证号码" value="1111" desc="身份证号码" contenteditable="false" class="form-component form-text" id="50" name="idCardNumber" style="cursor: text; width: 200px; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;50&#39;)"/>,户籍所在地<input placeholder="户籍所在地" value="1111" desc="户籍所在地" contenteditable="false" class="form-component form-text" id="13" name="address" style="cursor: text; width: 200px; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;13&#39;)"/>,财产共有人（含配偶）为（姓名）<input placeholder="财产共有人" value="11" desc="财产共有人" contenteditable="false" class="form-component form-text" id="20" name="coOwnerOfProperty" style="cursor: text; width: 100px; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;20&#39;)"/>,供养人口共<input placeholder="供养人口" value="22" desc="供养人口" contenteditable="false" class="form-component form-text" id="27" name="supportingPopulation" style="cursor: text; width: 60px; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;27&#39;)"/>人。本次借款用途为<input placeholder="本次借款用途" value="买房" desc="本次借款用途" contenteditable="false" class="form-component form-text" id="38" name="usageOfLoan" style="cursor: text; width: 150px; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;38&#39;)"/>,现已支付首期款<input placeholder="首期款" value="500000" desc="首期款" contenteditable="false" class="form-component form-text" id="49" name="downpayment" format="0,0.00" style="cursor: text; width: 100px; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;49&#39;)"/>元，占所购资产总价元的<input placeholder="占比" value="50" desc="占比" contenteditable="false" class="form-component form-text" id="56" name="assetsRatio" format="0.00" style="cursor: text; width: 50px; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;56&#39;)"/>%,申请个人贷款金额为<input placeholder="金额" value="500000" desc="金额" contenteditable="false" class="form-component form-text" id="67" name="amountOfLoans" format="0,0.00" style="cursor: text; width: 100px; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;67&#39;)"/>元，期限<input placeholder="期限" value="20" desc="期限" contenteditable="false" class="form-component form-text" id="74" name="timeLimit" style="cursor: text; width: 50px; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;74&#39;)"/>年，借款额度占所购资产总价的<input placeholder="占比" value="50" desc="占比" contenteditable="false" class="form-component form-text" id="81" name="borrowingRatio" format="0.00" style="cursor: text; width: 50px; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;81&#39;)"/>%.</span></p><h1 style="overflow-wrap: normal; padding: 0px; margin-top: 0px; margin-bottom: 10px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal;"><span style="text-indent: 2rem; font-size: 20px;">借款申请人还款保障状况</span></h1><p style="margin-top: 0px; margin-bottom: 10px; overflow-wrap: normal; padding: 0px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255); line-height: 2em;"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">1、根据借款申请人提供的资料，经本人实地调查核实后，其经济收入（月）<input placeholder="月收入" value="10000" desc="月收入" contenteditable="false" class="form-component form-text" id="92" name="monthlyIncome" format="0,0.00" style="cursor: text; width: 80px; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;92&#39;)"/>元，加上配偶收入（月）<input placeholder="月收入" value="5000" desc="月收入" contenteditable="false" class="form-component form-text" id="1000" name="monthlyIncomeOfSpouse" format="0,0.00" style="cursor: text; width: 80px; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;1000&#39;)"/>元，家庭月收入合计为元，而借款申请人按月支付我行贷款本息为元，占月收入的<input placeholder="占比" value="30" desc="占比" contenteditable="false" class="form-component form-text" id="124" name="monthlyIncomeRatio" format="0.00" style="cursor: text; width: 50px; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;124&#39;)"/>%,因此本人认为借款申请人经济状况较好，收入较稳定，第一还款来源充足。</span></p><p style="margin-top: 0px; margin-bottom: 10px; overflow-wrap: normal; padding: 0px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">2、借款申请人以作为借款的（<checkbox requestdata="{}" type="staticData" contenteditable="false" class="form-component form-checkbox" id="146" value="2" options="保证,1;抵押,2;质押,3" name="guaranteeMode" desc="担保方式" style="cursor: text; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;146&#39;)"><label><input name="guaranteeMode" type="checkbox" value="1"/>保证</label><label><input name="guaranteeMode" type="checkbox" value="2" checked="checked"/>抵押</label><label><input name="guaranteeMode" type="checkbox" value="3"/>质押</label></checkbox>）担保，第二还款来源充足，有关手续合法有效。</span></p><p style="margin-top: 0px; margin-bottom: 10px; overflow-wrap: normal; padding: 0px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">保证人（姓名），评定得分为<input placeholder="评分" value="80" desc="评分" contenteditable="false" class="form-component form-text" id="131" name="grade" format="0.0" style="cursor: text; width: 50px; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;131&#39;)"/>分；</span></p><p style="margin-top: 0px; margin-bottom: 10px; overflow-wrap: normal; padding: 0px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">抵押物为，评估价值为<input placeholder="价值" value="100000" desc="价值" contenteditable="false" class="form-component form-text" id="155" name="valueOfEstateUnderMortgage" format="0,0.00" style="cursor: text; width: 100px; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;155&#39;)"/>元；</span></p><p style="margin-top: 0px; margin-bottom: 10px; overflow-wrap: normal; padding: 0px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">质物为，质物价值<input placeholder="价值" value="100000" desc="价值" contenteditable="false" class="form-component form-text" id="162" name="qualityValue" format="0,0.00" style="cursor: text; width: 100px; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;162&#39;)"/>元；</span></p><p style="margin-top: 0px; margin-bottom: 10px; overflow-wrap: normal; padding: 0px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">3、借款申请人负债金额<input placeholder="金额" value="100000" desc="金额" contenteditable="false" class="form-component form-text" id="169" name="amountOfLiabilities" format="0,0.00" style="cursor: text; width: 100px; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;169&#39;)"/>,占家庭年收入的<input placeholder="占比" value="20" desc="占比" contenteditable="false" class="form-component form-text" id="176" name="debtRatio" format="0.00" style="cursor: text; width: 50px; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;176&#39;)"/>%,处于（<span requestdata="{}" type="staticData" desc="负债状况" contenteditable="false" class="form-component form-radio" id="188" value="2" options="过度,1;适度,2" name="indebtedness " style="cursor: text; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;188&#39;)"><label><input name="indebtedness" type="radio" value="1"/>过度</label><label><input name="indebtedness" type="radio" value="2" checked="checked"/>适度</label></span>）负债状况。</span></p><h1 style="overflow-wrap: normal; padding: 0px; margin-top: 0px; margin-bottom: 10px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal;"><span style="text-indent: 2rem; font-size: 20px;">借款人综合分析</span></h1><p style="margin-top: 0px; margin-bottom: 10px; overflow-wrap: normal; padding: 0px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">1、借款申请人向本行提交的购销合同及其首期款收据，借款申请人及配偶身份证明、经济收入证明、财产共有人出具的申明书，经律师协查，本人核实，均为真实、合法、有效。</span></p><p style="margin-top: 0px; margin-bottom: 10px; overflow-wrap: normal; padding: 0px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">2、本人经电话查询、实地走访，借款申请人基本情况如下：</span></p><p style="margin-top: 0px; margin-bottom: 10px; overflow-wrap: normal; padding: 0px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">1）现居住房系：<span requestdata="{}" type="staticData" desc="居住房系" contenteditable="false" class="form-component form-radio" id="195" value="3" options="自有房,1;租住房,2;无房,3" name="housingDepartment" style="cursor: text; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;195&#39;)"><label><input name="housingDepartment" type="radio" value="1"/>自有房</label><label><input name="housingDepartment" type="radio" value="2"/>租住房</label><label><input name="housingDepartment" type="radio" value="3" checked="checked"/>无房</label></span></span></p><p style="margin-top: 0px; margin-bottom: 10px; overflow-wrap: normal; padding: 0px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">其现居住房详细地址：<input placeholder="居住详细地址" value="的身份是的范德萨" desc="居住详细地址" contenteditable="false" class="form-component form-text" id="203" name="fullAddress" style="cursor: text; width: 200px; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;203&#39;)"/>,已居住<input placeholder="居住年限" value="5" desc="居住年限" contenteditable="false" class="form-component form-text" id="209" name="lengthOfResidence" style="cursor: text; width: 60px; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;209&#39;)"/>年；</span></p><p style="margin-top: 0px; margin-bottom: 10px; overflow-wrap: normal; padding: 0px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">2）现工作单位为：<input placeholder="工作单位" value="是的发送到" desc="工作单位" contenteditable="false" class="form-component form-text" id="220" name="company" style="cursor: text; width: 100px; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;220&#39;)"/>,在现单位工作时间为<input placeholder="工作年限" value="5" desc="工作年限" contenteditable="false" class="form-component form-text" id="227" name="workingSeniority" style="cursor: text; width: 60px; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;227&#39;)"/>年；</span></p><p style="margin-top: 0px; margin-bottom: 10px; overflow-wrap: normal; padding: 0px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">3）现有效联系方式（住宅电话）：<input placeholder="住宅电话" value="222222" desc="住宅电话" contenteditable="false" class="form-component form-text" id="235" name="homePhone" style="cursor: text; width: 100px; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;235&#39;)"/>;其它方式<input placeholder="其他方式" value="111111" desc="其他方式" contenteditable="false" class="form-component form-text" id="242" name="otherPhone" style="cursor: text; width: 100px; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;242&#39;)"/>;</span></p><p style="margin-top: 0px; margin-bottom: 10px; overflow-wrap: normal; padding: 0px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">4）学历（职称）为：<span requestdata="{}" type="staticData" desc="学历" contenteditable="false" class="form-component form-radio" id="249" value="3" options="博士（注册资格）,1;硕士（高级职称）,2;本科（中级职称）,3;大专（初级职称或有特殊技能）,4;中专以下,5" name="recordOfFormalSchooling" style="cursor: text; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;249&#39;)"><label><input name="recordOfFormalSchooling" type="radio" value="1"/>博士（注册资格）</label><label><input name="recordOfFormalSchooling" type="radio" value="2"/>硕士（高级职称）</label><label><input name="recordOfFormalSchooling" type="radio" value="3" checked="checked"/>本科（中级职称）</label><label><input name="recordOfFormalSchooling" type="radio" value="4"/>大专（初级职称或有特殊技能）</label><label><input name="recordOfFormalSchooling" type="radio" value="5"/>中专以下</label></span></span></p><p style="margin-top: 0px; margin-bottom: 10px; overflow-wrap: normal; padding: 0px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">5）信用卡：<span requestdata="{}" type="staticData" desc="信用卡" contenteditable="false" class="form-component form-radio" id="14" value="1" options="有,1;无,2" name="creditCard" style="cursor: text; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;14&#39;)"><label><input name="creditCard" type="radio" value="1" checked="checked"/>有</label><label><input name="creditCard" type="radio" value="2"/>无</label></span>&nbsp;卡号<input placeholder="卡号" value="12222222" desc="卡号" contenteditable="false" class="form-component form-text" id="24" name="creditCardNumber" style="cursor: text; width: 200px; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;24&#39;)"/>；</span></p><p style="margin-top: 0px; margin-bottom: 10px; overflow-wrap: normal; padding: 0px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">6）基本生活设施有：<checkbox requestdata="{}" type="staticData" contenteditable="false" class="form-component form-checkbox" id="35" value="1,2,3" options="彩电,1;冰箱,2;空调,3;电话,4;钢琴,5;音响,6;洗衣机,7;其他大件耐用消费品,8" name="amenities" desc="基本生活设施" style="cursor: text; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;35&#39;)"><label><input name="amenities" type="checkbox" value="1" checked="checked"/>彩电</label><label><input name="amenities" type="checkbox" value="2" checked="checked"/>冰箱</label><label><input name="amenities" type="checkbox" value="3" checked="checked"/>空调</label><label><input name="amenities" type="checkbox" value="4"/>电话</label><label><input name="amenities" type="checkbox" value="5"/>钢琴</label><label><input name="amenities" type="checkbox" value="6"/>音响</label><label><input name="amenities" type="checkbox" value="7"/>洗衣机</label><label><input name="amenities" type="checkbox" value="8"/>其他大件耐用消费品</label></checkbox></span></p><p style="margin-top: 0px; margin-bottom: 10px; overflow-wrap: normal; padding: 0px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">7）身体健康状况：<span requestdata="{}" type="staticData" desc="身体健康状况" contenteditable="false" class="form-component form-radio" id="43" value="1" options="良好,1;一般,2;较差,3" name="healthCondition" style="cursor: text; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;43&#39;)"><label><input name="healthCondition" type="radio" value="1" checked="checked"/>良好</label><label><input name="healthCondition" type="radio" value="2"/>一般</label><label><input name="healthCondition" type="radio" value="3"/>较差</label></span></span></p><p style="margin-top: 0px; margin-bottom: 10px; overflow-wrap: normal; padding: 0px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">8）不良嗜好：<span requestdata="{}" type="staticData" desc="不良嗜好" contenteditable="false" class="form-component form-radio" id="51" value="2" options="有,1;无,2" name="badHabit" style="cursor: text; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;51&#39;)"><label><input name="badHabit" type="radio" value="1"/>有</label><label><input name="badHabit" type="radio" value="2" checked="checked"/>无</label></span></span></p><p style="margin-top: 0px; margin-bottom: 10px; overflow-wrap: normal; padding: 0px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">9）不良信用记录：a、有（<checkbox requestdata="{}" type="staticData" contenteditable="false" class="form-component form-checkbox" id="58" value="1,2" options="欠水费,1;欠电费,2;欠煤气费,3;欠话费,4;恶意透支,5" name="poorCreditRecord" desc="不良信用记录" style="cursor: text; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;58&#39;)"><label><input name="poorCreditRecord" type="checkbox" value="1" checked="checked"/>欠水费</label><label><input name="poorCreditRecord" type="checkbox" value="2" checked="checked"/>欠电费</label><label><input name="poorCreditRecord" type="checkbox" value="3"/>欠煤气费</label><label><input name="poorCreditRecord" type="checkbox" value="4"/>欠话费</label><label><input name="poorCreditRecord" type="checkbox" value="5"/>恶意透支</label></checkbox>）b、无</span></p><p style="margin-top: 0px; margin-bottom: 10px; overflow-wrap: normal; padding: 0px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">四、其它需要说明的情况<input placeholder="其他需要说明的情况" value="暂无" desc="其他需要说明的情况" contenteditable="false" class="form-component form-text" id="68" name="otherComment" style="cursor: text; width: 300px; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;68&#39;)"/>.</span></p><p style="margin-top: 0px; margin-bottom: 10px; overflow-wrap: normal; padding: 0px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">五、综合意见</span></p><p style="margin-top: 0px; margin-bottom: 10px; overflow-wrap: normal; padding: 0px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">根据以上调查，经本人核实、评定，借款申请人综合得分为分<input placeholder="得分" value="75" desc="得分" contenteditable="false" class="form-component form-text" id="75" name="overallScore" format="0.0" style="cursor: text; width: 50px; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;75&#39;)"/>,其第一和第二还款来源均有保障，符合个人贷款条，贷款安全性、流动性和效益性良好。本人拟同意对借款申请人（姓名）<input placeholder="姓名" value="测试用11户" desc="姓名" contenteditable="false" class="form-component form-text" id="82" name="applyNameAgain" style="cursor: text; width: 100px; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;82&#39;)"/>发放个人消费贷款（金额）<input placeholder="金额" value="1000000" desc="金额" contenteditable="false" class="form-component form-text" id="89" name="totalLending" format="0,0.00" style="cursor: text; width: 100px; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;89&#39;)"/>元，贷款成数为<input placeholder="成数" value="5" desc="成数" contenteditable="false" class="form-component form-text" id="96" name="loanToValue" style="cursor: text; width: 50px; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;96&#39;)"/>成，贷款期限<input placeholder="期限" value="20" desc="期限" contenteditable="false" class="form-component form-text" id="998" name="realityTimeLimit" style="cursor: text; width: 50px; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;998&#39;)"/>年，（自<span contenteditable="false" enddate="2039-06-21" startdate="2019-06-21" class="form-component form-datepicker flatpickr-input" id="997" value="1561046400000" desc="贷款开始时间" name="loanStartDate" format="YYYY-MM-DD" readonly="readonly" style="background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;997&#39;)" onclick="document.__showFormDate(event, &#39;997&#39;)">2019-06-21</span>至<span contenteditable="false" enddate="2039-07-01" startdate="2039-06-21" class="form-component form-datepicker flatpickr-input" id="214" value="2192198400000" desc="贷款结束时间" name="loanEndDate" readonly="readonly" format="YYYY-MM-DD" style="background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;214&#39;)" onclick="document.__showFormDate(event, &#39;214&#39;)">2039-06-21</span>），年利率<input placeholder="年利率" value="5" desc="年利率" contenteditable="false" class="form-component form-text" id="157" name="rate" format="0.00" style="cursor: text; width: 50px; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;157&#39;)"/>%.同时在贷款审批完毕后，本人将及时办妥抵押登记及保险等相关手续，从而全面防范贷款风险。</span></p><p style="margin-top: 0px; margin-bottom: 10px; overflow-wrap: normal; padding: 0px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="overflow-wrap: normal; padding: 0px; margin: 0px; font-size: 16px;">调查人（签字）：</span></p><p style="margin-top: 0px; margin-bottom: 10px; overflow-wrap: normal; padding: 0px; text-indent: 2rem; color: rgb(51, 51, 51); font-family: &quot;Microsoft Yahei&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, tahoma, arial, &quot;WenQuanYi Micro Hei&quot;, Verdana, sans-serif, 宋体; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);"><span contenteditable="false" enddate="2019-07-01" startdate="2019-06-21" class="form-component form-datepicker flatpickr-input" id="177" value="1561046400000" desc="签字日期" name="signDate" format="YYYY-MM-DD" readonly="readonly" style="background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;" onmouseover="document.__showFormPop(event, &#39;177&#39;)" onclick="document.__showFormDate(event, &#39;177&#39;)">2019-06-21</span></p>';

            openMask(<div style={{width: 1000, background: '#FFFFFF', margin: '0 auto'}}>
                <DocEditor
                    editorDidMount={this.editorDidMount}
                    onSave={(html, data) => this.saveDocEditorContent(itemDefId, html, data)}
                    initialContent={this.editorInitContent}
                    initialFrameHeight={document.documentElement.clientHeight - 190}
                />
            </div>, {
                onClose: () => {
                    // 关闭确认操作
                    return new Promise((resolve, reject) => {
                        let editContent = this.editor.getContent() ;
                        // console.log('---2--');
                        // console.log(this.editorInitContent);
                        // console.log('---3--');
                        // console.log(editContent);
                        if (editContent !== this.editorInitContent) {
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
        });
    };

    openDocEditorOld = () => {
        openModal(<div><ConfInquireDocEditor/></div>, {
            defaultButton: false,
            title: "编辑模板",
            onOk: (modal, compnent, btn) => {
            },
        });
    }

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([{
            name: '新增',
            onClick: this.addItemRow
        }, {
            selectBind: true,
            name: '删除',
            onClick: this.deleteItem
        }]);

        this.voList.setColumnTemplate('itemName', (text, record, i) => {
            return (<a onClick={() => this.openItemInfo(record.itemDefKey, '编辑数据')}>{text}</a>);
        });
        this.voList.setColumnTemplate('tplFileId', (text, record, i) => {
            return (<a onClick={() => this.showTplFile(record)}>{text}</a>);
        });
        this.voList.setColumnsEditMode(['sortCode']);
        this.voList.addColumn(this.uploadButtons());

    };

    showTplFile = (row) => {
        const {rest} = this.props;
        const viewURL = `/conf/dossier/showItemTplFile/${row.itemDefKey}/${row.tplFileId}`;
        openModal(<Iframe {...this.props} allowNewWindow={false} url={rest.getRequestURL(viewURL)}/>, {
            title: '查看文件',
            width: '50%',
            defaultButton: false,
        });
    }

    uploadButtons = () => {
        return {
            title: '操作',
            key: 'buttonComponent',
            sortCode: '2000',
            width: 80,
            render: (text, record, index) => {
                const fileId = record.tplFileId || "NULL";
                const itemDefKey = record.itemDefKey;
                return (<div style={{
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-around'
                }}>
                    <Upload
                        action={`/conf/dossier/uploadItemTplFile/${itemDefKey}/${fileId}`}
                        onChange={this.onUploadChange}
                        buttonType={'a'}
                    />
                    <Download
                        action={`/conf/dossier/downItemTplFile/${itemDefKey}/${fileId}`}
                        disable={record.tplFileId ? 'false' : 'true'}
                        buttonType={'a'}
                    />
                    <Icon type="delete"
                          disable={record.tplFileId ? 'false' : 'true'}
                          onClick={() => this.removeTplFile(record)}/>
                </div>)
            }
        };
    }

    onUploadChange = (status, ret) => {
        if (status === "done") {
            const fileEntity = ret.response;
            this.voList.refresh();
        } else if (status === "uploading") {
        } else {
            Message.info('上传失败！');
        }
    };

    removeTplFile = (row) => {
        const {rest} = this.props;
        const itemName = row.itemName;
        const fileId = row.tplFileId || "NULL";
        const itemDefKey = row.itemDefKey;

        Modal.confirm({
            title: '删除确认',
            content: `您确定删除[${itemName}]的附件吗，删除后数据不可恢复！`,
            onOk: () => {
                rest.post(`/conf/dossier/removeTplFile/${itemDefKey}/${fileId}`)
                    .then((ret) => {
                        if (ret == 1) {
                            this.voList.refresh();
                        }
                    })
            },
            onCancel: () => {
            },
        });
    }

    dataReady = (api) => {
    };

    addItemRow = () => {
        this.openItemInfo('NULL', '新建');
    };

    openItemInfo = (itemDefKey, title) => {
        openModal(<ConfInquireItemInfo/>, {
            title: title,
            dossierDefKey: this.props.dossierDefKey,
            itemDefKey: itemDefKey,
            defaultButton: true,
            width: '768px',
            refresh: this.tableRefresh,
            onOk: (modal, component, btn) => {
                component.saveInfoData((err, value) => {
                    if (!err) {
                        modal.close();
                    }
                }, btn);
            },
            onCancel: (a, b) => {
            }
        });
    };

    saveListInfo = () => {
        this.voList.saveData()
            .then(() => {
                Message.success('保存成功');
                this.voList.refresh();
            });
    };

    deleteItem = (row) => {
        const selectedRow = row || this.voList.getSelectedRow();
        const itemName = selectedRow.itemName;
        Modal.confirm({
            title: '删除确认',
            content: `您确定删除[${itemName}]吗？删除后数据不可恢复！`,
            onOk: () => {
                this.voList.deleteRows([selectedRow]);
            },
            onCancel: () => {
            },
        });
    };

    tableRefresh = () => {
        this.voList.refresh();
    };

    render() {
        return (
            <DataTable
                dataFormId="configuration-InquireItemList"
                params={{dossierDefKey: this.props.dossierDefKey}}
                formReady={this.formReady}
                dataReady={this.dataReady}
                resizeable={false}
                viewModel={'ListView'}
                bordered={false}
                headerRender={this.headerRender}
                bodyRowRender={this.bodyRowRender}
                showPagination={false}
                pageSize={50}
            />
        );
    }
}
