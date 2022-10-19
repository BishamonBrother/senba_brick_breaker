<template>
  <div class="brickBreaker" align="center">
    <canvas ref="brickBreakerCanvas" width="960" height="540">
    </canvas>
  </div>
</template>

<script>
export default {
  name: 'BrickBreaker',
  // props: {
  //   msg: String
  // }

  data () {
    return {
      x: 0,
      y: 0,
      dx: 3,
      dy: 3,
      ballRadius: 10,
      se: [
        new Audio(require('@/assets/sounds/pon.wav')),
        new Audio(require('@/assets/sounds/chi.wav')),
        new Audio(require('@/assets/sounds/kan.wav')),
      ],
      gameOverSe: new Audio(require('@/assets/sounds/SE_YAKU.wav')),
      paddleHeight: 10,
      paddleWidth: 100,
      paddleX: 0,
      rightPressed: false,
      leftPressed: false,
      interval: 0,
      brickRowCount: 10,
      brickColumnCount: 11,
      brickWidth: 80,
      brickHeight: 20,
      brickPadding: 1,
      brickOffsetTop: 30,
      brickOffsetLeft: 30,
      bricks: [],
      bgImage: new Image(),
    }
  },

  mounted() {
    this.x = this.canvas.width / 2;
    this.y = this.canvas.height - 30;
    this.interval = setInterval(this.draw, 10);
    this.se.forEach(se => se.volume = 0.1);
    this.gameOverSe.volume = 0.1;
    this.paddleX = (this.canvas.width - this.paddleWidth) / 2;
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);

    for (let c = 0; c < this.brickColumnCount; c++) {
      this.bricks[c] = [];
      for (let r = 0; r < this.brickRowCount; r++) {
        this.bricks[c][r] = {x: 0, y: 0, exists: true};
      }
    }

    // const backgroundImage = new Image();
    // backgroundImage.src = require('@/assets/images/background.jpg');
    // this.bgImage.onload = ()=>{
    //   this.ctx.drawImage(this.bgImage, 0, 0);
    // }
    // this.bgImage.src = require('@/assets/images/background.jpg');
    // // this.ctx.drawImage(this.bgImage, 0, 0);
    // this.bgImage.onload = ()=>{
    //   this.ctx.drawImage(this.bgImage, 0, 0);
    // }
  },

  computed: {
    canvas () {
      return this.$refs["brickBreakerCanvas"];
    },

    ctx () {
      return this.canvas.getContext("2d");
    }
  },

  methods: {
    drawBall: function () {
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.ballRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = "#0095DD";
      this.ctx.fill();
      this.ctx.closePath();
    },

    draw: function () {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawBall();
      this.drawPaddle();
      this.drawBricks();
      this.collisionDetection();

      this.x += this.dx;
      this.y += this.dy;

      /* 左右の壁で跳ね返る処理 */
      if (this.x + this.dx > this.canvas.width - this.ballRadius || this.x + this.dx < this.ballRadius) {
        this.dx = -this.dx;
        // this.se[this.getRandomInterger(this.se.length)].play();
      }

      /* 上の壁で跳ね返る処理 */
      if (this.y + this.dy < this.ballRadius) {
        this.dy = -this.dy;
      } else if (this.y + this.dy > this.canvas.height - this.ballRadius) {
        if (this.x > this.paddleX && this.x < this.paddleX + this.paddleWidth) {
          /* パドルで跳ね返る処理
             中心付近（1/4~3/4）に当たると横軸の移動が緩くなる。 */
          if (this.x > this.paddleX + this.paddleWidth / 4 && this.x < this.paddleX + this.paddleWidth * 3 / 4) {
            this.dy = -this.dy;
            this.dx = this.dx > 0 ? 1 : -1;
          } else {
            this.dy = -this.dy;
            this.dx = this.dx > 0 ? 3 : -3;
          }
        } else {
          /* 下に触れるとゲームオーバーになる処理 */
          this.gameOverSe.play();
          alert("ゲームオーバーなのじゃ！");
          document.location.reload();
          clearInterval(this.interval);
        }
      }

      if (this.rightPressed) {
        this.paddleX = Math.min(this.paddleX + 5, this.canvas.width - this.paddleWidth);
      } else if (this.leftPressed) {
        this.paddleX = Math.max(this.paddleX - 5, 0);
      }
    },

    getRandomInterger: function (max) {
      return Math.floor(Math.random() * max);
    },

    drawPaddle: function () {
      this.ctx.beginPath();
      this.ctx.rect(this.paddleX, this.canvas.height - this.paddleHeight, this.paddleWidth, this.paddleHeight);
      this.ctx.fillStyle = "#0095DD";
      this.ctx.fill();
      this.ctx.closePath();
    },

    drawBricks: function () {
      for (let c = 0; c < this.brickColumnCount; c++) {
        for (let r = 0; r < this.brickRowCount; r++) {
          if (this.bricks[c][r].exists) {
            const brickX = c * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft;
            const brickY = r * (this.brickHeight + this.brickPadding) + this.brickOffsetTop;
            this.bricks[c][r].x = brickX;
            this.bricks[c][r].y = brickY;
            this.ctx.beginPath();
            this.ctx.rect(brickX, brickY, this.brickWidth, this.brickHeight);
            // this.ctx.fillStyle = "#0095DD";
  
            let red = 255 - 30 * c;
            let green = 255 - 30 * r;
            this.ctx.fillStyle = 'rgb(' + Math.floor(red) + ', ' + Math.floor(green) + ', 0)';
            // this.ctx.strokeStyle = "black";
            this.ctx.fill();
            this.ctx.closePath();
          }
        }
      }
    },

    collisionDetection: function() {
      for (let c = 0; c < this.brickColumnCount; c++) {
        for (let r = 0; r < this.brickRowCount; r++) {
          const b = this.bricks[c][r];
          if (b.exists) {
            if (this.x > b.x && this.x < b.x + this.brickWidth && this.y > b.y && this.y < b.y + this.brickHeight) {
              this.se[this.getRandomInterger(this.se.length)].play();
              this.dy = -this.dy;
              b.exists = false;
            }
          }
        }
      }
    },

    onKeyDown: function (e) {
      if (e.key === "Right" || e.key === "ArrowRight") {
        this.rightPressed = true;
      } else if (e.key === "Left" || e.key === "ArrowLeft") {
        this.leftPressed = true;
      }
    },

    onKeyUp: function (e) {
      if (e.key === "Right" || e.key === "ArrowRight") {
        this.rightPressed = false;
      } else if (e.key === "Left" || e.key === "ArrowLeft") {
        this.leftPressed = false;
      }
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
canvas {
  background-color: pink;
}
</style>
