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
                {/*<Icon className="we-logo-full-icon" onClick={this.handleHomeClick} type='fa-bank'/>*/}
                <div style={{paddingTop: '0px',overflow: 'hidden',height: '50px'}}>
                    <img src="asset/logo.png" style={{height: '50px'}} />
                    <span className="we-logo-full-text" style={{position: 'relative', top: '5px'}}>杭州联合银行</span>
                </div>
                {/*<span className="we-logo-full-text">杭州联合银行</span>*/}
            </React.Fragment>
        );
    }
}
