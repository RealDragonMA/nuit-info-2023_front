<script lang="ts">
    import {onMount} from "svelte";
    import type IPiece from "./Interface/IPiece";
    import {pieces} from "./Interface/IPiece";
    let stringColors = "obgrypu"
    let colors = {"0": "bg-white","o": "bg-orange-500", "b": "bg-blue-500", "g": "bg-green-500", "r": "bg-red-500", "y": "bg-yellow-500", "p": "bg-pink-500", "u": "bg-purple-500"}
    let table = []
    let piece: IPiece = {piece: [], color: "", x: 0, y: 0}
    let score = 0
    let perdu = false

    for (let i = 0; i < 25; i++) {
        table.push([])
        for (let j = 0; j < 12; j++) {
            table[i][j] = '0'
        }
    }
    function generatePiece(){
        console.log("generate")
        piece.piece = pieces[Math.floor(Math.random() * pieces.length)]
        piece.color =  stringColors[Math.floor(Math.random() * stringColors.length)]
        piece.x = 0
        piece.y = 5
    }
    function insertPieceInTab(piece: IPiece){
        for (let i = 0; i < piece.piece.length; i++) {
            for (let j = 0; j < piece.piece[i].length; j++) {
                if (piece.piece[i][j] !== 0) {
                    table[piece.x + i][piece.y + j] = piece.color
                }
            }
        }
    }

    function removePiece(){
        for (let i = 0; i < piece.piece.length; i++) {
            for (let j = 0; j < piece.piece[i].length; j++) {
                if (piece.piece[i][j] !== 0) {
                    table[piece.x + i][piece.y + j] = '0'
                }
            }
        }
    }

    function rotatePiece(){
        let tempPiece = piece
        tempPiece.piece = piece.piece[0].map((_, colIndex) => piece.piece.map(row => row[colIndex]).reverse())
        piece = tempPiece
    }


    onMount(() => {
        generatePiece()
        insertPieceInTab(piece)
    })

    function movePieceDown(){
        removePiece()
        piece.x++
        insertPieceInTab(piece)
    }

    function canGoLeft(): boolean{
        let canGo = true
        console.log(piece.y)
        for (let i = 0; i < 3; i++) {
            if (piece.piece[i][0] == 1 && (piece.y-1) < 0){
                console.log("here1")
                canGo = false
            }
            else if (piece.piece[i][1] == 1 && (piece.y) < 0){
                console.log("here2")
                canGo = false
            }
            else if (piece.piece[i][2] == 1 && (piece.y +1) < 0){
                console.log("here3")
                canGo = false
            }
        }
        console.log(canGo)
        return canGo
    }

    function canGoRight(): boolean{
        let canGo = true
        for (let i = 0; i < 3; i++) {
            if (piece.piece[i][2] == 1 && piece.y + 4 > 12){
                console.log("here1")
                canGo = false
            }
            else if (piece.piece[i][1] == 1 && piece.y + 3 > 12){
                console.log("here2")
                canGo = false
            }
            else if (piece.piece[i][0] == 1 && piece.y + 2 > 12) {
                console.log("here2")
                canGo = false
            }
        }
        console.log(canGo)
        return canGo
    }

    function canGoDown(): boolean{
        let canGo = true
        for (let i = 0; i < 3; i++) {
            if (piece.piece[2][i] == 1 && piece.x + 4 > 25){
                console.log("here1")
                canGo = false
            }
            else if (piece.piece[1][i] == 1 && piece.x + 3 > 25){
                console.log("here2")
                canGo = false
            }
            else if (piece.piece[0][i] == 1 && piece.x + 2 > 25) {
                console.log("here3")
                canGo = false
            }else{
                try {
                    if (piece.piece[2][i] == 1 && stringColors.includes(table[piece.x + 3][piece.y + i])) {
                        console.log("here1")
                        canGo = false
                    }
                    if (table[piece.x + 1][piece.y + i] == 1 && stringColors.includes(table[piece.x + 4][piece.y + i])) {
                        console.log("here5")
                        canGo = false
                    }
                    if (table[piece.x][piece.y + i] == 1 && stringColors.includes(table[piece.x + 3][piece.y + i])) {
                        console.log("here3")
                        canGo = false
                    }
                }catch (e) {
                    console.log(e)
                    canGo = false
                }
            }
        }
        return canGo
    }

    function newTurn(){
        for (let i = 0; i < table[0].length; i++) {
            if (table[0][i] !== '0'){
                perdu = true
            }
        }
        // détecter si une ligne est complète
        detectLines()
        generatePiece()
        insertPieceInTab(piece)
    }

    function handleArrow(event) {
        if (event.key === "ArrowLeft") {
            if (canGoLeft()){
                removePiece()
                piece.y--
                insertPieceInTab(piece)
            }
        }
        if (event.key === "ArrowRight") {
            if (canGoRight()){
                removePiece()
                piece.y++
                insertPieceInTab(piece)
            }
        }
        if (event.key === "ArrowDown") {
            while (canGoDown()){
                removePiece()
                piece.x++
                console.log(piece.y)
                insertPieceInTab(piece)
            }
            newTurn()
        }
        if (event.key === ' ') {
            removePiece()
            rotatePiece()
            insertPieceInTab(piece)
        }
    }

    function detectLines(){
        let lineBreak = 0
        for (let i = 0; i < table.length; i++) {
            let line = table[i]
            let isLine = true
            for (let j = 0; j < 12; j++) {
                if (line[j] == '0'){
                    isLine = false
                }
            }
            if (isLine){
                lineBreak++
                for (let j = 0; j < 12; j++) {
                    table[i][j] = '0'
                }
                for (let j = i; j > 0; j--) {
                    table[j] = Object.assign([],table[j - 1])
                }
                for (let j = 0; j < 12; j++) {
                    table[0][j] = '0'
                }
            }
        }
        if (lineBreak > 0){
            score += lineBreak * 12
        }
    }

    window.addEventListener("keydown", handleArrow);

    setInterval(() => {
        if (canGoDown()){
            movePieceDown()
        }else{
            newTurn()
        }
    }, 1000)

</script>

<div class="h-screen w-screen bg-white-200 overflow-hidden flex flex-col justify-between text-7xl">
    <p class="w-screen flex justify-center">
        <span class="text-red-500">T</span>
        <span class="text-orange-500">E</span>
        <span class="text-yellow-500">T</span>
        <span class="text-green-500">R</span>
        <span class="text-blue-500">I</span>
        <span class="text-pink-500">S</span>
        <span class="w-4"></span>
        <span class="text-purple-500">4</span>
        <span class="text-red-500">0</span>
        <span class="text-orange-500">4</span>
    </p>
    <div class="flex justify-center w-full mb-5">
        <div class="grid grid-cols-30 grid-rows-10 border-2">
            {#each table as elem}
                <div class="flex ">
                    {#each elem as e}
                        <div class="case border-2 border-black-500 {colors[e]}">
                            <div class="h-full w-full"></div>
                        </div>
                    {/each}
                </div>
            {/each}
        </div>
    </div>
</div>
<div class="absolute bottom-10 right-20 text-xl">
    Score : {score}
</div>
{#if perdu}
    <div class="w-screen h-screen backdrop-blur-sm bg-white/30 absolute z-30 pt-40">
            <p class="text-4xl text-center">Perdu</p>
            <p class="text-2xl text-center">Score : {score}</p>
    </div>
{/if}

<style>
    .case {
        height: 1.5vw;
        width: 1.5vw;
    }
</style>
