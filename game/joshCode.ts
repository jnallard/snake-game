import CellItem from "./cellItem";
import Collision from "./collistion";
import Coordinate from "./coordinate";
import Direction from "./direction";
import { BoardHelper, Snake } from "./studentCode";

export class JoshBoardHelper extends BoardHelper {
    getRefreshRateMs(): number {
        return 250;
    }

    getGridSize(): number {
        return 10;
    }

    getDirection(keyBoardEvent: KeyboardEvent): Direction | null {
        switch (keyBoardEvent.code) {
            case "ArrowUp":
            case "KeyW":
                return Direction.UP;
            case "ArrowRight":
            case "KeyD":
                return Direction.RIGHT;
            case "ArrowDown":
            case "KeyS":
                return Direction.DOWN;
            case "ArrowLeft":
            case "KeyA":
                return Direction.LEFT;
        }
        return null;
    }

    createApple(freeCells: Coordinate[]): CellItem {
        const randomCell = Math.floor(Math.random() * freeCells.length)
        return new CellItem(freeCells[randomCell].clone(), './game-assets/apple.png');
    }
}

export class JoshSnake extends Snake {
    constructor() {
        super();
        this.snakeBody.push(new CellItem(new Coordinate(4, 5), 'green'));
        this.snakeBody.push(new CellItem(new Coordinate(3, 5), 'green'));
    }

    lastTailSpot: Coordinate = this.snakeHead.coordinate.clone();

    update(direction: Direction): void {
        const snakeHeadCoor = this.snakeHead.coordinate;
        const previousHeadCoor = snakeHeadCoor.clone();
        switch (direction) {
            case Direction.UP:
                snakeHeadCoor.y++;
                break;
            case Direction.RIGHT:
                snakeHeadCoor.x++;
                break;
            case Direction.DOWN:
                snakeHeadCoor.y--;
                break;
            case Direction.LEFT:
                snakeHeadCoor.x--;
                break;
        }
        if (this.snakeBody.length > 0) {
            const currentEnd = this.snakeBody.pop() as CellItem;
            this.lastTailSpot = currentEnd.coordinate.clone();
            currentEnd.coordinate = previousHeadCoor.clone();
            this.snakeBody = [currentEnd].concat(this.snakeBody);
        } else {
            this.lastTailSpot = previousHeadCoor.clone();
        }
    }

    detectCollision(gridSize: number, appleLocation: Coordinate): Collision | null {
        const headX = this.snakeHead.coordinate.x;
        const headY = this.snakeHead.coordinate.y;
        if (headX < 0 || headX >= gridSize || headY < 0 || headY >= gridSize) {
            return Collision.WALL;
        }
        if (this.getSnakeBodyParts().map(part => part.coordinate).some(coor => coor.x == headX && coor.y == headY)) {
            return Collision.SNAKE;
        }
        if (headX == appleLocation.x && headY == appleLocation.y) {
            return Collision.APPLE;
        }
        return null;
    }

    consumeApple(): void {
        this.snakeBody.push(new CellItem(this.lastTailSpot.clone(), 'green'));
    }

    updateSnakePartBackground(snakePart: CellItem, indexInSnake: number, lastDirection: Direction): string {
        const snakeParts = this.getAllSnakeParts();
        const previousPart = snakeParts[indexInSnake - 1];
        const followingPart = snakeParts[indexInSnake + 1];

        // head
        if (indexInSnake === 0) {
            switch (lastDirection) {
                case Direction.UP:
                    return './game-assets/head_up.png';
                case Direction.RIGHT:
                    return './game-assets/head_right.png';
                case Direction.DOWN:
                    return './game-assets/head_down.png';
                case Direction.LEFT:
                    return './game-assets/head_left.png';
            }
        }

        // tail
        if (indexInSnake === snakeParts.length - 1) {
            const tailDirection = this.getDirectionComparison(snakePart, previousPart);
            switch (tailDirection) {
                case Direction.UP:
                    return './game-assets/tail_up.png';
                case Direction.RIGHT:
                    return './game-assets/tail_right.png';
                case Direction.DOWN:
                    return './game-assets/tail_down.png';
                case Direction.LEFT:
                    return './game-assets/tail_left.png';
            }
        }

        // middle
        const previousDirection = this.getDirectionComparison(previousPart, snakePart);
        const followingDirection = this.getDirectionComparison(followingPart, snakePart);
        const combinedDirection = previousDirection + '-' + followingDirection;
        switch (combinedDirection) {
            case 'left-right':
            case 'right-left':
                return './game-assets/body_horizontal.png';
            case 'down-up':
            case 'up-down':
                return './game-assets/body_vertical.png';
            case 'left-up':
            case 'up-left':
                return './game-assets/body_topleft.png';
            case 'up-right':
            case 'right-up':
                return './game-assets/body_topright.png';
            case 'down-left':
            case 'left-down':
                return './game-assets/body_bottomleft.png';
            case 'down-right':
            case 'right-down':
                return './game-assets/body_bottomright.png';
        }
        return 'blue';
    }

    private getDirectionComparison(a: CellItem, b: CellItem): Direction | null {
        if (a.coordinate.x > b.coordinate.x) {
            return Direction.RIGHT;
        }
        if (a.coordinate.x < b.coordinate.x) {
            return Direction.LEFT;
        }
        if (a.coordinate.y > b.coordinate.y) {
            return Direction.UP;
        }
        if (a.coordinate.y < b.coordinate.y) {
            return Direction.DOWN;
        }
        return null;
    }

}