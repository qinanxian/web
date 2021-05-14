/**
 * Created by hjtu (hjtu@amarsoft.com) on 2017/12/18.
 */
import React from 'react';
import { notification, message, Button } from 'antd';
import { DataTable2 } from '../../../../src/components';

export default class DataListMajor extends React.Component {
  dataReady = (dataList) => {
    this.setState({ dataList });
  };

  formReady(formList) {
    console.warn(formList);
  }

  didMounted(api) {
    const vm = api;
    function setSize() {
      vm.setSize('small');
    }

    function setBorder() {
      vm.setBorder(false);
    }

    function toggleSelection() {
      // debugger;
      const a = vm.$get('rowSelection.type') === 'radio' ? 'multiple' : 'single';
      vm.setSelectionMode(a);
      // vm.setSelectionFixed(true);
    }

    function setDisabledRows() {
      const d = vm.getData();
      vm.setDisabledRows((row) => {
        return d.indexOf(row) <= 2; // Column configuration not to be checked
      });
    }

    function setSelectedRows() {
      vm.setSelectedRows((row, index) => {
        console.log(index);
        return index < 5;
      });
    }

    function onSelectRow() {
      vm.onSelectRow((selectedKeys, selectedRows) => {
        const rows = vm.getData();
        const rowsIdx = selectedRows.map((row) => {
          return rows.indexOf(row);
        });
        notification.open({
          message: '已选中行',
          description: `已选中行号：${rowsIdx.join(',')} 已选中：${selectedKeys.join(',')}
      已选中行数据：${JSON.stringify(selectedRows)}`,
        });
        // console.log('onSelectRow', selectedKeys, selectedRows);
      });
      message.success('设置选中行监听成功！');
    }

    function onSelectionChange() {
      vm.onSelectionChange((record, selected, selectedRows) => {
        notification.open({
          message: '单行选中状态已变更',
          description: `行号：${vm.getData().indexOf(record)}
      行数据：${JSON.stringify(selectedRows)}
当前行已${selected ? '选中' : '取消'}`,
        });
        // console.log('onSelectionChange', record, selected, selectedRows);
      });
      message.success('设置单行选中状态监听成功！');
    }

    function getSelectedRows() {
      notification.open({
        message: '已选中行',
        description: JSON.stringify(vm.getSelectedRows()),
      });
      // console.log(vm.getSelectedRows(), vm.getSelectedRow());
    }

    function getRandomKey() {
      return parseInt(Math.random() * 10000 + 1, 10).toString();
    }

    function prependRow() {
      const row = {
        key: getRandomKey(),
        name: 'SomeoneHead',
        age: 27,
        address: 'Shanghai No. 1 People Square',
      };
      vm.prependRow(row);
    }

    function appendRow() {
      const row = {
        key: getRandomKey(),
        name: 'SomeoneRear',
        age: 17,
        address: 'Shanghai No. 11 People Square',
      };
      vm.appendRow(row);
    }

    function insertBefore() {
      const currRow = vm.getSelectedRow();
      if (!currRow) {
        message.warning('请选中一行数据！');
        return;
      }
      const row = {
        key: getRandomKey(),
        name: 'SomeoneBefore',
        age: 20,
        address: 'Shanghai No. 12 People Square',
      };
      vm.insertBefore(currRow, row);
    }

    function insertAfter() {
      const currRow = vm.getSelectedRow();
      if (!currRow) {
        message.warning('请选中一行数据！');
        return;
      }
      const row = {
        key: getRandomKey(),
        name: 'SomeoneAfter',
        age: 32,
        address: 'Shanghai No. 21 People Square',
      };
      vm.insertAfter(currRow, row);
    }

    function removeRows() {
      const rows = vm.getSelectedRows();
      if (!rows || !rows.length) {
        message.warning('请选择要删除的行数据');
        return;
      }
      // const row = vm.getData()[parseInt(Math.random() * vm.getData.length, 10)];
      console.log(vm.removeRows(rows));
    }

    function setValue() {
      // debugger;
      vm.setValue((row, index) => { return index > 3; }, 'name', '哈哈');
    }

    function setDataRow() {

      vm.setDataRow(0, {
        name: '呵呵',
      }, true);
    }

    function setLinkage() {
      vm.setLinkage('name', (row) => {
        // console.warn(row, val, oldVal);
        return {
          height: (row.name ? row.name.length : 0) + 1,
          chnName: `都叫我雷锋${row.height}`,
        };
      });
      vm.setLinkage('height', (row) => {
        return {
          weight: Number(row.height) * 4,
        };
      });

      vm.setLinkage('weight', (row) => {
        return {
          code: Number(row.monthIncome) * Number(row.height),
        };
      });
      // debugger;
      vm.setLinkage('sex', (row) => {
        return {
          code: Number(row.monthIncome) + 3,
        };
      });
      vm.setLinkage('chnName', (row) => {
        return {
          code: `${row.chnName} 2`,
        };
      });
      message.success('联动设置成功！请随意改变值观察变化');
    }

    function closePagination() {
      vm.closePagination();
    }

    function setPageSize() {
      vm.setPageSize(2);
    }

    function setColumnReadonly() {
      vm.setColumnReadonly((column) => { return column.dataIndex.length <= 4; }, true);
    }

    function setRowReadonly() {
      vm.setRowReadonly((row, index) => { return !index; }, true);
    }

    function setReadonlyByRow() {
      vm.setCellReadonly(true, true);
    }

    function setReadonlyByCol() {
      vm.setCellReadonly(true);
    }

    function setElement() {
      vm.setElement((row) => {
        return Number(row.birth) > new Date('1990/01/01').getTime();
      }, 'height', (row, column, index, value) => {
        return (
          <div style={{ backgroundColor: 'red', color: 'white', padding: '10px' }}>{value}</div>
        );
      });

      vm.setElement((row) => {
        return Number(row.birth) > new Date('1980/01/01').getTime();
      }, 'name', (row, column, index, value) => {
        return (
          <div style={{ backgroundColor: 'blue', color: 'white', padding: '10px' }}>{value}</div>
        );
      });

      message.success(`设置单元格成功！
  所有八零后的姓名用蓝色标注
所有九零后的身高用红色标注`);
    }

    function setEditable(){
      vm.setEditable(true);
    }

    function getColumnDict() {
      const field = 'hobby';
      notification.open({
        message: `${field}字段码表`,
        description: JSON.stringify(vm.getColumnDict(field)),
      });
    }

    function setColumnDict() {
      const field = 'hobby';
      const dict = vm.getColumnDict(field).concat([{ code: '00', name: '改bug' }]);
      vm.setColumnDict(field, dict);
      message.success(`设置${field}字段码表成功，请查看`);
    }

    function setColumnTemplate() {
      vm.setColumnTemplate('name', (row, column, index, text) => {
        return (<h2 style={{ backgroundColor: 'green' }}>{text}</h2>);
      });
      // vm.setColumnTemplate('birth', (row, column, index, text) => {
      //   return (<h3 style={{ backgroundColor: 'red', color: 'white' }}>{text}</h3>);
      // });
    }

    function replaceColumnValue() {
      vm.replaceColumnValue('birth', new Date('2000/01/01').getTime());
    }

    function setSelectionAll() {
      vm.setSelectionAll(true);
    }

    function getSelectionMode() {
      notification.open({
        message: '选中模式',
        description: `当前选中模式为：${vm.getSelectionMode()}`,
      });
    }

    function setRemember() {
      if (vm.getSelectionMode() !== 'multiple') {
        message.warning('非多选模式下不能设置跨查询选中，请设置为多选模式后重试');
      } else {
        vm.setRemember(true);
        message.success('设置跨查询选中数据成功，请查询数据后尝试');
      }
    }

    function getRemembers() {
      if (vm.getSelectionMode() !== 'multiple') {
        message.warning('非多选模式下不能设置跨查询选中，请设置为多选模式后重试');
      } else {
        const remembers = vm.getRemembers();
        notification.open({
          message: `跨查询选中的数据${remembers.length}条`,
          description: JSON.stringify(remembers),
        });
      }
    }

    function setGrandTotal() {
      vm.setGrandTotal('weight', 'sum');
      vm.setGrandTotal('height', 'average');
      message.success('设置小计成功！请查看表格页脚处');
    }

    function setGrandTotalVisible() {
      vm.setGrandTotalVisible(false);
    }

    function getGrandTotalResult() {
      const field = 'height';
      notification.open({
        message: `字段${field}的平均值`,
        description: vm.getGrandTotalResult(field) || null,
      });
    }

    function addBtn() {
      vm.addBtn({
        name: '测试',
        onclick: testme,
      });
    }

    function saveData() {
      vm.saveData().then(() => {
        message.success('数据保存成功！');
      });
    }

    function deleteData() {
      vm.deleteData(vm.getSelectedRow()).then(() => {
        message.success('数据删除成功！');
      });
    }

    vm.addBtn(['设置表格尺寸', setSize, 'arrows-alt', 'primary']);
    vm.addBtn({
      type: 'primary',
      onclick: setBorder,
      name: '设置表格边框',
    });
    vm.addBtn({
      type: 'primary',
      onclick: setEditable,
      name: '打开列表编辑模式',
    });
    vm.addBtn({
      type: 'primary',
      onclick: toggleSelection,
      name: '切换选中状态',
    });
    vm.addBtn({
      type: 'primary',
      onclick: setDisabledRows,
      name: '设置行禁止选中',
    });
    vm.addBtn({
      type: 'primary',
      onclick: setSelectedRows,
      name: '设置默认选中行',
    });
    vm.addBtn({
      type: 'primary',
      onclick: onSelectRow,
      name: '选中行监听',
    });
    vm.addBtn({
      type: 'primary',
      onclick: onSelectionChange,
      name: '单行选中状态监听',
    });
    vm.addBtn({
      type: 'primary',
      onclick: getSelectedRows,
      name: '获取选中行',
    });
    vm.addBtn({
      type: 'primary',
      onclick: prependRow,
      name: '在表首新增一行',
    });
    vm.addBtn({
      type: 'primary',
      onclick: appendRow,
      name: '在表尾新增一行',
    });
    vm.addBtn({
      type: 'primary',
      onclick: insertBefore,
      name: '在当前行上方新增一行',
    });
    vm.addBtn({
      type: 'primary',
      onclick: insertAfter,
      name: '在当前行下方新增一行',
    });
    vm.addBtn({
      type: 'primary',
      onclick: removeRows,
      name: '移除行',
    });
    vm.addBtn({
      type: 'primary',
      onclick: setValue,
      name: '设值',
    });
    vm.addBtn({
      type: 'primary',
      onclick: setDataRow,
      name: '设置行值',
    });
    vm.addBtn({
      type: 'primary',
      onclick: setLinkage,
      name: '设置行联动',
    });
    vm.addBtn({
      type: 'primary',
      onclick: closePagination,
      name: '关闭分页',
    });
    vm.addBtn({
      type: 'primary',
      onclick: setPageSize,
      name: '设置每页显示条目数',
    });
    vm.addBtn({
      type: 'primary',
      onclick: setColumnReadonly,
      name: '设置列只读',
    });
    vm.addBtn({
      type: 'primary',
      onclick: setRowReadonly,
      name: '设置行只读',
    });
    vm.addBtn({
      type: 'primary',
      onclick: setReadonlyByRow,
      name: '按行设置列表只读',
    });
    vm.addBtn({
      type: 'primary',
      onclick: setReadonlyByCol,
      name: '按列设置列表只读',
    });
    vm.addBtn({
      type: 'primary',
      onclick: setElement,
      name: '重置单元格',
    });
    vm.addBtn({
      type: 'primary',
      onclick: getColumnDict,
      name: '获取代码表',
    });
    vm.addBtn({
      type: 'primary',
      onclick: setColumnDict,
      name: '设置代码表',
    });
    vm.addBtn({
      type: 'primary',
      onclick: setColumnTemplate,
      name: '替换列模板',
    });
    vm.addBtn({
      type: 'primary',
      onclick: replaceColumnValue,
      name: '统一替换列值',
    });
    vm.addBtn({
      type: 'primary',
      onclick: setSelectionAll,
      name: '设置所有行选中',
    });
    vm.addBtn({
      type: 'primary',
      onclick: setRemember,
      name: '设置跨查询选中数据',
    });
    vm.addBtn({
      type: 'primary',
      onclick: getRemembers,
      name: '获取跨查询选中的数据',
    });
    vm.addBtn({
      type: 'primary',
      onclick: getSelectionMode,
      name: '获取选中模式',
    });
    vm.addBtn({
      type: 'primary',
      onclick: setGrandTotal,
      name: '设置小计',
    });
    vm.addBtn({
      type: 'primary',
      onclick: setGrandTotalVisible,
      name: '隐藏页脚小计',
    });
    vm.addBtn({
      type: 'primary',
      onclick: getGrandTotalResult,
      name: '获取小计值',
      // visible: false,
    });
    vm.addBtn({
      type: 'primary',
      onclick: addBtn,
      name: '添加按钮',
      icon: 'plus',
      disabled: true,
    });

    vm.addBtn({
      type: 'primary',
      onclick: saveData,
      name: '保存',
    });

    vm.addBtn({
      type: 'danger',
      onclick: deleteData,
      name: '删除',
      icon: 'delete',
    });
  }

  render() {
    return (
      <div>
        <DataTable2
          dataFormId="demo-BeanPersonList"
          dataFormParams={{ code: 'BeanPersonList' }}
          dataReady={this.dataReady}
          formReady={this.formReady}
          didMounted={this.didMounted}
        />
      </div>
    );
  }
}
