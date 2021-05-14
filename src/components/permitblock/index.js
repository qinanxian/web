import React, {Fragment} from 'react';
import PropTypes from 'prop-types';

export default class PermitBlock extends React.Component {
    render() {
        const {permission: {action = []} = {}} = this.context;
        const {permitCode, children} = this.props;
        if (permitCode && !action.map(a => a.permitCode).includes(permitCode)) {
            return '';
        }
        return <Fragment>{children}</Fragment>;
    }
}

PermitBlock.contextTypes = {
    permission: PropTypes.object,
};
