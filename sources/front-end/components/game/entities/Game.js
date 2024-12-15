import Player from './Player.js'
import Ball from './Ball.js'
import Net from './Net.js';
import loadingOverlay from '../loadingOverlayComponent.js';
import Ai from './Ai.js';
import { Router } from "../../../core/routing.js";
import { Auth } from "../../../tools/http.js";

class Game {
    static PAUSE_DURATION = 500;
    static MAX_SCORE = 6;

    constructor(pWidth, pHeight, pSpeed, bRadius, bSpeed, aiDifficulty = "normal", color = "#1E90FF", status, gameData) {
        // dom objects
        this.canvas = document.querySelector('game-component').shadowRoot.querySelector('canvas');
        this.button = document.querySelector('game-component').shadowRoot.querySelector('anchorbutton-component');
        this.infoSpan = document.querySelector('game-component').shadowRoot.querySelector('#infoSpan');
        this.loadingOverlay = document.querySelector('game-component').shadowRoot.querySelector('loadingoverlay-component');
        // this.avatarsContainer = document.querySelector('avatars-component');

        // general data
        this.ctx = this.canvas.getContext('2d');
        this.canvasHeight = this.canvas.height;
        this.canvasWidth = this.canvas.width;
        this.gameMode = status;
        this.gameEnd = false;
        this.pause = false;

        // online props
        this.emitter = new EventTarget();
        this.roomId = null;
        this.playerId = null;
        this.socket = null;
        this.gameData = gameData;

        // game objects
        this.clientPlayer = new Player(pWidth, pHeight, this.canvasHeight, this.canvasWidth, pSpeed, color);
        this.adversaryPlayer = this.gameMode !== "ai" ? new Player(pWidth, pHeight, this.canvasHeight, this.canvasWidth, pSpeed, color) : new Ai(pWidth, pHeight, this.canvasHeight, this.canvasWidth, pSpeed, bRadius, aiDifficulty, color);
        this.ball = new Ball(bRadius, (this.canvasWidth / 2 - bRadius / 2), (this.canvasHeight / 2 - bRadius / 2), bSpeed, bSpeed, 1, this.canvasHeight, this.canvasWidth, color);
    };


    async initSocket() {
        const {roomId, playerId, adversaryId} = this.gameData;
        this.roomId = roomId;
        this.playerId = playerId;
        this.adversaryId = adversaryId;
        const url = `wss://127.0.0.1:8080/gameplay/ws/game/${this.roomId}/`;
        this.socket = new WebSocket(url + `?token=${await Auth.getAccessToken()}`);
    }

