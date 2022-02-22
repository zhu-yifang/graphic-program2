//
// geometry.js
//
// Author: Jim Fix
// MATH 385, Reed College, Spring 2022
//
// This defines three names: 
//
//    point: a class of locations in 3-space
//    vector: a class of offsets between points within 3-space
//    ORIGIN: a point at the origin 
//
// The two classes/datatypes are designed based on Chapter 3 of
// "Coordinate-Free Geometric Programming" (UW-CSE TR-89-09-16)
// by Tony DeRose.
//

const EPSILON = 0.00000001;

//
// Description of 3-D point objects and their methods.
//
class point {

    constructor(_x,_y,_z) {
        /*
         * Construct a new point instance from its coordinates.
         */
        this.x = _x;
        this.y = _y;
        this.z = _z;
    }

    components() {
        /*
         * Object this as a Python list.
         */
        return [this.x, this.y, this.z];
    }

    glVertex3fv() {
        /*
         * Issues a glVertex3f call with the coordinates of this.
         */
        glVertex3f(this.x,this.y,this.z);
    }

    plus(offset) {
        /*
         * Computes a point-vector sum, yielding a new point.
         */
        return new point(this.x+offset.dx,
			 this.y+offset.dy,
			 this.z+offset.dz);
    }
    
    minus(other) {
        /*
         * Computes point-point subtraction, yielding a vector.
	 *   or else
         * Computes point-vector subtraction, yielding a point. 
	 */
	if (other instanceof point) {
            return new vector(this.x-other.x,
			      this.y-other.y,
			      this.z-other.z);
	} else if (other instanceof vector) {
            return new point(this.x-other.dx,
			     this.y-other.dy,
			     this.z-other.dz);
	} else {
	    return this;
	}
    }

    dist2(other) {
        /*
         * Computes the squared distance between this and other.
         */
        return this.minus(other).norm2();
    }

    dist(other) {
        /*
         * Computes the distance between this and other.
         */
	return this.minus(other).norm();
    }

    combo(scalar,other) {
	/*
         * Computes the affine combination of this with other.
         */
        return this.plus(other.minus(self).times(scalar));
    }

    combos(scalars,others) {
        /*
         * Computes the affine combination of this with other.
         */
        let P = this;
	const n = Math.min(len(scalars),len(others));
        for (let i = 0; i < n; i++) {
            P = P.plus(others[i].minus(this).times(scalars[i]));
	}
        return P;
    }

    max(other) {
        return new point(Math.max(this.x,other.x),
			 Math.max(this.y,other.y),
			 Math.max(this.z,other.z));
    }

    min(other) {
        return new point(Math.min(this.x,other.x),
			 Math.min(this.y,other.y),
			 Math.min(this.z,other.z));
    }
}

point.prototype.with_components = function(cs) {
    /*
     * Construct a point from a Python list. 
     */ 
    return new point(cs[0], cs[1], cs[2]);
}    


point.prototype.origin = function() {
    return new point(0.0, 0.0, 0.0);
}

    
//
// Description of 3-D vector objects and their methods.
//
class vector {

    constructor(_dx,_dy,_dz) {
        /*
	 * Construct a new vector instance.
	 */
        this.dx = _dx;
        this.dy = _dy;
        this.dz = _dz;
    }

    glNormal3fv() {
        /*
         * Issues a glVertex3f call with the coordinates of this.
         */
        glNormal3f(this.dx,this.dy,this.dz);
    }
    
    components() {
        /*
	 * This vector's components as a list.
	 */
        return [this.dx,this.dy,this.dz];
    }

    plus(other) {
        /*
	 * Sum of this and other.
	 */
        return new vector(this.dx + other.dx,
			  this.dy + other.dy,
			  this.dz + other.dz);
    }

    minus(other) {
        /*
	 * Vector that results from subtracting other from this.
	 */
        return this.plus(other.neg());
    }

    times(scalar) {
        /*
	 * Same vector as this, but scaled by the given value.
	 */
        return new vector(scalar * this.dx,
			  scalar * this.dy,
			  scalar * this.dz);
    }

    neg() {
        /*
	 * Additive inverse of this.
	 */
        return this.times(-1.0);
    }

    dot(other) {
        /*
	 * Dot product of this with other.
	 */
        return this.dx*other.dx + this.dy*other.dy + this.dz*other.dz;
    }

    cross(other) {
        /*
	 * Cross product of this with other.
	 */
        return new vector(this.dy*other.dz-this.dz*other.dy,
			  this.dz*other.dx-this.dx*other.dz,
			  this.dx*other.dy-this.dy*other.dx);
    }

    norm2() {
        /*
	 * Length of this, squared.
	 */
        return this.dot(this);
    }

    norm() {
        /*
	 * Length of this.
	 */
        return Math.sqrt(this.norm2());
    }

    unit() {
        /*
	 * Unit vector in the same direction as this.
	 */
        const n = this.norm();
        if (n < EPSILON) {
            return new vector(1.0, 0.0, 0.0);
        } else {
            return this.times(1.0/n);
	}
    }

    div(scalar) {
        /*
	 * Defines v / a
	 */
        return this.times(1.0/scalar);
    }
}

vector.prototype.with_components = function(cs) {
    /* 
     * Construct a vector from a list. 
     */
    return new vector(cs[0],cs[1],cs[2]);
}

vector.prototype.random_unit = function() {
    /* 
     * Construct a random unit vector 
     */
    //
    // This method is adapted from 
    //    http://mathworld.wolfram.com/SpherePointPicking.html
    //
    const phi = Math.random() * Math.PI * 2.0;
    const theta = Math.acos(2.0 * Math.random() - 1.0);
    return new vector(Math.sin(theta) * Math.cos(phi),
		      Math.sin(theta) * Math.sin(phi),
		      Math.cos(theta));
}
    
// 
// The point at the origin.
//
const ORIGIN = new point(0.0,0.0,0.0);

