/**
 * Created by hjtu (hjtu@amarsoft.com) on 2018/1/3.
 */
import React from 'react';
import {Button} from 'antd';

class DetailButtons extends React.Component {
  // 按钮去重函数
  static cnki(list, btn) {
    if (list && list.length) {
      for (let i = 0; i < list.length; i += 1) {
        if (list[i].name === btn.name) {
          list.splice(i, 1);
          return i;
        }
      }
    }
    return -1;
  }

  constructor(props) {
    super(props);
    this.state = { buttonList: props.buttonList || [], methods: props.methods };
    if(this.state.methods) {
      this.state.methods.addBtn = this.addBtn.bind(this);
    }
  }


  setBtnVisible(btnName, visible) {
    this.setState((state) => {
      const buttonList = state.buttonList.slice(0);
      for (let i = 0; i < buttonList.length; i += 1) {
        if (buttonList[i].name === btnName) {
          buttonList[i].visible = visible;
          break;
        }
      }
      return { buttonList };
    });
  }

  setBtnDisable(btnName, disabled) {
    this.setState((state) => {
      const buttonList = state.buttonList.slice(0);
      for (let i = 0; i < buttonList.length; i += 1) {
        if (buttonList[i].name === btnName) {
          buttonList[i].disabled = disabled;
          break;
        }
      }
      return { buttonList };
    });
  }

  /*eslint-disable no-else-return*/
  addBtn(btn) {
    let btnObject = {};
    if (btn instanceof Array) {
      if (!btn[0]) {
        console.error('button name is required !');
        return;
      } else {
        btnObject.name = btn[0];
      }
      if (!btn[1]) {
        console.error('button onclick event is required');
        return;
      } else {
        btnObject.onclick = btn[1];
      }
      btnObject.icon = btn[2] || '';
      btnObject.type = btn[3] || 'default';
      btnObject.size = btn[4] || 'default';
      btnObject.id = btn[5] || `detail-table-btn-${parseInt(new Date().getTime() * Math.random(), 10)}`;
      btnObject.disabled = btn[6] || false;
      btnObject.visible = btn[7] || true;
    } else if (btn instanceof Object) {
      if (!btn.name) {
        console.error('button name is required !');
        return;
      }
      if (!btn.onclick) {
        console.error('button onclick event is required');
        return;
      }
      btnObject = {
        name: '',
        onclick: '',
        icon: '',
        type: 'default',
        size: 'default',
        id: `detail-table-btn-${parseInt(new Date().getTime() * Math.random(), 10)}`,
        disabled: false,
        visible: true,
      };
      Object.assign(btnObject, btn);
    }
    this.setState((state) => {
      // 查重处理
      const buttonList = state.buttonList.slice(0);
      DetailButtons.cnki(buttonList, btnObject);
      buttonList.push(btnObject);
      return { buttonList };
    });
  }

  render() {
    return (
      <div>
        {this.state.buttonList.map((button) => {
          let btn = null;
          if (button.template) {
            btn = button.template;
          } else if (button.visible) {
            btn = <Button style={{ margin: '0 2px 2px 0' }} key={button.id} id={button.id} type={button.type} size={button.size} icon={button.icon} onClick={button.onclick} disabled={button.disabled}>{button.name}</Button>;
          }
          return btn;
        })}
      </div>
    );
  }
}
export default DetailButtons;
