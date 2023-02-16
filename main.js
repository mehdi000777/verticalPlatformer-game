import { InputHandler } from "./inputHandler.js";
import { Player } from "./player.js";
import { Sprite } from "./sprite.js";
import { floorCollisions, platformCollisions } from './data/collision.js';
import { CollisionBlock } from "./collisionBlock.js";

window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1024;
    canvas.height = 576;

    class Game {
        constructor(canvas) {
            this.canvas = canvas;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.player = new Player(this, '/assets/warrior/Idle.png', 8, .5, {
                idle: {
                    imageSrc: '/assets/warrior/Idle.png',
                    frameRate: 8,
                    frameBuffer: 3
                },
                idleLeft: {
                    imageSrc: '/assets/warrior/IdleLeft.png',
                    frameRate: 8,
                    frameBuffer: 3
                },
                run: {
                    imageSrc: '/assets/warrior/Run.png',
                    frameRate: 8,
                    frameBuffer: 5
                },
                runLeft: {
                    imageSrc: '/assets/warrior/RunLeft.png',
                    frameRate: 8,
                    frameBuffer: 5
                },
                jump: {
                    imageSrc: '/assets/warrior/Jump.png',
                    frameRate: 2,
                    frameBuffer: 3
                },
                jumpLeft: {
                    imageSrc: '/assets/warrior/JumpLeft.png',
                    frameRate: 2,
                    frameBuffer: 3
                },
                fall: {
                    imageSrc: '/assets/warrior/Fall.png',
                    frameRate: 2,
                    frameBuffer: 3
                },
                fallLeft: {
                    imageSrc: '/assets/warrior/FallLeft.png',
                    frameRate: 2,
                    frameBuffer: 3
                }
            });
            this.input = new InputHandler(this);
            this.background = new Sprite({ game: this, x: 0, y: 0, imageSrc: '/assets/background.png' });
            this.scaledCanvas = {
                width: this.width / 4,
                height: this.height / 4
            };
            this.floorCollision2D = [];
            this.platformCollision2D = [];
            this.collisionBlocks = [];
            this.platformCollisionBlocks = [];
            this.camera = {
                x: 0,
                y: this.scaledCanvas.height - this.background.image.height
            }
            this.debug = false;
        }

        render(ctx) {
            ctx.save()
            ctx.scale(4, 4);
            ctx.translate(this.camera.x, this.camera.y)
            this.background.draw(ctx);
            this.collisionBlocks.forEach(block => {
                block.draw(ctx);
            })
            this.platformCollisionBlocks.forEach(block => {
                block.draw(ctx);
            })
            this.player.update(this.input);
            this.player.draw(ctx)
            ctx.restore();
        }

        CollisionData() {
            for (let i = 0; i < floorCollisions.length; i += 36) {
                this.floorCollision2D.push(floorCollisions.slice(i, i + 36));
            }

            for (let i = 0; i < platformCollisions.length; i += 36) {
                this.platformCollision2D.push(platformCollisions.slice(i, i + 36));
            }
        }

        addCollisionBlocks() {
            this.floorCollision2D.forEach((row, y) => {
                row.forEach((symbol, x) => {
                    if (symbol === 202) {
                        this.collisionBlocks.push(new CollisionBlock(this, x * 16, y * 16));
                    }
                })
            });

            this.platformCollision2D.forEach((row, y) => {
                row.forEach((symbol, x) => {
                    if (symbol === 202) {
                        this.platformCollisionBlocks.push(new CollisionBlock(this, x * 16, y * 16, 4));
                    }
                })
            });
        }

        checkCollision(object1, object2) {
            return (
                object1.x <= object2.x + object2.width &&
                object1.x + object1.width >= object2.x &&
                object1.y <= object2.y + object2.height &&
                object1.y + object1.height >= object2.y
            )
        }

        checkPlatformCollision(object1, object2) {
            return (
                object1.x <= object2.x + object2.width &&
                object1.x + object1.width >= object2.x &&
                object1.y + object1.height <= object2.y + object2.height &&
                object1.y + object1.height + 1 >= object2.y
            )
        }
    }

    const game = new Game(canvas);
    game.CollisionData();
    game.addCollisionBlocks();

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.render(ctx);
        requestAnimationFrame(animate)
    }
    animate();
})