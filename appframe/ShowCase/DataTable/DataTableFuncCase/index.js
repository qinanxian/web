/**
 * Created by dpcui on 31/01/2018.
 */

import React from "react";
import './style.css';

import {
    DataTable,
    Notify,
    Row,
    Col,
    Message,
    Button,
    Radio,
    Icon,
    Currency,
    DatePicker,
    Select
} from '../../../../src/components';

/**
 * 新DataTable主要功能展示
 */
export default class EditDataTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
            selectionType: 'single',
            closeSelection: false,
            enableButtonBar: true,
            bordered: true,
            showPagination: true,
            pageSize: 20,
        }
    }

    /**
     * 表格模版加载完成后，调用
     * @param formList
     */
    formReady = (formList) => {
        this.formList = formList;
        formList.addButton([
            {name: '获取选中行数组', type: 'primary', onClick: () => this.getSelectedRows(), selectBind: true},
            {name: '获取选中行内值', type: 'primary', onClick: () => this.getSelectedRowValue(), selectBind: true},
            {name: '调用Handler方法', type: 'primary', onClick: () => this.doInvokeHandlerMethod(), selectBind: true},
        ]);
    };
    /**
     * 表格数据加载完成后，调用
     * @param dataList
     */
    dataReady = (dataList) => {
        this.dataList = dataList;
        dataList.setSelectedRows([1, 2, 4]);


        dataList.setFilterItemTemplate('gender',(field, options,text) => {
            return (
                <div style={{display:'flex',justifyContent: 'space-between',alignItems: 'center',width:'100%'}}>
                    <span style={{display:'inline-block',whiteSpace:'nowrap'}}>{field.name}:</span>
                    <Select
                        custMultiple
                        options={options}
                        onChange={this.handleEditChange}
                        value={text}
                    />
                </div>
            );
        });

        dataList.setTableFooter((bodyData) => {
            const summarizes = bodyData.summarizes;
            const totalSummarizes = bodyData.totalSummarizes;
            /** 小计以及合计部分，自己定义内容以及样式 */
            return <tfoot className="summary-footer">
            <tr>
                <td rowSpan={2} colSpan={5} className="header">小计</td>
                <td>出生最早(MAX):</td>
                <td>平均(AVG)：</td>
                <td>最轻(MIN)：</td>
                <td>总和(SUM)：</td>
            </tr>
            <tr>
                <td><DatePicker isTable value={summarizes.birth} reading/></td>
                <td>{summarizes.height}</td>
                <td>{summarizes.weight}</td>
                <td><Currency isTable value={summarizes.monthIncome} decimalDigits={2}  reading/></td>
            </tr>
            <tr>
                <td rowSpan={2} colSpan={5} className="header">总计</td>
                <td>出生最早(MAX):</td>
                <td>平均(AVG)：</td>
                <td>最轻(MIN)：</td>
                <td>总和(SUM)：</td>
            </tr>
            <tr>
                <td><DatePicker isTable value={totalSummarizes.birth} reading/></td>
                <td>{totalSummarizes.height}</td>
                <td>{totalSummarizes.weight}</td>
                <td><Currency isTable value={totalSummarizes.monthIncome} decimalDigits={2}  reading/></td>
            </tr>
            </tfoot>
        });
        dataList.setFooter((bodyData) => {
            return <div>列表脚注</div>;
        });
        // dataList.setSelectedRows([{id: '14'}, {id: '1'}]);
    };

    handleEditChange = (values) => {
        this.dataList.setFilterValue({gender:values});
    };

    addBtn = () => {
        this.formList.addButton([{
            name: '按钮添加展示', type: 'danger', onClick: () => {
                Message.info('添加按钮已经点击...');
            }
        }])
    };

    getSelectedRow = () => {
        const row = this.dataList.getSelectedRow();
        Notify.success({
            message: '获取单选选中对象或多选第一个选中对象',
            description: JSON.stringify(row),
        });
    };

    getSelectedRows = () => {
        const rows = this.dataList.getSelectedRows();
        Notify.success({
            message: '获取选中行',
            description: JSON.stringify(rows),
        });
    };

    doInvokeHandlerMethod = () => {
        const row = this.dataList.getSelectedRow();
        this.dataList.invoke('createNewPerson', row)
            .then((data) => {
                Notify.info(`标识码:${data.code},中文名称:${data.chnName}`)
            });
    }

    getSelectedRowValue = () => {
        const id = this.dataList.getSelectedValue('id');
        Notify.success({
            message: '直接获取选中行的ID',
            description: id,
        });
    };

    getData = () => {
        const data = this.dataList.getData();
        Notify.success({
            message: '返回列表所有数据',
            description: JSON.stringify(data),
        });
    };

    setSelectedRows = () => {
        // this.dataList.setSelectedRows([9]);
        this.dataList.setSelectedRows([{id: '18'}, {code: 'P1015'}]);
    };

    saveData = () => {
      this.dataList.saveData()
            .then((res) => {
                Notify.success({
                    message: '保存成功',
                    description: JSON.stringify(res),
                });
            }).catch((error) => {
            console.log('模版内部已处理异常' + error);
        });
    };

    saveSelectedRows = () => {
        const rows = this.dataList.getSelectedRows();
        this.dataList.saveData(rows)
            .then((res) => {
                Notify.success({
                    message: '保存成功',
                    description: JSON.stringify(res),
                });
            }).catch((error) => {
            console.log('模版内部已处理异常' + error);
        });
    };

    deleteSelectedRows = () => {
        const rows = this.dataList.getSelectedRows();
        this.dataList.deleteRows(rows)
            .then(res => {
                Notify.success({
                    message: '删除成功',
                    description: JSON.stringify(res),
                });
            }).catch((error) => {
            console.log('模版内部已处理异常' + error);
        })
    };

    setColumnTemplate = () => {
        this.dataList.setColumnTemplate('name', (text, record, index) => {
            return <a>{text}</a>
        })
    };

    setColumnVisible = (visible) => {
        this.formList.setColumnVisible('birth', visible);
    };

    addRow = () => {
        Notify.success({
            message: '提示',
            description: '尽量确保不要添加空对象，否则后续操作可能出现无法预料错误',
        });
        this.formList.addRow({id: '0100', name: '天下第一'}, 5);
    };

    removeSelectedRows = () => {
        const rows = this.formList.getSelectedRows();
        this.formList.removeRows(rows);
    };

    removeData = () => {
        this.formList.removeData();
    };

    refresh = () => {
        this.formList.refresh();
    };

    switchSelectMode = () => {
        this.setState({selectionType: this.state.selectionType === 'single' ? 'multiple' : 'single'});
    };

    openAndCloseSelectMode = () => {
        this.setState({closeSelection: !this.state.closeSelection});
    };

    openAndCloseEditMode = (api) => {
      if (api) {
        this.formList.setEditMode(true);
      } else {
        this.setState({editMode: !this.state.editMode});
      }
    };

    setRowsEditMode = () => {
        const rows = this.formList.getSelectedRows();
        this.formList.setRowsEditMode(rows);
    };

    setRowsReadOnly = () => {
        const rows = this.formList.getSelectedRows();
        this.formList.setRowsReadOnly(rows);
    };

    setColumnsEditMode = () => {
      this.formList.setColumnsEditMode(['name','gender']);
    };

    setColumnsReadOnly = () => {
      this.formList.setColumnsReadOnly('name');
    };

    getColumnDict = () => {
        const dic = this.formList.getColumnDict('gender');
        Notify.success({
            message: '性别码表获取',
            description: JSON.stringify(dic),
        });
    };

    setColumnDict = () => {
        this.formList.setColumnDict('gender', [{code: '1', name: '男'}, {code: '2', name: '女'}]);
        const dic = this.formList.getColumnDict('gender');
        Notify.success({message: '性别码表被重置'});
    };

    getPagination = () => {
        const pagination = this.formList.getPagination();
        Notify.success({
            message: '分页器信息',
            description: JSON.stringify(pagination),
        });
    };

    onSelectRow = (keys, rows) => {
        Message.info(rows.map(item => item.name).toString())
    };

    setEnableBtnGroup = () => {
        this.setState({enableButtonBar: !this.state.enableButtonBar});
    };

    openAndCloseBordered = () => {
        this.setState({bordered: !this.state.bordered})
    };

    onPageChanged = (page, size) => {
        console.log('翻页监听' + page, size);
    };

    onItemsPerPageChanged = (current, size) => {
        console.log('页面大小切换监听' + current, size);
    };

    showPagination = () => {
        this.setState({showPagination: !this.state.showPagination})
    };

    setPageSize = () => {
        this.setState({pageSize: 25});
    };

    closePagination = () => {
        this.setState({pageSize: 0});
        // this.formList.refresh();
    };

    handleBtnClick = (record) => {
      console.log('record:',record);
    };

    handleBtnDelete = (record) => {
      this.formList.deleteRow(record);
    };

    addColumnButton = () => {
       /*
       * 参数二：列宽(单位默认px)
       * 参数三：prefix：添加在第一列，suffix：添加在最后一列(默认)
       * */
       this.formList.addColumnButton([{
         name:'详情',
         onClick: this.handleBtnClick,
       },{
         name:'删除',
         onClick: this.handleBtnDelete,
       }],136,'suffix','列标题');
    };

    addColumn = () => {
        const column = {
            title: '添加一列接口慎用，接口第二个参数是列位置',
            key: '__danger',
            render: (text, record, index) => <Button>慎用</Button>
        };
        this.formList.addColumn(column);
    };

    removeColumn = () => {
        this.formList.removeColumn('__danger', () => {
            Notify.success({
                message: '列删除成功',
                description: '慎用列操作接口，建议使用setColumnTemplate接口',
            });
        });
    };

    setFilterTemplate = () => {
        this.formList.setFilterTemplate((filter, dict, column) => {
            return (
                <a>这里自定义你的模版，返回数据请看console控制台</a>
            );
        })
    };

    setFilterItemTemplate = () => {
        this.formList.setFilterItemTemplate('gender', (filter, dict) => {
            return (
                <a>这里自定义你的模版，返回数据请看console控制台</a>
            );
        });
    };

    getFilter = () => {
        Notify.success({
            message: '取筛选器值',
            description: JSON.stringify(this.formList.getFilter()),
        });
    };

    exportExcelAll = (flag) => {
      this.formList.exportExcel(flag);
    };

    exportExcelCurrent = (flag) => {
      this.formList.exportExcel(flag);
    };

    setFilterValue = () => {
        this.formList.setFilterValue({gender: '2'})
    };

    setRowTemplate = () => {
        this.formList.setRowTemplate([{id: '16'}, {id: '18'}], (text, record, index) => {
            return <a>{text}</a>
        });
    };

    getDataSource = () => {
      // console.log('jdfiosafj:',this.formList.getData());
    };

    handleColumnChange = (record,column) => {
      // console.log(column,record);
      // console.log('data:',this.formList.getData());
    };
    setColumnFixed = () => {
        // 1.需要制定scroll={{ x: 1500 }}
        // 2.需要给固定的列设置列宽 【在显示模板设置】
        // 3.不能使用setTableFooter
      this.formList.setTableFooter(null); // 此处因为在别处设置了模板，所以在此处关闭
      this.formList.setColFixed(['monthIncome'], 'right');
    };
    setMergeColumns = () => {
      this.formList.setMergeColumns(['gender']);
    };
    render() {
        return (
            <Row>
                <Col span={5}>
                    <Radio.Group value="small">
                        <Radio.Button onClick={() => this.addBtn()}>添加按钮</Radio.Button>
                        <Radio.Button onClick={() => this.refresh()}>刷新列表(保留页码）</Radio.Button>
                    </Radio.Group>
                    <Radio.Group value="small">
                        <Radio.Button onClick={() => this.saveData()}><Icon type="fa-save" />保存</Radio.Button>
                        <Radio.Button onClick={() => this.openAndCloseEditMode()}>开启/关闭编辑</Radio.Button>
                      <Radio.Button onClick={() => this.openAndCloseEditMode('api')}>开启编辑(API)</Radio.Button>
                    </Radio.Group>
                    <Radio.Group value="small">
                        <Radio.Button onClick={() => this.saveSelectedRows()}><Icon type="fa-save" />保存选中</Radio.Button>
                        <Radio.Button onClick={() => this.deleteSelectedRows()}>删除选中</Radio.Button>
                    </Radio.Group>
                    <Radio.Group value="small">
                        <Radio.Button onClick={() => this.setSelectedRows()}>设置选中</Radio.Button>
                        <Radio.Button onClick={() => this.removeSelectedRows()}>取消选中</Radio.Button>
                    </Radio.Group>
                    <Radio.Group value="small">
                        <Radio.Button onClick={() => this.setColumnTemplate()}>设置列模版</Radio.Button>
                        <Radio.Button onClick={() => this.setRowTemplate()}>设置行模版</Radio.Button>
                    </Radio.Group>
                    <Radio.Group value="small">
                        <Radio.Button onClick={() => this.addRow()}>添加行</Radio.Button>
                        <Radio.Button onClick={() => this.addColumn()}>添加列</Radio.Button>
                        <Radio.Button onClick={() => this.removeColumn()}>移除列</Radio.Button>
                        <Radio.Button onClick={() => this.addColumnButton()}>添加列按钮</Radio.Button>
                    </Radio.Group>
                    <Radio.Group value="small">
                        <Radio.Button onClick={() => this.getData()}>获取数据</Radio.Button>
                        <Radio.Button onClick={() => this.removeData()}>移除数据</Radio.Button>
                    </Radio.Group>

                    <Radio.Group value="small">
                        <Radio.Button onClick={() => this.setColumnVisible(false)}>列不可见</Radio.Button>
                        <Radio.Button onClick={() => this.setColumnVisible(true)}>列可见</Radio.Button>
                        (生日）
                    </Radio.Group>
                    <Radio.Group value="small">
                        <Radio.Button onClick={() => this.switchSelectMode()}>单选/多选</Radio.Button>
                        <Radio.Button onClick={() => this.openAndCloseSelectMode()}>可选中开启/关闭</Radio.Button>
                    </Radio.Group>

                    <Radio.Group value="small">
                      <Radio.Button onClick={() => this.setColumnsEditMode()}>开启列编辑</Radio.Button>
                      <Radio.Button onClick={() => this.setColumnsReadOnly()}>关闭列编辑</Radio.Button>
                    </Radio.Group>

                    <Radio.Group value="small">
                        <Radio.Button onClick={() => this.setRowsEditMode()}>开启行编辑</Radio.Button>
                        <Radio.Button onClick={() => this.setRowsReadOnly()}>关闭行编辑</Radio.Button>
                    </Radio.Group>
                    <Radio.Group value="small">
                        <Radio.Button onClick={() => this.getColumnDict()}>获取列字典</Radio.Button>
                        <Radio.Button onClick={() => this.setColumnDict()}>设置列字典</Radio.Button>
                    </Radio.Group>

                    <Radio.Group value="small">
                        <Radio.Button onClick={() => this.getPagination()}>获取分页器</Radio.Button>
                        <Radio.Button onClick={() => this.showPagination()}>显示隐藏分页器</Radio.Button>
                    </Radio.Group>

                    <Radio.Group value="small">
                        <Radio.Button onClick={() => this.setPageSize()}>设置页面条数</Radio.Button>
                        <Radio.Button onClick={() => this.closePagination()}>关闭分页</Radio.Button>
                    </Radio.Group>

                    <Radio.Group value="small">
                        <Radio.Button onClick={() => this.setEnableBtnGroup()}>按钮组显示隐藏</Radio.Button>
                        <Radio.Button onClick={() => this.openAndCloseBordered()}>边框线</Radio.Button>
                    </Radio.Group>

                    <Radio.Group value="small">
                        <Radio.Button onClick={() => this.setFilterValue()}>修改过滤器值</Radio.Button>
                        <Radio.Button onClick={() => this.getFilter()}>取过滤器值</Radio.Button>
                        <Radio.Button onClick={this.getDataSource}>获取数据</Radio.Button>
                    </Radio.Group>

                  <Radio.Group value="small">
                    <Radio.Button onClick={() => this.setColumnFixed()}>固定列</Radio.Button>
                  </Radio.Group>

                  <Radio.Group value="small">
                    <Radio.Button onClick={() => this.setMergeColumns()}>合并列</Radio.Button>
                  </Radio.Group>

                </Col>
                <Col span={19}>
                    <DataTable
                        dataFormId="demo-MainCasePersonList"
                        dataReady={this.dataReady}
                        formReady={this.formReady}
                        closeSelection={this.state.closeSelection}
                        selectionType={this.state.selectionType}
                        editMode={this.state.editMode}
                        enableButtonBar={this.state.enableButtonBar}
                        onSelectRow={this.onSelectRow}
                        bordered={this.state.bordered}
                        onPageChanged={this.onPageChanged}
                        onItemsPerPageChanged={this.onItemsPerPageChanged}
                        showPagination={this.state.showPagination}
                        pageSize={this.state.pageSize}
                        majorKey="id"
                        onChange={this.handleColumnChange}
                        scroll={{ x: 1500 }}
                        lineNumber={true}
                        //mergeColumns={['gender']}
                    />
                </Col>
            </Row>
        );
    }
}
