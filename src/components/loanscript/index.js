import React from 'react';
import * as rest from '../../lib/rest';

export default class LoanScript extends React.Component {
  componentDidMount() {
    const { src = [] } = this.props;
    let tempArray = [].concat(src);
    tempArray = tempArray.map((s) => {
      if (!s.startsWith('http')) {
        return rest.getLocationURL(s);
      }
      return s;
    });
    Promise.all(tempArray.map(s => rest.get(s))).then((result) => {
      result.forEach((res) => {
        /* eslint-disable */
        eval(res);
      });
    }).catch((err) => {
      console.log(err);
    });
  }
  render() {
    return '';
  }
}
