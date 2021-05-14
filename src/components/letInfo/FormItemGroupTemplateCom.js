import React from 'react';
import * as component from '../index';

// 详情item组件
export default class FormItemGroupTemplateCom extends React.Component{
  shouldComponentUpdate(nextProps){
    // 详情分组模板渲染条件
    // 条件1：分组模板发生变化
    // 条件2：分组模板内的字段数量发生了变化
    return (this._getDisplay(nextProps) !== this._getDisplay(this.props))
      || (this._getTemplate(nextProps) !== this._getTemplate(this.props));
  }
  _getDisplay = (props) => {
    const { groups, group } = props;
    return groups[group].filter(item => item.elementUIHint.visible).length !== 0 ? '' : 'none';
  };
  _getTemplate = (props) => {
    const { groupTemplates, group } = props;
    return groupTemplates[group] || groupTemplates[group.split(':')[0]];
  };
  _renderFormGroupTemplate = () => {
    const { dataValue, prefix = 'ro', groups, group } = this.props;
    const display = this._getDisplay(this.props);
    const template = this._getTemplate(this.props);
    const groupData = groups[group];
    const com = typeof template === 'function' ? template(groupData, dataValue) : template;
    return (
      <component.Fieldset
        expanded
        legend={group.split(':')[1] || group}
        id={group}
        key={group}
        style={{ display: display }}
      >
        <div className={`${prefix}-info-container ${prefix}-info-ctaTable`}>
          {React.cloneElement(com, { group: groupData, data: dataValue })}
        </div>
      </component.Fieldset>
    );
  };
  render() {
    return this._renderFormGroupTemplate();
  }
}
