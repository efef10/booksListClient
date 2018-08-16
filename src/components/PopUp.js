import * as React from 'react'
import {Link} from 'react-router-dom';
import './Popup.css';

class Popup extends React.Component{
    constructor(){
        super();
        this.state = {dateInput:"",formattedInput:""};
    }

    componentDidMount(){
        if(this.props.popupType==="update"){
            this.authorName.value += this.props.book.authorName;
            this.title.value += this.props.book.title;
            this.publishedDate.value += this.props.book.publishedDate;
            this.setState({dateInput:this.publishedDate.value.replace(/-/g, ''),formattedInput:this.formatInput(this.publishedDate.value)})
        }
    }

    formatInput=(input)=>{
        if(input.length > 0 && input.length <=2){
            return `${input}`;
        }
        if (input.length >2 && input.length <=4){
            return `${input.slice(0,2)}-${input.slice(2)}`;
        }
        if (input.length >4 && input.length <=8){

            return `${input.slice(0,2)}-${input.slice(2,4)}-${input.slice(4)}`;
        }
        else return input;
    }

    submit=async()=>{
        if(this.props.popupType==="delete"){
            this.props.save(this.props.book.id);
            this.props.history.push('/');
        }
        else if(!!this.authorName.value && !!this.title.value){
            let authorName = this.authorName.value.replace(/[^A-Z0-9a-z ]/ig,'');
            let title = this.title.value.replace(/[^A-Z0-9a-z ]/ig,'');
            let myDate = this.publishedDate.value;
            if(myDate.length === 10 && Number(myDate.slice(0,2))<=31 && Number(myDate.slice(3,5))<=12 && Number(myDate.slice(6))<=2018){
                if(this.props.popupType==="update"){
                    this.props.save(this.props.book.id,authorName,title,this.publishedDate.value);
                }
                else if(this.props.popupType==="new"){
                    this.props.save(authorName,title,this.publishedDate.value);
                }
                this.props.history.push('/');
            }
            else{
                this.message.innerHTML = "wrong date";
            }

        }
        else{
            this.message.innerHTML = "all fields must not be empty";
        }
    }

    dateChanged=(e)=>{
        //case of backspace:
        if(e.target.value.length<this.state.formattedInput.length){
            let newDateInput = this.state.dateInput.slice(0,this.state.dateInput.length-1);
            this.setState({dateInput:newDateInput},()=>{
                this.setState({formattedInput:this.formatInput(this.state.dateInput)},()=>{
                    console.log(this.state.dateInput,">>>",this.state.formattedInput);
                });
            });
            return;
        }

        //case of new number
        let char = e.target.value.charAt(e.target.value.length-1);
        if(isNaN(char)){
            return;
        }
        this.setState({formattedInput:this.formatInput(this.state.dateInput + char),dateInput:this.state.dateInput + char});
    }

    renderContent=()=>{
        if(this.props.popupType==="update"){
            return <div className='popup_inner'>
                <h2>Edit book: {this.props.book.id}</h2>
                <div className="field">
                    <input ref={elem=>this.authorName =elem} id="authorName" type="text" placeholder='Author name'/>
                </div>
                <div className="field">
                    <input ref={elem=>this.title =elem} id="title" type="text" placeholder='Title'/>
                </div>
                <div className="field">
                    <input ref={elem=>this.publishedDate =elem} id="publishedDate" type="text" placeholder='Published Date' onChange={this.dateChanged} value={this.state.formattedInput}/>
                </div>
                <div className="buttons">
                    <div className="button">
                        <Link to="/"><button>cancel</button></Link>
                    </div>
                    <div className="button right">
                        <button onClick={this.submit}>Save</button>
                    </div>
                </div>
                <p id="error-message" ref={elem=>this.message =elem}></p>
            </div>
        }
        else if(this.props.popupType==="new"){
            return <div className='popup_inner'>
                <h2>Add new book:</h2>
                <div className="field">
                    <input ref={elem=>this.authorName =elem} id="authorName" type="text" placeholder='Author name'/>
                </div>
                <div className="field">
                    <input ref={elem=>this.title =elem} id="title" type="text" placeholder='Title'/>
                </div>
                <div className="field">
                    <input ref={elem=>this.publishedDate =elem} id="publishedDate" type="text" placeholder='Published Date' onChange={this.dateChanged} value={this.state.formattedInput}/>
                </div>
                <div className="buttons">
                    <div className="button">
                        <Link to="/"><button>cancel</button></Link>
                    </div>
                    <div className="button">
                        <button onClick={this.submit}>Add</button>
                    </div>
                </div>
                <p id="error-message" ref={elem=>this.message =elem}></p>
            </div>
        }
        else if(this.props.popupType==="delete"){
            return                 <div className='popup_inner'>
                <h2>Are you sure you want to delete {this.props.book.title}?</h2>
                <div className="buttons">
                    <div className="button">
                        <Link to="/"><button>Cancel</button></Link>
                    </div>
                    <div className="button">
                        <button onClick={this.submit}>Yes</button>
                    </div>
                </div>
            </div>
        }
    }

    render() {
        return (
            <div className='popup'>
                    {this.renderContent()}
            </div>
        );
    }
}

export default Popup;