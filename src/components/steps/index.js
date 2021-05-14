import React from 'react';
import { Steps } from 'antd';
import PropTypes from 'prop-types';
import { Button } from '../index';
import './style/index.less';

const Step = Steps.Step;

class RoSteps extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      current: props.current || 0,
      buttonStatus: {...(props.buttonStatus || {})},
      height: 'auto',
    };
    this.id = Math.uuid();
  }
  componentDidMount(){
    const { offsetTop } = this.props;
    if (offsetTop) {
        this.calcHeight();
        this.context.widthChangeAddListen &&
        this.context.widthChangeAddListen(this.id, this.calcHeight);
    }
  }
  componentWillReceiveProps(nextProps){
    if ((nextProps.current !== this.state.current) && (nextProps.current !== this.props.current)) {
      this.setState({
        current: nextProps.current,
      });
    }
  }
  componentWillUnmount(){
      const { offsetTop } = this.props;
      if (offsetTop) {
          this.context.widthChangeRemoveListen && this.context.widthChangeRemoveListen(this.id);
      }
  }
  calcHeight = () => {
    const { offsetTop } = this.props;
    this.setState({
        height: `${document.documentElement.clientHeight - offsetTop}px`,
    });
  };
  _setButtonDisabled = (key, status) => {
    this.setState({
      buttonStatus: {
        ...this.state.buttonStatus,
        [key]: status,
      },
    });
  };
  _next = (cb) => {
    this.setState({
      current: this.state.current + 1,
    }, () => {
      cb && cb(this.state.current);
    });
  };
  _pre = (cb) => {
    this.setState({
      current: this.state.current - 1,
    }, () => {
      cb && cb(this.state.current);
    });
  };
  _setStatus = (status) => {
    // wait process finish erro
    this.setState({
      status,
    });
  };
  render() {
    const { current, status } = this.state;
    const { prefix = 'ro', buttonClick, steps, style } = this.props;
    const stepCurrent = steps.filter((step, index) => index === current)[0];
    return (
      <div className={`${prefix}-steps`}>
        <Steps current={current} status={status} style={style}>
          {steps.map(item => <Step key={item.title} title={item.title} />)}
        </Steps>
        <div className={`${prefix}-steps-buttons`}>
          {((stepCurrent && stepCurrent.buttons) || []).map(item =>
            (<Button
              disabled={this.state.buttonStatus[item.key]}
              type={item.type}
              key={item.key}
              onClick={() => buttonClick(item.key,
                {
                  next: this._next,
                  pre: this._pre,
                  setStatus: this._setStatus,
                  setButtonDisabled: this._setButtonDisabled,
                }, this.instance)}
              icon={item.icon}
            >{item.name}</Button>))}
        </div>
        <div className={`${prefix}-steps-content`} style={{height: this.state.height, overflow: 'auto'}}>
          {
            stepCurrent && stepCurrent.content && React.cloneElement(
              stepCurrent.content,
              {
                key: stepCurrent.key,
                ref: instance => this.instance = instance,
              },
          )
          }
        </div>
      </div>);
  }
}

RoSteps.contextTypes = {
    widthChangeAddListen: PropTypes.func,
    widthChangeRemoveListen: PropTypes.func,
};

export default RoSteps;
