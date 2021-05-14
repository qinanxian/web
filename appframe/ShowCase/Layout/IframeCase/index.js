import React from 'react';
import {Iframe, rest} from '../../../../src/components';


export default class IframeCase extends React.Component {
    render() {
        return (<Iframe {...this.props} allowNewWindow={true} url={rest.getRequestURL('/showcase/pageoffice/index')}/>);
    }
}

