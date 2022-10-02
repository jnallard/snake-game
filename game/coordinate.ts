export default class Coordinate {
    constructor(public x: number, public y: number) { }

    getCoordinateKey = () => `${this.x}-${this.y}`;

    clone = () => new Coordinate(this.x, this.y);
}
