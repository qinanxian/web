import React from 'react';
import { TreeTable } from 'roface';

export default class TreeTableCase extends React.Component{
  expand = () => {
    this.voList.expand("A10-30");
  };
  collapse = () => {
    this.voList.collapse("A10-30");
  };
  dataReady = () => {
    //this.voList.expand("A12-60");
  };
  formReady = (voList) => {
    this.voList = voList;
    this.voList.addButton([{
      name: '展开',
      onClick: this.expand
    }, {
      name: '收起',
      onClick: this.collapse
    }]);
  };
  render() {
    return (
      <div>
        <TreeTable
          pageSize={300}
          dataFormId="system-MenuList"
          keyAttribute="id"
          parentAttribute="parentMenu"
          toggleAttribute="id"
          formReady={this.formReady}
          dataReady={this.dataReady}
          // 是否默认展开全部
          expandAll
          // 关闭点击单元格收起
          toggleAttributeCell={false}
        />
      </div>
    );
  }
}