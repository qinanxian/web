import React from 'react';
import { Fieldset,Table,Button } from '../../../../src/components';
import './style/index.less';

export default class CommonIconList extends React.Component {
  constructor(props) {
    super(props);
    this.processButton = [
      {case: {type:'primary',name:'提交'}, icon: 'fa-send-o', color: 'primary'},
      {case: {type:'primary',name:'传阅'}, icon: 'fa-share-alt', color: 'primary'},
      {case: {type:'primary',name:'否决'}, icon: 'minuscircleo', color: 'primary'},
      {case: {type:'primary',name:'作废'}, icon: 'closecircleo', color: 'primary'},
      {case: {type:'primary',name:'退回'}, icon: 'fa-backward', color: 'primary'},
      {case: {type:'primary',name:'转他人处理'}, icon: 'fa-mail-forward', color: 'primary'},
      {case: {type:'primary',name:'驳回'}, icon: 'fa-rotate-left', color: 'primary'},
      {case: {type:'primary',name:'征求他人意见'}, icon: 'fa-phone', color: 'primary'},
      {case: {type:'primary',name:'查看流程'}, icon: 'roic-workflow', color: 'primary'}
      ];
    this.generalButton = [
      {case: {type:'default',name:'默认'}, icon: '', color: 'default'},
      {case: {type:'primary',name:'新增'}, icon: 'fa-plus', color: 'primary'},
      {case: {type:'success',name:'创建'}, icon: 'fa-file-o', color: 'primary'},
      {case: {type:'primary',name:'详情'}, icon: 'fa-file-text-o', color: 'primary'},
      {case: {type:'warning',name:'编辑'}, icon: 'fa-edit', color: 'warning'},
      {case: {type:'danger',name:'移除'}, icon: 'fa-minus', color: 'danger'},
      {case: {type:'danger',name:'删除'}, icon: 'fa-trash-o', color: 'danger'},
      {case: {type:'primary',name:'保存'}, icon: 'fa-save', color: 'success'},
      {case: {type:'primary',name:'暂存'}, icon: 'roic-apply', color: 'primary'},
      {case: {type:'primary',name:'确定'}, icon: 'fa-check', color: 'primary'},
      {case: {type:'primary',name:'取消'}, icon: 'fa-ban', color: 'primary'},
      {case: {type:'primary',name:'上传'}, icon: 'fa-upload', color: 'primary'},
      {case: {type:'primary',name:'下载'}, icon: 'fa-download', color: 'primary'},
      {case: {type:'primary',name:'预览'}, icon: 'fa-eye', color: 'primary'},
      {case: {type:'primary',name:'设置'}, icon: 'fa-gear', color: 'primary'},
      {case:{type:'primary',name:'返回'}, icon: 'fa-reply', color: 'primary'}
    ];
    this.columns = [
      {title:'案例',dataIndex:'case',key:'case'},
      {title:'图标',dataIndex:'icon',key:'icon'},
      {title:'颜色',dataIndex:'color',key:'color'}
      ];
  }
  render() {
    const { prefix = 'ro' } = this.props;
    const genBut = this.generalButton.map((item,index) => {
      return {
        ...item,
        key:index,
        case:(<Button type={item.case.type} icon={item.icon}>{item.case.name}</Button>)
      };
    });
    const proBut = this.processButton.map((item,index) => {
      return {
        ...item,
        key:index,
        case:(<Button type={item.case.type} icon={item.icon}>{item.case.name}</Button>)
      };
    });
    return (
      <div className={`${prefix}-common-icon-list`}>
        <Fieldset legend="一般按钮" style={{width:'45%'}}>
          <Table
            key={1}
            columns={this.columns}
            pagination={false}
            size='small'
            dataSource={genBut}
          />
        </Fieldset>
        <Fieldset legend="流程按钮" style={{width:'45%'}}>
          <Table
            key={2}
            columns={this.columns}
            pagination={false}
            size='small'
            dataSource={proBut}
          />
        </Fieldset>
      </div>
    );
  }
}