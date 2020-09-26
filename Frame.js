
/**
 * This file interfaces directly with the user inputs
 */

 var svgNS = "http://www.w3.org/2000/svg";
 /**
  * 
  * @param {Event} evt An event object; used to find where the user clicked
  */

function createNewPlanet(evt) {
    //there is a faster way 
    let values = document.getElementsByTagName('input');
    //we expect seven tags

    let vecEl = document.getElementById('v0Vector');
    let vecScale = parseFloat(values[0].value) || 1000;
    let v0 = new Vector2D((document.getElementById('v0Vector').x2.baseVal.value || 200)-200, (document.getElementById('v0Vector').y2.baseVal.value||200)-200);
    v0 = v0.scale(vecScale/200);
    let col = values[1].value || "#FFFFFF";
    let mass = parseFloat(values[2].value) || 7.3;
    let massScale = parseFloat(values[3].value) || 22;
    let rad = parseFloat(values[4].value) || 1780;
    let e = parseFloat(values[5].value) || -1;

    let nPlanet = new Planet(rad,mass * Math.pow(10,massScale),col,e);

    let field = document.getElementById('field');
    let box = field.getBoundingClientRect();

    let center = (box.right+box.left)/2
    let xCord = evt.clientX-center;
    let yCord = evt.clientY-center;

    let scale = (values[6].value || 10000)/(box.right-box.left);
    let trueX = xCord*scale;
    let trueY = yCord*scale;

    let newSVG = document.createElementNS(svgNS,"circle");
    // newSVG.cx = evt.clientX;
    // newSVG.cy = evt.clientY;
    newSVG.setAttribute("cx",evt.clientX);
    newSVG.setAttribute("cy",evt.clientY);
    newSVG.setAttribute("fill",col);
    newSVG.setAttribute("r",rad/scale);
    field.children[0].appendChild(newSVG);

    

    nPlanet.setElement(newSVG);
    nPlanet.step(new Vector2D(trueX, trueY));
    nPlanet.setVelocity(v0);
    insertPlanet(nPlanet);



}


function physicsTick() {
    var marks = incrementTime();
    let values = document.getElementsByTagName('input');
    let field = document.getElementById('field');
    let box = field.getBoundingClientRect();
    let screenScale = (values[6].value || 10000)/(box.right-box.left);
    //let timeScale = values[7].value || 1;
    //marks contains an array of Planets and Displacements
    let plans = marks.planets;
    let disps = marks.disps;

    var svgEl = field.getElementsByTagName('svg')[0];

    for (let n = 0 ;n < plans.length; n++) {
        try {
            
            let newEl = document.createElementNS(svgNS, 'line');
            let DOMPlanet = plans[n].DOMElement;
            newEl.setAttribute("x1",DOMPlanet.cx.baseVal.value);
            newEl.setAttribute("y1",DOMPlanet.cy.baseVal.value);
            plans[n].stepDOMEl(disps[n].scale(1/screenScale));
            newEl.setAttribute("x2",DOMPlanet.cx.baseVal.value);
            newEl.setAttribute("y2",DOMPlanet.cy.baseVal.value);

            newEl.classList.add("trail");
            svgEl.appendChild(newEl);
        } catch (e) {
            //probably undefined err
            console.log(e);
        }
        
    }
    setTimeout(physicsTick,50);
}

function resquare(DOMel, suffix="") {
    if (window.innerHeight <= window.innerWidth) {
        //square around the height
        DOMel.setAttribute("style",`height:${window.innerHeight}${suffix}; 
            width:${window.innerHeight}${suffix}`);
    } else {
        DOMel.setAttribute("style",`height:${window.innerWidth}${suffix}; 
        width:${window.innerWidth}${suffix}`);
    }

    //fix the sidebar, but whatever
}


function init() {
    resquare(document.getElementById('field'),"px");
    resquare(document.getElementsByTagName('svg')[0], "px");
    physicsTick();
}




var lastResize = 10000;
function resizeBoard(DOMEl) {
    let newDim = parseFloat(DOMEl.value);
    setBounds(100* newDim); //this is from Physics.js
    let ratio = newDim/lastResize;

    let space = document.getElementById('field').getElementsByTagName('svg')[0];
    let box = space.getBoundingClientRect();

    let pxCenterX = (box.right+box.left)/2;
    let pxCenterY = (box.bottom+box.top)/2


    let circles = space.getElementsByTagName('circle');
    for (let n = 0; n < circles.length; n++) {
        let aCirc = circles[n];
        aCirc.setAttribute("r",parseFloat(aCirc.getAttribute("r"))/ratio);
        aCirc.setAttribute("cy",pxCenterY+parseFloat((aCirc.getAttribute("cy")-pxCenterY))/ratio);
        aCirc.setAttribute("cx",pxCenterX+parseFloat((aCirc.getAttribute("cx")-pxCenterX))/ratio);
    }

    lastResize = newDim;
}

/**
 * Used only by the vector drawing svg
 * @param {HTMLElement} DOMEl 
 * @param {Event} evt 
 */
function drawVector(DOMEl, evt) {
    let lastVec = document.getElementById('v0Vector');
    if (lastVec != null) {
        lastVec.remove();
    }
    let box = DOMEl.getBoundingClientRect();
    let vecY = evt.clientY-box.top;
    let vecX = evt.clientX-box.left;

    let newSVG = document.createElementNS(svgNS,"line");
    newSVG.setAttribute("x1","200");
    newSVG.setAttribute("y1","200");
    newSVG.setAttribute("x2",vecX + "");
    newSVG.setAttribute("y2", vecY + "");
    newSVG.id = "v0Vector";

    DOMEl.appendChild(newSVG);
}

function clearLines() {
    var lines = document.getElementById('field').getElementsByTagName('svg')[0].getElementsByTagName('line');
    for (let n = 0 ; n != lines.length; ) {
        lines[n].remove();

    }
}

/**
 * For debugging purposes
 * @param {*} x1 
 * @param {*} y1 
 * @param {*} x2 
 * @param {*} y2 
 */
function drawSegmentFromPoints(x1,y1,x2,y2, classname) {
    let newSVG = document.createElementNS(svgNS,"line");
    newSVG.setAttribute("x1",x1);
    newSVG.setAttribute("y1",y1);
    newSVG.setAttribute("x2",x2);
    newSVG.setAttribute("y2",y2);
    newSVG.classList.add(classname);

    document.getElementById('field').getElementsByTagName('svg')[0].appendChild(newSVG);
}

function drawSegmentFromVector(x,y,vec,classname) {
    drawSegmentFromPoints(x,y,x+vec.x,y+vec.y,classname);
}