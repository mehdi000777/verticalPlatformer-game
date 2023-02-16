export class Sprite {
    constructor({ game, x, y, imageSrc, frameRate = 1, scale = 1 }) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.load = false;
        this.image = new Image();
        this.image.onload = () => {
            this.width = (this.image.width / this.frameRate) * this.scale;
            this.height = this.image.height * this.scale;
            this.load = true;
        }
        this.image.src = imageSrc;
        this.frameRate = frameRate;
        this.frame = 0;
        this.spriteWidth = this.image.width / this.frameRate;
        this.spriteHeight = this.image.height;
        this.spriteX = 0;
        this.spriteY = 0;
        this.frameBuffer = 3;
        this.elapsedFrame = 0;
    }

    draw(ctx) {
        if (!this.image) return;
        ctx.drawImage(this.image, this.spriteX, this.spriteY, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }

    update() {
        this.elapsedFrame++;
        this.spriteX = this.spriteWidth * this.frame;

        if (this.elapsedFrame % this.frameBuffer === 0) {
            if (this.frame < this.frameRate - 1) this.frame++;
            else this.frame = 0;
        }
    }
}