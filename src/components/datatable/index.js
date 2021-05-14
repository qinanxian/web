/**
 * Created by dpcui on 09/01/2018.
 */

import React from 'react';
import DataList from '../datalist';
import * as dataFormApi from '../../lib/dataform';

class RoDataTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return <DataList dataInovker={dataFormApi} {...this.props} />;
    }
}

export default RoDataTable;
