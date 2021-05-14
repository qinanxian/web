import React from 'react';

/* eslint-disable */
const outerClose = (WrappedCom) => {
    return class extends React.Component {
        componentDidMount(){
            window.addEventListener('click', this._execute);
        }
        componentWillUnmount() {
            window.removeEventListener('click', this._execute);
        }
        _execute = (e) => {
            const compareValue = this.wrappedRef.compareDocumentPosition(e.target);
            if (this.wrappedRef && compareValue !== 20) {
                this.comInstance.closeDropDown();
            }
        };
        render(){
            return <WrappedCom {...this.props} ref={instance => this.comInstance = instance} editRef={instance => this.wrappedRef = instance}/>;
        }
    };
};

export default outerClose;
