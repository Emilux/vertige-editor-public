import React, {Component, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Button, Modal} from "react-bootstrap";
import {Route} from "react-router-dom";
import ChoiceMenu from "./pages";
const {ipcRenderer} = window.require('electron');
const { remote } = window.require('electron');
class Menu extends Component{
    constructor() {
        super();
        this.state = {
            setShow:false,
            show:false,
            config:null,
            password:"",
            showChoiceMenu:false
        }

        this.handleMenuClick = this.handleMenuClick.bind(this)
    }

    handleMenuClick(e,event){
        e.preventDefault()
        let win = remote.getCurrentWindow();
        if (event === 'close'){
            win.close()
            if (!window.closed){
                win.destroy()
            }
        }
        if (event === 'min'){
            win.minimize();
        }
        if (event === 'max'){
            win.isMaximized() ? win.unmaximize() : win.maximize();
        }
        if (event === 'publish'){
            this.setState({setShow:false})
            let element = []
            let headerStyle = document.querySelectorAll("style")
            let data = document.querySelector("#published-page")
            data = data.innerHTML
            element = [{body:data,header:[]}]

            for (let i = 0; i < headerStyle.length;i++){
                element[0]["header"].push(`<style>${headerStyle[i].innerHTML}</style>`)
            }
            ipcRenderer.send("publishhtml", element[0],this.state.password);
        }
        if (event === 'openmenu'){

        }
    }

    render() {

        ipcRenderer.on('letOpenMenu', (event, args) => {
            ipcRenderer.removeAllListeners("letOpenMenu")
            if (!this.state.showChoiceMenu){
                this.setState({showChoiceMenu:true})
            }
        })

        return (
            <>
                <nav className="toolbar navbar navbar-light navbar-expand"
                     style={{backgroundColor: "#aa4949",paddingTop: "3px",paddingBottom: "3px"}}>
                    <div className="container-fluid">
                        <a className="navbar-brand" href="" style={{color: "#ffffff",fontSize: "15px",padding: "0"}}>Vertige</a>
                        <button className="btn btn-warning rounded-0 no-drag" onClick={
                            e => !this.state.showChoiceMenu ? this.setState({showChoiceMenu:true}) : this.setState({showChoiceMenu:false})
                        } style={{fontSize: "15px",padding: "0 5px"}}>Ouvrir le menu</button>
                        <button data-toggle="collapse" data-target="#navcol-1" className="navbar-toggler"><span
                            className="sr-only">Toggle navigation</span><span className="navbar-toggler-icon"></span></button>
                        <div className="collapse navbar-collapse" id="navcol-1">
                            <ul className="nav navbar-nav ml-auto">
                                <li onClick={e => this.handleMenuClick(e,'min')} role="presentation" className="nav-item">
                                    <div id="minimize" className="nav-link"
                                         style={{color: "#ffffff",paddingTop: "0",paddingBottom: "0"}}><FontAwesomeIcon icon="window-minimize"/></div>
                                </li>
                                <li onClick={e => this.handleMenuClick(e,'max')} role="presentation" className="nav-item">
                                    <div id="maximize" className="nav-link"
                                         style={{color: "#ffffff",paddingTop: "0",paddingBottom: "0"}}><FontAwesomeIcon icon="window-maximize"/></div>
                                </li>
                                <li onClick={e => this.handleMenuClick(e,'close')} role="presentation" className="nav-item">
                                    <div id="close" className="nav-link"
                                         style={{color: "#ffffff",paddingTop: "0",paddingBottom: "0"}}><FontAwesomeIcon icon="times"/></div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <ChoiceMenu showChoiceMenu={this.state.showChoiceMenu}/>
            </>

        );
    }

}


export default Menu;