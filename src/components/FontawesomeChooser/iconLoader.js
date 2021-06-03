import React, {Component, Suspense} from "react";
import {HashRouter as Router, Link, Redirect, Route, withRouter} from "react-router-dom";
import {Modal, Button, Overlay, OverlayTrigger, Tooltip} from "react-bootstrap"


const {ipcRenderer} = window.require('electron');
const FontAwesomeIcon = React.lazy(() => import('@fortawesome/react-fontawesome').then(module=>({default: module.FontAwesomeIcon})));


class IconLoader extends Component{
    constructor(props) {
        super(props);

    }

    render() {
        let item = this.props.item
        let i = this.props.loop
        let value = this.props.iconvalue
        return (
            <>
                <FontAwesomeIcon id={`icon${i}`} style= {{fontSize: "30px"}} className={`icon-hover ${value === item ? "icon-selected" : ""}`} datatext={`${item}`} icon={item} />
            </>)
    }
}

export default IconLoader;