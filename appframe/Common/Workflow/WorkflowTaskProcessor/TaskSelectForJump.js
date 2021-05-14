import React from 'react';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { Table, ConfigProvider } from '../../../../src/components';

export default class TaskSelectForJump extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: [],
      columns: [{
        className: 'ro-data-table-first-td',
        title: '',
        dataIndex: '__i',
        key: '__i',
        width: 40,
        sortCode: '0',
        render: (text, record, index) => (
          <div
            key="__i"
          >
            {index + 1}
          </div>
        )
      },{
        title: '阶段名称',
        dataIndex: 'name',
      }, {
        title: '处理人',
        dataIndex: 'assignee',
      }],
      rowSelection: {
        onSelect: this._onSelect,
        type: 'radio'
      },
      selectedRows: []
    }
  }
  componentDidMount() {
    const { rest, procInstId } = this.props;
    rest.get(`/workflow/process/forwardActivityTask/${procInstId}`).then(res => {
      this.setState({
        data: this.restructureData(res) || []
      })
    })
  }
  restructureData = (data) => {
    let newdata = data.map(item => {
      let assi = item.candidateGroupIdExpressions.reduce((total,cur,index) => {
        return total = total + `${index > 0 ? ', ' : ''}` + cur['expressionText'];
      },[]);
      return {
        key:item.key,
        name:item.nameExpression.expressionText,
        assignee:assi || item.assigneeExpression.expressionText
      }
    });
    return newdata;
  };
  _onSelect = (e, record) => {
    const {autoConfig,onSelectRow} = this.props;
    this.setState({
      selectedRows: [record]
    });
    if(autoConfig){
      const selectedRecord = record.children ?
        this.state.data.filter(item => item.name === record.children[2])
      : record;
      onSelectRow && onSelectRow([].concat(selectedRecord));
    }else{
      onSelectRow && onSelectRow([], [record]);
    }
  };
  _renderTableRow = (row) => {
    const { selectedRows } = this.state;
    const {  prefix = 'ro' } = this.props;
    const children = row.children;
    const record = children[0].props.record;
    const selected = selectedRows.includes(record);
    let className = selected ? `ant-table-row  ant-table-row-level-0 ${prefix}-data-table-row-selected`
      : 'ant-table-row  ant-table-row-level-0';
    return (
      <tr
        {...row}
        style={{display: record.__hidden ? 'none' : ''}}
        className={className}
        onClick={ (e) => this._onSelect(e, record)}
      >
        { children }
      </tr>
    );
  };
  _renderTableCell = (cell) => {
    const {autoConfig} = this.props;
    const realCell = cell.children[2];
    if(autoConfig){
      return (
        <td {...cell} onClick={(e) => this._onSelect(e, cell)}>
          {realCell}
        </td>
      );
    } else {
      const cellProps = realCell.props;
      const record = cellProps && cellProps.record;
      return (
        <td {...cell} onClick={(e) => this._onSelect(e, record)}>
          {cell.children}
        </td>
      );
    }
  };
  render() {
    const { columns, data } = this.state;
    return (
      <ConfigProvider locale={zhCN}>
        <Table
          components={{ body: { row: this._renderTableRow, cell: this._renderTableCell } }}
          columns={columns}
          dataSource={data}
          rowKey="id"
        />
    </ConfigProvider>)
  }
}
