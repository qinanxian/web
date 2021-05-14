import React from 'react';
import PropTypes from 'prop-types';

import { CellRender } from '../index';

export default class CellRef extends React.Component {
    static contextTypes = {
        tableRowComponent: PropTypes.object,
    };

    render() {
        const { name } = this.props;
        const { rowIndex } = this.props;
        if (rowIndex !== undefined) {
            return <CellRender name={name} rowIndex={rowIndex}/>;
        }
        const {tableRowComponent: {props: {children = []} = {}} = {}} = this.context;
        const nodes = children.filter((child) => {
            return ((child.props && child.props.name === name) || child.key === name);
        });
        return nodes[0] || '未匹配';
    }
}
