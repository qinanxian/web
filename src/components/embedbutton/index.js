import React from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import { Icon } from '../index';
import { filterProps } from '../../lib/object';
import './style/index.less';

export default class EmbedButton extends React.Component {
  static Group = Button.Group;
  constructor(props) {
    super(props);
    this.state = {
      loading: props.loading,
      disabled: props.disabled,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.loading !== this.props.loading) {
      this.setState({
        loading: nextProps.loading,
      });
    }
    if (nextProps.disabled !== this.props.disabled) {
      this.setState({
        disabled: nextProps.disabled,
      });
    }
  }
  _onClick = (e) => {
    const { onClick } = this.props;
    onClick && onClick(e, {
      setLoading: this._setLoading,
      setDisabled: this._setDisabled,
    });
  };
  _setLoading = (loading) => {
    this.setState({
      loading,
    });
  };
  _setDisabled = (disabled) => {
    this.setState({
      disabled,
    });
  };
  render() {
    const { permission : { action = [] } = {} } = this.context;
    const { prefix = 'ro', type, className, style, permitCode } = this.props;
    if (permitCode && !action.map(a => a.permitCode).includes(permitCode)) {
      return '';
    }
    return (
      <Button
        {...filterProps(this.props, ['size','icon', 'selectbind', 'onClick', 'loading', 'disabled'])}
        style={{height:'18px',lineHeight:'12px',borderRadius:'3px',fontSize:'12px',...style}}
        className={`${prefix}-button-${type} ${className}`}
        onClick={this._onClick}
        size='small'
        loading={this.state.loading}
        disabled={this.state.disabled}
      >
        {this.props.icon && <Icon type={this.props.icon}/>}
        {this.props.children}
      </Button>);
  }
}

EmbedButton.contextTypes = {
  permission: PropTypes.object,
};
