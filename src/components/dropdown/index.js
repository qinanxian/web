/**
 * Created by dpcui on 28/12/2017.
 */

import React from 'react';
import { Menu, Dropdown } from 'antd';
import { compose } from '../compose';

@compose
class RoDropdown extends React.Component {
  static Button = Dropdown.Button;
  handleMenuClick = e => this.props.onClick && this.props.onClick(e);

  /* eslint-disable */
  renderOptionItem = () => {
    const children = [];
    const {options = [], optionName, optionField, optionDisabled} = this.props;
    if (options[0] instanceof Object) {
      for (let i = 0; i < options.length; i++) {
        children.push(
          <Menu.Item
            key={options[i][optionField]}
            disabled={optionDisabled && optionDisabled.includes(options[i][optionField])}
          >
            { options[i][optionName] }
          </Menu.Item>
        );
      }
    } else {
      for (let i = 0; i < options.length; i++) {
        children.push(
          <Menu.Item
            key={options[i]}
            disabled={optionDisabled && optionDisabled.includes(options[i])}
          >
            { options[i] }
          </Menu.Item>
        );
      }
    }
    return children;
  };
  /* eslint-disable */

  render() {
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        { this.renderOptionItem() }
      </Menu>
    );

    return (
      <Dropdown
        overlay={menu}
        {...this.props}
      />
    );
  }
}

export default RoDropdown;
