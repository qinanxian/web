import React from 'react';
import yaml from 'js-yaml';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { removeProperties } from './utils';
import { Message } from '../../../src/components';

class ExportData extends React.Component {
  _toggleCopy = (isShow) => {
    const copyPre = document.getElementById('copy-pre');
    copyPre.style.opacity = isShow ? 1 : 0;
  };

  copied = (text, result) => {
    if (result) {
      Message.success('复制成功');
    } else {
      Message.success('复制失败');
    }
  };

  render() {
    const { type } = this.props;
    const jsonString = JSON.stringify({
      ...removeProperties(this.props.dataSource, ['direction', 'id', 'expanded']) || {} }, null, 2);

    const yamlString = yaml.safeDump({
        ...removeProperties(this.props.dataSource, ['direction', 'id', 'expanded']) || {} },
      {
        indent: 2,
      });

    const data = type === 'yaml' ?  yamlString : jsonString;
    /* eslint-disable */
      return (
        <div className='ro-develop-console'>
          <div className='ro-develop-console-right'>
            <div className='ro-develop-console-right-border'>
              <pre
                id='code'
                className="ro-develop-console-right-bash"
                onMouseOver={() => this._toggleCopy(true)}
                onMouseOut={() => this._toggleCopy(false)}
              >
                {
                  <CopyToClipboard
                    text={data}
                    onCopy={this.copied}
                  >
                    <span id='copy-pre' className='copy-pre'>复制</span>
                  </CopyToClipboard>
                }
                { data }
              </pre>
            </div>
          </div>
        </div>
      );
  }
}

export default ExportData;
