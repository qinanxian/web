import React from 'react';

import BpmnModeler from 'bpmn-js/lib/Modeler';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda';

import diagramXML from './resources/newDiagram.bpmn';
import './style/index.less';

export default class Design extends React.Component{
  constructor(props){
    super(props);
    this.id = `ro-${Math.uuid()}`;
    this.modeler = null;
  }
  componentDidMount() {
    this.modeler = new BpmnModeler({
      container: `#${this.id}-container`,
      propertiesPanel: {
        parent: `#${this.id}-properties`
      },
      additionalModules: [
        propertiesPanelModule,
        propertiesProviderModule
      ],
      moddleExtensions: {
        camunda: camundaModdleDescriptor
      }
    });
    this.modeler.importXML(diagramXML, function(err) {
      if (err) {

      } else {

      }
    });
  }

  render() {
    return <div className='ro-design-content with-diagram'>
      <div className='ro-design-canvas' id={`${this.id}-container`}>{}</div>
      <div className='ro-design-properties-panel-parent' id={`${this.id}-properties`}>{}</div>
    </div>;
  }
}
