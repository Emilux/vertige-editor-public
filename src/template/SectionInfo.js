import React, { Component } from 'react';
import JsxParser from 'react-jsx-parser'
import {HashRouter as Router, Link, Route, Switch,Redirect} from "react-router-dom";
import * as ReactDOM from "react-dom";
import Editable from "../components/Editable";
import choiceBackground, {placeblock} from "../components/Additionnal";
import Block from "./Block/BlockInfo";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Components from "../components/ComponentList";
const {ipcRenderer} = window.require('electron');

class SectionInfo extends Component {

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

        //BG HEADER
        //BG IMG HEADER
        let bgdefault = this.props.defaultData.find(e => e.id === `sectionInfo-${this.props.id}`)
        bgdefault = bgdefault === undefined ? "http://dansedebal.free.fr/assets/img/maple-1079235.jpg?h=3a72934d49da9fe41fa720e9c1b34e44" : bgdefault.content.backgroundUrl
        let bgid = this.getIndex(this.props.data,'id', `sectionInfo-${this.props.id}`);
        //BG COLOR HEADER
        let bgcolordefault = this.props.defaultData.find(e => e.id === `sectionInfo-${this.props.id}`)
        bgcolordefault = bgcolordefault === undefined ? "#666" : bgcolordefault.content.backgroundColor
        let bgcolorid = this.getIndex(this.props.data,'id', `sectionInfo-${this.props.id}`);
        //BG CHOICE
        let bgchoicedefault = this.props.defaultData.find(e => e.id === `sectionInfo-${this.props.id}`)
        bgchoicedefault = bgchoicedefault === undefined ? "color" : bgchoicedefault.content.backgroundChoice
        let bgchoiceid = this.getIndex(this.props.data,'id', `sectionInfo-${this.props.id}`);

        //Title
        let titledefault = this.props.defaultData.find(e => e.id === `sectionInfoTitle-${this.props.id}`)
        titledefault = titledefault === undefined ? "Danse de Bal : Quand la danse redevient danse…" : titledefault.content
        let blockId = this.getIndex(this.props.data,'id', `sectionInfoTitle-${this.props.id}`);

        //Paragraph
        let paragraphdefault = this.props.defaultData.find(e => e.id === `sectionInfoParagraph-${this.props.id}`)
        paragraphdefault = paragraphdefault === undefined ?
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce dictum vitae nisl vel scelerisque. Vivamus pharetra vitae magna eu ultrices." :
            paragraphdefault.content
        let paragraphId = this.getIndex(this.props.data,'id', `sectionInfoParagraph-${this.props.id}`);

        //Image
        let imagedefault = this.props.defaultData.find(e => e.id === `sectionInfoImage-${this.props.id}`)
        imagedefault = imagedefault === undefined ?
            "http://dansedebal.free.fr/assets/img/Extrait%20calendrier-1.jpg?h=afd1bf10d3fdbef400a2b28e2de75a22" :
            imagedefault.content.imageUrl
        let imageId = this.getIndex(this.props.data,'id', `sectionInfoImage-${this.props.id}`);
        //alt
        let altdefaultid = this.props.defaultData.find(e => e.id === `sectionInfoImage-${this.props.id}`)
        let altdefault =  altdefaultid === undefined  ? "" : altdefaultid.content.alt
        let altid = this.getIndex(this.props.data,'id', `sectionInfoImage-${this.props.id}`)

        return (
            <>
                <Editable dataId={`sectionInfo-${this.props.id}`} dataType="background" openMenu={this.props.menuclose} className="position-relative mainselect myHtml">
                    <section ref={(node) => {
                        if (node) {
                            node.style.setProperty("background", choiceBackground(this.props.data,bgchoicedefault,bgchoiceid, bgcolorid,bgcolordefault, bgid, bgdefault), "important");
                        }
                    }} id="infos-rentre" className="content-section bg-primary text-white text-center">
                        <div className="container" style={{backgroundColor: "rgba(0,0,0,0.24)"}}>
                            <div className="content-section-heading">
                                <Editable dataId={`sectionInfoTitle-${this.props.id}`} dataType="title" openMenu={this.props.menuclose}>
                                    <JsxParser className="mb-5" jsx={this.props.data[blockId] !== undefined ? this.props.data[blockId].img : titledefault}>

                                    </JsxParser>
                                </Editable>
                            </div>
                            <div className="row">
                                <div className="col-md-6 my-auto">
                                    <Editable dataId={`sectionInfoImage-${this.props.id}`} dataType="image" openMenu={this.props.menuclose}>
                                        <img  className="img-fluid"
                                              src={`${
                                                  this.props.data[imageId] !== undefined ?
                                                      this.props.data[imageId].img.imageUrl !== undefined ?
                                                          this.props.data[imageId].img.imageUrl :
                                                          imagedefault :
                                                      imagedefault}`
                                              }
                                              alt={`${
                                                  this.props.data[altid] !== undefined ?
                                                      this.props.data[altid].img.alt !== undefined ?
                                                          this.props.data[altid].img.alt :
                                                          altdefault :
                                                      altdefault}`
                                              } />
                                    </Editable>
                                    </div>
                                <div className="col-md-6">
                                    {placeblock(Block,this.props.id,"sectionInfoBlock", this.props.defaultData, this.props.data,  this.props.menuclose,3,6)}
                                </div>
                            </div>
                            <Editable dataId={`sectionInfoParagraph-${this.props.id}`} dataType="textbox" openMenu={this.props.menuclose}>
                                <JsxParser
                                           jsx={this.props.data[paragraphId] !== undefined ?
                                                   this.props.data[paragraphId].img :
                                               paragraphdefault}>
                                </JsxParser>
                            </Editable>
                        </div>
                    </section>
                </Editable>
            </>
        );
    }
}

export default SectionInfo;