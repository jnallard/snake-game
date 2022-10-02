import { FunctionComponent, useState } from "react";
import CellItem from "./cellItem";
import styles from '../styles/Board.module.css';
import Coordinate from "./coordinate";

export class Cell {
    constructor(public coodinate: Coordinate, private item?: CellItem) {}

    hasItem() {
        return !!this.item;
    }

    clearItem() {
        this.item = undefined;
        this.onChange();
    }

    setItem(item: CellItem) {
        this.item = item;
        this.onChange();
    }

    getItemBackgroundColor() {
        return this.item?.backgroundColor ?? '';
    }

    onChange = () => {};
}

export type CellProps = {
    cell: Cell;
}

export const CellComponent: FunctionComponent<CellProps> = (props) =>  {
    const [bgColor, setBgColor] = useState(props.cell.getItemBackgroundColor());

    props.cell.onChange = () => {
        setBgColor(props.cell.getItemBackgroundColor());
    }

    const onClick = () => {
        console.log(props.cell);
    };

    return <div className={styles.square} onClick={onClick} style={{backgroundColor: bgColor}}></div>
}