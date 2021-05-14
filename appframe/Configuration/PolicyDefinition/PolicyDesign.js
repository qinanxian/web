import React from 'react';

import * as appframe from '../../../appframe/.rof.index';
import * as app from '../../../app/.rof.index';
import * as components from '../../../src/components';
import './style/index.less';
import * as rest from '../../../src/lib/rest';
import PolicyDesignParamInfo from './PolicyDesignParamInfo';
import GridLayout from 'react-grid-layout';
import NotFound from '../../Container/NotFound';
import CustomerComponent from './CustomerComponent';
import PolcDefinitionBaseInfo from './PolcDefinitionBaseInfo';
import PolcDefinitionBaseInfoEditor from './PolcDefinitionBaseInfoEditor';
import DefaultValue from './DefaultValue';
import PolicyParamFormulaResult from './PolicyParamFormulaResult'

const {Switch, openModal, Button, Icon, Fieldset, TextRangeInput, Popconfirm, Dropdown, Notify, Menu} = components;
import { Form } from '@ant-design/compatible';

const FormItem = Form.Item;
const ButtonGroup = Button.Group;

export default Form.create()(class PolicyDesign extends React.Component {
    static CustomerComponent = CustomerComponent;

    constructor(props) {
        super(props);
        this.flag = true;
        this.layout = {};
        // const groups = this.calculateGroup(json);
        // this.applyEditorMode = {};
        this.state = {
            key: (props.param || {}).type === 'design',
            data: {},
            groups:{},
            width: 0,
            layout: {},
            dicts: {},
            applyEditorMode: {},
            defaultValue: {},
        };
      this.id = `ro-${Math.uuid(8)}`;
    };

    componentDidMount() {
        const {policyId} = this.props.param;
        Promise.all([rest.get(`/policy/get/${policyId}`), rest.get(`/policy/get/${policyId}/dicts`)]).then(res => {
          const groups = this.calculateGroup(res[0]);
          const layout = this.initLayout(groups);
            this.setState({
              data: res[0],
              groups,
              layout,
              dicts: res[1],
              defaultValue: this.initParamsDefaultValue(res[0]),
            });
        });
    };

    componentWillUnmount() {
        this.flag = false;
    }
    initParamsDefaultValue = (data = {}) => {
      return (data.policyParams || []).reduce((pre, next) => {
          const tempObj = {...pre};
          tempObj[next.paramCode] = next.defaultValue;
          return tempObj;
      }, {});
    };
    widthChange = (width) => {
        this.flag && this.setState({width});
    };
    editTypeChange = (key) => {
        this.props.form.resetFields();
        this.setState({
            key,
        });
    };
    openParamInfo = (param) => {
        const {data} = this.state;
        const tempParam = param;
        openModal(<PolicyDesignParamInfo
            param={tempParam}
            groups={this.state.groups}
            policyParams={data.policyParams}
        />, {
            isDragact: true,
            defaultButton: true,
            title: tempParam && tempParam.paramCode ? "参数详情" : "新增参数信息",
            onOk: (modal, compnent, btn) => {
                btn.setLoading(true);
                compnent.validateFields((err, values) => {
                    btn.setLoading(false);
                    if (!err) {
                        modal.close();
                        let tempData = {};
                        if (tempParam) {
                            // 修改
                            tempData = {
                                ...data,
                                policyParams: (data.policyParams || []).map(p => {
                                    if (p.paramCode === param.paramCode) {
                                        return {
                                            ...p,
                                            ...values,
                                            isExpression: values.isExpression ? 'Y' : 'N'
                                        }
                                    }
                                    return p;
                                })
                            }
                        } else {
                            // 增加
                            tempData = {
                                ...data,
                                policyParams: (data.policyParams || []).concat({
                                  ...values,
                                  sortValue: 9999,
                                  isExpression: values.isExpression ? 'Y' : 'N',
                                  applyEditorMode: 'Editable'
                                })
                            }
                        }
                        // 更新界面
                        const groups = this.calculateGroup(tempData);
                        this.setState({
                            data: tempData,
                            groups,
                            layout: this.initLayout(groups),
                        });
                    }
                });
            },
        });
    };
    deleteParam = (param) => {
        const {data} = this.state;
        let tempData = {
            ...data,
            policyParams: (data.policyParams || []).filter(p => p.paramCode !== param.paramCode)
        };
        const groups = this.calculateGroup(tempData);
        this.setState({
            data: tempData,
            groups,
            layout: this.initLayout(groups),
        });
    };
    calculateGroup = (data) => {
        const tempGroups = {};
        (data.policyParams || []).forEach(d => {
            const groupName = d.groupName || '__noGroup:未分组参数';
            if (!tempGroups[groupName]) {
                tempGroups[groupName] = [];
            }
            tempGroups[groupName].push(d);
        });
        return tempGroups
    };
    mergeSort = (arr) => {  //采用自上而下的递归方法
        const len = arr.length;
        if (len < 2) {
            return arr;
        }
        const middle = Math.floor(len / 2),
            left = arr.slice(0, middle),
            right = arr.slice(middle);
        return this.merge(this.mergeSort(left), this.mergeSort(right));
    };
    merge = (left, right) => {
        const result = [];
        while (left.length > 0 && right.length > 0) {
            if (left[0].sortValue <= right[0].sortValue) {
                result.push(left.shift());
            } else {
                result.push(right.shift());
            }
        }
        while (left.length)
            result.push(left.shift());
        while (right.length)
            result.push(right.shift());
        return result;
    };
    sortCodeGenerate = (index, multiple = 1, size = 4) => {
        // 1.索引乘以倍数
        const code = index * multiple;
        // 2.补全位数
        const addSize = (newCode, newSize) => {
            if (newCode.toString().length < newSize) {
                return addSize(`0${newCode}`, newSize);
            }
            return newCode;
        };
        return addSize(code, size);
    };
    layoutChange = (g, layout) => {
        // 不改变state只是记录layout的变化
        this.layout[g] = layout;
    };
    omit = (obj, fields) => {
        const temp = {...obj};
        fields.forEach(f => {
            delete temp[f];
        });
        return temp;
    };

    resetPosition = (layout) => {
        const col = 2;
        const initLayout = {
            x: 0,
            y: 0,
            w: 0,
            h: 0,
        };
        const tempLayout = [];
        return layout.map((l) => {
            let x = initLayout.x;
            let y = initLayout.y;
            const h = l.h;
            const w = l.w;
            x += initLayout.w;
            if (x + w > col) {
                // 判断x是否需要换上新行
                x = 0;
                y += initLayout.h;
                if (tempLayout.some(t => t.maxX > x && t.maxY > y)) {
                    x += 1;
                }
            }
            initLayout.x = x;
            initLayout.y = y;
            initLayout.w = w;
            initLayout.h = h;
            tempLayout.push({maxX: x + w, maxY: y + h});
            return {
                ...l,
                x,
                y,
                w,
                h,
            };
        });
    };
    initLayout = (groups) => {
        const calcGroupField = (gp) => {
            const initLayout = {
                x: 0,
                y: 0,
                w: 0,
                h: 0,
            };
            const col = 2;
            return this.mergeSort(groups[gp] || []).map((param) => {
                let x = initLayout.x;
                let y = initLayout.y;
                const h = param.spanRows && parseInt(param.spanRows, 10) || 1;
                const w = param.spanCols && parseInt(param.spanCols, 10) || 1;
                x += initLayout.w;
                if (x + w > col) {
                    x = 0;
                    y += initLayout.h;
                }
                initLayout.x = x;
                initLayout.y = y;
                initLayout.w = w;
                initLayout.h = h;
                return {
                    i: param.paramCode,
                    x,
                    y,
                    w,
                    h,
                    isResizable: col !== 1,
                };
            });
        };
        return Object.keys(groups).reduce((a, b) => {
            const tempObject = a;
            tempObject[b] = this.resetPosition(calcGroupField(b));
            return tempObject;
        }, {});
    };
    applyEditorModeChange = (param, item) => {
        //this.applyEditorMode[param] = value;
        this.setState({
          applyEditorMode: {
            ...this.state.applyEditorMode,
            [param]: item.key,
          }
        })
    };
    getValue = (param) => {
        if (param.dataValueMode && param.dataValueMode === 'Range') {
            return [param.valueMinExpr, param.valueMaxExpr];
        }
        return param.valueExpr;
    };
    getComponent = (param) => {
        if (param.dataValueMode && param.dataValueMode === 'Range') {
            return TextRangeInput;
        } else if (param.editorMode === 'ReferComponent' && param.referUrl) {
            return this.getObject(app, param.referUrl.split('/')) || this.getObject(appframe, param.referUrl.split('/')) || NotFound
        }
        return components[param.editorMode || 'Text'];
    };
    getObject = (obj, fields) => {
        return fields.filter(field => !!field).reduce((a, b) => {
            const tempB = b.replace(/\W/g, '');
            return a && a[tempB];
        }, obj);
    };

    getPolicyDefinitionData = () => {
        const {groups, data, applyEditorMode} = this.state;
        // 保存的时候更新最新的顺序，并且生成最新的sortValue
        let tempData = Object.keys(groups).sort((a, b) => a.split(':')[0] - b.split(':')[0]).map((g, gIndex) => {
            return (groups[g] || []).map(param => {
                const position = (this.layout[g] || []).filter(p => p.i === param.paramCode)[0] || {};
                return {
                    ...param,
                    x: position.x || 0,
                    y: position.y || 0,
                    h: position.h || 1,
                    w: position.w || 1
                }
            }).sort((a, b) => {
                if (a.y === b.y) {
                    return a.x - b.x;
                }
                return a.y - b.y;
            }).map((param, index) => {
                const temp = this.omit(param, ['x', 'y', 'h', 'w']);
                return {
                    ...temp,
                    sortValue: this.sortCodeGenerate(gIndex * 10 + index),
                    spanRows: param.h,
                    spanCols: param.w,
                }
            })
        }).reduce((a, b) => a.concat(b), []);
        // 更新数据
        // 1.更新显示和编辑类型
        // 2.更新每个字段的value
        const allValues = this.props.form.getFieldsValue();
        tempData = tempData.map(p => {
            const value = allValues[p.paramCode];
            const apply = {
                applyEditorMode: applyEditorMode[p.paramCode] || p.applyEditorMode,
            };
            if (p.dataValueMode === 'Range') {
                return {
                    ...p,
                    valueMinExpr: value && value[0],
                    valueMaxExpr: value && value[1],
                    ...apply,
                    defaultValue: this.state.defaultValue[p.paramCode],
                }
            }
            return {
                ...p,
                valueExpr: value,
                ...apply,
                defaultValue: this.state.defaultValue[p.paramCode]
            }
        });

        return {
            ...data,
            policyParams: tempData
        };
    };
    formReady = (voInfo) => {
      this.voInfo = voInfo;
    };
    editorPolicy = () => {
        openModal(<PolcDefinitionBaseInfoEditor policyId={this.props.param.policyId}/>, {
          title: '产品详细信息',
          defaultButton: true,
          onOk: (modal, compnent, btn) => {
            btn.setLoading(true);
            compnent.savePolcInfo((err, value) => {
              if (!err) {
                modal.close();
                // 刷新基础信息的那个分组
                this.voInfo.refresh();
              }
              btn.setLoading(false);
            });
          },
        })
    };

    testParamFormula = () => {
        const policyDefinitionData = this.getPolicyDefinitionData();
        openModal(<PolicyParamFormulaResult rest={rest} policyDefinitionData={policyDefinitionData}/>, {
            title: '测试参数公式结果',
            width:'45%',
            defaultButton: true,
            onOk: (modal, compnent, btn) => {
                btn.setLoading(true);
                compnent.savePolcInfo((err, value) => {
                    if (!err) {
                        modal.close();
                        // 刷新基础信息的那个分组
                       // this.voInfo.refresh();
                    }
                   // btn.setLoading(false);
                });
            },
        })
    };


    /**
     * 保存功能
     */
    savePolicy = (btn, type) => {
        const policyDefinitionData = this.getPolicyDefinitionData();
        console.log(policyDefinitionData);
        btn && btn.setLoading(true);
        rest.post(`/policy/${type === 'config' ? 'saveValues' : 'save'}`, policyDefinitionData)
            .then(() => {
              Notify.info({
                message: '保存成功',
                description: '保存成功',
              });
              btn && btn.setLoading(false);
              //this.props.refresh();
            }).catch((error) => {
              btn && btn.setLoading(false);
              Notify.info({
                message: '保存失败',
                description: '保存失败',
              });
            });
    };
    _editModeChn = (key) => {
        let data = '';
        switch(key){
          case 'Label': data = '标签显示';break;
          case 'Readonly': data = '只读';break;
          case 'Editable': data = '可编辑';break;
          case 'Hidden': data = '隐藏';break;
        }
        return data;
    };
    _getDefaultValue = (code) => {
      let tempValue = this.state.defaultValue[code];
      const option = (this.state.dicts[code]
        || [{code: 'demo1', name: 'demo1'}, {code: 'demo2', name: 'demo2'}]).filter(d => d.code === tempValue)[0];
      return (option && option.name) || tempValue;
    };
    _setDefaultValue = (code, editorMode) => {
      let tempValue = this.state.defaultValue[code];
      const onChange = (newValue) => {
        if (editorMode === 'Text' && newValue) {
          tempValue = parseFloat(newValue);
        } else {
          tempValue = newValue;
        }
      };
      const otherProps = {};
      if (editorMode === 'CheckBox') {
        let value = this.props.form.getFieldValue(code);
        const valueArray = (value && value.split(',')) || [];
        otherProps.options = (this.state.dicts[code]
          || [{code: 'demo1', name: 'demo1'}, {code: 'demo2', name: 'demo2'}]).filter(d => valueArray.includes(d.code));
      }
      openModal(<DefaultValue onChange={onChange} value={tempValue} {...otherProps}/>, {
        title: '设置参数默认值',
        defaultButton: true,
        isDragact: true,
        onOk: (modal) => {
          modal && modal.close();
          this.setState({
            defaultValue: {
              ...this.state.defaultValue,
              [code]: tempValue,
            }
          })
        },
      });
    };
    render() {
        const {key, groups, width, layout, dicts} = this.state;
        const { type = 'config' } = this.props.param || {};
        const formItemLayout = {
            //labelCol: {span: 8},
            //wrapperCol: {span: 16},
        };
      const {getFieldDecorator} = this.props.form;
        return (<div className='ro-policy-design'>
            <div className='ro-policy-design-tools'>
                <div>
                    <Button
                        type='primary'
                        icon='fa-save'
                        style={{display: key ? '' : 'none'}}
                        onClick={(e, btn) => this.savePolicy(btn, 'design')}
                    >
                        保存设计
                    </Button>
                  <Button
                    type='primary'
                    icon='fa-save'
                    style={{display: key ? 'none' : ''}}
                    onClick={(e, btn) => this.savePolicy(btn, 'config')}
                  >
                    保存配置
                  </Button>
                  <Button
                    style={{marginLeft: 10}}
                    icon='fa-edit'
                    onClick={this.editorPolicy}
                  >
                    编辑产品基础信息
                  </Button>
                  <Button
                    style={{marginLeft: 10}}
                    icon='fa-eye'
                    onClick={this.testParamFormula}
                  >
                    测试参数公式
                  </Button>
                </div>
                <div className='ro-policy-design-tools-right'>
                    <Button
                        className='ro-policy-design-tools-right-botton'
                        style={{display: key ? '' : 'none'}}
                        icon='fa-plus'
                        onClick={() => this.openParamInfo()}
                    >
                        增加参数
                    </Button>
                    <Switch
                        className={`ro-policy-design-info-item-${type === 'config' ? 'hidden' : 'show'}`}
                        checkedChildren="设计模式"
                        unCheckedChildren="编辑模式"
                        defaultChecked={key}
                        onChange={this.editTypeChange}
                    />
                </div>
            </div>
            <div className='ro-policy-design-info-container'>
                <PolcDefinitionBaseInfo policyId={this.props.param.policyId} formReady={this.formReady}/>
                <Form>
                    <div id={this.id} style={{position: 'relative'}}>
                        {
                            Object.keys(groups).sort((a, b) => a.split(':')[0] - b.split(':')[0]).map(g => {
                                return (
                                    <Fieldset key={g} legend={g.split(':')[1]} expanded={true}>
                                        <GridLayout
                                            draggableHandle=".ro-policy-design-layout-move-icon"
                                            key={g}
                                            isDraggable={key}
                                            isResizable={key}
                                            cols={2}
                                            width={width - 80}
                                            rowHeight={70}
                                            margin={[1, 1]}
                                            layout={layout[g]}
                                            onLayoutChange={(layout) => this.layoutChange(g, layout)}
                                        >
                                            {
                                                this.mergeSort(groups[g] || []).map(param => {
                                                    const Com = this.getComponent(param);
                                                    const value = this.getValue(param);
                                                    const props = {
                                                        options:
                                                          dicts[param.paramCode] ||
                                                          [{code: 'demo1', name: 'demo1'}, {code: 'demo2', name: 'demo2'}]
                                                    };
                                                    props.style = {
                                                        //minWidth: 120,
                                                        //width: '150%'
                                                    };
                                                    if (param.editorMode === 'Select') {
                                                        props.containerId = this.id;
                                                    }
                                                    const paramLayout = layout[g].filter(l => l.i === param.paramCode)[0] || {};
                                                  const menu = (
                                                    <Menu
                                                      className='ro-policy-design-info-edit-select-menu'
                                                      onClick={(item) => this.applyEditorModeChange(param.paramCode, item)}
                                                    >
                                                      <Menu.Item key="Label">标签显示</Menu.Item>
                                                      <Menu.Item key="Readonly">只读</Menu.Item>
                                                      <Menu.Item key="Editable">可编辑</Menu.Item>
                                                      <Menu.Item key="Hidden">隐藏</Menu.Item>
                                                    </Menu>
                                                  );
                                                    return (
                                                        <div
                                                            className={
                                                                `ro-policy-design-info ${paramLayout.x === 0 ? 'ro-policy-design-info-border-right' : ''}`}
                                                            key={param.paramCode}
                                                        >
                                                            <div
                                                              style={{
                                                                display: ((param.editorMode === 'Text' && param.dataValueMode === 'Range')
                                                                  || (param.editorMode === 'CheckBox' && param.dataValueMode === 'Multi')) && !key ? '' : 'none'
                                                              }}
                                                              className={`ro-policy-design-info-edit-default`}>
                                                              <a
                                                                onClick={() => this._setDefaultValue(param.paramCode, param.editorMode)}
                                                                style={{marginRight: 5}}
                                                              >
                                                                设置默认值
                                                              </a>
                                                              <span>[{this._getDefaultValue(param.paramCode)}]</span>
                                                            </div>
                                                            <FormItem
                                                                {...formItemLayout}
                                                                labelWidth={param.layoutMode === 'Vertical' ? '100%' : 100}
                                                                label={`${param.paramName}`}
                                                                //wrapperCol={{span: 16}}
                                                                //wrapperStyle={{width: 'calc(100% - 100px)'}}
                                                                className={`ro-policy-design-info-${param.layoutMode || 'Horizontal'}`}
                                                            >
                                                                {getFieldDecorator(param.paramCode, {
                                                                    initialValue: value,
                                                                })(<Com readOnly={key} item={param} {...props}/>)}
                                                            </FormItem>
                                                            <div className='ro-policy-design-info-edit-opt'>
                                                                <div
                                                                    className={`ro-policy-design-info-edit-${
                                                                      (!key && param.inOut === 'Out'
                                                                        && param.editorMode !== 'Label'
                                                                        && param.editorMode !== 'ReferComponent') ? 'show' : 'hidden'}`}
                                                                >
                                                                    <div className='ro-policy-design-info-edit-select'>
                                                                        <span
                                                                          style={{marginRight: 5}}
                                                                        >
                                                                          [{
                                                                          this._editModeChn(this.state.applyEditorMode[param.paramCode] || param.applyEditorMode)
                                                                        }]
                                                                      </span>
                                                                      <Dropdown
                                                                        overlay={menu}
                                                                        trigger={['click']}
                                                                      >
                                                                        <a style={{marginRight: 5}}>编辑形式<Icon style={{marginLeft: 5}} type="down" /></a>
                                                                      </Dropdown>
                                                                    </div>
                                                                </div>
                                                                <ButtonGroup
                                                                    className={`ro-policy-design-info-group-${key ? 'show' : 'hidden'}`}
                                                                >
                                                                    <Button
                                                                        className='ro-policy-design-info-group-button'
                                                                        icon="fa-edit"
                                                                        onClick={() => this.openParamInfo(param)}
                                                                    />
                                                                    <Popconfirm
                                                                        title="确定删除该参数吗?"
                                                                        onConfirm={() => this.deleteParam(param)}
                                                                        okText="确定"
                                                                        cancelText="取消"
                                                                    >
                                                                        <Button
                                                                            icon="fa-trash-o"
                                                                            className='ro-policy-design-info-group-button'
                                                                        />
                                                                    </Popconfirm>
                                                                </ButtonGroup>
                                                            </div>
                                                            <Icon
                                                                style={{display: key ? '' : 'none'}}
                                                                className="ro-policy-design-layout-move-icon"
                                                                type="fa-arrows"
                                                            />
                                                        </div>
                                                    );
                                                })
                                            }
                                        </GridLayout>
                                    </Fieldset>
                                );
                            })
                        }
                    </div>
                </Form>
            </div>
        </div>);
    }
});
