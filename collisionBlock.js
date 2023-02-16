export class CollisionBlock {
    constructor(game, x, y, height = 16) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 16;
        this.height = height;
    }

    draw(ctx) {
        if (this.game.debug) {
            ctx.fillStyle = 'rgba(255,0,0,.5)';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}