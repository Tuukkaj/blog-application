import React, { Component } from 'react';

import './App.css';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import Ribbon from "./components/Ribbon";
import ArticleView from "./components/ArticleView";

class App extends Component {
  render() {
    return (
      <div className="p-grid p-justify-center">
        <div className="p-col-8">
          <ArticleView/>
        </div>
      </div>
    );
  }
}

export default App;
