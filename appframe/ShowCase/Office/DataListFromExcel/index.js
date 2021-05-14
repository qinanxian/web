import React from "react";

import {Tabs, Upload, Message, DataTable, propsCompose, Notify} from '../../../../src/components';

const TabPane = Tabs.TabPane;

@propsCompose
export default class DataListFromExcel extends React.Component {
    constructor(props) {
        super(props);
    }

    downTemplateData = () => {
        const { rest } = this.props;
        rest.download('/showcase/DataListImportControllerDemo/downloadTemplate')
    };

    downTestData = () => {
        const { rest } = this.props;
        rest.download('/showcase/DataListImportControllerDemo/downloadTestDataList')
    };

    uploadTestDataCallback1 = (status,ret) => {
        // console.log(status);
        if(status === 'done'){
            const dataList = ret.response;
            console.log(dataList);
            this.dataList1.setData(dataList);
            Message.success('上传解析成功');
        }
    };

    /**
     * 表格数据加载完成后，调用
     * @param formList1
     */
    formReady1 = (formList1) => {
        this.formList1 = formList1;
        this.formList1.addButton([
            {name: '下载案例数据', type: 'primary', icon: 'fa-file-excel-o', onClick: () => this.downTestData()},
            {name: '下载映射模板', type: 'primary', icon: '', onClick: () => this.downTemplateData()},
        ]);
        this.formList1.addTemplate([
            <Upload
                name={"导入"}
                action={`/showcase/DataListImportControllerDemo/uploadParseDataList/DemoId001`}
                onChange={this.uploadTestDataCallback1}
            />
        ])
    };

    dataReady1 = (dataList1) => {
        this.dataList1 = dataList1;
    };



    formReady2 = (formList2) => {
        this.formList2 = formList2;
        this.formList2.addButton([
            {name: '删除所有数据', type: 'danger', icon: 'fa-delete', onClick: () => this.removeAllData()},
            {name: '下载案例数据', type: 'primary', icon: 'fa-file-excel-o', onClick: () => this.downTestData()},
            {name: '下载映射模板', type: 'primary', icon: '', onClick: () => this.downTemplateData()},
        ]);
        this.formList2.addTemplate([
            <Upload
                name={"导入"}
                action={`/showcase/DataListImportControllerDemo/uploadParseDataListToDB/DemoId001`}
                onChange={this.uploadTestDataCallback2}
            />
        ])
    };

    dataReady2 = (dataList2) => {
        this.dataList2 = dataList2;
    };

    removeAllData = () => {
        this.dataList2.invoke('deleteAllData',{})
            .then((ret) => {
                Message.success(`成功删除记录[${ret}]条`);
                this.dataList2.refresh();
            });
    };

    uploadTestDataCallback2 = (status,ret) => {
        console.log(status);
        if(status === 'done'){
            const count = ret.response;
            Message.success(`成功导入记录[${count}]条`);
            this.dataList2.refresh();
        }
    };

    render() {
        return (
            <Tabs defaultActiveKey="1" type={'line'}>
                <TabPane tab="前端导入" key="1">
                    <DataTable
                        dataFormId="demo-ExportBeanPerson4Import"
                        formReady={this.formReady1}
                        dataReady={this.dataReady1}
                        editMode={true}
                        requestData={false}
                        pageSize = {0}
                    />
                </TabPane>
                <TabPane tab="后端导入" key="2">
                    <DataTable
                        dataFormId="demo-ExportBeanPerson4Import"
                        formReady={this.formReady2}
                        dataReady={this.dataReady2}
                        pageSize = {0}
                    />
                </TabPane>
            </Tabs>
        );
    }

}