import React from 'react';

import {DetailInfo, Button,Radio, Row,Col, Dropdown, Menu, Icon, Notify} from '../../../../src/components';
import BankCardList from './BankCardList';
import moment from 'moment';

export default class MainFunction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: true,
            info: null,
        };
    }

    // Api接口展示
    _setValue = () => {
        this.dataInfo.setValue('name', 'test' + parseInt(Math.random() * 100)); // eslint-disable-line
    };
    _getValue = () => {
        Notify.success({
            message: '获取姓名',
            description: this.dataInfo.getValue('name'),
        });
    };
    _getData = () => {
        Notify.success({
            message: '获取表单数据',
            description: JSON.stringify(this.dataInfo.getData()),
        });
    };
    _setData = () => {
        this.dataInfo.setData({engName: 'test' + parseInt(Math.random() * 100)}); // eslint-disable-line
    };
    _setItemVisible = (bool) => {
        this.dataInfo.setItemVisible('gender', bool);
    };
    _setItemRequired = (bool) => {
        this.dataInfo.setItemRequired('birth', bool);
    };
    _setValueReadonly = (bool) => {
        Notify.success({
            message: '选中操作',
            description: '尝试点击出生日期选择框',
            duration: 6,
        });
        this.dataInfo.setValueReadonly('birth', bool);
    };
    _setReadingMode = (bool) => {
        this.dataInfo.setReadingMode('name', bool);
    };
    _setGroupVisible = (bool) => {
        this.dataInfo.setGroupVisible('20', bool);
    };
    _setGroupReadonly = (bool) => {
        this.dataInfo.setGroupReadonly('40', bool);
        Notify.success({
            message: '选中操作',
            description: '尝试点击经济状况组中输入框',
            duration: 6,
        });
    };
    _setGroupReadingMode = (bool) => {
        this.dataInfo.setGroupReadingMode('30', bool);
    };
    _setItemTemplate = () => {
        this.dataInfo.setItemTemplate('name', <div>sdssss</div>);
    };
    _setItemPrefix = () => {
        this.dataInfo.setItemPrefix('name', 'Prefix' + parseInt(Math.random() * 100)); // eslint-disable-line
    };
    _setItemSuffix = () => {
        this.dataInfo.setItemSuffix('name', 'Suffix' + parseInt(Math.random() * 100)); // eslint-disable-line
    };
    _setLabelWidth = () => {
        this.dataInfo.setLabelWidth('150px');
    }
    _setItemLabelWidth = () => {
        this.dataInfo.setItemLabelItemWidth('name','250px');
    }
    _setItemTips = () => {
        Notify.success({
            message: '鼠标操作',
            description: '将鼠标移动到姓名输入框中',
            duration: 6,
        });
        this.dataInfo.setItemTips('name', '浮动提示：' + parseInt(Math.random() * 100)); // eslint-disable-line
    };
    _setItemNotes = () => {
        this.dataInfo.setItemNotes('name', '备注说明：' + parseInt(Math.random() * 100)); // eslint-disable-line
    };
    _validate = () => {
        this.dataInfo.validate((err, value) => {
            if (err) {
                Notify.error({
                    message: '校验未通过',
                    description: JSON.stringify(value),
                });
            } else {
                Notify.success('通过');
            }
        });
    };
    _saveData = () => {
        const {openLoading, closeLoading} = this.props;
        openLoading && openLoading();
        this.dataInfo.saveData((hasError) => {
            if(hasError){
                Notify.error('保存失败,'+hasError);
            }else{
                Notify.success('保存成功');
            }
            closeLoading && closeLoading();
        });
    };
    _saveDataWithoutValidate = () =>{
        this.dataInfo.saveWithoutValidate((hasError)=>{
            if(hasError){
                Notify.error('保存失败');
            }else{
                Notify.success('保存成功');
            }
        })
    };

    formReady = (formInfo) => {
        formInfo.addButton([{
            name: '按钮1',
            type: 'primary',
            icon: 'fa-file-excel-o',
            onClick: ()=>{}
        }, {
            name: '按钮2',
            type: 'primary',
            icon: 'fa-file',
            onClick: ()=>{}
        }]);
    };
    // 界面渲染
    dataReady = (dataInfo) => {
        this.dataInfo = dataInfo;
        this.setState({
            disabled: false,
        });
        this.dataInfo.setReadingMode('createdBy', true);
        this.dataInfo.setReadingMode('updatedBy', true);
        this.dataInfo.setItemTemplate('bankCard1', <BankCardList personId={'18'}/>, true);
        this.dataInfo.setGroupTemplate('55', <BankCardList personId={'18'}/>);
        this.dataInfo.setValue('birth',moment(new Date()).format('YYYY-MM-DD'));

        //校验规则
        this.dataInfo.addValidate('checkWeight1', (value, object) => {
            //console.log(object);
            return new Promise((resolve, reject) => {
                if (parseInt(value) > 250) {
                    resolve({passed: false, message: "体重不能超过250"})
                }
            })
        });
        this.dataInfo.addValidate('checkWeight2', (value, object) => {
            return new Promise((resolve, reject) => {
                if (parseInt(value) > 280) {
                    resolve({passed: false, message: "体重不能超过280"})
                }
            })
        });

        this.dataInfo.setItemOnChange('monthIncome', this.monthIncomeOnChange);

    };

    monthIncomeOnChange = (value) => {
        if (value) {
            this.dataInfo.setItemValueToMoney('monthIncomeUpperCase', value);
        }
    };

    render() {
        const menuItem = (text, onChange) => <Menu.Item><a onClick={onChange}>{text}</a></Menu.Item>

        return (
            <Row gutter={10}>
                <Col span={6}>
                    <Radio.Group value="small">
                        <Radio.Button onClick={() => this._getValue()}>getValue</Radio.Button>
                        <Radio.Button onClick={() => this._setValue()}>setValue</Radio.Button>
                        (姓名)
                    </Radio.Group>
                    <Radio.Group value="small">
                        <Radio.Button onClick={() => this._getData()}>getData</Radio.Button>
                        <Radio.Button onClick={() => this._setData()}>setData</Radio.Button>
                    </Radio.Group>
                    <Radio.Group value="small">
                        <Radio.Button onClick={() => this._setItemVisible(true)}>可见</Radio.Button>
                        <Radio.Button onClick={() => this._setItemVisible(false)}>不可见</Radio.Button>
                        (性别)
                    </Radio.Group>
                    <Radio.Group value="small">
                        <Radio.Button onClick={() => this._setItemRequired(true)}>必需</Radio.Button>
                        <Radio.Button onClick={() => this._setItemRequired(false)}>非必需</Radio.Button>
                        (生日)
                    </Radio.Group>
                    <Radio.Group value="small">
                        <Radio.Button onClick={() => this._setValueReadonly(true)}>只读</Radio.Button>
                        <Radio.Button onClick={() => this._setValueReadonly(false)}>非只读</Radio.Button>
                        (生日)
                    </Radio.Group>
                    <Radio.Group value="small">
                        <Radio.Button onClick={() => this._setReadingMode(true)}>文本模式</Radio.Button>
                        <Radio.Button onClick={() => this._setReadingMode(false)}>非文本模式</Radio.Button>
                        (姓名)
                    </Radio.Group>
                    <Radio.Group value="small">
                        <Radio.Button onClick={() => this._setGroupVisible(true)}>分组可见</Radio.Button>
                        <Radio.Button onClick={() => this._setGroupVisible(false)}>分组不可见</Radio.Button>
                        (联系信息组)
                    </Radio.Group>
                    <Radio.Group value="small">
                        <Radio.Button onClick={() => this._setGroupReadonly(true)}>分组只读</Radio.Button>
                        <Radio.Button onClick={() => this._setGroupReadonly(false)}>分组不只读</Radio.Button>
                        (经济状况组)
                    </Radio.Group>
                    <Radio.Group value="small">
                        <Radio.Button onClick={() => this._setGroupReadingMode(true)}>分组文本</Radio.Button>
                        <Radio.Button onClick={() => this._setGroupReadingMode(false)}>分组非文本</Radio.Button>
                        (职业信息组)
                    </Radio.Group>
                    <Radio.Group value="small">
                        <Radio.Button onClick={() => this._setItemTips()}>浮动提示</Radio.Button>
                        <Radio.Button onClick={() => this._setItemNotes()}>备注说明</Radio.Button>
                        (姓名)
                    </Radio.Group>
                    <Radio.Group value="small">
                        <Radio.Button onClick={() => this._setItemPrefix()}>字段前缀</Radio.Button>
                        <Radio.Button onClick={() => this._setItemSuffix()}>字段后缀</Radio.Button>
                        (姓名)
                    </Radio.Group>
                    <Radio.Group value="small">
                        <Radio.Button onClick={() => this._setLabelWidth()}>表单标签宽度</Radio.Button>
                        <Radio.Button onClick={() => this._setItemLabelWidth()}>单个标签宽度</Radio.Button>
                    </Radio.Group>
                    <Radio.Group value="small">
                        <Radio.Button onClick={() => this._validate()}><Icon type="fa-medkit" />校验</Radio.Button>
                        <Radio.Button onClick={() => this._saveData()}><Icon type="fa-save" />保存</Radio.Button>
                        <Radio.Button onClick={() => this._saveDataWithoutValidate()}>无校验保存</Radio.Button>
                    </Radio.Group>

                </Col>
                <Col span={18}>
                    <DetailInfo dataFormId="demo-PersonGroupInfo" buttonOffsetLeft={378} buttonFixed={true} params={{id: 18}} formReady={this.formReady} dataReady={this.dataReady}/>
                </Col>
            </Row>
        );
    }
}
