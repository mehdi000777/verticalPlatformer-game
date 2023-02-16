import { Sprite } from "./sprite.js";

export class Player extends Sprite {
    constructor(game, imageSrc, frameRate, scale = .5, animations) {
        super({ imageSrc, frameRate, scale });
        this.game = game;
        this.x = 100;
        this.y = 300;
        this.speedY = 0;
        this.speedX = 0;
        this.gravity = .5;
        this.collision = false;
        this.hitBox = {
            x: this.x + 35,
            y: this.y + 26,
            width: 14,
            height: 27
        }
        this.animations = animations;
        for (let key in this.animations) {
            const image = new Image();
            image.src = this.animations[key].imageSrc;
            this.animations[key].image = image;
        }
        this.lastDirection = 'right';
        this.cameraBox = {
            x: this.x - 50,
            y: this.y,
            width: 200,
            height: 80
        }
    }

    draw(ctx) {
        if (this.game.debug) {
            ctx.fillStyle = 'rgba(0,255,0,.2)';
            ctx.fillRect(this.x, this.y, this.width, this.height);

            ctx.fillStyle = 'rgba(255,0,0,.5)';
            ctx.fillRect(this.hitBox.x, this.hitBox.y, this.hitBox.width, this.hitBox.height);

            ctx.fillStyle = 'rgba(0,0,255,.5)';
            ctx.fillRect(this.cameraBox.x, this.cameraBox.y, this.cameraBox.width, this.cameraBox.height);
        }
        super.draw(ctx);
    }

    update(input) {
        super.update();

        this.speedX = 0

        this.updateCameraBox();

        if (input.keys.includes('ArrowRight')) {
            if (this.hitBox.x + this.hitBox.width <= this.game.background.width) this.speedX = 2.5;
            this.switchSprite('run');
            this.lastDirection = 'right'
            this.shouldPanCameraToTheLeft();
        }
        else if (input.keys.includes('ArrowLeft')) {
            if (this.hitBox.x >= 0) this.speedX = -2.5
            this.switchSprite('runLeft');
            this.lastDirection = 'left';
            this.shouldPanCameraToTheRight();
        }
        else if (this.speedY === 0) {
            if (this.lastDirection === 'right') this.switchSprite('idle');
            else this.switchSprite('idleLeft');
        }
        if (input.keys.includes('ArrowUp') && this.collision) {
            this.speedY = -8;
        }
        if (this.speedY < 0) {
            if (this.lastDirection === 'right') this.switchSprite('jump');
            else this.switchSprite('jumpLeft');
            this.shouldPanCameraToDown();
        }
        if (this.speedY > 0) {
            if (this.lastDirection === 'right') this.switchSprite('fall');
            else this.switchSprite('fallLeft');
            this.shouldPanCameraToUp();
        }

        this.x += this.speedX;
        this.updateHitBox();
        this.checkHorizontalCollisionBlocks();

        if (this.speedY < 5) this.speedY += this.gravity;
        this.y += this.speedY;
        this.updateHitBox();
        this.checkVerticalCollisionBlocks();
    }

    switchSprite(key) {
        if (this.image === this.animations[key].image || !this.load) return;
        this.frame = 0;
        this.image = this.animations[key].image;
        this.frameRate = this.animations[key].frameRate;
        this.frameBuffer = this.animations[key].frameBuffer;
    }

    shouldPanCameraToTheLeft() {
        const cameraBoxRightSide = this.cameraBox.x + this.cameraBox.width;

        if (this.cameraBox.x + this.cameraBox.width >= this.game.background.width) return;

        if (cameraBoxRightSide >= this.game.width / 4 + Math.abs(this.game.camera.x)) {
            this.game.camera.x -= this.speedX;
        }
    }

    shouldPanCameraToTheRight() {
        const cameraBoxLeftSide = this.cameraBox.x;

        if (this.cameraBox.x <= 0) return;

        if (cameraBoxLeftSide <= Math.abs(this.game.camera.x)) {
            this.game.camera.x -= this.speedX;
        }
    }

    shouldPanCameraToDown() {
        const cameraBoxTopSide = this.cameraBox.y;

        if (this.cameraBox.y + this.speedY <= 0) return;

        if (cameraBoxTopSide <= Math.abs(this.game.camera.y)) {
            this.game.camera.y -= this.speedY;
        }
    }

    shouldPanCameraToUp() {
        const cameraBoxBottomSide = this.cameraBox.y + this.cameraBox.height;

        if (this.cameraBox.y + this.cameraBox.height >= this.game.background.height) return;

        if (cameraBoxBottomSide >= this.game.height / 4 + Math.abs(this.game.camera.y)) {
            this.game.camera.y -= this.speedY;
        }
    }

    updateCameraBox() {
        this.cameraBox = {
            x: this.x - 50,
            y: this.y,
            width: 200,
            height: 80
        }
    }

    updateHitBox() {
        this.hitBox = {
            x: this.x + 35,
            y: this.y + 26,
            width: 14,
            height: 27
        }
    }

    checkHorizontalCollisionBlocks() {
        this.game.collisionBlocks.forEach(block => {
            if (this.game.checkCollision(this.hitBox, block)) {
                if (this.speedX > 0) {
                    this.speedX = 0;
                    const offset = this.hitBox.x - this.x + this.hitBox.width;
                    thisx = block.x - offset - 0.01;
                }
                if (this.speedX < 0) {
                    this.speedX = 0;
                    const offset = this.hitBox.x - this.x;
                    this.x = block.x + block.width - offset + 0.01;
                }
            };
        });
    }

    checkVerticalCollisionBlocks() {
        this.collision = false;
        this.game.collisionBlocks.forEach(block => {
            if (this.game.checkCollision(this.hitBox, block)) {
                if (this.speedY > 0) {
                    this.speedY = 0;
                    this.collision = true;
                    const offset = this.height - ((this.hitBox.y - this.y) + this.hitBox.height);
                    this.y = block.y - this.height + offset - 0.01;
                }
                if (this.speedY < 0) {
                    this.speedY = 0;
                    this.collision = true;
                    const offset = this.hitBox.y - this.y;
                    this.y = block.y + block.height - offset + 0.01;
                }
            };
        });

        //platform collision blocks
        this.game.platformCollisionBlocks.forEach(block => {
            if (this.game.checkPlatformCollision(this.hitBox, block)) {
                if (this.speedY > 0) {
                    this.speedY = 0;
                    this.collision = true;
                    const offset = this.height - (this.hitBox.y - this.y + this.hitBox.height);
                    this.y = block.y - this.height + offset - 0.01;
                }
            }
        })
    }
}