    initSocketEvents () {
        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.event === "gameplay_init") {
                this.initRemotePlayersSide(data.paddle_x);
                this.emitter.dispatchEvent(new CustomEvent('startGame'));
            } else if (data.event === "gameplay_reinit") {
                this.handleGoalEvent(data.player_score, data.opponent_score);
            } else if (data.event === "gameplay_end") {
                this.endGame();
            } else if (data.event === "ball_state") {
                this.ball.updateMultiplayerBall(data.ball[0], data.ball[1]);
            } else if (data.event === "paddle_state") {
                this.adversaryPlayer.updateMultiplayerY(data.paddle_y);
            }
        };

        this.socket.onerror = () => {
            const alert = document.createElement("custom-alert");
            alert.setMessage("matchmaking is down currently, try again later!");
            alert.modalInstance.show();
            Router.redirect('/game');
        }
    }

    // Game positions and coordinates
    initLocalPlayersSide () {
        this.clientPlayer.initPlayerSide("left");
        this.adversaryPlayer.initPlayerSide("right");
    }

    initRemotePlayersSide (x) {
        this.clientPlayer.initPlayerSide(x > this.canvasWidth / 2 ? "right" : "left");
        this.adversaryPlayer.initPlayerSide(x > this.canvasWidth / 2 ? "left" : "right");
    }

    reinitGameCoordinates () {
        this.ball.reinitCoordinates();
        this.clientPlayer.reinitCoordinates();
        this.adversaryPlayer.reinitCoordinates();
    }

    registerKeys () {
        if (this.gameMode === "local") {
            this.clientPlayer.registerKeys("w", "s");
            this.adversaryPlayer.registerKeys("ArrowUp", "ArrowDown");
        }
        else if (this.gameMode === "multiplayer" || this.gameMode === "ai") {
            this.clientPlayer.registerKeys("ArrowUp", "ArrowDown");
        }
    }

    // Game mode controls
    startGame () {
        this.registerKeys();
        // local modes
        if (this.gameMode !== "multiplayer") {
            this.loadingOverlay.hideElement();
            this.initLocalPlayersSide();
            if (this.gameMode === "local")
                this.localGame();
            else if (this.gameMode === "ai")
                this.aiGame();
        }
        // multiplayer
        else {
            this.emitter.addEventListener('startGame', () => {
                this.loadingOverlay.hideElement();
                this.remoteGame();
            });
            this.initSocketEvents();
        }
    }

    endGame() {
        setTimeout(() => {
            if (this.gameMode === "ai" && this.adversaryPlayer.getInterval())
                clearInterval(this.adversaryPlayer.getInterval());
            this.canvas.style.display = "none";
            this.infoSpan.style.display = "block";
            this.button.style.display = "block";
            if (this.clientPlayer.score > this.adversaryPlayer.score) {
                this.infoSpan.textContent = `You've won! score: ${this.clientPlayer.score}-${this.adversaryPlayer.score}`;
            } else {
                this.infoSpan.textContent = `You've lost! score: ${this.clientPlayer.score}-${this.adversaryPlayer.score}`;
            }
        }, 500);
        localStorage.removeItem("gameData");
        localStorage.removeItem("gameMode");
        localStorage.removeItem("aiDifficulty");
        localStorage.removeItem("chosenColor");
    }

    pauseGame() {
        this.pause = true;
        setTimeout(() => {
            this.pause = false;
        }, Game.PAUSE_DURATION);
    }


    // Game modes
    localGame() {
        if (!this.gameEnd) {
            if (!this.pause) {
                this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
                this.ball.drawBall(this.ctx);
                this.clientPlayer.drawPaddle(this.ctx);
                this.adversaryPlayer.drawPaddle(this.ctx);
                this.clientPlayer.movePaddle();
                this.adversaryPlayer.movePaddle();
                this.ball.moveBall(this);
                this.checkScore();
            }
            this.drawScore();
            requestAnimationFrame(this.localGame.bind(this));
        }
    }

    remoteGame() {
        if (!this.gameEnd) {
            if (!this.pause) {
                this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
                this.ball.drawBall(this.ctx);
                this.clientPlayer.drawPaddle(this.ctx);
                this.adversaryPlayer.drawPaddle(this.ctx);
                this.clientPlayer.movePaddle(this.socket);
            }
            this.drawScore();
            requestAnimationFrame(this.remoteGame.bind(this));
        }
    }

    aiGame() {
        if (!this.gameEnd) {
            if (!this.pause) {
                this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
                this.clientPlayer.drawPaddle(this.ctx);
                this.adversaryPlayer.drawPaddle(this.ctx);
                this.ball.drawBall(this.ctx);
                this.clientPlayer.movePaddle();
                this.adversaryPlayer.runAi(this, this.ball);
                this.ball.moveBall(this);
                this.checkScore();
            }
            this.drawScore();
            requestAnimationFrame(this.aiGame.bind(this));
        }
    }

    // Game scoring events
    checkScore() {
        if (this.clientPlayer.score > Game.MAX_SCORE || this.adversaryPlayer.score > Game.MAX_SCORE) {
            this.gameEnd = true;
            this.endGame();
        }
    }

    handleGoalEvent(playerScore, adversaryScore) {
        this.clientPlayer.updateScore(playerScore);
        this.adversaryPlayer.updateScore(adversaryScore);
        this.pauseGame();
        this.drawMessage("GOAL!");
        this.reinitGameCoordinates();

        const verdict = playerScore > adversaryScore ? "scored" : "conceded";
        this.canvas.classList.add(verdict);
        setTimeout(() => {
            this.canvas.classList.remove(verdict);
        }, Game.PAUSE_DURATION);
    }

    drawScore() {
        const canvasMiddleX = this.canvasWidth / 2;
        const canvasMiddleY = this.canvasHeight / 2;
        this.ctx.font = "4rem Arial";
        this.ctx.fillText(this.clientPlayer.score, this.clientPlayer.canvasSide === "left" ? canvasMiddleX - 400 : canvasMiddleX + 400, canvasMiddleY);
        this.ctx.fillText(this.adversaryPlayer.score, this.adversaryPlayer.canvasSide === "left" ? canvasMiddleX - 400 : canvasMiddleX + 400, canvasMiddleY);
    }

    drawMessage(message) {
        const canvasMiddleX = this.canvasWidth / 2;
        const canvasMiddleY = this.canvasHeight / 2;
        this.ctx.font = "3rem Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText(message, canvasMiddleX, canvasMiddleY);
    }
}

export default Game;
