import React from 'react';
import PropTypes from 'prop-types';

export default class CellRender extends React.Component {
    static contextTypes = {
        columns: PropTypes.array,
        dataSource: PropTypes.array,
    };

    render() {
        const { columns, dataSource } = this.context;
        const { name, rowIndex } = this.props;
        const currentColumn = columns.filter(c => c.key === name)[0] || {
            render: () => {
                return '未匹配';
            },
        };
        const record = dataSource[rowIndex] || {};
        const renderFuc = currentColumn.render;
        return renderFuc(record[name], record, rowIndex);
    }
}
