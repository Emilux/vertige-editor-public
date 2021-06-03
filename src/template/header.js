import React, { Component } from 'react';
import JsxParser from 'react-jsx-parser'
import {HashRouter as Router, Link, Route, Switch,Redirect} from "react-router-dom";
import choiceBackground, {getElement} from "../components/Additionnal";
import * as ReactDOM from "react-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Editable from "../components/Editable";
const {ipcRenderer} = window.require('electron');

class Header extends Component {

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
        if(text !== undefined && text !== null){
            return text.toString()
        }
    }

    render() {
        const editable = {
            onMouseEnter: this.editable,
            onMouseLeave: this.editable,
            onMouseOver: this.editable
        }

        /*NEW ID LOADING VERSION */
        let inElement = [
            {
                id:`headerTitle-${this.props.id}`,
                type:'title',
            },
            {
                id:`headerBoxBackground-${this.props.id}`,
                type:'background',
            },
            {
                id:`headerBoxContent-${this.props.id}`,
                type:'text',
            },
        ]

        let showElement = getElement(inElement,this.props.defaultData,this.props.data)

        //TITLE HEADER
        let title = showElement.find(e => e.id === `headerTitle-${this.props.id}`)
        let boxBackground = showElement.find(e => e.id === `headerBoxBackground-${this.props.id}`)
        let boxContent = showElement.find(e => e.id === `headerBoxContent-${this.props.id}`)

        //SHOW HEADER BOX OR NOT
        let headerBox = true

        /* OLD ID LOADING VERSION */
        //BG IMG HEADER
        let bgdefault = this.props.defaultData.find(e => e.id === `header-${this.props.id}`)
        bgdefault = bgdefault === undefined ? "http://dansedebal.free.fr/assets/img/header1.jpg?h=4b55761a359dbb7f8d6cfa0c6fd2566a" : bgdefault.content.backgroundUrl
        let bgid = this.getIndex(this.props.data,'id', `header-${this.props.id}`);
            //BG COLOR HEADER
            let bgcolordefault = this.props.defaultData.find(e => e.id === `header-${this.props.id}`)
            bgcolordefault = bgcolordefault === undefined ? "#666" : bgcolordefault.content.backgroundColor
            let bgcolorid = this.getIndex(this.props.data,'id', `header-${this.props.id}`);

            //BG CHOICE
            let bgchoicedefault = this.props.defaultData.find(e => e.id === `header-${this.props.id}`)
            bgchoicedefault = bgchoicedefault === undefined ? "color" : bgchoicedefault.content.backgroundChoice
            let bgchoiceid = this.getIndex(this.props.data,'id', `header-${this.props.id}`);

        //IMG
        let imgdefaultid = this.props.defaultData.find(e => e.id === `headerImg-${this.props.id}`)
        let imgdefault =  imgdefaultid === undefined  ? "http://dansedebal.free.fr/assets/img/Logo-full.png?h=086276ede78b1f574363cad6cc4697b9" : imgdefaultid.content.imageUrl
        let imgid = this.getIndex(this.props.data,'id', `headerImg-${this.props.id}`)
            //alt
            let altdefaultid = this.props.defaultData.find(e => e.id === `headerImg-${this.props.id}`)
            let altdefault =  altdefaultid === undefined  ? "" : altdefaultid.content.alt
            let altid = this.getIndex(this.props.data,'id', `headerImg-${this.props.id}`)

        //TITLE HEADER
        let txtdefault = this.props.defaultData.find(e => e.id === `headerTitle-${this.props.id}`)
        txtdefault = txtdefault === undefined ? "Faites le premier pas, nous vous aiderons à faire les autres..." : txtdefault.content
        let txtid = this.getIndex(this.props.data,'id', `headerTitle-${this.props.id}`);

        //SCROLL CONTENT
        let scrolltxtdefault = this.props.defaultData.find(e => e.id === `headerScrollText-${this.props.id}`)
        scrolltxtdefault = scrolltxtdefault === undefined ? "Voir la suite..." : scrolltxtdefault.content
        let scrolltxtid = this.getIndex(this.props.data,'id', `headerScrollText-${this.props.id}`);
        return (
            <>
                <Editable dataId={`header-${this.props.id}`} dataType="background" openMenu={this.props.menuclose} className="position-relative mainselect myHtml">
            <header   className={`d-flex masthead`} id="accueil"
                      ref={(node) => {
                          if (node) {
                              node.style.setProperty("background", choiceBackground(this.props.data,bgchoicedefault,bgchoiceid, bgcolorid,bgcolordefault, bgid, bgdefault, "--------"), "important");
                          }}}
                      style={{minHeight: "50rem"}}>
                <div>{this.props.data.id}</div>

                <div className="container my-auto text-center" style={{zIndex:1}}>
                    <Editable dataId={`headerImg-${this.props.id}`} dataType="image" openMenu={this.props.menuclose} className="position-relative">
                    <img  className={this.state.selectImg}
                          src={`${
                              this.props.data[imgid] !== undefined ?
                                  this.props.data[imgid].img.imageUrl !== undefined ?
                                      this.props.data[imgid].img.imageUrl :
                                      imgdefault :
                                  imgdefault}`
                          } style={{maxHeight: "130px"}}
                          alt={`${
                                this.props.data[altid] !== undefined ?
                                    this.props.data[altid].img.alt !== undefined ?
                                        this.props.data[altid].img.alt :
                                        altdefault :
                                    altdefault}`
                    } />
                    </Editable>
                    <Editable dataId={`headerTitle-${this.props.id}`} dataType="title" openMenu={this.props.menuclose} style={{color: "rgb(255,255,255)"}} className="mb-5 position-relative">
                        <JsxParser jsx={this.props.data[title.index] !== undefined ? this.escapeHtml(this.props.data[title.index].img) : this.escapeHtml(title.defaultData)}>

                        </JsxParser>
                    </Editable>
                    {headerBox ?
                        <Editable dataId={`headerBoxBackground-${this.props.id}`} dataType="background" openMenu={this.props.menuclose} style={{color: "rgb(255,255,255)"}} className="mb-5 position-relative">
                            <div className="mx-auto"
                                 ref={(node) => {
                                     if (node) {
                                         node.style.setProperty("background", choiceBackground(this.props.data,boxBackground.defaultData.backgroundChoice,boxBackground.index, boxBackground.index,boxBackground.defaultData.backgroundColor, boxBackground.index, boxBackground.defaultData.backgroundUrl, "--------"), "important");
                                     }}}
                                 style={{backgroundColor: "#7e3f3ffa",width:"60%",padding: "20px",border: "3px none rgb(236,184,7)",paddingBottom: "5px"}}>
                                <Editable dataId={`headerBoxContent-${this.props.id}`} dataType="textbox" openMenu={this.props.menuclose} style={{color: "rgb(255,255,255)"}} className="mb-5 position-relative">
                                    <JsxParser style={{color: "rgb(255,255,255)"}} jsx={this.props.data[boxContent.index] !== undefined ? this.escapeHtml(this.props.data[boxContent.index].img) : this.escapeHtml(boxContent.defaultData)}>

                                    </JsxParser>
                                </Editable>

                            </div>
                        </Editable>

                        :
                        <div>ADD</div>
                    }


                    <Editable dataId={`headerScrollText-${this.props.id}`} dataType="text" openMenu={this.props.menuclose} className="position-relative">
                        <div className="row d-sm-flex d-md-flex justify-content-sm-center justify-content-md-center"
                             style={{marginTop : "20rem"}}>
                            <div
                                className="col d-flex d-sm-flex d-md-flex d-lg-flex justify-content-center align-self-center justify-content-sm-center justify-content-md-center justify-content-lg-center">
                                <div className="scrollDown">
                                    <div className="chevron"></div>
                                    <div className="chevron"></div>
                                    <div className="chevron"></div>
                                    <span className="text">{this.props.data[scrolltxtid] !== undefined ? this.props.data[scrolltxtid].img : scrolltxtdefault}</span>
                                </div>
                            </div>
                        </div>
                    </Editable>

                </div>

            </header>
                </Editable>
                </>
        );
    }
}

export default Header;