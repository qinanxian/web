import React from 'react';
import {DataTable, Row, Col, Alert, Typography, Divider,PermitBlock} from '../../../../src/components';
import * as permission from '../../../../src/lib/permission';

const {Text} = Typography;


export default class DataRangePermitList extends React.Component {
    formReady = (voList) => {
        this.voList = voList;
        //添加按钮
        this.voList.addButton([
            {name: '新增', type: 'primary', permitCode: 'Editable', onClick: () => this.invokeEmpty()},
            {name: '修改', type: 'warning', permitCode: 'Editable', onClick: () => this.invokeEmpty()},
            {name: '删除', type: 'default', permitCode: 'Editable', onClick: () => this.invokeEmpty()},
            {name: '查看', type: 'success', permitCode: 'Operateable', onClick: () => this.invokeEmpty()},
            {name: '查联系人', type: 'default', permitCode: 'Operateable', onClick: () => this.invokeEmpty()},
            {
                name: '导出EXCEL',
                type: 'default',
                permitCode: 'Export',
                onClick: () => this.exportExcel(false),
                icon: 'fa-file-excel-o'
            },
        ]);
    }

    invokeEmpty = () => {

    }
    /**
     * 导出EXCEL
     * @param allData 是否导出所有数据
     */
    exportExcel = (isAll) => {
        this.voList.exportExcel(isAll, `个人客户信息.xlsx`);
    };

    render() {
        const desc = <div>
            <pre>
            <Text type="danger">xji        权限:所有按钮-范围：所有数据</Text><br/>
            <Text type="danger">bliu       权限:导出数据-范围：本机构及下属机构</Text><br/>
            <Text type="danger">jlou       权限:操作权限-范围：本部门</Text><br/>
            <Text type="danger">ccao       权限:修改权限-范围：本人</Text><br/>
            <Text type="danger">bzhou      权限:无按钮-范围：无数据</Text><br/>
            <Divider/>
            编辑:{permission.hasPermit('Editable')?'有':'无'}<br/>
            <PermitBlock permitCode={'Editable'}>看到这段文字表示你有【编辑】权限</PermitBlock><br/>
            <PermitBlock permitCode={'Operateable'}>看到这段文字表示你有【操作】权限</PermitBlock><br/>
            </pre>
        </div>;
        return (
            <div>
                <Alert
                    message="用户及权限提醒"
                    description={desc}
                    type="warning"
                    showIcon
                />
                <DataTable
                    formReady={this.formReady}
                    lineNumber={true}
                    dataFormId="demo-BeanPersonRangeList"
                />
            </div>

        );
    }
}

