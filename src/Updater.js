import React, { Component } from 'react';
import {HashRouter as Router, Link, Route} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
const {ipcRenderer} = window.require('electron')

class Updater extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message:'Lancement...',
            isDownload:false
        };

    }

    render() {
        const { match, location, history } = this.props;
        console.log(ipcRenderer)
        ipcRenderer.on('oui', (event, args) =>{
            console.log(`error update : ${args}`);
        });
        ipcRenderer.on('update_error', (event, args) =>{
            ipcRenderer.removeAllListeners('update_error');
            this.setState({message:`Erreur durant la mise à jour : ${args}`});
            console.log(`error update : ${args}`);
        });

        ipcRenderer.on('update_check', () => {
            ipcRenderer.removeAllListeners('update_check');
            this.setState({message:'Recherche de mises à jour...'});
            console.log("check update");
        });

        ipcRenderer.on('update_available', () => {
            ipcRenderer.removeAllListeners('update_available');
            this.setState({message:'Mise à jour trouvée et en cours de téléchargement...'});
            console.log("update available");
        });
        ipcRenderer.on('update_downloaded', () => {
            ipcRenderer.removeAllListeners('update_downloaded');
            this.setState({message:'Mise à jour installée, redémarrage de l\'application...'});
            this.setState({isDownload:true});
            console.log("update and restart");
        });
        return (
            <>
                <header className="d-flex masthead">
                    <div className="container my-auto text-center">
                        <FontAwesomeIcon icon="spinner" size="3x" spin={!this.state.isDownload}/>
                        <br />
                        <p id="message">{this.state.message}</p>
                    </div>
                </header>
            </>
        );
    }
}

export default Updater;