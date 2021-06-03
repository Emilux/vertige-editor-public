import React, { Component } from 'react';
import {Redirect,withRouter} from "react-router-dom";
const {ipcRenderer} = window.require('electron');

class AddElement extends Component {

    constructor() {
        super();


        this.state = {
            openMenu:{
                isOpen : false,
                data : null,
                type: null
            }
        }

        this.editable = this.editable.bind(this)
        this.buttonEdit = this.buttonEdit.bind(this)
        this.openHeader = this.openHeader.bind(this)
        this.useQuery = this.useQuery.bind(this)
    }

    useQuery(){
        return new URLSearchParams(this.props.location.search);
    }

    buttonEdit(e){
        e.preventDefault();

        //Close the choice menu when modal opened
        ipcRenderer.send('closeChoiceMenu', true)

        let query = this.useQuery()
        let id = e.target.parentNode.dataset.id
        let type = e.target.parentNode.dataset.type
        let path = `/Editor/openheader?id=${id}&type=${type}&page=${query.get("page")}`;
        this.props.history.push(path);
    }

    openHeader(){

        /*if (this.state.openMenu.isOpen){
            return <Redirect to={`/Editor/openheader?id=${this.state.openMenu.data}&type=${this.state.openMenu.type}`} />;
        } else {
            return <Redirect to='/Editor' />;
        }*/



    }

    editable(e){
        if (e.type === "mouseenter"){
            e.preventDefault();
            let button = document.createElement("button")
            button.className = "btn btn-warning rounded-0 editButton"
            button.innerText ="Editer"
            e.currentTarget.classList.add("select")
            e.currentTarget.append(button)
            let event = e.currentTarget.getElementsByClassName('editButton');

            event[0].addEventListener('click', e => this.buttonEdit(e))
        } else if (e.type === "mouseleave") {
            e.preventDefault();
            let remove = e.currentTarget.getElementsByClassName('editButton')
            if (remove.length !== 0){
                e.currentTarget.classList.remove("select")
                e.currentTarget.removeChild(remove[0])
            }

        }/* else if (e.type === "click"){
            if (e.currentTarget === e.target){
                let id = e.currentTarget.dataset.id
                if(this.state.openMenu.isOpen && this.state.openMenu.data === id){
                    this.setState({openMenu: {isOpen:false, data:null}})
                } else {
                    let dataid = e.currentTarget.dataset.id
                    this.setState({openMenu:{isOpen:true, data:dataid}})
                }
            }
        }*/

    }


    render() {

        const editable = {
            onMouseEnter: this.editable,
            onMouseLeave: this.editable,
            onMouseOver: this.editable
        }

        return(
            <>
                <div {...editable} data-id={this.props.dataId} data-type={this.props.dataType} style={this.props.style} className={`position-relative ${this.props.className}`}>
                    {this.props.children}
                </div>

            </>
        );
    }
}

export default withRouter(AddElement);