const seedinput = document.getElementById("seed");
const inputdiv = document.getElementById("inputdiv");
const width = window.innerWidth;
const height = window.innerHeight;
const flowerfield = document.getElementById("flowerfield");
const widthpxperchar = 14.5;
const heightpxperchar = 26;
const flowermapwidth = Math.floor(width/widthpxperchar);
const flowermapheight = Math.floor(height/heightpxperchar);

let assets;
let eyesonscreen=[];
let isthereaneyehere=0;
let mathdotrandomindex = -1
let randomarr = [];
let seed = [];
let returnstr = "";
let flowertickinterval = 0;
let flag=false;
let flowertypes = [];
let flowerchars = ['9','T','P','Y','$','@','*','x','v','p','t','O']
let flowermap = Array.from({length: flowermapwidth}, () =>
    Array.from({length: flowermapheight}, () => [0,0,0,'&nbsp'])
);

let nextflowermap = Array.from({length: flowermapwidth}, () =>
    Array.from({length: flowermapheight}, () => [0,0,0,'&nbsp'])
);

fetch('./assets.json')
  .then(response => {
    return response.json();
  })
  .then(data => {
    assets = data;
  })


seedinput.addEventListener("keydown", async function(event) {
    if (event.key==="Enter") {
        event.preventDefault();
        seed = seedinput.value.toUpperCase();
        await reroll();
        let eh = mathdotrandom(0,2)
        if (eh ===0) {
            generateflowermap();
            flowerfield.style.backgroundColor = "#222222"
        } else if (eh===1) {
            flowerfield.innerHTML = "";
            starteyes();
            flowerfield.style.backgroundColor = "#000000"

        }
    }
})

async function reroll() {
    const msgBuffer = new TextEncoder().encode(seed);                    
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const intermediate = new Uint8Array(hashBuffer)
    const hashArray = Array.from(intermediate);
    seed = intermediate;
    randomarr =  hashArray;
}
function mathdotrandom(inclusivemin, exclusivemax) {
    mathdotrandomindex++;
    if (mathdotrandomindex === randomarr.length-5) {
        reroll(); 
        mathdotrandomindex=0;
    }
    return Math.floor(randomarr[mathdotrandomindex%(randomarr.length)]/256*(exclusivemax-inclusivemin))+inclusivemin;
}

function starteyes() {
    for (y=0;y<(flowermapheight);y++) {
        if (isthereaneyehere===0) {
            let spinspinspin = mathdotrandom(0,3);
            if (spinspinspin < 2) {
                eyesonscreen.push([assets.objectss[spinspinspin].width,assets.objectss[spinspinspin].height,assets.objectss[spinspinspin].frames,mathdotrandom(0,assets.objectss[spinspinspin].frames.length),mathdotrandom(0,flowermapwidth-assets.objectss[spinspinspin].width),y]);
                //0 width 1 height 2 frames 3 currentframe 4 x 5 y
                isthereaneyehere =assets.objectss[spinspinspin].height;
            }
        }
        isthereaneyehere--;
    
    }
    setInterval(tickeyes, 200);
}

function tickeyes() {
    returnstr="";
    returnarr=[];
    for (y=0;y<flowermapheight;y++) {
        returnarr.push(" ".repeat(flowermapwidth));
    }
    eyesonscreen.forEach((element)=> {
        for (i=0;i<element[1];i++) {
            returnarr[element[5]+i]=" ".repeat(element[4]+1)+element[2][element[3]] + " ".repeat(flowermapwidth-element[4]-element[0]-1);
        }
    })
    returnarr.forEach((val)=>{
        returnstr += val;
    })
    flowerfield.innerHTML=returnstr;
    //change ' ' to &nbsp
}














function generateflowermap() {
     numflowers=mathdotrandom(3,30);
     for (i=0; i<numflowers; i++) {
        flowertypes.push([mathdotrandom(0,256),mathdotrandom(0,256),mathdotrandom(0,256),flowerchars[mathdotrandom(0,flowerchars.length)]]);
     }
     //seed flowers
     flowertypes.forEach((element) =>  {
        flowermap[mathdotrandom(0,flowermapwidth)][mathdotrandom(0,flowermapheight)] = element
     })
     flowertickinterval = setInterval(flowertick, 100);
}

async function flowertick() {
    returnstr = "";
    flag=false;
    nextflowermap = Array.from({length: flowermapwidth}, () =>
    Array.from({length: flowermapheight}, () => [0,0,0,'&nbsp'])
);
    for (y=0; y<flowermapheight;y++) {
        for (x=0;x<flowermapwidth;x++) {
            if (flowermap[x][y][3]==='&nbsp') {
                flag=true;
                surroundings= [];
                if (x!==0) {surroundings.push(flowermap[x-1][y])};
                if (x!==flowermapwidth-1) {surroundings.push(flowermap[x+1][y])};
                if (y!==0) {surroundings.push(flowermap[x][y-1])};
                if (y!==flowermapheight-1) {surroundings.push(flowermap[x][y+1])};
                nextflowermap[x][y] = surroundings[mathdotrandom(0,surroundings.length)];
                returnstr += `<a style="color:rgb(${nextflowermap[x][y][0]},${nextflowermap[x][y][1]},${nextflowermap[x][y][2]})">${nextflowermap[x][y][3]}</a>`

            } else {
                cell=flowermap[x][y]
                nextflowermap[x][y] = cell;
                returnstr += `<a style="color:rgb(${cell[0]},${cell[1]},${cell[2]})">${cell[3]}</a>`
            }
            if (x===(flowermapwidth-1)) {
                returnstr += "<br>";
            }
        }
    }
    flowermap = nextflowermap;
    flowerfield.innerHTML = returnstr;


    if (flag===false) {
        clearInterval(flowertickinterval);
        alert("You received a gift: [Flower Field]!")
    }
}

