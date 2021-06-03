import React, {Component, Suspense} from "react";
import {HashRouter as Router, Link, Redirect, Route, withRouter} from "react-router-dom";
import {Modal, Button, Overlay, OverlayTrigger, Tooltip} from "react-bootstrap"

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import iconListSolid from "./listIcon.json";
import {forEach} from "react-bootstrap/ElementChildren";
import * as faIcons from 'react-icons/fa'
const {ipcRenderer} = window.require('electron');
const iconLoader = React.lazy(() => import('./FontawesomeChooser/iconLoader'));


class FontawesomeChooser extends Component{
    constructor(props) {
        super(props);
        this.state = {
            search:false,
            searchText:"",
            searchFound:[],
            selectedIcon:"",
            completedloading:false,
            show:false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showAllIcons = this.showAllIcons.bind(this);
        this.searchIcon = this.searchIcon.bind(this);
        this.showSearchedIcons = this.showSearchedIcons.bind(this);


    }

    showAllIcons(){
        let iconList = iconListSolid
        let element = []

        //SEARCH
        if (this.state.show){
            let value = this.state.searchText
            let lowercasedFilter = value.toLowerCase();
            let find = iconList.filter(item => {
                return Object.keys(item).some(key =>
                    item.toLowerCase().includes(lowercasedFilter)
                );
            });
            for (let i = 0; i < find.length; i++) {
                //console.log(`${i} sur ${find.length}`)
                element.push(


                        <div className={`col-3 p-2 text-center`} key={`${i}`} onClick={e => this.showSearchedIcons(e,find[i])}>{React.createElement(iconLoader, {
                            loop:i,
                            iconvalue:value,
                            item:find[i],
                        })}</div>
                )
            }
            return element;

        }

    }

    showSearchedIcons(e, icon){
        let getInput = e.currentTarget.parentNode.parentNode
        let input = getInput.querySelector("input")

        let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(input, `${icon}`);
        let ev = new Event('input', { bubbles: true});
        input.dispatchEvent(ev);

        this.setState({searchText:icon})
    }

    searchIcon(e){
        let value = e.target.value
        this.props.onUpdate(e.target.value);

        if (this.state.show === false){
            this.setState({show:true})
        }

        this.setState({searchText:value})
        if (value !== ""){
            if (this.state.search === false){
                this.setState({search:true})
            }
        } else {
            this.setState({search:false})
        }
    }

    handleSubmit(e){
        e.preventDefault();
        if (this.state.show === false){
            this.setState({show:true})
        } else {
            this.setState({show:false})
        }


    }

    render() {

        return (
            <>
                <div className="overflow-hidden position-relative" style={{height:"100%", width:"100%"}}>
                    <div className="input-group">
                        <input value={this.state.search ? this.state.searchText : this.props.value} onChange={e => this.searchIcon(e)} type="text" className="form-control" placeholder="Rechercher un icone..."
                               aria-label="Recipient's username" aria-describedby="button-addon2"/>
                        <div className="input-group-append">
                            <button className="btn btn-primary" onClick={e => this.handleSubmit(e)}>Voir les icônes</button>
                        </div>
                    </div>
                        <Suspense fallback={<div>CHARGEMENT...</div>}>
                            <div hidden={!this.state.show} className="row mx-auto" style={{overflowY:"scroll", height:"210px"}} id="search">
                                {this.showAllIcons()}
                            </div>
                        </Suspense>




                </div>
            </>)
    }
}

export default FontawesomeChooser;