import React, {Component} from "react";
import {connect} from "react-redux";

import {Panel} from 'primereact/panel';

import * as actions from '../actions/ArticleActions';
import Loader from './Loader';

import './ArticleView.css';
import {Button} from "primereact/button";

class BlogView extends Component {
  constructor(props) {
    super(props);

    this.getContent = this.getContent.bind(this);
    this.renderArticle = this.renderArticle.bind(this);

    if (process.env.NODE_ENV === "development") {
      this.fetchUrl = "http://localhost:8080";
    } else {
      this.fetchUrl = window.location.origin;
    }
  }

  componentWillMount() {
    fetch(`${this.fetchUrl}/blogs/`)
      .then(response => response.json())
      .then(data => this.props.dispatch(actions.setBlogData(data)));
  }

  renderArticle(data) {
    const error = BlogView.getErrorMessage(data);

    if (error) {
      return error;
    }

    return (
      <div key={data.id}>
        <div className="p-grid p-align-center ">
          <div className="p-col-9">
            <h1>{data.title}</h1>
          </div>
          <div className="p-col-3">
            <Button label="Go to article" icon="pi pi-arrow-right" iconPos="right" className="p-button-secondary" onClick={e => window.location = `/#/articles/${data.id}`}/>
          </div>
        </div>
        <p>{data.content}</p>
      </div>
    );
  }

  getContent() {
    const blogData = this.props.BLOG_DATA;

    if(blogData != null) {
      if (Array.isArray(blogData)) {
        return blogData.map(blogEntry => this.renderArticle(blogEntry));
      } else {
        return this.renderArticle(blogData);
      }
    }

    return <Loader text="Fetching data..." />;
  }

  render() {
    return <div className="p-col-12" id="page">{this.getContent()}</div>;
  }

  static getErrorMessage(data) {
    if (typeof data === "object" && data["errorMessage"]) {
      return (
        <Panel header="Error" toggleable={true} className="error">
          <p>{data["errorMessage"]}</p>
        </Panel>
      );
    }

    return null;
  }
}

export default connect(data => data.blog)(BlogView);