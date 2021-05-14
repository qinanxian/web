import React from 'react';

import { DetailInfo } from '../../../../src/components';


export default class ReadingInfoCase extends React.Component {
    render() {
        return (
            <DetailInfo dataFormId="demo-PersonThreeColInfo" tableBorder={true} reading={true}  params={{id: 18}} />
        );
    }
}

