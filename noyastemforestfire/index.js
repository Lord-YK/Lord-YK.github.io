//ignore any useless variables I'm reusing code from another project and
//lazy to figure out what to delete
let surroundings = [];
const width = window.innerWidth;
const height = window.innerHeight;
const flowerfield = document.getElementById("field");
const widthpxperchar = 14.5;
const heightpxperchar = 26;
const fieldwidth = Math.floor(width/widthpxperchar);
const fieldheight = Math.floor(height/heightpxperchar);
const eyesonscreen=[];
const isthereaneyehere=0;
const mathdotrandomindex = -1
const randomarr = [];
const seed = [];
let returnstr = "";
let flowertickinterval = 0;
let flag=false;
const flowertypes = [];
const flowerchars = ['9','T','P','Y','$','@','*','x','v','p','t','O']

let fieldmap = Array.from({length: fieldwidth}, () =>
    Array.from({length: fieldheight}, () => '&nbsp')
);

lettertorgbmap = {
    "T" : [0, 255, 0],
    "B" : [255, 0, 0],
    "R" : [68, 68, 68],
    "&nbsp" : [34,34,34] //wtvr the background is
}

let nextfieldmap = Array.from({length: fieldwidth}, () =>
    Array.from({length: fieldheight}, () => '&nbsp')
);

function mathdotrandom(inclusivemin, exclusivemax) {
    return Math.floor(Math.random()*(exclusivemax-inclusivemin))+inclusivemin;
}

function mathdotprobabilitytrue(probabilitytruedecimal) {
    if (Math.random()<=probabilitytruedecimal) {
        return true;
    } else {
        return false;
    }
}

//T for [tree]
//B for [burning tree]
//R for [tree remains]
//&nbsp for [grass]
function generatefieldmap() {
     for (i=0; i<mathdotrandom(10, 60); i++) {
        fieldmap[mathdotrandom(0, fieldwidth)][mathdotrandom(0, fieldheight)] = "T"
     }
     
     flowertickinterval = setInterval(flowertick, 100);
}

async function flowertick() {
    returnstr = "";
    flag=true; //make false if [tree] or [burning tree] exists
    nextfieldmap = Array.from({length: fieldwidth}, () =>
    Array.from({length: fieldheight}, () => '&nbsp')
    );
    for (y=0; y<fieldheight;y++) {
        for (x=0;x<fieldwidth;x++) {
            if (fieldmap[x][y]==='&nbsp') {
                surroundings=checkgrid(x,y,2);
                let probabilityofreproduction = 0.0;
                surroundings.forEach(element => {
                    if (element === "T" || element === "R") {
                        probabilityofreproduction += 0.0015;
                    }
                    
                });
                if (mathdotprobabilitytrue(probabilityofreproduction)) {
                    nextfieldmap[x][y]="T";

                } else {
                    nextfieldmap[x][y]="&nbsp";
                }


            } else if (fieldmap[x][y]==="T"){
                flag=false;
                surroundings=checkgrid(x,y,2);
                let probabilityofburning = 0;
                surroundings.forEach(element => {
                    if (element === "T" || element === "B") {
                        probabilityofburning += 0.0005;
                    }
                    
                });
                if (mathdotprobabilitytrue(probabilityofburning)) {
                    nextfieldmap[x][y]="B";;

                } else {
                    nextfieldmap[x][y]="T";
                }
            } else if (fieldmap[x][y]==="B") {
                flag=false;
                if (mathdotprobabilitytrue(0.01)) {
                    nextfieldmap[x][y]="R";
                } else {
                    nextfieldmap[x][y]="B";
                }
            } else if (fieldmap[x][y]==="R") {
                if (mathdotprobabilitytrue(0.005)) {
                    nextfieldmap[x][y] = "&nbsp";
                } else {
                    nextfieldmap[x][y] = "R";
                }
            }
            returnstr += `<a style="color:rgb(${lettertorgbmap[nextfieldmap[x][y]][0]},${lettertorgbmap[nextfieldmap[x][y]][1]},${lettertorgbmap[nextfieldmap[x][y]][2]})">${nextfieldmap[x][y]}</a>`

            if (x===(fieldwidth-1)) {
                returnstr += "<br>";
            }
        }
    }
    fieldmap = nextfieldmap;
    flowerfield.innerHTML = returnstr;


    if (flag) {
        clearInterval(flowertickinterval);
        alert("Everything died")
    }
}

function checkgrid(x, y, gridn) {
    const returnarrr = [];
    for (myy=y-gridn;myy<=y+gridn;myy++) {
        for (myx=x-gridn; myx<=x+gridn; myx++) {
            if (myx>=0 && myy>=0 && myx<fieldwidth && myy<fieldheight) {
                returnarrr.push(fieldmap[myx][myy]);
            }
        }
    }
    return returnarrr
}

generatefieldmap();