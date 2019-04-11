import React, {Component} from "react";
import {connect} from "react-redux";

import {Panel} from 'primereact/panel';

import * as actions from '../actions/ArticleActions';
import Loader from './Loader';

import './ArticleView.css';
import {Editor} from "primereact/editor";
import {Button} from "primereact/button";
import {SplitButton} from "primereact/splitbutton";
import {Menu} from "primereact/menu";

class ArticleView extends Component {
  constructor(props) {
    super(props);

    this.getContent = this.getContent.bind(this);
    this.fetchUserData = this.fetchUserData.bind(this);
    this.renderArticle = this.renderArticle.bind(this);
    this.fetchAllData = this.fetchAllData.bind(this);
    this.fetchUserData = this.fetchUserData.bind(this);
    this.postComment = this.postComment.bind(this);
    this.renderCommenting = this.renderCommenting.bind(this);
    this.renderComment = this.renderComment.bind(this);
    this.renderCommentAdminButton = this.renderCommentAdminButton.bind(this);
    this.renderArticleAdminButtons = this.renderArticleAdminButtons.bind(this);
    this.createAdminButtonItems = this.createAdminButtonItems.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
    this.deleteArticle = this.deleteArticle.bind(this);

    this.state = {comment: ""}
    if (process.env.NODE_ENV === "development") {
      this.fetchUrl = "http://localhost:8080";
    } else {
      this.fetchUrl = window.location.origin;
    }
  }

  componentWillMount() {
    this.fetchAllData();
  }

  fetchAllData() {
    fetch(`${this.fetchUrl}/blogs/${this.props.match.params.id}`)
      .then(response => response.json())
      .then(data => this.props.dispatch(actions.setBlogData(data)))
      .then(() => {this.fetchUserData(); this.fetchCommentData()});
  }

  fetchCommentData() {
    fetch(`${this.fetchUrl}/blogs/${this.props.match.params.id}/comments`)
      .then(response => response.json())
      .then(data => this.props.dispatch(actions.setCommentData(data)))
  }

  fetchUserData() {
    fetch(`${this.fetchUrl}/users/${this.props.BLOG_DATA.author_id}`)
      .then(response => response.json())
      .then(data => {
        this.props.dispatch(actions.setAuthorData(data))
      });
  }

  postComment() {
    if(this.state.comment) {
      const url = this.fetchUrl + "/blogs/comments";
      let data = new FormData();
      data.append("comment", this.state.comment);
      data.append("articleId",this.props.match.params.id);
      fetch(url, {
        method: "POST",
        credentials: "include",
        body: data
      }).then(response => console.log(response))
        .then(() => window.location.reload())
    }
  }

  renderArticle(data) {
    const error = ArticleView.getErrorMessage(data);

    if (error) {
      return error;
    }

    return (
      <div key={data.id} className="article">
        <div className="p-grid">
          <div className="p-col-11">
            <h1>{data.title}</h1>
          </div>
          <div className="p-col-1 p-col-align-center">
            {this.renderArticleAdminButtons()}
          </div>
        </div>
          <p>{this.props.AUTHOR_DATA?this.props.AUTHOR_DATA.username:"author"}</p>
          <p>{data.content}</p>
        <div>
          {this.props.COMMENT_DATA?this.props.COMMENT_DATA.map(comment => this.renderComment(comment)): "No comments"}
        </div>
      </div>
    );
  }

  createAdminButtonItems() {
    return [
      {
        label: 'Options',
        items: [
          {
            label: "Edit", icon: "pi pi-pencil",
            command: e => window.location.href = `/#/edit/`+this.props.BLOG_DATA.id
          },
          {
            label: "Delete", icon: "pi pi-times",
            command: (e) => this.deleteArticle()
          },
        ]
      }
    ]
  }

  deleteArticle() {
    const url = window.location.origin + this.props.BLOG_DATA.link;
    fetch(url,{
      method:"DELETE",
      credentials:"include",
    }).then(res => console.log(res))
      .then(() => window.location.href = '/#/articles');
  }

  renderArticleAdminButtons() {
    if(this.props.permits === "ADMIN") {
      return <>
          <Menu model={this.createAdminButtonItems()} popup={true} ref={el => this.menu = el}/>
          <Button icon="pi pi-bars" className="p-button-secondary" onClick={(event) => this.menu.toggle(event)}/>
        </>
    } else {
      return ""
    }
  }

  renderComment(comment) {
      return <div className="comment">
        <div className="p-grid p-align-center">
          <div className="p-col-10">
            <p>{comment.comment}</p>
          </div>
          <div className="p-col-2" align="center">
          {this.renderCommentAdminButton(comment.link, comment.author_id)}
          </div>
        </div>
      </div>
  }

  renderCommentAdminButton(commentUrl, authorId) {
    if(this.props.permits === "ADMIN" || this.props.userId === authorId) {
      return <Button icon="pi pi-times" className="p-button-danger" onClick={() => this.deleteComment(commentUrl)}/>
    } else {
      return ""
    }
  }

  deleteComment(commentUrl) {
    const url = this.fetchUrl + commentUrl;
    fetch(url, {
      method: "DELETE",
      credentials: "include",
    }).then(response => console.log(response))
      .then(() => window.location.reload())
  }

  getContent() {
    const blogData = this.props.BLOG_DATA;

    if(blogData != null) {
      return this.renderArticle(blogData);
    }

    return <Loader text="Fetching data..." />;
  }

  componentDidUpdate(previousProps) {
    const currentSearch = this.props.match.params.id
    const previousSearch = previousProps.match.params.id
    if (currentSearch !== previousSearch) {
      this.fetchAllData()
    }
  }

  renderCommenting() {
    return <div id="comment-section">
      <div>
        <Editor headerTemplate={<b>Comment</b>} style={{height:'80pt'}} value={this.state.comment} onTextChange={(e)=>this.setState({comment:e.textValue})}/>
      </div>
      <div>
        <Button label="Comment" id="comment-button" onClick={() => this.postComment()}></Button>
      </div>
    </div>
  }

  render() {
    return <div id="page">
      <div>
        {this.getContent()}
      </div>
      {this.props.permits === "ADMIN" || this.props.permits === "USER"?this.renderCommenting():""}
    </div>;
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

export default connect(data => data.article)(ArticleView);
