import React from 'react';
import { Notify } from '../index';
import * as cache from '../../lib/cache';
import { getRequestURL } from '../../lib/rest';

export default class RestDownLoad extends React.Component{
  constructor(props){
    super(props);
    this.uuid = Math.uuid();
  }
  componentDidMount() {
    const form = document.getElementById(this.uuid);
    if (form) {
      form.submit();
      form.parentNode.removeChild(form);
    }
  }
  _onLoad = () => {
    const { removeDom } = this.props;
    Notify.error('下载失败！');
    removeDom && removeDom();
  };
  renderHiddenInput = (param, type) => {
    return Object.keys(param).map((p) => {
      // 如果value是一个数组则需要渲染两遍
      if (Array.isArray(param[p]) && type.toLocaleLowerCase() === 'get') {
          return (<div key={p}>
            {
              param[p].map((f, i) => (<input key={`${p}_${i}`} name={p} value={param[p][i]} readOnly/>)) // eslint-disable-line
            }
          </div>);
      }
      return <input key={p} name={p} value={param[p]} readOnly/>;
    });
  };
  render() {
    const { url, type, param = {} } = this.props;
    const session = 'X-SESSION-TOKEN';
    return (
      <iframe
        style={{ display: 'none' }}
        title={this.uuid}
        name={this.uuid}
        onLoad={this._onLoad}
      >
        <form
          id={this.uuid}
          action={getRequestURL(url)}
          method={type}
          target={this.uuid}
        >
          {
            this.renderHiddenInput({...param, [session]: cache.getSessionId()}, type)
          }
        </form>
      </iframe>
    );
  }
}
