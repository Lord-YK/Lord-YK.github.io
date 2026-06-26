const seedinput = document.getElementById("seed");
const inputdiv = document.getElementById("inputdiv");
const width = window.innerWidth;
const height = window.innerHeight;
const flowerfield = document.getElementById("flowerfield");
const widthpxperchar = 14.5;
const heightpxperchar = 26;
const flowermapwidth = Math.floor(width/widthpxperchar);
const flowermapheight = Math.floor(height/heightpxperchar);

randomarr = [];
seed = [];
returnstr = "";
flowertickinterval = 0;
flag=false;
flowertypes = [];
flowerchars = ['9','T','P','Y','$','@','*','x','v','p','t','O']
flowermap = Array.from({length: flowermapwidth}, () =>
    Array.from({length: flowermapheight}, () => [0,0,0,'&nbsp'])
);

nextflowermap = Array.from({length: flowermapwidth}, () =>
    Array.from({length: flowermapheight}, () => [0,0,0,'&nbsp'])
);
mathdotrandomindex = -1

seedinput.addEventListener("keydown", async function(event) {
    if (event.key==="Enter") {
        event.preventDefault();
        seed = seedinput.value.toUpperCase();
        await reroll();
        generateflowermap();
        flowerfield.style.backgroundColor = "#222222"
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
                console.log(`broken at ${x},${y}`);
            }
        }
    }
    flowermap = nextflowermap;
    flowerfield.innerHTML = returnstr;


    if (flag===false) {
        clearInterval(flowertickinterval);
    }
}

