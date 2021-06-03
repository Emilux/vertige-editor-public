import React, { Component } from 'react';
import JsxParser from 'react-jsx-parser'
import {HashRouter as Router, Link, Route, Switch,Redirect} from "react-router-dom";
import * as ReactDOM from "react-dom";
import Editable from "../components/Editable";
import choiceBackground from "../components/Additionnal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Components from "../components/ComponentList";
const {ipcRenderer} = window.require('electron');

class SectionContact extends Component {

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
            },
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

        //BG HEADER
        //BG IMG HEADER
        let bgdefault = this.props.defaultData.find(e => e.id === `SectionContact-${this.props.id}`)
        bgdefault = bgdefault === undefined ? "http://dansedebal.free.fr/assets/img/maple-1079235.jpg?h=3a72934d49da9fe41fa720e9c1b34e44" : bgdefault.content.backgroundUrl
        let bgid = this.getIndex(this.props.data,'id', `SectionContact-${this.props.id}`);
        //BG COLOR HEADER
        let bgcolordefault = this.props.defaultData.find(e => e.id === `SectionContact-${this.props.id}`)
        bgcolordefault = bgcolordefault === undefined ? "#666" : bgcolordefault.content.backgroundColor
        let bgcolorid = this.getIndex(this.props.data,'id', `SectionContact-${this.props.id}`);
        //BG CHOICE
        let bgchoicedefault = this.props.defaultData.find(e => e.id === `SectionContact-${this.props.id}`)
        bgchoicedefault = bgchoicedefault === undefined ? "color" : bgchoicedefault.content.backgroundChoice
        let bgchoiceid = this.getIndex(this.props.data,'id', `SectionContact-${this.props.id}`);



        //Title
        let titledefault = this.props.defaultData.find(e => e.id === `SectionContactTitle-${this.props.id}`)
        titledefault = titledefault === undefined ? "Danse de Bal : Quand la danse redevient danse…" : titledefault.content
        let blockId = this.getIndex(this.props.data,'id', `SectionContactTitle-${this.props.id}`);

        //Texte
        let textdefault = this.props.defaultData.find(e => e.id === `SectionContactText-${this.props.id}`)
        textdefault = textdefault === undefined ? "Lorem ipsum dolor. Lorem ipsum dolor. Lorem ipsum dolor." : textdefault.content
        let textId = this.getIndex(this.props.data,'id', `SectionContactText-${this.props.id}`);



        //Image
        let imagedefault = this.props.defaultData.find(e => e.id === `SectionContactImage-${this.props.id}`)
        imagedefault = imagedefault === undefined ?
            "http://dansedebal.free.fr/assets/img/Extrait%20calendrier-1.jpg?h=afd1bf10d3fdbef400a2b28e2de75a22" :
            imagedefault.content
        let imageId = this.getIndex(this.props.data,'id', `SectionContactImage-${this.props.id}`);

        return (
            <>
                <Editable dataId={`SectionContact-${this.props.id}`} dataType="background" openMenu={this.props.menuclose} className="position-relative mainselect myHtml">
                    <section id="contact"
                             ref={(node) => {
                                 if (node) {
                                     node.style.setProperty("background", choiceBackground(this.props.data,bgchoicedefault,bgchoiceid, bgcolorid,bgcolordefault, bgid, bgdefault), "important");
                                 }}}
                             style={{paddingTop: "80px",paddingBottom: "80px"}}>
                        <div className="container text-center">
                            <div className="row">
                                <div className="col-lg-5 d-lg-flex align-items-lg-center contact-noform"
                                     style={{paddingTop: "80px",paddingBottom: "80px"}}>
                                    <Editable dataId={`SectionContactText-${this.props.id}`} dataType="textbox" openMenu={this.props.menuclose}>
                                        <div style={{padding: "40px",backgroundColor: "#7e3f3ffa", color: "rgb(255,255,255)"}}>
                                            <JsxParser
                                                jsx={this.props.data[textId] !== undefined ?
                                                    this.props.data[textId].img :
                                                    textdefault}>
                                            </JsxParser>
                                        </div>
                                    </Editable>

                                </div>
                                <div className="col-lg-2 d-lg-flex justify-content-lg-center align-items-lg-center">
                                    <h1 style={{color: "rgb(255,255,255)"}}>OU</h1>
                                </div>
                                <div className="col-lg-5">
                                    <div className="contact-clean" style={{backgroundColor: "rgba(255,255,255,0)"}}>
                                        <form data-bss-recipient="5d2650d4ca502357110aa3cc62040e14">
                                            <h2 className="text-center">Nous contacter</h2>

                                            <div className="form-group">
                                                <input className="form-control" type="text"
                                                                                name="name"
                                                                                placeholder="Prénom et Nom"
                                                                                inputMode="latin-name"
                                                                                required=""
                                                                                minLength="2"
                                                                                maxLength="25"/>
                                            </div>

                                            <div className="form-group">
                                                <input className="form-control" type="email"
                                                                                name="email"
                                                                                placeholder="Email"
                                                                                inputMode="email"
                                                                                required=""/>
                                            </div>

                                            <div className="form-group">
                                                <textarea className="form-control"  name="message"
                                                                                    placeholder="Message"
                                                                                    rows="14"
                                                                                    required=""
                                                                                    minLength="5"/>
                                            </div>
                                            <div className="form-group">
                                                <button className="btn btn-primary" type="submit">Envoyer</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </Editable>
            </>
        );
    }
}

export default SectionContact;