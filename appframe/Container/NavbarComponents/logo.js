import React from 'react';
import config from '../../../src/lib/config';
import {Icon} from "../../../src/components";
import './style/index.less';

const pageStyle = config.surface.defaultOptions.pageStyle;

export default class Logo extends React.Component {
  _handleHome = () => {
    this.props.backHome && this.props.backHome();
  };
  renderLogo(){
    const { prefix = 'ro',menuType,collapse } = this.props;
    if (pageStyle) {
      return (
        <div style={{marginLeft:menuType ? !collapse ? '2px' : '-12px' : ''}} className={`${prefix}-navbar-logov2`}>
          <Icon style={{fontSize:!collapse ? '30px' : '18px'}} onClick={this._handleHome} type={config.brand.banner.logo}/>
          <span style={{display:collapse ? 'none' : 'inline-block'}} className={`${prefix}-navbar-logov2-text`}>{!menuType ? '' : config.brand.banner.title}</span>
        </div>
      );
    } else {
      return (
        <div style={{marginLeft:menuType ? '2px' : ''}} className={`${prefix}-navbar-logo`}>
          <Icon onClick={this._handleHome} type={config.brand.banner.logo}/>
          {/*<span className={`${prefix}-navbar-logo-text`}>{!menuType ? '' : config.brand.banner.title}</span>*/}
        </div>
      );
    }
  }
  render() {
    return (
      this.renderLogo()
    );
  }
}
