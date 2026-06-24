const seedinput = document.getElementById("seed");
const inputdiv = document.getElementById("inputdiv");
const width = window.innerWidth;
const height = window.innerHeight;

randomseed = new Array(32).fill(0);
mathdotrandomindex = -1

seedinput.addEventListener("keydown", function(event) {
    if (event.key==="Enter") {
        event.preventDefault;
        seed = seedinput.value;
        sha256(seed).then(function(shaseed)  {
        randomseed = shaseed;
        console.log(randomseed);
        inputdiv.innerHTML = "";
        generateflowermap();
    });
    }
   
})
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);                    
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray;
}       
function mathdotrandom(inclusivemin, exclusivemax) {
    mathdotrandomindex++;
    return Math.floor(randomseed[mathdotrandomindex%(randomseed.length)]/256*(exclusivemax-inclusivemin))+inclusivemin;
}
function generateflowermap() {
    
}