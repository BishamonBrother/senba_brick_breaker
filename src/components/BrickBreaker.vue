<template>
  <div class="brickBreaker" align="center">
    <canvas ref="brickBreakerCanvas" v-bind:width="canvasWidth" height="540">
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
        new Audio(require('@/assets/sounds/SE_CHII.wav')),
        new Audio(require('@/assets/sounds/SE_DA.wav')),
        new Audio(require('@/assets/sounds/SE_KAN.wav')),
        new Audio(require('@/assets/sounds/SE_KIRA.wav')),
        new Audio(require('@/assets/sounds/SE_NUKI.wav')),
        new Audio(require('@/assets/sounds/SE_SHA.wav')),
      ],
      gameOverSe: new Audio(require('@/assets/sounds/SE_YAKU.wav')),
      ikkitsuukanSe: new Audio(require('@/assets/sounds/SE_DORA.wav')),
      reachSe: new Audio(require('@/assets/sounds/reach.wav')),
      clearSe: [
        new Audio(require('@/assets/sounds/ron.wav')),
        new Audio(require('@/assets/sounds/tsumo.wav')),
      ],
      paddleX: 0,
      rightPressed: false,
      leftPressed: false,
      interval: 0,
      brickRowCount: 5,
      brickColumnCount: 14,
      brickWidth: 80,
      brickHeight: 30,
      brickPadding: 0.1,
      brickOffsetTop: 30,
      brickOffsetLeft: 30,
      bricks: [],
      bgImage: new Image(),
      mosaicBgImage: 0,
      mosaicSize: 30,
      ikkitsuukan: false,
      isReach: false,
      isGameCleared: false,
      isGameOver: false,
      volumeValue: 0.3,
      canvasWidth: 960,
      playing: false,
      tenbouImage: new Image(),
      threeColorRuns: [
        '/img/p_ms1_1.gif',
        '/img/p_ms2_1.gif',
        '/img/p_ms3_1.gif',
        '/img/p_ss1_1.gif',
        '/img/p_ss2_1.gif',
        '/img/p_ss3_1.gif',
        '/img/p_ps1_1.gif',
        '/img/p_ps2_1.gif',
        '/img/p_ps3_1.gif',
        '/img/p_ms7_1.gif',
        '/img/p_ms8_1.gif',
        '/img/p_ms9_1.gif',
        '/img/p_ms9_1.gif',
        '/img/p_ms9_1.gif',
      ],
      thirteenOrphans: [
        '/img/p_ms1_1.gif',
        '/img/p_ms9_1.gif',
        '/img/p_ss1_1.gif',
        '/img/p_ss9_1.gif',
        '/img/p_ps1_1.gif',
        '/img/p_ps9_1.gif',
        '/img/p_ji_e_1.gif',
        '/img/p_ji_s_1.gif',
        '/img/p_ji_w_1.gif',
        '/img/p_ji_n_1.gif',
        '/img/p_no_1.gif',
        '/img/p_ji_h_1.gif',
        '/img/p_ji_c_1.gif',
        '/img/p_ji_c_1.gif',
      ],
      allGreens: [
        '/img/p_ss2_1.gif',
        '/img/p_ss2_1.gif',
        '/img/p_ss3_1.gif',
        '/img/p_ss3_1.gif',
        '/img/p_ss4_1.gif',
        '/img/p_ss4_1.gif',
        '/img/p_ss6_1.gif',
        '/img/p_ss6_1.gif',
        '/img/p_ss8_1.gif',
        '/img/p_ss8_1.gif',
        '/img/p_ss8_1.gif',
        '/img/p_ji_h_1.gif',
        '/img/p_ji_h_1.gif',
        '/img/p_ji_h_1.gif',
      ],
      bigDragons: [
        '/img/p_no_1.gif',
        '/img/p_no_1.gif',
        '/img/p_no_1.gif',
        '/img/p_ji_h_1.gif',
        '/img/p_ji_h_1.gif',
        '/img/p_ji_h_1.gif',
        '/img/p_ji_c_1.gif',
        '/img/p_ji_c_1.gif',
        '/img/p_ji_c_1.gif',
        '/img/p_ji_e_1.gif',
        '/img/p_ji_e_1.gif',
        '/img/p_ji_e_1.gif',
        '/img/p_ji_s_1.gif',
        '/img/p_ji_s_1.gif',
      ],
      nineGates: [
        '/img/p_ms1_1.gif',
        '/img/p_ms1_1.gif',
        '/img/p_ms1_1.gif',
        '/img/p_ms1_1.gif',
        '/img/p_ms2_1.gif',
        '/img/p_ms3_1.gif',
        '/img/p_ms4_1.gif',
        '/img/p_ms5_1.gif',
        '/img/p_ms6_1.gif',
        '/img/p_ms7_1.gif',
        '/img/p_ms8_1.gif',
        '/img/p_ms9_1.gif',
        '/img/p_ms9_1.gif',
        '/img/p_ms9_1.gif',
      ],
    }
  },

  mounted() {
    this.bgImage.src = require('@/assets/images/background.png');
    this.bgImage.onload = function () {
      this.loaded = true;
    }
    this.tenbouImage.src = require('@/assets/images/b_8_2.gif');
    this.tenbouImage.onload = function () {
      this.loaded = true;
    }
    
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

    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);

    let row = [this.nineGates, this.bigDragons, this.allGreens, this.thirteenOrphans, this.threeColorRuns];
    for (let r = 0; r < this.brickRowCount; r++) {
      this.bricks[r] = [];
      for (let c = 0; c < this.brickColumnCount; c++) {
        this.bricks[r][c] = {x: 0, y: 0, exists: true, image: new Image()};
        this.bricks[r][c].image.src = (row[r][c]);
        this.bricks[r][c].image.onload = function () {
          this.loaded = true;
        }
      }
    }
    this.brickWidth = this.bricks[0][0].image.width;
    this.brickHeight = this.bricks[0][0].image.height;

    this.canvasWidth = this.bricks[0][0].image.width * this.brickColumnCount + 60;

    this.x = this.canvasWidth / 2;
    this.y = this.canvas.height - 30;
    this.paddleX = (this.canvasWidth - this.tenbouImage.width) / 2;

    this.interval = setInterval(this.draw, 10);
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

      if (!this.playing) {
        return;
      }

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
            if (!this.isGameOver) {
              this.ikkitsuukanSe.play();
            }
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
      for (let r = 0; r < this.brickRowCount; r++) {
        for (let c = 0; c < this.brickColumnCount; c++) {
          if (this.bricks[r][c].exists) {
            const brickX = c * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft;
            const brickY = r * (this.brickHeight + this.brickPadding) + this.brickOffsetTop;
            this.bricks[r][c].x = brickX;
            this.bricks[r][c].y = brickY;
            if (this.bricks[r][c].image.loaded) {
              this.ctx.drawImage(this.bricks[r][c].image, brickX, brickY, this.brickWidth, this.brickHeight);
            }
          }
        }
      }
    },

    drawBgImage: function () {
      if (!this.bgImage.loaded) {
        return;
      }
      if (this.mosaicBgImage === 0) {
        this.createMosaicBgImage();
      }
      if (this.isGameCleared) {
        this.ctx.drawImage(this.bgImage, 30, 30);
      } else {
        this.ctx.putImageData(this.mosaicBgImage, 30, 30);
      }
    },

    createMosaicBgImage: function () {
      /* 元の画像を描写 -> mosaicSize単位でモザイクをかけたものをcanvasに描写 -> 元の画像サイズ分モザイクをかけた範囲をgetImageDataで切り取る */
      this.ctx.drawImage(this.bgImage, 30, 30);

      let w;
      let h;
      for (w = 0; w < this.bgImage.width; w += this.mosaicSize) {
        for (h = 0; h < this.bgImage.height; h += this.mosaicSize) {
          let size = this.mosaicSize;
          if (h + this.mosaicSize > this.bgImage.height) {
            size = this.bgImage.height - h;
          }
          this.blurColor(30 + w, 30 + h, this.mosaicSize, size);
        }
      }

      this.mosaicBgImage = this.ctx.getImageData(30, 30, this.bgImage.width, this.bgImage.height);
    },

    drawTenbouImage: function () {
      if (this.tenbouImage.loaded) {
        this.ctx.drawImage(this.tenbouImage, this.paddleX, this.canvas.height - this.tenbouImage.height, this.tenbouImage.width, this.tenbouImage.height);
      }
    },

    collisionDetection: function() {
      let isAllDeleted = true;
      let numBricks = 0;
      for (let c = 0; c < this.brickColumnCount; c++) {
        for (let r = 0; r < this.brickRowCount; r++) {
          const b = this.bricks[r][c];
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

    blurColor: function (x, y, w, h) {
      let r, g, b
      r = g = b = 0
      
      let src = this.ctx.getImageData(x, y, w, h);
      let dst = this.ctx.createImageData(w, h)

      for (let i = 0; i < src.data.length; i += 4) {
          r += src.data[i]
          g += src.data[i + 1]
          b += src.data[i + 2]
      }

      r /= src.data.length / 4
      g /= src.data.length / 4
      b /= src.data.length / 4

      r = Math.ceil(r)
      g = Math.ceil(g)
      b = Math.ceil(b)

      for (let i = 0; i < src.data.length; i += 4) {
          dst.data[i] = r
          dst.data[i + 1] = g
          dst.data[i + 2] = b
          dst.data[i + 3] = 255
      }

      this.ctx.putImageData(dst, x, y)
    },

    onKeyDown: function (e) {
      if (e.key === "Right" || e.key === "ArrowRight") {
        this.rightPressed = true;
      } else if (e.key === "Left" || e.key === "ArrowLeft") {
        this.leftPressed = true;
      } else if (e.key === "Enter") {
        this.playing = true;
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
