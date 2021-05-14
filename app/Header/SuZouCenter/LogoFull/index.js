import React from 'react';
import {Icon, propsCompose} from 'roface';
import "./index.less"

@propsCompose
export default class LogoFull extends React.Component {

    handleHomeClick = () => {
        this.props.flexTabs.goToTab && this.props.flexTabs.goToTab();
    };

    render() {
        return (
            <React.Fragment>
                <Icon className="szc-logo-full-icon" onClick={this.handleHomeClick} type='roic-amix'/>
                <span className="szc-logo-full-text">苏州安硕数科</span>
            </React.Fragment>
        );
    }
}
