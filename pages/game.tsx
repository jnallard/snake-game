import { NextPage } from "next"
import Head from "next/head"
import Board from "../game/board"
import styles from '../styles/Game.module.css'

const Home: NextPage = () => {
    return (<>
        <Head>
            <title>Snake Game</title>
            <meta name="description" content="Generated by create next app" />
            <link rel="icon" href="./favicon.png" />
        </Head>
        <div className={styles.container}>
            <main className={styles.main}>
                <h1>Snake Game</h1>

                <Board></Board>
            </main>
        </div>
    </>
    )
}

export default Home