


function Vector2D(x =0, y =0) {
    this.x=x;
    this.y=y;

    /**
     * As always, operations are immutable
     */
    this.add = (vec) => {
        return new Vector2D(this.x + vec.x, this.y + vec.y);
    }

    this.dot = (vec) => {
        return this.x * vec.x + this.y + vec.y;
    }

    this.negate = () => {
        return new Vector2D(this.x * -1, this.y * -1);
    }

    this.scale = (factor) => {
        return new Vector2D(this.x * factor, this.y * factor);
    }

    this.squaredMagnitude = () => {
        return this.x * this.x + this.y * this.y;
    }
}


