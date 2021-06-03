import React, { Component } from 'react';
import JsxParser from 'react-jsx-parser'
import {HashRouter as Router, Link, Route, Switch,Redirect} from "react-router-dom";
import * as ReactDOM from "react-dom";
import Editable from "../../components/Editable";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
const {ipcRenderer} = window.require('electron');

class SectionRight extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectHeader:"",
            selectImg:"",
            selectTextHeader:"",
            openMenu:{
                isOpen : false,
                data : null,
                type: null
            }
        }
        this.editable = this.editable.bind(this)
        this.getIndex = this.getIndex.bind(this)
        this.buttonEdit = this.buttonEdit.bind(this)
        this.escapeHtml = this.escapeHtml.bind(this)

    }

    componentDidUpdate(){
        if (this.props.menuclose === false){
            this.setState({openMenu: {isOpen:false}})
        }
    }

    openHeader(){
        if (this.state.openMenu.isOpen){
            return <Redirect to={`/Editor/openheader?id=${this.state.openMenu.data}&type=${this.state.openMenu.type}`} />;
        } else {
            return <Redirect to='/Editor' />;
        }
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

    buttonEdit(e){
        e.preventDefault();
        let id = e.target.parentNode.dataset.id
        let type = e.target.parentNode.dataset.type
        this.setState({openMenu: {isOpen:true, data:id, type:type}})
    }

    getIndex(array, index, id){
        for(let z=array.length-1;z>=0;z--){
            if(z !== -1 && array[z][index] === id){
                return z;
            }
        }
    }

    escapeHtml(text) {
        if(text !== undefined){
            return text.toString()
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/&lt;br\/&gt;/g, "<br/>")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;")
                .replace(/{/g, "&#123;")
                .replace(/}/g, "&#125;");
        }
    }

    render() {

        const editable = {
            onMouseEnter: this.editable,
            onMouseLeave: this.editable,
            onMouseOver: this.editable
        }

        let defaultId = this.props.defaultData.find(e => e.id === `${this.props.id}`)
        let blockTitleDefault =  defaultId === undefined  ? "Lorem ipsum dolor" : defaultId.content.title
        let DataId = this.getIndex(this.props.data,'id', `${this.props.id}`)

        let blockContentDefault = defaultId === undefined  ? "Lorem ipsum dolor" : defaultId.content.content
        let blockIconDefault = defaultId === undefined  ? "book-open" : defaultId.content.icon

        return (
            <>
                <Editable dataId={`${this.props.id}`} dataType="block" openMenu={this.props.menuclose} className="col-md-6 offset-md-6">
                        <span className="d-flex d-sm-flex d-md-flex d-lg-flex d-xl-flex justify-content-lg-start">
                            <FontAwesomeIcon
                                icon={`${
                                        this.props.data[DataId] !== undefined ?
                                            this.props.data[DataId].img.icon !== undefined ?
                                                this.props.data[DataId].img.icon :
                                                blockIconDefault :
                                            blockIconDefault}`
                                }

                                             style={{fontSize: "35px"}}/>

                            <JsxParser className="d-lg-flex align-items-lg-center ml-3 my-auto"
                                           jsx={
                                               this.props.data[DataId] !== undefined ?
                                                   this.props.data[DataId].img.title !== undefined ?
                                                       this.props.data[DataId].img.title :
                                                       blockTitleDefault :
                                                   blockTitleDefault
                                           }>
                            </JsxParser>
                        </span>
                    <JsxParser className="text-left d-lg-flex"
                        jsx={this.props.data[DataId] !== undefined ?
                            this.props.data[DataId].img.content !== undefined ?
                                this.props.data[DataId].img.content :
                                blockContentDefault :
                            blockContentDefault}>
                    </JsxParser>
                </Editable>
            </>
        );
    }
}

export default SectionRight;