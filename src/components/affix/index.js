/**
 * Created by dpcui on 28/12/2017.
 */
import React from 'react';
import ReactDom from 'react-dom';

export default class Affix extends React.Component{
  componentDidMount() {
    /* eslint-disable */
    const children = ReactDom.findDOMNode(this.instance);
    const affixInstance = ReactDom.findDOMNode(this.affixInstance);
    const rect = children.getBoundingClientRect();
    affixInstance.style.position = 'fixed';
    affixInstance.style.left = rect.left + 'px';
    affixInstance.style.top = rect.top + 'px';
  }
  render() {
    const { children } = this.props;
    return (
      <div
        ref={instance => this.affixInstance = instance}
        //style={{ position: 'fixed' }}
      >
        {
          React.cloneElement(children, { ref: instance => this.instance = instance })
        }
      </div>
    );
  }
}
