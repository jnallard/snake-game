import CellItem from "./cellItem";
import Collision from "./collistion";
import Coordinate from "./coordinate";
import Direction from "./direction";
import { IBoardHelper, ISnake } from "./iStudentCode";

export class BoardHelper implements IBoardHelper {
    getGridSize(): number {
        return 10;
    }

    getBoardSpeedMs(): number {
        return 500;
    }

    createApple(freeCells: Coordinate[]): CellItem {
        return new CellItem(new Coordinate(0, 0), 'red');
    }

    getDirection(keyBoardEvent: KeyboardEvent): Direction | null {
        return null;
    }
}

export class JoshBoardHelper extends BoardHelper {

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
        return new CellItem(freeCells[randomCell].clone(), 'red');
    }
}

export class Snake implements ISnake {
    protected snakeHead = new CellItem(new Coordinate(5, 5), 'blue');
    protected snakeBody: CellItem[] = [new CellItem(new Coordinate(4, 5), 'green'), new CellItem(new Coordinate(3, 5), 'green')];

    getSnakeHead(): CellItem {
        return this.snakeHead;
    }

    getSnakeBodyParts(): CellItem[] {
        return this.snakeBody;
    }

    getAllSnakeParts(): CellItem[] {
        return [this.snakeHead].concat(this.getSnakeBodyParts());
    }

    update(direction: Direction): void {

    }

    detectCollision(gridSize: number, appleLocation: Coordinate): Collision | null {
        return null;
    }

    consumeApple(): void {
        
    }

}

export class JoshSnake extends Snake {
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

}
