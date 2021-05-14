import React from 'react';
import ReactDOM from 'react-dom';

// import Routers from './Routers';
import LoginPage from '../appframe/Container/LoginPage';

function initComponent() {
    ReactDOM.render(<LoginPage />, document.getElementById('app'));
}

initComponent();
