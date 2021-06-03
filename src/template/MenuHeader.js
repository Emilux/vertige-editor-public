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

class MenuHeader extends Component {

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
                <Editable dataId={`MenuHeader-${this.props.id}`} dataType="MenuHeader" openMenu={this.props.menuclose} className="position-relative mainselect myHtml">
                    <nav className="navbar navbar-light navbar-expand-lg fixed-top on-edition-menu" id="mainNav">
                        <div className="container-fluid">
                            <a className="navbar-brand js-scroll-trigger" href="#"
                                                            style={{color: "rgb(255, 255, 255)"}}>Vertige des danses</a>
                            <button data-toggle="collapse" className="navbar-toggler" data-target="#navcol-1"
                                    style={{color: "rgb(255,255,255)",borderWidth: 0}}>
                                <span className="sr-only">Toggle navigation</span>
                                <FontAwesomeIcon icon="bars"/>
                            </button>
                            <div className="collapse navbar-collapse" id="navcol-1">
                                <ul className="nav navbar-nav ml-auto"
                                    style={{fontSize: "20px",fontFamily: "Alef, sans-serif"}}>
                                    <li className="nav-item" role="presentation"
                                        style={{backgroundColor: "#fffffffa",borderRadius: "30px"}}><a
                                        className="nav-link text-center text-danger js-scroll-trigger"
                                        href="#infos-rentre"
                                        style={{color: "rgba(255,255,255,0.9)",backgroundColor: "#7e3f3f00",borderRadius: "50px",fontSize: "20px"}}>Infos
                                        rentrée</a></li>
                                    <li className="nav-item" role="presentation"><a
                                        className="nav-link js-scroll-trigger active" href="#accueil"
                                        style={{color: "rgba(255,255,255,0.9)"}}>Accueil</a></li>
                                    <li className="nav-item" role="presentation"><a
                                        className="nav-link js-scroll-trigger" href="#methode"
                                        style={{color: "rgba(255,255,255,0.9)"}}>Méthode</a></li>
                                    <li className="nav-item" role="presentation"><a
                                        className="nav-link js-scroll-trigger" href="#calendrier"
                                        style={{color: "rgba(255,255,255,0.9)"}}>Calendrier</a></li>
                                    <li className="nav-item dropdown">
                                        <a className="dropdown-toggle nav-link"
                                                                         data-toggle="dropdown" aria-expanded="false"
                                                                         href="#"
                                                                         style={{color: "rgba(255,255,255,0.9)"}}>
                                            Lieux
                                        </a>
                                        <div className="dropdown-menu" role="menu"><a
                                            className="dropdown-item js-scroll-trigger" role="presentation"
                                            href="lieux.html#mutzig">Mutzig</a><a
                                            className="dropdown-item js-scroll-trigger" role="presentation"
                                            href="lieux.html#wasselonne">Wasselonne</a><a
                                            className="dropdown-item js-scroll-trigger" role="presentation"
                                            href="lieux.html#brumath">Brumath</a><a
                                            className="dropdown-item js-scroll-trigger" role="presentation"
                                            href="lieux.html#ittenheim">Ittenheim</a><a
                                            className="dropdown-item js-scroll-trigger" role="presentation"
                                            href="lieux.html#freiburg">Freiburg</a></div>
                                    </li>
                                    <li className="nav-item" role="presentation"><a
                                        className="nav-link js-scroll-trigger" href="#contact"
                                        style={{color: "rgba(255,255,255,0.9)"}}>Contact</a></li>
                                    <li className="nav-item" role="presentation"><a className="nav-link" href="#"
                                                                                    style={{color: "rgba(255,255,255,0.9)"}}>Partenaires</a>
                                    </li>
                                    <li className="nav-item my-auto" role="presentation"><a className="nav-link my-auto"
                                                                                            href="https://www.facebook.com/VertigeDesDanses"
                                                                                            style={{color: "rgba(255,255,255,0.9)"}}
                                                                                            target="_blank">
                                        <FontAwesomeIcon icon={["fab","facebook-square"]}
                                        className="d-lg-flex align-items-lg-center my-auto"
                                        style={{fontSize: "25px"}}/></a></li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </Editable>
            </>
        );
    }
}

export default MenuHeader;