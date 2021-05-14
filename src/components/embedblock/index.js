import React from 'react';
import NotFound from '../../../appframe/Container/NotFound';
import * as appframe from '../../../appframe/.rof.index';
//import * as app from '../../../app/.rof.index';
import * as cache from '../../../src/lib/cache';

export default class EmbedBlock extends React.Component {
  componentDidMount() {
    const { ready } = this.props;
    ready && ready(this.instance);
  }
  _getObject = (obj, fields) => {
    return fields.filter(field => !!field).reduce((a, b) => {
      const tempB = b.replace(/\W/g, '');
      return a && a[tempB];
    }, obj);
  };
  render() {
    const { url } = this.props;
    const Com = this._getObject(cache.getCache('app') || {}, url.split('/'))
      || this._getObject(appframe, url.split('/')) || NotFound;
    return <Com ref={instance => this.instance = instance} {...this.props} />;
  }
}
