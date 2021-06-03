const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const fs = require('fs');
const yaml = require('js-yaml');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var uniqid = require('uniqid');

const ftp = require("basic-ftp");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

function createWindow(){

    let updater = new BrowserWindow({
        backgroundColor: '#fff', // always set a bg color to enable font antialiasing!
        webPreferences: {
            nodeIntegration: true
        },
        width: 450,
        height: 600,
        minWidth: 200,
        minHeight: 500,
        frame: false
    })
    const pathUpload = url.format({
        pathname: path.join(__dirname, '../build/index.html'),
        hash: 'updater',
        protocol: 'file',
        slashes: true,
    })

    const pathHome = url.format({
        pathname: path.join(__dirname, '../build/index.html'),
        hash: 'home',
        protocol: 'file',
        slashes: true,
    })
    // load updater app
    updater.loadURL(
        isDev ? "http://localhost:3000#/updater" : pathUpload
    )

    updater.webContents.on('did-finish-load', ()=>{
        if (isDev){
            // Create the browser window.

            let mainWindow = new BrowserWindow({
                backgroundColor: '#fff', // always set a bg color to enable font antialiasing!
                webPreferences: {
                    nodeIntegration: true
                },
                width: 950,
                height: 600,
                minWidth: 200,
                minHeight: 500,
                frame: false
            });


            // and load the index.html of the app.
            mainWindow.loadURL(
                isDev ? "http://localhost:3000#/home" : pathHome
            );

            // Open the DevTools.
            if (isDev) mainWindow.webContents.openDevTools()

        }
        autoUpdater.on('error', (event) => {
            updater.webContents.send('update_error', event);
        });
        autoUpdater.on('checking-for-update', () => {
            updater.webContents.send('update_check');
        });

        autoUpdater.on('update-available', () => {
            updater.webContents.send('update_available');
            console.log("update available");
        });

        autoUpdater.on('update-downloaded', () => {
            updater.webContents.send('update_downloaded');
            autoUpdater.quitAndInstall();
            console.log("update available");
        });

        autoUpdater.on('before-quit-for-update', () => {
            app.relaunch();
        })

        autoUpdater.on('update-not-available', () => {
            // Create the browser window.

            let mainWindow = new BrowserWindow({
                backgroundColor: '#fff', // always set a bg color to enable font antialiasing!
                webPreferences: {
                    nodeIntegration: true
                },
                width: 800,
                height: 600,
                minWidth: 200,
                minHeight: 500,
                frame: false
            });


            // and load the index.html of the app.
            mainWindow.loadURL(
                isDev ? "http://localhost:3000#/home" : pathHome
            );

            // Open the DevTools.
            mainWindow.webContents.openDevTools();
            updater.close();
            console.log("update not available");
        });
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    if (!isDev){
        autoUpdater.checkForUpdatesAndNotify();
    }

    createWindow();
});

ipcMain.on('restart_app', (event, args) => {
    autoUpdater.quitAndInstall();
});
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
let rightClickPosition = null

//CREATE config.yaml if doesn't exist
ipcMain.on('check-config', (event, args) => {

    let file = `${app.getPath("userData")}/config.yaml`;
    //let fileContent = `host:\nuser:\npassword_hashed:\nisConfig: false`

    let config = {};

    config['host'] = null;
    config['user'] = null;
    config['password'] = null;
    config['isConfig'] = false;

    fs.access(file, fs.constants.F_OK, (err) => {
        if(err){
            fs.writeFile(file,yaml.safeDump(config), (err) => {
                if (err) throw err;
            });
        } else {
            let config = yaml.safeLoad(fs.readFileSync(file), 'utf8');
            event.reply('check-config-isConfig', config['isConfig']);
        }
    });



});

// EDIT CONFIG FILE WITH FTP INFORMATION
ipcMain.on('edit-config', (event, args) => {
    let file = `${app.getPath("userData")}/config.yaml`;

    let config = yaml.safeLoad(fs.readFileSync(file), 'utf8');

    config['host'] = args['host'];
    config['user'] = args['user'];
    config['password'] = null;
    config['isConfig'] = args['isConfig'];

    fs.writeFile(file, yaml.safeDump(config), 'utf8', (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
});

ipcMain.on('test-config', (event, args) => {


    console.log("oui")

    //GET FTP HOST
    let host = args['host'];

    //GET FTP USER
    let user = args['user'];

    //GET FTP PASSWORD
    let password_hash = args['password_hashed'];

    example();

    async function example() {
        const client = new ftp.Client();
        client.ftp.verbose = false;
        try {
            await client.access({
                host: host,
                user: user,
                password: password_hash,
                secure: false
            });
            event.reply('test-config-err', "connected");
        }
        catch(err) {
            event.reply('test-config-err', err['code']);
            console.log(err);
        }
        client.close();
    }
})
/* ------------------- */
/* -----END CONIG----- */
/* ------------------- */

/* ---------------- */
/* GET CONFIG VALUE */
/* ---------------- */
ipcMain.on('getConfig', (event, args) => {
    let file = `${app.getPath("userData")}/config.yaml`;
    let config = yaml.safeLoad(fs.readFileSync(file), 'utf8');
    event.reply('getConfig-reply', config)
})

/* -------------------- */
/* --SIMPLE JSON SAVE-- */
/* -------------------- */

ipcMain.on('access-json', (event, args) => {

    let file = `${app.getPath("userData")}/save.json`;
    //let fileContent = `host:\nuser:\npassword_hashed:\nisConfig: false`

    fs.access(file, fs.constants.F_OK, (err) => {
        if(err){
            let array =
                {
                    pages:[
                        {_uid:uniqid(),component:'MenuPage',title:'Menu', onAllPage:true},
                        {_uid:uniqid(),component:'HomePage',title: 'Page d\'accueil', name:'home'},
                        {_uid:uniqid(),component:'LieuxPage', title: 'Page lieux', name:'lieux2'},
                    ],
                    data:[
                        {_uid:uniqid(),page:'MenuPage', component:'MenuHeader',content:[],onAllPage:true, attribut:['background={this.props.background}', 'menuclose={this.props.menuclose}']},
                        {_uid:uniqid(),page:'HomePage', component:'HeaderTP',content:[], attribut:['background={this.props.background}', 'menuclose={this.props.menuclose}']},
                        {_uid:uniqid(),page:'HomePage', component:'SectionRightTP',content:[], attribut:['background={this.props.background}', 'menuclose={this.props.menuclose}']},
                        {_uid:uniqid(),page:'HomePage', component:'SectionCascadeTP',content:[], attribut:['background={this.props.background}', 'menuclose={this.props.menuclose}']},
                        {_uid:uniqid(),page:'HomePage', component:'SectionInfoTP',content:[], attribut:['background={this.props.background}', 'menuclose={this.props.menuclose}']},
                        {_uid:uniqid(),page:'HomePage', component:'SectionSimpleImageTP',content:[], attribut:['background={this.props.background}', 'menuclose={this.props.menuclose}']},
                        {_uid:uniqid(),page:'HomePage', component:'SectionContactTP',content:[], attribut:['background={this.props.background}', 'menuclose={this.props.menuclose}']},
                    ]
                }






            fs.writeFile(file,JSON.stringify(array,null,2), (err) => {
                if (err) throw err;
            });
        } else {
            let config = fs.readFileSync(file);
            event.reply('access-json-response', JSON.parse(config.toString()).data);
            event.reply('access-json-page-response', JSON.parse(config.toString()).pages);

        }
    });
})

ipcMain.on('get-json', (event, args) =>{
    let file = `${app.getPath("userData")}/save.json`;
    let config = fs.readFileSync(file);
    event.reply('get-json-response', JSON.parse(config.toString()).data);
})

ipcMain.on('openMenu', (event,args) => {
    event.reply('letOpenMenu', true);
})

ipcMain.on('send-json', (event, args) => {
    const Array = args;
    if (Array.length !== 0){
        let id = Array[Array.length-1].id
        let content = Array[Array.length-1].img
        let multiple = Array[Array.length-1].multiple
        console.log(multiple)
        let file = `${app.getPath("userData")}/save.json`;

        fs.access(file, fs.constants.F_OK, (err) => {
            if(!err){
                let config = fs.readFileSync(file);
                let Data = config.toString()
                Data = JSON.parse(Data)
                config = JSON.parse(config.toString()).data
                if (!multiple){
                    for (let i = 0;i < config.length;i++){
                        let configId = id.split("-")
                        configId = configId[1];
                        if ( config[i]._uid === configId ){
                            if (config[i].content.length !== 0 ){
                                if(config[i].content.find(e => e.id === id) !== undefined){
                                    let Check = config[i].content.findIndex(e => e.id === id)
                                    config[i].content[Check].id = id;
                                    config[i].content[Check].content = content;
                                } else {
                                    config[i].content.push({id:id,content:content})
                                }
                            } else {
                                config[i].content.push({id:id,content:content})
                            }

                        }
                    }
                } else {
                    for (let i = 0;i < config.length;i++){
                        let configId = id.split("-")
                        configId = configId[1];
                        if ( config[i]._uid === configId ){
                            if (config[i].content.length !== 0 ){
                                if(config[i].content.find(e => e.id === id) !== undefined){
                                    let Check = config[i].content.findIndex(e => e.id === id)
                                    config[i].content[Check].id = id;
                                    for (const y in content){
                                        console.log(`le contenu est ${content[y]} avec l'id : ${y}`)
                                        if (content[y] !== undefined){
                                            console.log(`le contenu est ${config[i].content[Check].content[y]} avec l'id : ${y}`)
                                            config[i].content[Check].content[y] = content[y];
                                        }

                                    }

                                } else {
                                    config[i].content.push({id:id,content:content})
                                }
                            } else {
                                config[i].content.push({id:id,content:content})
                            }

                        }
                    }
                }

                Data.data = config
                Data = JSON.stringify(Data,null,2);
                fs.writeFileSync(file,Data, 'utf8');

                /*fs.writeFile(file,JSON.stringify(array), (err) => {
                    if (err) throw err;
                });*/
            }
        });
    }


})

/* ------------- */
/* --PUBLISHER-- */
/* ------------- */

ipcMain.on('publishhtml', (event, args, password,checked) => {
    let header = args.header.join("")
    let yamlFile = `${app.getPath("userData")}/config.yaml`;
    let html = []
    let readyCount = 0;
    let fileArray = [];

    let config = yaml.safeLoad(fs.readFileSync(yamlFile), 'utf8');
    //GET FTP HOST
    let host = config['host'];

    //GET FTP USER
    let user = config['user'];

    let password_hash = password;

    if (checked){
        config['password'] = password;

        fs.writeFile(yamlFile, yaml.safeDump(config), 'utf8', (err) => {
            if (err) throw err;
            console.log('The file YAML has been saved!');
        });
    }



    //GET FTP PASSWORD

    for (let i = 0;i < args.body.name.length;i++){
        let file = `${app.getPath("userData")}/${args.body.name[i]}.html`;
        fileArray.push(file)
        console.log(fileArray)
        html.push(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,700,300italic,400italic,700italic">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Alef">
            <title>${args.body.name[i]} - Vertige des danses</title>
            <meta name="description" content="Cours de danses collectifs dans une ambiance sympathique décontracté, nous vous proposons une approche différente de l’enseignement traditionnel des danses de salon.">
            <meta property="og:image" content="http://dansedebal.free.fr/assets/img/image7.png?h=47e29de9562214940a0ba2d77488b73b">
            <meta property="og:type" content="website">
            <link rel="icon" type="image/png" sizes="16x16" href="http://dansedebal.free.fr/assets/img/favicon-16x16.png?h=b956dc671d95ba9639076b13a8be88dc">
            <link rel="icon" type="image/png" sizes="32x32" href="http://dansedebal.free.fr/assets/img/favicon-32x32.png?h=4cba020ea0a57776e810f746b5f9a697">
            <link rel="icon" type="image/png" sizes="180x180" href="http://dansedebal.free.fr/assets/img/apple-icon-180x180.png?h=d433ab095ca43d52e8e7096a9934159b">
            <link rel="icon" type="image/png" sizes="192x192" href="http://dansedebal.free.fr/assets/img/android-icon-192x192.png?h=8d3b744bbcd4bc2c867697f21913bf2a">
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            ${header}
          </head>
          <body>
            ${args.body.data[i]}
                <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.0/js/bootstrap.bundle.min.js"></script>
                <script src="http://dansedebal.free.fr/assets/js/smart-forms.min.js?h=0c556d5438933bda409408695b5733e7"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.4.1/jquery.easing.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/3.3.1/js/swiper.jquery.min.js"></script>
                <script src="http://dansedebal.free.fr/assets/js/script.min.js?h=7298b981ed03e9e34f35a6abc22a87fe"></script>
          </body>
        </html>
            `)

        fs.writeFile(file,html[i], 'utf8', err => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
        console.log(`${i} sur ${args.body.name.length-1}`)
        if (args.body.name.length-1 === i){
            console.log("ready")
            example(fileArray, args.body.name);
        }
    }




    async function example(file, filename) {
        console.log(filename)
        console.log(file)
        const client = new ftp.Client();
        client.ftp.verbose = false;
        try {
            await client.access({
                host: host,
                user: user,
                password: password_hash,
                secure: false
            });
            console.log('connected')

            for (let i = 0; i < file.length;i++){
                await client.uploadFrom(file[i], `${filename[i]}.html`)
            }
        }
        catch(err) {
            console.log(err);
        }
        client.close();
    }

})

ipcMain.on('closeChoiceMenu', (event, args) => {
    event.reply('closeChoiceMenu-response', args)
})