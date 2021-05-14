import {DataTable, Message,propsCompose} from "roface";
import React from "react";


@propsCompose
export default class DataList2ExcelCase extends React.Component {
    constructor(props) {
        super(props);
    }

    openPersonInfo = () => {
        const record = this.dataList.getSelectedRow();
        if(!record){
            Message.error('请选择一行')
        }
        const {flexTabs} = this.props;
        flexTabs.open(`${record.name}的详情`, 'ShowCase/DataTable/BaseSimpleTable/PersonInfo', {personId: record.id});
    };



    formReady = (formList) => {
        this.formList = formList;
        formList.addButton([
            {name: '导出EXCEL（当前页）', type: 'primary', icon: 'fa-file-excel-o', onClick: () => this.exportExcel(false)},
            {name: '导出EXCEL（所有）', type: 'primary', icon: 'fa-file-excel-o', onClick: () => this.exportExcel(true)},
            // {name: '导出PDF（当前页）', type: 'primary', icon: 'fa-file-pdf-o', onClick: () => this.exportPDF(false)},
            // {name: '导出PDF（所有）', type: 'primary', icon: 'fa-file-pdf-o', onClick: () => this.exportPDF(true)},
        ]);
    };
    /**
     * 表格数据加载完成后，调用
     * @param dataList
     */
    dataReady = (dataList) => {
        this.dataList = dataList;
    };

    /**
     * 导出EXCEL
     * @param allData 是否导出所有数据
     */
    exportExcel = (isAll) => {
        this.dataList.exportExcel(isAll);
    };

    exportPDF = (allData) => {

    };

    render() {
        return (
            <DataTable
                dataFormId="demo-ExportBeanPersonList"
                dataReady={this.dataReady}
                formReady={this.formReady}
                editMode={false}
            />
        );
    }
}