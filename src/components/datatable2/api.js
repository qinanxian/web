/**
 * Created by hjtu (hjtu@amarsoft.com) on 2017/12/18.
 */

// 对当前列表的操作
const listAPI = {
  // 渲染列表到指定位置
  'rendListTo': rendListTo,
  //★ 渲染列表
  'run': fillTplAndData,
  // ***同步渲染(同步渲染包括过滤器、分页、排序功能等将自动变更为前端模式) ***
  'runSync': runSync,
  //★ 设置只读模式，按列只读，按行只读
  'setCellReadOnly': setCellReadOnly,
  //★ 设置单选、多选、非选择模式[ok] U
  'setSelectionMode': setSelectionMode,
  // 单选时控制radio显示隐藏[ok]
  'setRadioBox': useRadioOnSingle,
  //★ 设置是否打开编辑模式[ok] U
  'setEditable': setEditable,
  // 全量保存数据[ok] U
  'saveData': saveData,
  // 删除一行或多行数据[ok] U
  'deleteData': deleteData,
  // 刷新数据源[ok] U
  'refresh': refresh,
  // 执行列表前端校验，判断是否通过前端校验[ok] U
  'validate': validate,
  //★ 获取当前表格数据的拷贝[ok]U
  'getData': getData,
  //★ 获取指定列的代码表[ok]
  'getColumnDict': getColumnDict,
  //★ 设置指定列的代码表[ok]
  'setColumnDict': setColumnDict,
  // 自定义表尾	[ok]
  'customizeFooter': setFooterTemplate,
  //★ ***设置列表尺寸***
  'setSize': setSize,
  //★ ***设置列表是否开启边框***
  'setBorder': setBorder,
  // ***自定义选择器（在全选操作的checkbox的位置增加的下拉选项）***[ok]
  'rowSelections': rowSelections,
  // ***设置树形表格模式下的缩进 ***[ok]
  'setIndentSize': setTreeIndent,
  //★ ***设置列表简单操作模式，只有选中只读数据的功能，其他操作全部屏蔽 ***[ok]
  'setSimpleMode': setSimpleMode,
}


// 监听操作
const listenerAPI = {
  // 设置小计
  'setGrandTotal': setGrandTotal,
  //★ 设置行联动[ok]
  'setLinkage': setLinkage,
  //★ 行选中监听（多行状态）[ok]U
  'onSelectRow': onSelectRow,
  //★ ***单行选中监听（单行状态）***[ok]U
  'onSelectionChange': onSelectionChange,
  //★ ***数据查询成功后的监听***[ok]U
  'onBeforeRenderData': onBeforeRenderData,
  //★ ***分页切换监听***[ok]U
  'onPageChanged': onPageChanged,
  //★ ***单页数据条数监听***[ok]U,
  'onItemsPerPageChanged': itemsPerPageChanged
}


// 对行的操作
const rowAPI = {
  //★ 设置行只读[ok]U
  'setRowReadOnly': setRowReadOnly,
  //★ 设置不可选中行[ok]
  'setDisabledRows': setDisabledRows,
  //★ 设置指定行样式[ok]
  'setStyleChangeRows': setRowStyle,
  //★ 设置首屏选中的行[ok]
  'setSelectedRows': setSelectedRows,
  //★ 在表格末尾新增一行数据[ok]
  'appendRow': appendRow,
  //★在表首末尾新增一行数据[ok]
  'prependRow': prependRow,
  //★ 设置全局跨页跨选择器选中 [ok]
  'setRemember': setRemember,
  //★ 获取全局跨页跨选择器选中行[ok]
  'getRemembers': getRemembers,
  //★ 设置所有行是否选中[ok]
  'setSelectionAll': setSelectionAll,
  // ***设置行合并规则***
  'setRowMerge': setRowMerge,
  // ***设置行可展开***[ok]
  'setExpandRow': setExpandRow,
}


// 对列的操作
const columnAPI = {
  //★ 设置只读列隐藏展示[ok]
  'setColumnVisible': setColumnVisible,
  //★ 设置指定列只读 [ok]
  'setColumnReadOnly': setColumnReadOnly,
  //★ 设置列样式[ok]
  'setColumnStyle': setColumnStyle,
  //★ 设置列模板[ok]
  'setColumnTemplate': setColumnTemplate,
  //★  统一替换指定列的值
  'replaceColumnValue': replaceColumnValue,
  // ***设置列固定
  'setColumnFixed': setColumnFixed,
  // ***通过列设置行排序***[ok]设置服务端或客户端排序规则
  'setSorter': setColumnSorterModel,
  // ***通过列设置行筛选器***[ok]
  'setFilter': setFilter,
  // ***设置列合并规则***
  'setColumnMerge': setColumnMerge,
}


// 对表头的操作
const headerAPI = {
  // 自定义表头[ok]
  'customizeHeader': setHeaderTemplate,
  // ***设置表头固定***[ok]U
  'setHeaderFixed': setHeaderFixed,
  // ***设置表头分组***[ok]
  'setHeaderGroup': setHeaderGroup,
  // ***设置表头合并***
  'setHeaderMerge': setHeaderMerge,
}


// 对当前行或选中行的操作
const selectedAPI = {
  //★ 获取选中行（单行）[ok]U
  'getSelectedRow': getSelectedRow,
  //★ 获取所有选中行数据[ok]U
  'getSelectedRows': getSelectedRows,
  // 保存单行数据[ok]U
  'saveRowData': saveRow,
  //★ 移除一行或多行数据[ok]U
  'removeRow': removeRow,
  //★ 在当前行上方插入数据[ok]U
  'insertBefore': insertBefore,
  //★ 在当前行下方插入数据[ok]U
  'insertAfter': insertAfter,

}


// 对单元格的操作
const elementAPI = {
  //★ 设置单元格值[ok]U
  "setValue": setValue,
  //★ 对单元格进行操作[ok]U
  'setElement': setElement,
}


// 对按钮组的操作
const buttonsAPI = {
  // 设置按钮组显示隐藏
  'enableButtonBar': enableButtonBar,
  // 添加按钮
  'addBtn': addBtn,
  // 设置按钮禁用
  'setButtonDisabled': setButtonDisabled,
  // 在指定位置插入按钮
  'insertBtn': insertBtn,
  // 设置按钮组悬浮
  'setButtonsFixed': setButtonsFixed,
}


// 对搜索器的操作
const searcherAPI = {
  // 设置指定过滤器默认值[ok]
  'setFilterValue': setFilterValue,
  // 首屏状态下是否不加载数据而是通过搜索器加载数据[ok]
  'enableSearchOnly': enableSearchOnly,
  // 设置搜索器显示隐藏[ok]
  'enableSearchBar': enableSearchBar,
  // [ok]
  'exportCSV': exportCSV,
}


// 对分页器的操作
const paginationAPI = {
  //★ 设置分页单页显示条目数[ok]
  'setPageSize': setPageSize,
  // 设置分页器显示隐藏[ok]
  'setPagination': setPagination,
  // 获取当前分页状态[ok]
  'isPagination': isPagination,
  //★ 关闭分页
  'closePagination': closePagination,
}

export default Object.assign({}, listAPI, listenerAPI, rowAPI, columnAPI, headerAPI, selectedAPI, elementAPI, buttonsAPI, searcherAPI, paginationAPI)
