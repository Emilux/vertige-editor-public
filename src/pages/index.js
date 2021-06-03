import React, { Component } from 'react';
import {HashRouter as Router, Link, Redirect, Route, Switch, withRouter} from "react-router-dom";
import Components from "../components/ComponentList";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Button, Modal} from "react-bootstrap";
const {ipcRenderer} = window.require('electron');

class ChoiceMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            json:null,
            defaultData:null,
            setShow:false,
            show:false,
            config:null,
            password:"",
            registerPassword:false,
            app:null,
            preview:false,
            showChoiceMenu:false,
            openPage:{
                isOpen:true,
                page:null
            }
        }
        this.renderer = this.renderer.bind(this)
        this.routeChange = this.routeChange.bind(this)
        this.handleMenuClick = this.handleMenuClick.bind(this)
        this.renderPreview = this.renderPreview.bind(this)
    }

    componentDidUpdate() {
    }

    routeChange(page,pages) {
        let path = `/Editor/?page=${page}`;
        this.props.history.push(path);
    }

    send(data, sended){

        if (sended){
            ipcRenderer.send('send-json', data)
        }

    }

    isOnAllPage(page){
        for (let element in this.state.json){
            if (element.page === page){
                if (element.pos !== undefined){
                    return element.pos
                }
            }
        }
        return null;

    }

    renderPreview(){
        if (this.state.app !== null && this.state.app !== undefined){
            let Array = this.state.app
            let Page = this.state.json
            let Element = []
            let PageTitle = []
            for (let All in Page){
                if (Page[All].onAllPage === undefined || Page[All].onAllPage !== true){
                    Element.push(Array.filter(element => element.page === Page[All].component || (element.onAllPage !== undefined && element.onAllPage === true)))
                    PageTitle.push(Page[All].name)
                }
            }

            return (<div id="published-page" hidden={true}>

                {Element.map((element,index) => {

                      return (
                              <div id={PageTitle[index]} data-pagename={true}>
                                  {
                                      element.map(element => (
                                          React.createElement(Components[element.component],{
                                              key:element._uid,
                                              id: element._uid,
                                              data:[],
                                              defaultData:element.content,
                                          })
                                      ))
                                  }
                              </div>
                          )


                }

            )}</div>)
        }
    }

    renderer(){

        ipcRenderer.on('access-json-page-response', (event, args) =>{
            ipcRenderer.removeAllListeners('access-json-page-response');
            this.setState({json:args})
        })

        let Array = this.state.json;
        if (Array !== null && Array !== undefined){

            return  (Array.map(element => (
                    <li key={element._uid} className="nav-item">
                        <div className="nav-link" style={{color: "#ffffff",paddingTop: "0",paddingBottom: "0"}}>
                            <button  className="btn rounded-0 btn-warning" onClick={() => this.routeChange(element.component)}>
                                {element.title}
                            </button>
                        </div>

                    </li>
                )))
        }

    }

    handleMenuClick(e,event){
        e.preventDefault()
        if (event === 'publish'){
            ipcRenderer.send('access-json')
            ipcRenderer.on('access-json-response', async (event, args) =>{
                ipcRenderer.removeAllListeners('access-json-response');
                this.setState({app:args,preview:true})

            })
        } else if (event === 'publishConfirm'){
            this.setState({setShow:false, preview:false,app:null})
            let element = []
            let headerStyle = document.querySelectorAll("style")
            let data = document.querySelector("#published-page")
            let Page = document.querySelectorAll("div[data-pagename]")
            data = data.innerHTML
            element = [{body: {name:[],data:[]},header:[]}]

            for (let i = 0; i < Page.length;i++){
                element[0]["body"].name.push(Page[i].id)
                element[0]["body"].data.push(Page[i].innerHTML)
            }

            for (let i = 0; i < headerStyle.length;i++){
                element[0]["header"].push(`<style>${headerStyle[i].innerHTML}</style>`)
            }
            ipcRenderer.send("publishhtml", element[0],this.state.password, this.state.registerPassword);
        }
    }

    render() {
        ipcRenderer.on('closeChoiceMenu-response', (event, args)=>{
            ipcRenderer.removeAllListeners("closeChoiceMenu-response")
            this.setState({showChoiceMenu:args})
            console.log("close menu")

        })

        const handleClose = () => {
            this.setState({setShow:false, showChoiceMenu:false})
        };

        const handleClosePreview = () => {
            this.setState({preview:false})
            this.setState({app:null})
        };
        const handleShow = () => {
            ipcRenderer.send("getConfig");

            ipcRenderer.on("getConfig-reply", (event, args) => {
                ipcRenderer.removeAllListeners("getConfig-reply")
                this.setState({config:args})
            })
            this.setState({setShow:true, showChoiceMenu:true})
        };

        return (
            <>
            <nav hidden={this.state.showChoiceMenu === false ? !this.props.showChoiceMenu : this.state.showChoiceMenu} className="navbar navbar-light navbar-expand"
                 style={{backgroundColor: "#fff",paddingTop: "3px",paddingBottom: "3px",zIndex:"99999"}}>
                <div className="container-fluid mx-auto">
                    <div className="collapse navbar-collapse" style={{height: "160px"}} id="navcol-1">
                        <ul className="nav navbar-nav mx-auto">
                            <li onClick={handleShow} role="presentation" className="nav-item">
                                <div id="publish" className="nav-link" style={{color: "#ffffff",paddingTop: "0",paddingBottom: "0"}}>
                                    <button className="btn rounded-0 btn-primary">Publier</button>
                                </div>
                            </li>
                            {this.renderer()}
                        </ul>
                    </div>
                </div>
            </nav>
            <Modal centered show={this.state.setShow} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Publication de la page</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label htmlFor="host">Nom de l'hôte :</label>
                    <p id="host">{this.state.config !== null ? this.state.config.host:""}</p>
                    <label htmlFor="user">Nom d'utilisateur :</label>
                    <p id="user">{this.state.config !== null ? this.state.config.user:""}</p>
                    <label htmlFor="password">Mot de passe :</label>
                    <div className="input-group" hidden={this.state.config !== null && this.state.config.password !== null ? true : false}>
                        <input className="form-control" onChange={e => this.setState({password:e.target.value})} id="password" type="text" placeholder="mot de passe..."/>
                    </div>
                    <p id="user" hidden={this.state.config !== null && this.state.config.password !== null ? false : true}>{this.state.config !== null && this.state.config.password !== null ? this.state.config.password : ""}</p>

                    <div hidden={this.state.config !== null && this.state.config.password !== null ? true : false} className="form-check">
                        <input className="form-check-input" checked={this.state.config !== null && this.state.config.password !== null ? true : false} onChange={e => this.setState({registerPassword:e.target.checked})} id="check-password" type="checkbox"/>
                        <label htmlFor="check-password">Retenir le mot de passe</label>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button className="rounded-0" variant="secondary" onClick={handleClose}>
                        Fermer
                    </Button>
                    <Button className="rounded-0" variant="warning" onClick={e => this.handleMenuClick(e,'publish')}>
                        Publier
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal centered size="lg" show={this.state.preview} animation={false}>
                <Modal.Body>
                    {this.renderPreview()}
                    Publier maintenant ?
                </Modal.Body>
                <Modal.Footer>
                    <Button className="rounded-0" variant="secondary" onClick={handleClosePreview}>
                        Annuler
                    </Button>
                    <Button className="rounded-0" variant="warning" onClick={e => this.handleMenuClick(e,'publishConfirm')}>
                        Oui
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
        )
    }
}

export default withRouter(ChoiceMenu);