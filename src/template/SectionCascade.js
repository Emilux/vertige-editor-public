import React, { Component } from 'react';
import JsxParser from 'react-jsx-parser'
import {HashRouter as Router, Link, Route, Switch,Redirect} from "react-router-dom";
import * as ReactDOM from "react-dom";
import Editable from "../components/Editable";
import choiceBackground, {placeblock} from "../components/Additionnal";
import Block from "./Block/BlockCascade";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Components from "../components/ComponentList";
const {ipcRenderer} = window.require('electron');

class SectionCascade extends Component {

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

        //BG HEADER
        //BG IMG HEADER
        let bgdefault = this.props.defaultData.find(e => e.id === `sectionCascade-${this.props.id}`)
        bgdefault = bgdefault === undefined ? "http://dansedebal.free.fr/assets/img/image8-1.png?h=2132ab800849e423d9d7fb3ab88a8739" : bgdefault.content.backgroundUrl
        let bgid = this.getIndex(this.props.data,'id', `sectionCascade-${this.props.id}`);
        //BG COLOR HEADER
        let bgcolordefault = this.props.defaultData.find(e => e.id === `sectionCascade-${this.props.id}`)
        bgcolordefault = bgcolordefault === undefined ? "#666" : bgcolordefault.content.backgroundColor
        let bgcolorid = this.getIndex(this.props.data,'id', `sectionCascade-${this.props.id}`);
        //BG CHOICE
        let bgchoicedefault = this.props.defaultData.find(e => e.id === `sectionCascade-${this.props.id}`)
        bgchoicedefault = bgchoicedefault === undefined ? "color" : bgchoicedefault.content.backgroundChoice
        let bgchoiceid = this.getIndex(this.props.data,'id', `sectionCascade-${this.props.id}`);

        let titledefault = this.props.defaultData.find(e => e.id === `sectionCascadeTitle-${this.props.id}`)
        titledefault = titledefault === undefined ? "Danse de Bal : Quand la danse redevient danse…" : titledefault.content
        let blockId = this.getIndex(this.props.data,'id', `sectionCascadeTitle-${this.props.id}`);

        //Second Title
        let Secondtitledefault = this.props.defaultData.find(e => e.id === `sectionCascadeSecondTitle-${this.props.id}`)
        Secondtitledefault = Secondtitledefault === undefined ? "Danse de Bal : Quand la danse redevient danse…" : Secondtitledefault.content
        let SecondblockId = this.getIndex(this.props.data,'id', `sectionCascadeSecondTitle-${this.props.id}`);


        return (
            <>
                <Editable dataId={`sectionCascade-${this.props.id}`} dataType="background" openMenu={this.props.menuclose} className="position-relative mainselect myHtml">
                    <section id="methode" className="content-section bg-primary text-white text-center"
                             ref={(node) => {
                                 if (node) {
                                     node.style.setProperty("background", choiceBackground(this.props.data,bgchoicedefault,bgchoiceid, bgcolorid,bgcolordefault, bgid, bgdefault), "important");
                                 }}}>
                        <div className="container">
                            <div className="content-section-heading">
                                <Editable dataId={`sectionCascadeSecondTitle-${this.props.id}`} dataType="title" openMenu={this.props.menuclose}>
                                    <JsxParser jsx={this.props.data[SecondblockId] !== undefined ? this.props.data[SecondblockId].img : Secondtitledefault}>

                                    </JsxParser>
                                </Editable>

                                <Editable dataId={`sectionCascadeTitle-${this.props.id}`} dataType="title" openMenu={this.props.menuclose}>
                                    <JsxParser className="mb-5" jsx={this.props.data[blockId] !== undefined ? this.props.data[blockId].img : titledefault}>

                                    </JsxParser>
                                </Editable>

                            </div>
                            <div className="row">
                                {placeblock(Block, this.props.id,"sectionCascadeBlock", this.props.defaultData, this.props.data,  this.props.menuclose,4,6)}
                            </div>
                        </div>
                    </section>
                </Editable>
            </>
        );
    }
}

export default SectionCascade;