import React, { Component } from 'react';
import {HashRouter as Router, Link, Route, Switch} from "react-router-dom";
import Config from "./Config";
import Editor from "./Editor";
const {ipcRenderer} = window.require('electron');

class Home extends Component {

    render() {



        return (
            <header className="d-flex masthead">
                <div className="container my-auto text-center">
                    <Switch>
                        <Route exact path={"/home"}>
                            <div>
                                <Link to={{pathname : "/home/config", state:"home"}} className="btn btn-primary" style={{backgroundColor: "#ffd77b", color: "#635233",fontWeight: "bold"}}>Configuration</Link>
                            </div>
                        </Route>

                        <Route path="/home/config" component={Config}>
                        </Route>
                    </Switch>

                </div>
            </header>
        );
    }
}

export default Home;