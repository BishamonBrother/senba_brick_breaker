<template>
  <div class="brickBreaker" align="center">
    <canvas ref="brickBreakerCanvas" width="940" height="540">
    </canvas>
  </div>
  <div class="volume">
    <img src="@/assets/images/volume.png" width="30" height="30">
    <input type="range" ref="volumeSlider" max="1" min="0" step = "0.01" v-bind:value="volumeValue" v-on:change="onVolumeChange">
  </div>
  <div>
    <p>Enterキーを押すとスタートするのじゃ！</p>
    <p>左右のカーソルキーで操作するのじゃ！</p>
  </div>
</template>

<script>
export default {
  name: 'BrickBreaker',

  data () {
    return {
      x: 0,
      y: 0,
      dx: 2,
      dy: 3,
      ballRadius: 10,
      breakSe: [
        new Audio(require('@/assets/sounds/pon.wav')),
        new Audio(require('@/assets/sounds/chi.wav')),
        new Audio(require('@/assets/sounds/kan.wav')),
      ],
      gameOverSe: new Audio(require('@/assets/sounds/SE_YAKU.wav')),
      ikkitsuukanSe: new Audio(require('@/assets/sounds/SE_DORA.wav')),
      reachSe: new Audio(require('@/assets/sounds/reach.wav')),
      clearSe: [
        new Audio(require('@/assets/sounds/SE_AGARI.wav')),
        new Audio(require('@/assets/sounds/ron.wav')),
        new Audio(require('@/assets/sounds/tsumo.wav')),
      ],
      paddleX: 0,
      rightPressed: false,
      leftPressed: false,
      interval: 0,
      brickRowCount: 10,
      brickColumnCount: 11,
      brickWidth: 80,
      brickHeight: 30,
      brickPadding: 0.1,
      brickOffsetTop: 30,
      brickOffsetLeft: 30,
      bricks: [],
      bgImage: new Image(),
      ikkitsuukan: false,
      isReach: false,
      isGameCleared: false,
      isGameOver: false,
      volumeValue: 0.3,
      tenbouImage: new Image(),
    }
  },

  mounted() {
    this.x = this.canvas.width / 2;
    this.y = this.canvas.height - 30;

    this.bgImage.src = require('@/assets/images/background.jpg');
    this.tenbouImage.src = require('@/assets/images/b_8_2.gif');
    
    /* ローカルストレージからボリュームの値を取得する。 */
    let storageVolume = localStorage.getItem("volumeValue");
    if (storageVolume !== 0) {
      this.volumeValue = storageVolume;
    }

    this.breakSe.forEach(se => se.volume = this.volumeValue);
    this.gameOverSe.volume = this.volumeValue;
    this.gameOverSe.onended = function () {
      alert("もう一回チャレンジするのじゃ！");
      document.location.reload();
      clearInterval(this.interval);
    }
    this.ikkitsuukanSe.volume = this.volumeValue;
    this.reachSe.volume = this.volumeValue;
    this.clearSe.forEach(se => se.volume = this.volumeValue);
    this.clearSe.forEach(se => se.onended = function () {
      alert("お見事なのじゃ！");
      document.location.reload();
      clearInterval(this.interval);
    });

    this.paddleX = (this.canvas.width - this.tenbouImage.width) / 2;
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);

    for (let c = 0; c < this.brickColumnCount; c++) {
      this.bricks[c] = [];
      for (let r = 0; r < this.brickRowCount; r++) {
        this.bricks[c][r] = {x: 0, y: 0, exists: true};
      }
    }

    this.drawBgImage();
    this.drawBall();
    this.drawTenbouImage();
    this.drawBricks();
  },

  computed: {
    canvas () {
      return this.$refs["brickBreakerCanvas"];
    },

    ctx () {
      return this.canvas.getContext("2d");
    },
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
      this.drawBgImage();
      this.drawBall();
      this.drawTenbouImage();
      this.drawBricks();
      this.collisionDetection();

      this.x += this.dx;
      this.y += this.dy;

      /* 左右の壁で跳ね返る処理 */
      if (this.x + this.dx > this.canvas.width - this.ballRadius || this.x + this.dx < this.ballRadius) {
        this.dx = -this.dx;
      }

      /* 上の壁で跳ね返る処理 */
      if (this.y + this.dy < this.ballRadius) {
        this.dy = -this.dy;
      } else if (this.y + this.dy > this.canvas.height - this.ballRadius) {
        if (this.x > this.paddleX && this.x < this.paddleX + this.tenbouImage.width) {
          /* パドルで跳ね返る処理
             中心付近に当たると横軸の移動が緩くなる。
             さらに中心付近に当たると一気通貫モードになる。 */
          if (this.x > this.paddleX + this.tenbouImage.width * 8 / 17 && this.x < this.paddleX + this.tenbouImage.width * 9 / 17) {
            this.dy = this.dy > 0 ? -5 : 5;
            this.dx = this.dx > 0 ? 1 : -1;
            this.ikkitsuukan = true;
            this.ikkitsuukanSe.play();
          } else if (this.x > this.paddleX + this.tenbouImage.width / 4 && this.x < this.paddleX + this.tenbouImage.width * 3 / 4) {
            this.dy = this.dy > 0 ? -3 : 3;
            this.dx = this.dx > 0 ? 1 : -1;
            this.ikkitsuukan = false;
          } else {
            this.dy = this.dy > 0 ? -3 : 3;
            this.dx = this.dx > 0 ? 2 : -2;
            this.ikkitsuukan = false;
          }
        } else {
          /* 下に触れるとゲームオーバーになる処理 */
          if (!this.isGameCleared && !this.isGameOver) {
            this.isGameOver = true;
            this.gameOverSe.play();
          }
        }
      }

      if (this.rightPressed) {
        this.paddleX = Math.min(this.paddleX + 5, this.canvas.width - this.tenbouImage.width);
      } else if (this.leftPressed) {
        this.paddleX = Math.max(this.paddleX - 5, 0);
      }
    },

    getRandomInterger: function (max) {
      return Math.floor(Math.random() * max);
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
  
            let red = 255 - 30 * c;
            let green = 255 - 30 * r;
            this.ctx.fillStyle = 'rgb(' + Math.floor(red) + ', ' + Math.floor(green) + ', 0)';
            this.ctx.fill();
            this.ctx.closePath();
          }
        }
      }
    },

    drawBgImage: function () {
      this.ctx.drawImage(this.bgImage, 30, 30, 880, 293);
    },

    drawTenbouImage: function () {
      this.ctx.drawImage(this.tenbouImage, this.paddleX, this.canvas.height - this.tenbouImage.height, this.tenbouImage.width, this.tenbouImage.height);
    },

    collisionDetection: function() {
      let isAllDeleted = true;
      let numBricks = 0;
      for (let c = 0; c < this.brickColumnCount; c++) {
        for (let r = 0; r < this.brickRowCount; r++) {
          const b = this.bricks[c][r];
          if (b.exists) {
            numBricks++;
            isAllDeleted = false;
            if (this.ikkitsuukan) {
              if (this.x > b.x && this.x < b.x + this.brickWidth && this.y > b.y && this.y < b.y + this.brickHeight) {
                b.exists = false;
              }
            } else {
              if (this.x > b.x && this.x < b.x + this.brickWidth && this.y > b.y && this.y < b.y + this.brickHeight) {
                if (!this.isReach) {
                  this.breakSe[this.getRandomInterger(this.breakSe.length)].play();
                }
                this.dy = -this.dy;
                b.exists = false;
              }
            }
          }
        }
      }

      if (numBricks === 1 && !this.isReach) {
        this.isReach = true;
        this.reachSe.play();
      }

      /* クリア時の処理 */
      if (isAllDeleted && !this.isGameCleared) {
        this.isGameCleared = true;
        this.clearSe[this.getRandomInterger(this.clearSe.length)].play();
      }
    },

    onKeyDown: function (e) {
      if (e.key === "Right" || e.key === "ArrowRight") {
        this.rightPressed = true;
      } else if (e.key === "Left" || e.key === "ArrowLeft") {
        this.leftPressed = true;
      } else if (e.key === "Enter") {
        this.interval = setInterval(this.draw, 10);
      }
    },

    onKeyUp: function (e) {
      if (e.key === "Right" || e.key === "ArrowRight") {
        this.rightPressed = false;
      } else if (e.key === "Left" || e.key === "ArrowLeft") {
        this.leftPressed = false;
      }
    },

    /* ボリュームスライダーが変更されたときの処理 */
    onVolumeChange: function () {
      /* リロードしてもボリュームを保持するためローカルストレージに入れる */
      this.volumeValue = this.$refs["volumeSlider"].value;
      localStorage.setItem("volumeValue", this.volumeValue);

      this.breakSe.forEach(se => se.volume = this.volumeValue);
      this.gameOverSe.volume = this.volumeValue;
      this.ikkitsuukanSe.volume = this.volumeValue;
      this.reachSe.volume = this.volumeValue;
      this.clearSe.forEach(se => se.volume = this.volumeValue);
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
canvas {
  background-color: pink;
}
.volume {
  display: flex;
  margin-top: 30px;
  margin-left: 30px;
}
</style>
