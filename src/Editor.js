import React, {Component, Suspense} from "react";
import loadable from '@loadable/component'
import {HashRouter as Router, Link, Redirect, Route, withRouter} from "react-router-dom";
import IndexEditor from "./template/index";
import {Modal, Button} from "react-bootstrap"
import { BlockPicker } from 'react-color'
import {forEach} from "react-bootstrap/ElementChildren";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import FontawesomeChooser from "./components/FontawesomeChooser";
import { Editor as Tiny } from '@tinymce/tinymce-react';
const {ipcRenderer} = window.require('electron');

class Editor extends Component{
    constructor(props) {
        super(props);

        this.state = {
            img:[],
            json:"",
            backgroundChange:[],
            show:true,
            sended:false,
            menuclose:true,
            setShow:false,
            idData:null,
            multiple:false,
            default:null,
            editing:{
                type:null,
                is:false
            },
            editionParam:null
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showEdition = this.showEdition.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.useQuery = this.useQuery.bind(this);
        this.arrayChange = this.arrayChange.bind(this);
        this.getAllIndexes = this.getAllIndexes.bind(this);
        this.defaultEdition = this.defaultEdition.bind(this);
        this.showTiny = this.showTiny.bind(this);


    }
    componentDidUpdate(){
        if (this.state.sended === true){
            this.setState({img:[]})
            this.setState({sended:false})
        }
    }
    closeModal(){
        let query = this.useQuery();

        let path = `/Editor/?page=${query.get("page")}`;

        //let choice menu show up again when modal closed
        ipcRenderer.send('closeChoiceMenu', false)

        this.props.history.push(path);
        this.setState({editing:{type:null,is:false}})
    }

    useQuery(){
        return new URLSearchParams(this.props.location.search);
    }

    handleEditorChange = (content, editor) => {
        console.log('Content was updated:', content);
    }

    arrayChange(e, type, main){

        if (main === 'block'){
            if (type === 'blockIcon'){
                let icon = e;
                this.setState({img:{icon:icon,title:this.state.img.title,content:this.state.img.content}, editing:{type:"icon",is:true}})
            } else if (type === 'blockTitle'){
                let title = e
                this.setState({img:{icon:this.state.img.icon,title:title,content:this.state.img.content},editing:{type:"title",is:true}})
            } else if (type === 'blockText'){
                let content = e
                    .replace(/\n/g,'<br/>')
                    .replace(/\r/g,'<br/>')
                    .replace(/\r\n/g,'<br/>')
                this.setState({img:{icon:this.state.img.icon,title:this.state.img.title,content:content},editing:{type:"content",is:true}})
            }
        } else if (main === 'imgBlock'){
            if (type === 'blockImg'){
                let img = e.target.value
                this.setState({img:{imageUrl:img, alt:this.state.img.alt},editing:{type:"imageUrl",is:true}})
            } else if (type === 'blockAlt'){
                let alt = e.target.value
                this.setState({img:{imageUrl:this.state.img.imageUrl, alt:alt},editing:{type:"alt",is:true}})
            }
        } else if (main === 'background'){
            if (type === 'backgroundUrl'){
                let backgroundUrl = e.target.value
                if (this.state.img.backgroundChoice === undefined){

                    this.setState({img:{backgroundUrl:backgroundUrl, backgroundColor:this.state.img.backgroundColor,backgroundChoice:"url"},editing:{type:"backgroundUrl",is:true}})

                } else {
                    this.setState({img:{backgroundUrl:backgroundUrl, backgroundColor:this.state.img.backgroundColor,backgroundChoice:this.state.img.backgroundChoice},editing:{type:"backgroundUrl",is:true}})
                }

            }else if (type === 'backgroundColor'){
                let backgroundColor = e.hex

                if (this.state.img.backgroundChoice === undefined){
                    this.setState({img:{backgroundUrl:this.state.img.backgroundUrl, backgroundColor:backgroundColor, backgroundChoice:"color"},editing:{type:"backgroundColor",is:true}})

                } else {
                    this.setState({img:{backgroundUrl:this.state.img.backgroundUrl, backgroundColor:backgroundColor, backgroundChoice:this.state.img.backgroundChoice},editing:{type:"backgroundColor",is:true}})
                }
                this.setState({img:{backgroundUrl:this.state.img.backgroundUrl, backgroundColor:backgroundColor, backgroundChoice:this.state.img.backgroundChoice},editing:{type:"backgroundColor",is:true}})

            } else if (type === "backgroundChoice"){
                let backgroundChoice = e.target.value
                this.setState({img:{backgroundUrl:this.state.img.backgroundUrl, backgroundColor:this.state.img.backgroundColor,backgroundChoice:backgroundChoice},editing:{type:"backgroundChoice",is:true}})

            }
        }

    }

    defaultEdition(block=null, isEdited=false, editingValue="",editingType=null,defaultValue=""){
        let query = this.useQuery();
        let id = query.get("id").split("-")[1];
        let registerData = this.state.backgroundChange
        let img = this.state.img
        let idArray = this.state.backgroundChange.filter(e => e.id === query.get("id"));
        let idDefault = this.state.default.filter(e => e._uid === id);
        if (!isEdited || (block!==null && this.state.img[block] === undefined)){
            if (idArray[idArray.length-1] !== undefined && idArray[idArray.length-1] !== null){

                if (block===null){
                    return idArray[idArray.length-1].img
                } else if (idArray[idArray.length-1].img[block] !== undefined) {
                    return idArray[idArray.length-1].img[block]
                } else if (idArray[idArray.length-1].img[block] === undefined){
                    let DefaultregisterData = idDefault[0].content.filter(e => e.id === query.get("id"))
                    if (DefaultregisterData[0] !== undefined){
                        if (typeof DefaultregisterData[0].content === "object"){
                            for (const i in DefaultregisterData[0].content){
                                if (DefaultregisterData[0].content[block] !== undefined){
                                    return DefaultregisterData[0].content[block]
                                } else {
                                    return defaultValue
                                }
                            }
                        } else {
                            return DefaultregisterData[0].content
                        }
                    } else {
                        return defaultValue
                    }
                }


            } else {
                let DefaultregisterData = idDefault[0].content.filter(e => e.id === query.get("id"))
                if (DefaultregisterData[0] !== undefined){
                    if (typeof DefaultregisterData[0].content === "object"){
                        for (const i in DefaultregisterData[0].content){
                            if (DefaultregisterData[0].content[block] !== undefined){
                                return DefaultregisterData[0].content[block]
                            } else {
                                return defaultValue
                            }
                        }
                    } else {
                        return DefaultregisterData[0].content
                    }
                } else {
                    return defaultValue
                }

            }
        } else {
            if (block !== editingType){
                return this.state.img[block]
            } else {
                return editingValue
            }


        }

    }

    showTiny(option=null){
        let formats = {
            titre_block: {block : 'div', styles : {fontSize : '20px'}, attributes: { title: 'Titre'}},
            paragraph_lead: {block : 'p',classes:"lead", styles : {textShadow: "0px -1px 5px"}, attributes: { title: 'Paragraphe lead'}},
            second_titre: {block : 'h3',classes:"text-secondary", attributes: { title: 'Second titre'}}
        }
        let block_formats =  'Second titre=second_titre;Titre=titre_block;Paragraph=p;Paragraph lead=paragraph_lead;Header 1=h1;Header 2=h2;Header 3=h3;Header 4=h4;Header 5=h5;'
        let contextmenu = 'paste pastetext copy link preview'
        let plugins = "paste autoresize wordcount link"
        let toolbar = "bold italic underline | forecolor | link | formatselect | fontsizeselect | alignleft aligncenter alignright alignjustify"
        let fontsize_formats = "5px 10px 12px 16px 20px 25px 30px 35px 40px 45px 50px"
        if (option === "title"){
            toolbar = "bold italic underline | forecolor | link | formatselect | fontsizeselect"


        } else if (option === "texte") {


        } else {



        }
        return (
            {
            formats:formats,
                block_formats:block_formats,
                language: "fr_FR",
                language_url: "./langs/fr_FR.js",
                branding: false,
                height: 50,
                toolbar_mode: 'wrap',
                menubar: false,
                fontsize_formats: fontsize_formats,
                contextmenu: contextmenu,
                plugins: plugins,
                toolbar: toolbar,
            }
        )
    }

    showEdition(){
        let query = this.useQuery();
        let type = query.get("type");
        let element = <div className="text-center mt-5 mb-5"><FontAwesomeIcon style={{color:"rgb(170, 73, 73)"}} className="pulse-icon" size="3x" icon="feather"/><div>{query.get("type") !== undefined ? `l'élément : ${query.get("type")} n'est pas encore pris en charge` : "une erreur est survenu"}</div></div>
        if (type !== null){
            if(type === "textbox") {
                //TEXT INPUT
                element =
                    <div className="form-group">
                        <label htmlFor="textbox">Contenu :</label>
                        <Tiny
                            id="textbox"
                            initialValue={`${this.defaultEdition()}`}
                            init={this.showTiny("texte")}
                            onEditorChange={(content, editor) => this.setState({
                                img: content
                            })}
                        />
                    </div>

            } else if(type === "simpletext"){
                //SIMPLE TEXT INPUT FOR EXAMPLE : TITLE
                element =
                    <div className="form-group">
                        <label htmlFor="inputText">Texte :</label>
                        <input id="inputText" value={`${this.defaultEdition(null, this.state.editing.is, this.state.img)}`} placeholder="Texte..." className="form-control" onChange={e => this.setState({img: e.target.value,editing:{type:null,is:true}})} type="text"/>
                    </div>
            }else if (type === "background"){
                //BACKGROUND
                element =
                    <>
                        <div className="form-group">
                            <label htmlFor="bgtype-select">Choisir entre image ou couleur :</label>
                            <select value={`${this.defaultEdition("backgroundChoice", this.state.editing.is, this.state.img.backgroundChoice,null,"url")}`} className="custom-select" onChange={e => this.arrayChange(e, 'backgroundChoice', 'background')} name="bgtype" id="bgtype-select">
                                <option value="url">Image</option>
                                <option value="color">Couleur</option>
                            </select>
                        </div>
                        <div hidden={
                                this.defaultEdition("backgroundChoice", this.state.editing.is, this.state.img.backgroundChoice,null,"url") !== "url" ?
                                    true : false
                            }  className="form-group">
                            <label htmlFor="backgroundUrl">Url de la photo :</label>
                            <input id="backgroundUrl" value={`${this.defaultEdition("backgroundUrl", this.state.editing.is, this.state.img.backgroundUrl)}`} placeholder="Url de la photo..." className="form-control" onChange={e => this.arrayChange(e, 'backgroundUrl', 'background')} type="text"/>
                            <img className="img-fluid mx-auto d-block" src={`${this.defaultEdition("backgroundUrl", this.state.editing.is, this.state.img.backgroundUrl)}`} width="70%" />
                        </div>
                        <div hidden={
                                this.defaultEdition("backgroundChoice", this.state.editing.is, this.state.img.backgroundChoice,null,"url") !== "color" ?
                                    true : false
                            } className="form-group">
                            <label htmlFor="colorpicker">Couleur du fond :</label>
                            <BlockPicker
                                id="colorpicker"
                                className="mx-auto text-center"
                                color={`${this.defaultEdition("backgroundColor", this.state.editing.is, this.state.img.backgroundColor)}`}
                                onChangeComplete={ e => this.arrayChange(e, 'backgroundColor', 'background')}
                            />
                        </div>
                    </>
            } else if (type === "block") {
                //BLOCK
                element =
                    <>
                        <div className="form-group">
                            <label htmlFor="blockIcon">Icon :</label>
                            <FontawesomeChooser value={`${this.defaultEdition("icon",this.state.editing.is, this.state.img.icon,this.state.editing.type)}`} id="blockIcon" onUpdate={e => this.arrayChange(e,'blockIcon', 'block')}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="blockTitle">Titre :</label>
                            <Tiny
                                id="blockTitle"
                                initialValue={`${this.defaultEdition("title",this.state.editing.is, this.state.img.title,this.state.editing.type)}`}
                                init={this.showTiny("title")}
                                onEditorChange={(content, editor) => this.arrayChange(content, 'blockTitle', 'block')}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="blockText">Contenu :</label>
                            <Tiny
                                id="blockText"
                                initialValue={`${this.defaultEdition("content",this.state.editing.is, this.state.img.content, this.state.editing.type)}`}
                                init={this.showTiny("texte")}
                                onEditorChange={(content, editor) => this.arrayChange(content, 'blockText', 'block')}
                            />
                        </div>
                    </>



            } else if (type === "image"){
                //IMAGE
                element =
                    <>
                        <div className="form-group">
                            <label htmlFor="imageUrl">Url de la photo :</label>
                            <input id="imageUrl" value={`${this.defaultEdition("imageUrl", this.state.editing.is, this.state.img.imageUrl, this.state.editing.type)}`} placeholder="Url de la photo..." className="form-control" onChange={e =>  this.arrayChange(e, 'blockImg', 'imgBlock')} type="text"/>
                        </div>
                        <img className="img-fluid mx-auto d-block" src={`${this.defaultEdition("imageUrl", this.state.editing.is, this.state.img.imageUrl, this.state.editing.type)}`} width="70%" />
                        <div className="form-group">
                            <label htmlFor="altID">Intitulé (ALT) :</label>
                            <input id="altID" value={`${this.defaultEdition("alt", this.state.editing.is, this.state.img.alt, this.state.editing.type)}`} placeholder="Alt..." className="form-control" onChange={e =>  this.arrayChange(e, 'blockAlt', 'imgBlock')} type="text"/>
                        </div>
                    </>
            } else if (type === "title"){
                //TITLE
                element =
                    <>
                        <div className="form-group">
                            <label htmlFor="titleContent">Titre :</label>
                            <Tiny
                                id="titleContent"
                                initialValue={`${this.defaultEdition()}`}
                                init={this.showTiny("title")}
                                onEditorChange={(content, editor) => this.setState({
                                    img: content
                                })}
                            />
                        </div>
                    </>
            }
            return element;
        }

    }

    getAllIndexes(arr, val) {
        var indexes = [], i;
        for(i = 0; i < arr.length; i++)
            if (arr[i] === val)
                indexes.push(i);
        return indexes;
    }

    handleSubmit(e){
        e.preventDefault();
        let query = this.useQuery();
        if (this.state.img.length !== 0 ){
            let multiple = false;
            if (typeof this.state.img === "object"){

                for (const i in this.state.img){
                    if (this.state.img[i] === undefined){
                        let idArray = this.state.backgroundChange.filter(e => e.id === query.get("id"));


                        if (idArray[idArray.length-1] !== undefined){
                            if (idArray[idArray.length-1].id === query.get("id")){

                                this.state.img[i] = idArray[idArray.length-1].img[i]
                            }
                        }

                        /*for (let y = 0;y < this.state.backgroundChange.length,y++){

                        }*/
                    }
                }
                multiple = true
            }
            this.setState(prevState => ({
                backgroundChange:[...this.state.backgroundChange, {id:query.get("id"),img:this.state.img,multiple:multiple}],
            }))
            this.setState({sended:true})


        }
        this.setState({editing:{type:null,is:false}})
        this.setState({idData:query.get("id")})
        let path = `/Editor/?page=${query.get("page")}`;
        this.props.history.push(path);
    }

    render() {

        ipcRenderer.on('access-json-response', (event, args) =>{
            ipcRenderer.removeAllListeners('access-json-response');
            this.setState({default:args})
        })
        let query = this.useQuery();

        const props = {
            idData:this.state.idData,
            background:this.state.backgroundChange,
            json:this.state.json,
            sended:this.state.sended
        }

        return (
            <>
                <div className="d-flex w-100 overflow-hidden">

                    <Route path="/Editor/openheader">
                        <Suspense fallback={<div>CHARGEMENT...</div>}>
                            <Modal role="dial" enforceFocus={false} size="lg" centered show={true} onHide={this.closeModal} animation={false}>
                                <Modal.Header closeButton>
                                    <Modal.Title>{query.get("id")}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>{this.showEdition()}</Modal.Body>
                                <Modal.Footer>
                                    <Button className="rounded-0" variant="secondary" onClick={this.closeModal}>
                                        Fermer
                                    </Button>
                                    <Button className="rounded-0" variant="warning" onClick={this.handleSubmit}>
                                        Valider
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </Suspense>

                    </Route>
                    <div id="canvas" className="w-100 scroll">
                        <IndexEditor {...props} />
                    </div>
                </div>


            </>)
    }
}

export default withRouter(Editor);