import React from "react";
import {Form} from '@ant-design/compatible';
import {getUser} from '../../../src/lib/cache';
import './style/index.less';
import {Button, Col, DataTable, DataTablePicker, DetailInfo, Notify, Row} from "../../../src/components";

const FormItem = Form.Item;

export default Form.create()(class Information extends React.Component {
    constructor(props) {
        super(props);
        console.log(getUser().id);
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
    };

    userInfoSave = () => {
        this.voInfo.saveData((err, values) => {
            if (err) {
                Notify.error('保存失败！');
            } else {
                Notify.success('保存成功！');
                this.voInfo.refresh();
            }
        });
    };


    render() {
        return (
            <Row>
                <Button type='primary' style={{display: getUser().id ? '' : 'none'}} onClick={this.userInfoSave}>保存</Button>
                <DetailInfo
                    dataFormId="system-UserSummary"
                    dataReady={this.dataReady}
                    params={{userId: getUser().id}}
                />
            </Row>


        );
    }
})
