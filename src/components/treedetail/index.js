import React from 'react';

import {Tree, Row, Col} from '../../../src/components';
import './style/index.less';
import NotFound from '../../../appframe/Container/NotFound';
import * as appframe from '../../../appframe/.rof.index';
//import * as app from '../../../app/.rof.index';
import * as cache from '../../../src/lib/cache';

export default class TreeDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            detail: null,
            param: {},
        };
    }

    _onSelect = (selectedKeys, selectedNodes) => {
        const {onSelect} = this.props;
        onSelect && onSelect({
            selectedKeys,
            openDetail: this._openDetail,
        }, selectedNodes);
    };
    _getObject = (obj, fields) => {
        return fields.filter(field => !!field).reduce((a, b) => {
            const tempB = b.replace(/\W/g, '');
            console.log(a, b, tempB);
            return a && a[tempB];
        }, obj);
    };
    _openDetail = (com, param) => {
        let detail = <NotFound/>;
        if (typeof com === 'string') {
            const Obj = this._getObject(cache.getCache('app') || {}, com.split('/'))
                || this._getObject(appframe, com.split('/')) || NotFound;
            // 防止组件出现缓存
            detail = <Obj key={Math.uuid()}/> || <NotFound/>;
        } else {
            detail = com;
        }
        this.setState({
            param,
            detail,
        });
    };

    render() {
        const {treeSpan = 8, detailSpan = 16} = this.props;
        return (
          <Row>
            <Col span={treeSpan} className='nav-tree-container'>
              <Tree
                {...this.props}
                showLine
                onSelect={this._onSelect}
                />
            </Col>
            <Col span={detailSpan}>
              {this.state.detail &&
                React.cloneElement(this.state.detail, {...this.state.param})}
            </Col>
          </Row>
        );
    }
}
