
//private to this file

//to match realtime, run increment time 20 times per second
var timeConstant = .05; 
var bounds = 10000000
const GRAVITATIONAL_CONSTANT = 6.674*Math.pow(10,-11);
var planetList = [];

function speedMultiply(fac) {
    timeConstant = fac*.05;
}
function setBounds(bound) {
    bounds = bound;
}

function incrementTime() {
    var displacements = []; //we should expect this to be the same size as planetList
    for (let plan1 = 0 ;plan1 < planetList.length; plan1++) {
        let aPlanet = planetList[plan1]

        if (aPlanet.readyToDestroy || Math.abs(aPlanet.getPosition().x) > bounds || Math.abs(aPlanet.getPosition().y) > bounds) {
            destroyAtIndex(plan1);
            continue;
        }
        let dispVel = getDisplacementAndVelocity(aPlanet)
        aPlanet.step(dispVel.disp);
        aPlanet.setVelocity(dispVel.vel);
        aPlanet.zeroForces();
        displacements[plan1] = dispVel.disp;
    }
    for (let plan1 = 0; plan1 < planetList.length; plan1++) {
        let planetA = planetList[plan1];
        for (let plan2 = plan1+1; plan2 < planetList.length; plan2++) {
            let planetB = planetList[plan2];
            if (planetA.isColliding(planetB)) {
                let destroyedPlanet = false;
                //this requires further investigation
                
                let effCoef = Math.min(planetA.getRestitution(),planetB.getRestitution());
                if (effCoef == -1) {
                    // if (planetB.getRestitution() == -1 && planetA.getRestitution() == -1) {
                    //     //special case
                    //     return;
                    // }
                    if (planetB.getRestitution() == -1) {
                        planetB.absorb(planetA);
                        destroyAtIndex(plan1);
                        continue;
                    } else {
                        planetA.absorb(planetB);
                        destroyAtIndex(plan2);
                        continue;
                    }
                    
                } else {
                    let scalarCoef = planetA.getMass() * (effCoef/timeConstant);
                    let forceVec = planetA.getVelocity().add(planetB.getVelocity()).scale(scalarCoef);
                    planetA.applyForce(forceVec);
                    planetB.applyForce(forceVec.negate());
                }

            }
            //GRAVITY 
            let dispVec = planetB.getPosition().add(planetA.getPosition().negate());

            //unit vector points from planetA to planetB
            let uVec = dispVec.scale(1/Math.sqrt(dispVec.squaredMagnitude()));

            let forceMag = GRAVITATIONAL_CONSTANT * (planetA.getMass()*planetB.getMass())/dispVec.squaredMagnitude();

            //apply forces
            planetA.applyForce(uVec.scale(forceMag));
            let DOMEl = planetA.DOMElement;
            drawSegmentFromVector(DOMEl.cx.baseVal.value, DOMEl.cy.baseVal.value, uVec.scale(100), "debug-vec");
            planetB.applyForce(uVec.scale(forceMag * -1));

        }
    }
    // for (disp in displacements) {
    //     console.log(`moving by ${disp.x} in x`)
    // }
    return {
        planets: planetList,
        disps: displacements
    }
}

/**
 * Returns a theoretical displacement given a planet's physical state
 * @param {Planet} aPlanet the planet to perform on
 * @returns a vector displacement
 */
function getDisplacementAndVelocity(aPlanet) {
    let v_0 = aPlanet.getVelocity();
    let a = aPlanet.getNetForce()
            .scale(1/aPlanet.getMass());
    
    return {
        disp: v_0.scale(timeConstant).add(a.scale(.5*timeConstant*timeConstant)),
        vel: v_0.add(a.scale(timeConstant))
    };
    // (a)*(timeConstant) *(timeConstant);

}

function insertPlanet(somePlanet) {
    planetList.push(somePlanet);
}

function destroyAtIndex(ind) {
    let planet = planetList.splice(ind,1)[0];
    planet.destroyDOM();
    //no mroe references; should be picked up by garbage

}