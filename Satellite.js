/**
 * Purpose: to assign each SVG to a single object
 */

//no module.exports! be sure that you summon js files in the correct order!

/**
 * Create a new PLanet object
 * @param {Number} radius radius of the planet in km
 * @param {Number} mass mass of the planet in kg
 * @param {String} color color of the planet (hexcode)
 * @param {Number} restitution the "bounciness" factor of the planet; must be a number between 0 and 1 or be -1 (special option)
 */
function Planet(radius, mass, color, restitution = 0){
    this.position = new Vector2D();
    this.velocity = new Vector2D();
    this.netForce = new Vector2D();

    this.isStatic = false;
    // this.hasGravity = true; 

    this.radius = radius;
    this.mass = mass;
    this.restitution = restitution;

    this.color = color;

    this.DOMElement = null;
    this.readyToDestroy = false;

    this.step = (step) => {
        this.position = this.position.add(step);
    }
    this.setVelocity = (vel) => {
        this.velocity = vel;
    }

    this.setElement = (DOMElement) => {
        this.DOMElement = DOMElement;
    }

    this.getPosition = () => {
        return this.position;
    }
    this.getVelocity = () => {
        return this.velocity;
    }
    this.getNetForce = () => {
        return this.netForce;
    }
    this.getMass = () => {
        return this.mass;
    }

    this.getRadius = () => {
        return this.radius;
    }

    this.getRestitution = () => {
        return this.restitution;
    }
    this.zeroForces = () => {
        this.netForce = new Vector2D();
    }

    /**
     * Checks if two planets are overlapping or touching
     * @param {Planet} aPlanet a planet to check
     */
    this.isColliding = (aPlanet) => {
        // return this.radius * this.radius +
        //         2 * this.radius * aPlanet.getRadius +
        //         aPlanet.getRadius() + aPlanet.getRadius()
        //         <= this.position.add(aPlanet.getPosition().negate()).squaredMagnitude();
        return this.radius + aPlanet.radius >= Math.sqrt(this.position.add(aPlanet.position.negate()).squaredMagnitude());
    }

    this.absorb = (aPlanet) => {

        this.velocity = this.velocity.scale(this.mass).add(aPlanet.getVelocity().scale(aPlanet.getMass())).scale(1/(this.mass+aPlanet.getMass()));
        this.mass = this.mass + aPlanet.getMass();
    }

    this.applyForce = (forceVec) => {
        // console.log(this);
        // console.log("receiving the following force: ");
        // console.log(forceVec);
        this.netForce = this.netForce.add(forceVec);
    }

    this.deconstruct = () => {
       this.readyToDestroy = true;
    }
    this.destroyDOM = () => {
        this.DOMElement.remove();
    }


    this.stepDOMEl = (someVec) => {
        this.DOMElement.setAttribute('cx',parseFloat(this.DOMElement.getAttribute('cx')) + someVec.x);
        this.DOMElement.setAttribute('cy',parseFloat(this.DOMElement.getAttribute('cy')) + someVec.y);
    }
}
