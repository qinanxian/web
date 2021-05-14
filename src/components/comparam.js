import React from 'react';
import PropTypes from 'prop-types';

export const comContextParam = (Com) => {
    class Compose extends React.Component {
        getChildContext(){
            const { comParam = {} } = this.context;
            return {
                comParam: {...comParam, ...(this.props.comParam || {})},
            };
        }
        render() {
            return <Com {...this.props} />;
        }
    }
    Compose.childContextTypes = {
        comParam: PropTypes.object,
    };
    Compose.contextTypes = {
        comParam: PropTypes.object,
    };
    /* eslint-disable */
    Com.contextTypes = {
        comParam: PropTypes.object,
    };
    return Compose;
};
