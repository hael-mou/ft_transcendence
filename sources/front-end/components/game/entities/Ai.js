import Player from "./Player.js";
import Ball from "./Ball.js";


class Ai extends Player {
    #numberOfPredictions;
    #interval;
    #state;
    constructor(width, height, canvasHeight, canvasWidth, speed, ballRadius, difficulty = "normal", color) {
        super(width, height, canvasHeight, canvasWidth, speed, color);
        this.ballRadius = ballRadius;
        this.#state = {
            predicting: 1,
            moving: 0,
            hesitating: 0
        };
        this.prediction = {
            x: (canvasWidth / 2) - ballRadius,
            y: (canvasHeight / 2) - ballRadius,
        }
        this.#numberOfPredictions = this.initNbPredictions(difficulty);
        this.#interval = this.initPredictInterval();
    }

    getInterval() {
        return (this.#interval);
    }

    initPredictInterval() {
        return (setInterval(() => {
            this.#state.predicting = 1;
        }, 500));
    };

    initNbPredictions(difficulty) {
        if (difficulty === "easy") {
            return (20);
        } else if (difficulty === "normal") {
            return (40);
        } else if (difficulty === "impossible") {
            return (120);
        }
    }
    

    predict(game, ball) {
        const prediction = ball.emulateBallMovement(game, ball, this.#numberOfPredictions);
        const offset = Math.floor(Math.random());
        this.prediction.x = prediction.x + offset;
        this.prediction.y = prediction.y + offset;
    }

    move() {
        this.keyDown = false;
        this.keyUp = false;

        if (this.prediction.x > (this.canvasWidth / 2) + (this.canvasWidth / 4)) {
            if (this.prediction.y > this.y + this.width) {
                this.keyDown = true;
            } else if (this.prediction.y < this.y) {
                this.keyUp = true;
            }
        }
    }

    runAi(game, ball) {
        if (this.#state.predicting) {
            this.#state.moving = 0;
            this.predict(game, ball);
            this.#state.predicting = 0;
            this.#state.moving = 1;
        } else if (this.#state.moving) {
            this.move();
            this.movePaddle();
        }
    }

    reinitCoordinates() {
        this.x = this.canvasSide === "left" ? 0 : this.canvasWidth - this.width;
        this.y = (this.canvasHeight / 2) - (this.height / 2);
        this.speed = this.speed;
        this.prediction = {
            x: (this.canvasWidth / 2) - this.ballRadius,
            y: (this.canvasHeight / 2) - this.ballRadius
        }
    };
};

export default Ai;