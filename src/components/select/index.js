import React from 'react';
import RoSelect from './defaultSelect';
import EditSelect from './editSelect';
import './style/index.less';

export default class Select extends React.Component{
    render() {
        const { props } = this;
        if (props.custMultiple) {
            return <EditSelect {...props}/>;
        }
        return <RoSelect {...props}/>;
    }
}
