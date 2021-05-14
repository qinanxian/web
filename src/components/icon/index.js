import React from 'react';
import { Icon } from '@ant-design/compatible';
import profile from '../../../profile';

import './style/index.less';

export default class RoIcon extends React.Component {
  preventClick = (e, value) => {
    if (value !== 'true') {
      this.props.onClick && this.props.onClick(e);
    }
  };
  render() {
    const { icons = [] } = profile;
    const { type, className, disable = 'false' } = this.props;
    const customerIcon = icons.filter(i => type.startsWith(`${i.name}-`))[0];
    const valid = disable !== 'false' ? 'icon-unvalid' : 'icon-valid';
    if (type.startsWith('roic-') || type.startsWith('roic_')) {
      const roicProps = {
        ...this.props,
        onClick:e => this.preventClick(e, disable),
        className: `${valid} icon roic ${type} ${className || ''} ro-icon`,
      };
      return (<i {...roicProps}>{}</i>);
    } else if (type.startsWith('fa-')) {
      const faProps = {
        ...this.props,
        onClick:e => this.preventClick(e, disable),
        className: `${valid} fa ${type} ${className || ''} ro-icon`,
      };
      return (<i {...faProps}>{}</i>);
    } else if (customerIcon) {
      const faProps = {
        ...this.props,
        onClick:e => this.preventClick(e, disable),
        className: `${valid} ${customerIcon.prefix}${type} ${className || ''} ro-icon`,
      };
      return (<i {...faProps}>{}</i>);
    }
    const faProps = {
      ...this.props,
      onClick:e => this.preventClick(e, disable),
    };
    return (<Icon {...faProps}/>);
  }
}
