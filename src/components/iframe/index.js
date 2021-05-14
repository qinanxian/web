import React from 'react';
import PropTypes from 'prop-types';
import { Spin,Icon,Tooltip } from '../../components';
import * as rest from '../../lib/rest';
import './style/index.less';

class Iframe extends React.Component {
  constructor(props){
    super(props);
    this.height = props.offsetTop || 110;
    this.tempUrl = props.local ? rest.getLocationURL(props.url || props.param.url)
      : rest.getRequestURL(props.url || props.param.url, true);
    this.allowNewWindow = props.allowNewWindow;
    this.id = Math.uuid();
    this.state = {
     // clientHeight: '100%',
      spinning: true,
    };
  }
  componentDidMount(){
    this.context.widthChangeAddListen &&
    this.context.widthChangeAddListen(this.id, this.calcHeight);
  }
  componentWillUnmount(){
      this.context.widthChangeRemoveListen && this.context.widthChangeRemoveListen(this.id);
  }
  calcHeight = () => {
    this.setState({
      clientHeight: `${document.documentElement.clientHeight - this.height}px`,
    });
  };
  _onLoad = () => {
    const { onLoad } = this.props;
    onLoad && onLoad(this.instance);
    this.setState({
      spinning: false,
      clientHeight: `${document.documentElement.clientHeight - this.height}px`,
    });
  };
  /* eslint-disable */
  openNewWindow = () => {
    this.props.flexTabs.openNewWindowIframe(this.props.title,this.tempUrl);
    return '';
  };
  render() {
    const {prefix = 'ro'} = this.props;
    return (
      <Spin spinning={this.state.spinning}>
        <div className={`${prefix}-iframe`}>
          <div className={`${prefix}-iframe-tool`} style={{ display:this.allowNewWindow ? '' : 'none' }}>
            <Tooltip title='新窗口打开' placement="topRight"><Icon onClick={this.openNewWindow} type='export'/></Tooltip>
          </div>
          <iframe
            ref={instance => this.instance = instance}
            width="100%"
            height={this.state.clientHeight}
            scrolling="auto"
            style={{border:"solid 1px #DCDCDC"}}
            src={this.tempUrl}
            onLoad={this._onLoad}
          >{}</iframe>
        </div>
      </Spin>
    );
  }
}

Iframe.contextTypes = {
    widthChangeAddListen: PropTypes.func,
    widthChangeRemoveListen: PropTypes.func,
};

export default Iframe;
