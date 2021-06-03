import React from "react";

const choiceBackground = (data,bgchoicedefault,bgchoiceid, bgcolorid,bgcolordefault, bgid, bgdefault, pos="null") => {
    if ((data[bgchoiceid] === undefined && bgchoicedefault === "color") || (data[bgchoiceid] !== undefined && data[bgchoiceid].img.backgroundChoice !== undefined && data[bgchoiceid].img.backgroundChoice === "color")){
        if (data[bgcolorid] !== undefined) {
            if (data[bgcolorid].img.backgroundColor !== undefined) {
                return (`${data[bgcolorid].img.backgroundColor}`)
            } else {
                return (`${bgcolordefault}`)
            }
        } else {
            return (`${bgcolordefault}`)
        }

    } else if ((data[bgchoiceid] === undefined && bgchoicedefault === "url") || (data[bgchoiceid] !== undefined && data[bgchoiceid].img.backgroundChoice !== undefined && data[bgchoiceid].img.backgroundChoice === "url")) {
        return `url(${
            data[bgid] !== undefined ?
                data[bgid].img.backgroundUrl !== undefined ?
                    data[bgid].img.backgroundUrl :
                    bgdefault :
                bgdefault}) top / cover fixed`
    }
}

export default choiceBackground;


const placeblock = (Block, uid,itemName,defaultContent, data,menuclose,number=3, max=6) => {
    let element = []
    if (number < max){
        for(let i = 0;i < number;i++){
            element.push(React.createElement(Block,{
                    key:`${uid}-${i}`,
                    id: `${itemName}-${uid}-${i}`,
                    data:data,
                    defaultData:defaultContent,
                    menuclose:menuclose,
                    offset:i
                }

                )
            )
        }
        return element
    }

}

export {placeblock};

const getIndex = (array, index, id) => {
    for(let z=array.length-1;z>=0;z--){
        if(z !== -1 && array[z][index] === id){
            return z;
        }
    }
}

export {getIndex};

const getElement = (Array,defaultData,data) => {
    let type = {
        background:"https://via.placeholder.com/1920x1080",
        image:"https://via.placeholder.com/500",
        title:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nec.",
        text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam fermentum, mauris congue porta sodales, orci metus sagittis felis, et congue dolor sem ac massa. Nulla fringilla laoreet nulla at malesuada. Mauris bibendum tellus sed mi.",
    }
    let element = [];
    for (let i = 0;i < Array.length;i++){
        let defaultDataFind = defaultData.find(e => e.id === Array[i].id)
        defaultDataFind = defaultDataFind === undefined ? type[Array[i].type] : defaultDataFind.content
        let index = getIndex(data,'id', Array[i].id);
        element.push({id:Array[i].id,index:index,defaultData:defaultDataFind})
    }
    console.log(element)
    return element
}

export {getElement};
