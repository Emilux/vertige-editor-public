import React, {Component} from "react";
import {HashRouter as Router, Link, Route, withRouter, Redirect} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
const {ipcRenderer} = window.require('electron');
const { remote } = window.require('electron');

class Config extends Component{
    constructor(props) {
        super(props);
        this.state = {
            host: '',
            user: '',
            password: '',
            message:false,
            loadingftp:false,
            submitted:false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTest = this.handleTest.bind(this);
    }

    handleSubmit(event){
        let data = {
            host: this.state.host,
            user: this.state.user,
            password_hashed: this.state.password,
            isConfig:true
        };
        this.setState({submitted:true});
        ipcRenderer.send('edit-config', data);
        let win = remote.getCurrentWindow();
        win.reload()
        event.preventDefault();
    }

    handleTest(event){
        let data = {
            host: this.state.host,
            user: this.state.user,
            password_hashed: this.state.password
        };
        ipcRenderer.send('test-config', data);
        this.setState({loadingftp:true});
        ipcRenderer.on('test-config-err', (event, args) =>{
            ipcRenderer.removeAllListeners('test-config-err');
            this.setState({loadingftp:false});
            let message;

            if (args === "connected"){
                message = true
            }

            this.setState({message: message});
        });
        event.preventDefault();
    }

    render() {
        return (
            <>
            <Link to="/home" className="btn btn-primary">Revenir en arrière</Link>
            <form onSubmit={this.handleSubmit}>
                <div className="form-group text-left">
                    <label htmlFor="host">hôte</label>
                    <input id="host" type="text" className="form-control"
                           placeholder="hôte"
                           value={this.state.host}
                           onChange={e => this.setState({host: e.target.value})}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="user">utilisateur</label>
                    <input id="user" type="text" className="form-control"
                           placeholder="Utilisateur"
                           value={this.state.user}
                           onChange={e => this.setState({user: e.target.value})}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="password">mot de passe</label>
                    <input id="password" type="password" className="form-control"
                           placeholder="mot de passe"
                           value={this.state.password}
                           onChange={e => this.setState({password: e.target.value})}
                    />
                </div>
                <div className="form-group text-left">
                    <div className="input-group">
                        <input type="button" className="btn btn-primary" value="Tester" onClick={this.handleTest}/>
                        <FontAwesomeIcon className="ml-2 my-auto d-flex align-items-center justify-content-center" icon={this.state.message && !this.state.loadingftp ? "check" : this.state.loadingftp ? "spinner" : "times"} size="2x" color={this.state.message && !this.state.loadingftp ? "green" : this.state.loadingftp ? "black" : "red"} spin={this.state.loadingftp}/>
                    </div>
             </div>

                <input type="submit" className="btn btn-primary" value="Configurer"/>
                {this.state.submitted ? <Redirect to={{ pathname: '/editor/?page=default'}} /> : ""}

            </form>
        </>)
    }
}

export default Config;