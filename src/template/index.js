import React, { Component } from 'react';
import {HashRouter as Router, Link, Route, Switch,withRouter} from "react-router-dom";
import HeaderTP from "./header";
import Components from "../components/ComponentList";
const {ipcRenderer} = window.require('electron');

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            json:null,
            defaultData:null,
            page:null
        }
        this.renderer = this.renderer.bind(this)
        this.useQuery = this.useQuery.bind(this)
        this.routeChange = this.routeChange.bind(this)
    }

    componentDidUpdate() {
    }

    useQuery(){
        return new URLSearchParams(this.props.location.search);
    }

    send(data, sended){

        if (sended){
            ipcRenderer.send('send-json', data)
        }

    }

    renderer(data,menu){


       ipcRenderer.on('access-json-response', (event, args) =>{
            ipcRenderer.removeAllListeners('access-json-response');
            this.setState({json:args})
        })

        let Array = this.state.json;

        let query = this.useQuery();

        if (Array !== null && Array !== undefined){
            let element = [];
            let Compo;
            let Page;

            for(let i = 0;i < Array.length;i++){
                Compo = Components[Array[i].component]
                Page = Array[i].page


                if (Page === query.get("page")){
                    element.push(React.createElement(Compo,{
                            key:Array[i]._uid,
                            id: Array[i]._uid,
                            onAllPage:Array[i].onAllPage,
                            data:data,
                            defaultData:Array[i].content,
                        }

                        )
                    )
                }



            }
            if (query.get("page") === "default"){
                ipcRenderer.send('openMenu')
                let Page = this.state.page;
                element = (
                    <div className="container h-100">
                        <div className="position-absolute m-0 " style={{top:"50%",left:" 50%",  transform: "translate(-50%, -50%)"}}>
                            Veuillez choisir une page dans le menu
                        </div>
                    </div>
                )
            }
            return element
        }

    }

    routeChange(page) {
        let path = `/Editor/?page=${page}`;
        this.props.history.push(path);
    }

    render() {
        return (
            <div>
                {this.renderer(this.props.background,this.props.menuclose)}
                {this.send(this.props.background,this.props.sended)}
            </div>
        )
    }
}

export default withRouter(Home);