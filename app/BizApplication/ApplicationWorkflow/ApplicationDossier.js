import React from "react";
import Dossier from "../../../appframe/Common/Dossier";

/**
 * 资料清单
 */
export default class ApplicationDossier extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dossierId: props.param.dossierId,
        };
    }


    render() {
        return (<Dossier dossierId={this.state.dossierId}/>);
    }
}
