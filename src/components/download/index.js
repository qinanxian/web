import React from 'react';

import * as rest from '../../../src/lib/rest';
import {Button, Icon } from '../index';

export default class Download extends React.Component {
  _downLoad = () => {
    const { action, params = {}, beforeDownload, type = 'get' } = this.props;
    if (!beforeDownload) {
      rest.download(action, type, params);
    } else {
      const result = beforeDownload();
        if(result.then) {
            result.then((res) => {
                if (res.action) {
                    rest.download(res.action, type, params);
                } else {
                    rest.download(action, type, params);
                }
            });
        } else if(result !== false) {
            rest.download(action, type, params);
        }
    }
  };
  render() {
    const { name = '下载', buttonType, disable } = this.props;
    return (
      <span>
        {
          buttonType && buttonType === 'a' ?
            (
              <Icon onClick={e => this._downLoad(e)} style={{whiteSpace: 'nowrap'}} disable={disable} type="fa-download"/>
            ) :
            (
              <Button disabled={disable === 'true'} onClick={e => this._downLoad(e)}>
                <Icon disable={disable} type="fa-download"/>{name}
              </Button>
            )
        }
      </span>
    );
  }
}
