import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
const { remote } = window.require('electron');

function handleMenuClick(event){
    let win = remote.getCurrentWindow();
    if (event === 'close'){
        win.close();
    }
    if (event === 'min'){
        win.minimize();
    }
    if (event === 'max'){
        win.isMaximized() ? win.unmaximize() : win.maximize();
    }
}

function Menu() {
    return (
        <nav className="toolbar navbar navbar-light navbar-expand fixed-top"
             style={{backgroundColor: "#aa4949",paddingTop: "3px",paddingBottom: "3px"}}>
            <div className="container-fluid"><a className="navbar-brand" href=""
                                                style={{color: "#ffffff",fontSize: "15px",padding: "0"}}>Vertige</a>
                <button data-toggle="collapse" data-target="#navcol-1" className="navbar-toggler"><span
                    className="sr-only">Toggle navigation</span><span className="navbar-toggler-icon"></span></button>
                <div className="collapse navbar-collapse" id="navcol-1">
                    <ul className="nav navbar-nav ml-auto">
                        <li onClick={e => handleMenuClick('min')} role="presentation" className="nav-item">
                            <div id="minimize" className="nav-link"
                                 style={{color: "#ffffff",paddingTop: "0",paddingBottom: "0"}}><FontAwesomeIcon icon="window-minimize"/></div>
                        </li>
                        <li onClick={e => handleMenuClick('max')} role="presentation" className="nav-item">
                            <div id="maximize" className="nav-link"
                                 style={{color: "#ffffff",paddingTop: "0",paddingBottom: "0"}}><FontAwesomeIcon icon="window-maximize"/></div>
                        </li>
                        <li onClick={e => handleMenuClick('close')} role="presentation" className="nav-item">
                            <div id="close" className="nav-link"
                                 style={{color: "#ffffff",paddingTop: "0",paddingBottom: "0"}}><FontAwesomeIcon icon="times"/></div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Menu;