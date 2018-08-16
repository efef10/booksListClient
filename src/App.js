import React, { Component } from 'react';
import './App.css';
import $ from 'jquery';
import Popup from './components/PopUp'
import {Link,Route} from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/font-awesome/css/font-awesome.min.css';

class App extends Component {
    constructor(){
        super();
        this.state = {books:[]};
    }

    async componentWillMount(){
        $.ajax({
            type: "GET",
            url: "https://serene-escarpment-62053.herokuapp.com/books",
            dataType: "json",
            success:  (data) =>{
                this.setState({books:data.books});
                },
            error: function () {
                console.log("error occurred");
            }
        });
    }

    update=(id,authorName,title,publishedDate)=>{
        $.ajax({
            type: "PUT",
            url: "https://serene-escarpment-62053.herokuapp.com/books/" + id,
            dataType: "json",
            data: {authorName,title,publishedDate},
            success:  () =>{
                this.message.innerHTML = "book updated successfully";
                setTimeout(this.clearMessage,2000);
                $.ajax({
                    type: "GET",
                    url: "https://serene-escarpment-62053.herokuapp.com/books",
                    dataType: "json",
                    success:  (data) =>{
                        this.setState({books:data.books})
                    },
                    error: function () {
                        this.message.innerHTML = "error occurred";
                        setTimeout(this.clearMessage,2000);
                    }
                });
            },
            error: function () {
                this.message.innerHTML = "error occurred";
                setTimeout(this.clearMessage,2000);
            }
        });
    }

    add=(authorName,title,publishedDate)=>{
        let books = this.state.books;
        books.push({})
        $.ajax({
            type: "POST",
            url: "https://serene-escarpment-62053.herokuapp.com/books/",
            dataType: "json",
            data: {authorName,title,publishedDate},
            success:  () =>{
                this.message.innerHTML = "book added successfully";
                setTimeout(this.clearMessage,2000);
                $.ajax({
                    type: "GET",
                    url: "https://serene-escarpment-62053.herokuapp.com/books",
                    dataType: "json",
                    success:  (data) =>{
                        this.setState({books:data.books})
                    },
                    error: function () {
                        this.message.innerHTML = "error occurred";
                        setTimeout(this.clearMessage,2000);
                    }
                });
            },
            error: function () {
                this.message.innerHTML = "error occurred";
                setTimeout(this.clearMessage,2000);
            }
        });
    }

    delete=(id)=>{
        $.ajax({
            type: "DELETE",
            url: "https://serene-escarpment-62053.herokuapp.com/books/" + id,
            dataType: "json",
            data: {id},
            success:  () =>{
                this.message.innerHTML = "book deleted successfully";
                setTimeout(this.clearMessage,2000);
                $.ajax({
                    type: "GET",
                    url: "https://serene-escarpment-62053.herokuapp.com/books",
                    dataType: "json",
                    success:  (data) =>{
                        this.setState({books:data.books})
                    },
                    error: function () {
                        this.message.innerHTML = "error occurred";
                        setTimeout(this.clearMessage,2000);
                    }
                });
            },
            error: function () {
                this.message.innerHTML = "error occurred";
                setTimeout(this.clearMessage,2000);
            }
        });
    }

    renderPopUpUpdate = (props)=>{
        return <Popup popupType="update" save={this.update} book={props.location.state.book} {...props}/>
    }

    renderPopUpDelete = (props)=>{
        return <Popup popupType="delete" save={this.delete} book={props.location.state.book} {...props}/>
    }

    renderPopUpAdd = (props)=>{
        return <Popup popupType="new" save={this.add} {...props}/>
    }

    clearMessage = ()=>{
        this.message.innerHTML = "";
    }

    render() {
        const list = this.state.books.map((book,idx)=>{
            return (<li key={idx} className="list-group-item book"><span className="title">{book.title}</span> by {book.authorName}
                        <div className="links">
                            <Link to={{pathname:`/books/${book.id}/edit`,state:{book}}}><i className="fa fa-edit"></i> Edit</Link>
                            <Link to={{pathname:`/books/${book.id}`,state:{book}}}><i className="fa fa-trash"></i> Delete</Link>
                        </div>
                    </li>)
        });

        return (
          <div className="App">
              <h1>Book List:</h1>
              <p ref={elem=>this.message =elem} id="message"> </p>
              <Link to={'/books'}><button id="new-book">+ Add New Book</button></Link>
              <ul className="book-list list-group">
                  {list}
              </ul>
              <Route exact={true} path='/books/:id/edit' render={this.renderPopUpUpdate}/>
              <Route exact={true} path='/books/:id' render={this.renderPopUpDelete}/>
              <Route exact={true} path='/books/' render={this.renderPopUpAdd}/>
          </div>
        );
  }
}

export default App;
