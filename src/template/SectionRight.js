import React, { Component } from 'react';
import JsxParser from 'react-jsx-parser'
import {HashRouter as Router, Link, Route, Switch,Redirect} from "react-router-dom";
import * as ReactDOM from "react-dom";
import Editable from "../components/Editable";
import choiceBackground, {placeblock} from "../components/Additionnal";
import Block from "./Block/Block";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Components from "../components/ComponentList";
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
        this.getIndex = this.getIndex.bind(this)
        this.escapeHtml = this.escapeHtml.bind(this)

    }

    componentDidUpdate(){
        if (this.props.menuclose === false){
            this.setState({openMenu: {isOpen:false}})
        }
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
        let bgdefault = this.props.defaultData.find(e => e.id === `sectionRight-${this.props.id}`)
        bgdefault = bgdefault === undefined ? "http://dansedebal.free.fr/assets/img/image4.png?h=e4d58bbb81c474193e5a3d45649f798f" : bgdefault.content.backgroundUrl
        let bgid = this.getIndex(this.props.data,'id', `sectionRight-${this.props.id}`);
        //BG COLOR HEADER
        let bgcolordefault = this.props.defaultData.find(e => e.id === `sectionRight-${this.props.id}`)
        bgcolordefault = bgcolordefault === undefined ? "#666" : bgcolordefault.content.backgroundColor
        let bgcolorid = this.getIndex(this.props.data,'id', `sectionRight-${this.props.id}`);
        //BG CHOICE
        let bgchoicedefault = this.props.defaultData.find(e => e.id === `sectionRight-${this.props.id}`)
        bgchoicedefault = bgchoicedefault === undefined ? "color" : bgchoicedefault.content.backgroundChoice
        let bgchoiceid = this.getIndex(this.props.data,'id', `sectionRight-${this.props.id}`);

        let choice = () => {


            if ((this.props.data[bgchoiceid] === undefined && bgchoicedefault === "color") || (this.props.data[bgchoiceid] !== undefined && this.props.data[bgchoiceid].img.backgroundChoice !== undefined && this.props.data[bgchoiceid].img.backgroundChoice === "color")){
                if (this.props.data[bgcolorid] !== undefined) {
                    if (this.props.data[bgcolorid].img.backgroundColor !== undefined) {
                        return (this.props.data[bgcolorid].img.backgroundColor)
                    } else {
                        return (bgcolordefault)
                    }
                } else {
                    return (bgcolordefault)
                }

            } else if ((this.props.data[bgchoiceid] === undefined && bgchoicedefault === "url") || (this.props.data[bgchoiceid] !== undefined && this.props.data[bgchoiceid].img.backgroundChoice !== undefined && this.props.data[bgchoiceid].img.backgroundChoice === "url")) {
                return `url(${
                    this.props.data[bgid] !== undefined ?
                        this.props.data[bgid].img.backgroundUrl !== undefined ?
                            this.props.data[bgid].img.backgroundUrl :
                            bgdefault :
                        bgdefault}) top / cover fixed`
            }
        }


        let titledefault = this.props.defaultData.find(e => e.id === `sectionRightTitle-${this.props.id}`)
        titledefault = titledefault === undefined ? "Pas d’enchaînements à rallonge à apprendre par coeur." : titledefault.content
        let blockId = this.getIndex(this.props.data,'id', `sectionRightTitle-${this.props.id}`);
        //blockTitleDefault = blockTitleDefault === undefined ? "http://dansedebal.free.fr/assets/img/image4.png?h=e4d58bbb81c474193e5a3d45649f798f" : blockTitleDefault.content
        /*
        let imgdefault = this.props.defaultData.find(e => e.id === `headerImg-${this.props.id}`)
        imgdefault = imgdefault === undefined ? "http://dansedebal.free.fr/assets/img/Logo-full.png?h=086276ede78b1f574363cad6cc4697b9" : imgdefault.content
        let imgid = this.getIndex(this.props.background,'id', `headerImg-${this.props.id}`);

        //TITLE HEADER
        let txtdefault = this.props.defaultData.find(e => e.id === `headerTitle-${this.props.id}`)
        txtdefault = txtdefault === undefined ? "Faites le premier pas, nous vous aiderons à faire les autres..." : txtdefault.content
        let txtid = this.getIndex(this.props.background,'id', `headerTitle-${this.props.id}`);

        //SCROLL CONTENT
        let scrolltxtdefault = this.props.defaultData.find(e => e.id === `headerScrollText-${this.props.id}`)
        scrolltxtdefault = scrolltxtdefault === undefined ? "Voir la suite..." : scrolltxtdefault.content
        let scrolltxtid = this.getIndex(this.props.background,'id', `headerScrollText-${this.props.id}`);*/

        return (
            <>
                <Editable dataId={`sectionRight-${this.props.id}`} dataType="background" openMenu={this.props.menuclose} className="position-relative mainselect myHtml">
                    <section id="calendar" className="content-section bg-primary text-white text-center"
                             ref={(node) => {
                                 if (node) {
                                     node.style.setProperty("background", choiceBackground(this.props.data,bgchoicedefault,bgchoiceid, bgcolorid,bgcolordefault, bgid, bgdefault), "important");
                                 }}}>
                        <div className="container">
                            <Editable dataId={`sectionRightTitle-${this.props.id}`} dataType="title" openMenu={this.props.menuclose}>
                                <JsxParser className="mb-5" jsx={this.props.data[blockId] !== undefined ? this.props.data[blockId].img : titledefault}>

                                </JsxParser>
                            </Editable>
                            <div className="row">
                                {placeblock(Block, this.props.id,"sectionRightBlock", this.props.defaultData, this.props.data,  this.props.menuclose)}
                            </div>
                        </div>
                    </section>
                </Editable>
                </>
        );
    }
}

export default SectionRight;