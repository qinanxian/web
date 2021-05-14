import React from 'react';
import DefaultProcessor from './defaultProcessor';
import AreaProcessor from './areaProcessor';

const WorkflowTaskProcessor = (props) => {
  const { processor = 'default' } = props;
  return processor !== "default" ? <AreaProcessor {...props} processor={processor}/> : <DefaultProcessor {...props}/>;
};

export default WorkflowTaskProcessor;
