import React from "react";

import {DataTable, Message, Notify} from 'roface';

export default class EditDataTableWithValidate extends React.Component {
    constructor(props) {
        super(props);
    }

    formReady = (formList) => {
        this.formList = formList;
        formList.addButton([
            {name: '保存', type: 'primary', icon: 'save', onClick: () => this.saveListData()},
            {name: '无校验保存', type: 'primary', icon: 'save', onClick: () => this.saveListDataWithoutValidate()},
        ]);

        //校验规则
        this.formList.addValidate('checkNameLength', (value, row,rowList) => {
            //console.log(object);
            return new Promise((resolve, reject) => {
                if (value && value.length>4) {
                    resolve({passed: false, message: "名字不能超过四个字"})
                }
            })
        });
    };

    dataReady = (dataList) => {
        this.dataList = dataList;
        dataList.getData()[1].name='艾伦被JS校验到过长';
    };

    saveListData = () => {
      this.formList.saveData().then(() => {
        Notify.success('保存成功');
      }).catch((err) => {
        Notify.error(`保存失败${err}`);
      });
    };

    saveListDataWithoutValidate = () => {
      this.formList.saveWithoutValidate().then(() => {
        Notify.success('保存成功');
      });
    };

    render() {
        return (
            <DataTable
                dataFormId="demo-EditBeanWithValidatePersonList"
                dataReady={this.dataReady}
                formReady={this.formReady}
                editMode={true}
            />
        );
    }
}