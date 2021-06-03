import React, { Component } from 'react';
import JsxParser from 'react-jsx-parser'
import {HashRouter as Router, Link, Route, Switch,Redirect} from "react-router-dom";
import choiceBackground from "../components/Additionnal";
import * as ReactDOM from "react-dom";
import Editable from "../components/Editable";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Components from "../components/ComponentList";
const {ipcRenderer} = window.require('electron');

class SectionSimpleImage extends Component {

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

        //BG HEADER
        //BG IMG HEADER
        let bgdefault = this.props.defaultData.find(e => e.id === `SectionSimpleImage-${this.props.id}`)
        bgdefault = bgdefault === undefined ? "http://dansedebal.free.fr/assets/img/maple-1079235.jpg?h=3a72934d49da9fe41fa720e9c1b34e44" : bgdefault.content.backgroundUrl
        let bgid = this.getIndex(this.props.data,'id', `SectionSimpleImage-${this.props.id}`);
            //BG COLOR HEADER
            let bgcolordefault = this.props.defaultData.find(e => e.id === `SectionSimpleImage-${this.props.id}`)
            bgcolordefault = bgcolordefault === undefined ? "#666" : bgcolordefault.content.backgroundColor
            let bgcolorid = this.getIndex(this.props.data,'id', `SectionSimpleImage-${this.props.id}`);
            //BG CHOICE
            let bgchoicedefault = this.props.defaultData.find(e => e.id === `SectionSimpleImage-${this.props.id}`)
            bgchoicedefault = bgchoicedefault === undefined ? "color" : bgchoicedefault.content.backgroundChoice
            let bgchoiceid = this.getIndex(this.props.data,'id', `SectionSimpleImage-${this.props.id}`);

        //Title
        let titledefault = this.props.defaultData.find(e => e.id === `SectionSimpleImageTitle-${this.props.id}`)
        titledefault = titledefault === undefined ? "Danse de Bal : Quand la danse redevient danse…" : titledefault.content
        let blockId = this.getIndex(this.props.data,'id', `SectionSimpleImageTitle-${this.props.id}`);

        //Second Title
        let Secondtitledefault = this.props.defaultData.find(e => e.id === `SectionSimpleImageSecondTitle-${this.props.id}`)
        Secondtitledefault = Secondtitledefault === undefined ? "Danse de Bal : Quand la danse redevient danse…" : Secondtitledefault.content
        let SecondblockId = this.getIndex(this.props.data,'id', `SectionSimpleImageSecondTitle-${this.props.id}`);

        //Image
        let imagedefault = this.props.defaultData.find(e => e.id === `SectionSimpleImageImage-${this.props.id}`)
        imagedefault = imagedefault === undefined ?
            "http://dansedebal.free.fr/assets/img/Extrait%20calendrier-1.jpg?h=afd1bf10d3fdbef400a2b28e2de75a22" :
            imagedefault.content.imageUrl
        let imageId = this.getIndex(this.props.data,'id', `SectionSimpleImageImage-${this.props.id}`);
            //alt
            let altdefaultid = this.props.defaultData.find(e => e.id === `SectionSimpleImageImage-${this.props.id}`)
            let altdefault =  altdefaultid === undefined  ? "" : altdefaultid.content.alt
            let altid = this.getIndex(this.props.data,'id', `SectionSimpleImageImage-${this.props.id}`)

        return (
            <>
                <Editable dataId={`SectionSimpleImage-${this.props.id}`} dataType="background" openMenu={this.props.menuclose} className="position-relative mainselect myHtml">
                    <section id="calendrier"  ref={(node) => {
                        if (node) {
                            node.style.setProperty("background", choiceBackground(this.props.data,bgchoicedefault,bgchoiceid, bgcolorid,bgcolordefault, bgid, bgdefault), "important");
                        }}} className="content-section">
                        <div className="container">
                            <div className="content-section-heading text-center">
                                <Editable dataId={`SectionSimpleImageSecondTitle-${this.props.id}`} dataType="title" openMenu={this.props.menuclose}>
                                    <JsxParser jsx={this.props.data[SecondblockId] !== undefined ? this.props.data[SecondblockId].img : Secondtitledefault}>

                                    </JsxParser>
                                </Editable>
                                <Editable dataId={`SectionSimpleImageTitle-${this.props.id}`} dataType="title" openMenu={this.props.menuclose}>
                                    <JsxParser className="mb-5" jsx={this.props.data[blockId] !== undefined ? this.props.data[blockId].img : titledefault}>

                                    </JsxParser>
                                </Editable>
                            </div>
                            <div className="mx-auto text-center">
                                <Editable dataId={`SectionSimpleImageImage-${this.props.id}`} dataType="image" openMenu={this.props.menuclose}>
                                    <img  className="img-fluid mx-auto text-center"
                                          src={`${
                                              this.props.data[imageId] !== undefined ?
                                                  this.props.data[imageId].img.imageUrl !== undefined ?
                                                      this.props.data[imageId].img.imageUrl :
                                                      imagedefault :
                                                  imagedefault}`
                                          } width="75%"
                                          alt={`${
                                              this.props.data[altid] !== undefined ?
                                                  this.props.data[altid].img.alt !== undefined ?
                                                      this.props.data[altid].img.alt :
                                                      altdefault :
                                                  altdefault}`
                                          } />
                                </Editable>
                            </div>
                        </div>
                    </section>
                </Editable>
            </>
        );
    }
}

export default SectionSimpleImage;