import React from 'react';
import { Icon as RoIcon, rest } from '../../../../src/components';
import * as config from '../../../../src/lib/config';


import './style/index.less';

export default class Icon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      icons: {},
    };
  }
  componentDidMount(){
    config.default.icons.forEach((icon) => {
      rest.get(rest.getLocationURL(icon.path)).then((res) => {
        this.setState({
          icons: {
            ...this.state.icons,
            [icon.name]: res,
          },
        });
      });
    });
  }
  render() {
    const { prefix = 'ro', onClick } = this.props;
    return (<div>
      {
        config.default.icons.map(icon => icon.name).map((icon) => {
          return (<div key={icon}>
            <h1>{`${icon}图标库`}</h1>
            <div className={`${prefix}-show-case-items`}>
              {
                (this.state.icons[icon] && this.state.icons[icon].match(/<i.*class="fa.*">.*<\/i>/g) || []).map((item, index) => {
                  const tempItem = item.match(/".*(?=".*aria)/g)[0];
                  const type = tempItem.split('"fa ')[1];
                  return (<div key={`${type}${index}`} className={`${prefix}-show-case-item`}>
                    <RoIcon type={type} className={`${prefix}-show-case-item-icon`} onClick={() => onClick(type)}/>
                    {type}
                  </div>);
                })
              }
              {
                (this.state.icons[icon] && this.state.icons[icon].match(/<div.*class="fontclass">.*<\/div>/g) || []).map((item) => {
                  const tempItem = item.match(/\..*(?=<)/g)[0];
                  let type = '';
                  if (tempItem.startsWith('.icon')) {
                    type = tempItem.replace(/\.icon-/g, '');
                  } else {
                    type = tempItem.split('.')[1];
                  }
                  return (<div key={tempItem} className={`${prefix}-show-case-item`}>
                    <RoIcon type={type} className={`${prefix}-show-case-item-icon`}  onClick={() => onClick(type)}/>
                    {type}
                  </div>);
                })
              }
            </div>
          </div>);
        })
      }
    </div>);
  }
}
