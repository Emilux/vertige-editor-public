import React from 'react';
import {
    HashRouter as Router,
    Route,
    Redirect
} from "react-router-dom";

import logo from './logo.svg';
import './App.css';
import TopMenu from './Menu';
import MenuEditor from './MenuEditor';
import Home from './Home';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Updater from "./Updater";
import Config from "./Config";
import Editor from "./Editor";
const fs = window.require('fs');
const {app} = window.require('electron').remote;
const {ipcRenderer} = window.require('electron');

/* -------------------------------- */
/* --------RIGHT CLICK MENU-------- */
/* -------------------------------- */
const { remote } = window.require('electron')
const { Menu, MenuItem } = remote

const menu = new Menu()
const isMac = process.platform === 'darwin'

const template = [
    {label: 'Annuler', role: 'undo' },
    {label: 'Rétablir', role: 'redo' },
    {type: 'separator' },
    {label: 'Couper', role: 'cut' },
    {label: 'Copier', role: 'copy' },
    {label: 'Coller', role: 'paste' },
    ...(isMac ? [
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
            label: 'Speech',
            submenu: [
                { role: 'startspeaking' },
                { role: 'stopspeaking' }
            ]
        }
    ] : [
        {label: 'Supprimer', role: 'delete' },
        { type: 'separator' },
        {label: 'Tout sélectionner', role: 'selectAll' }
    ])
]

window.addEventListener('contextmenu', (e) => {
    e.stopPropagation()
    e.preventDefault()
    Menu.buildFromTemplate(template).popup({ window: remote.getCurrentWindow() })
}, false)

/* -------------------------------- */
/* ------END RIGHT CLICK MENU------ */
/* -------------------------------- */

//CHECK IF CONFIG FILE IS CREATED
ipcRenderer.send('check-config');
ipcRenderer.send('access-json')
class App extends React.Component{

    constructor(props) {
        super(props);

        this.upload = this.upload.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.closeNotification = this.closeNotification.bind(this);
        this.restartApp = this.restartApp.bind(this);


        this.state = {
            isConfig:false
        }

    }

    upload(event){
        if (event === "config"){

        }
    }

    handleSubmit(event){
        event.preventDefault();
    }

    closeNotification() {
        this.setState({hiddenNotif:'hidden'});
        console.log(this.state.hiddenNotif);
        console.log("close");
    }
    restartApp() {
        ipcRenderer.send('restart_app', "ping");
        console.log("test");
    }

    render() {
        console.log("test")
        ipcRenderer.on('check-config-isConfig', (event, args) =>{
            ipcRenderer.removeAllListeners('check-config-isConfig');
            if (args){
                this.setState({isConfig:args});
            }
        });
        return (
            <Router>
                <Route path="/Updater">
                    <Updater />
                </Route>

                <Route path="/home">
                    <TopMenu />
                    {this.state.isConfig ? <Redirect to="/Editor/?page=default" /> : <Home /> }
                </Route>

                <Route path="/Editor">
                    <div className="content">
                        <MenuEditor/>
                        <Editor/>
                    </div>

                </Route>

            </Router>
        );
    }
}

export default App;
