import React from 'react';

export default class Anchor extends React.Component {
  render() {
    const { title, id } = this.props;
    return (<div id={id}>{title}</div>);
  }
}
