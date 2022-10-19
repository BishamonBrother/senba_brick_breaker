<template>
  <div class="brickBreaker" align="center">
    <canvas ref="brickBreakerCanvas">
    </canvas>
  </div>
</template>

<script>
// const canvas = document.getElementById("brickBreakerCanvas");
// const ctx = canvas.getContext("2d");

// const ctx = brickBreakerCanvas.getContext("2d");

// ctx.beginPath();
// ctx.rect(20, 40, 50, 50);
// ctx.fillStyle = "#FF0000";
// ctx.fill();
// ctx.closePath();

export default {
  name: 'BrickBreaker',
  // props: {
  //   msg: String
  // }

  data () {
    return {
      x: 0,
      y: 0,
      dx: 2,
      dy: 2,
      ballRadius: 10,
      se: [
        new Audio(require('@/assets/sounds/pon.wav')),
        new Audio(require('@/assets/sounds/chi.wav')),
        new Audio(require('@/assets/sounds/kan.wav')),
      ],
      paddleHeight: 10,
      paddleWidth: 75,
      paddleX: 0,
      rightPressed: false,
      leftPressed: false
    }
  },

  mounted() {
    const canvas = this.$refs["brickBreakerCanvas"];
    this.x = canvas.width / 2;
    this.y = canvas.height - 30;
    setInterval(this.draw, 10);
    this.se.forEach(se => se.volume = 0.00);
    this.paddleX = (canvas.width - this.paddleWidth) / 2;
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
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

      this.x += this.dx;
      this.y += this.dy;

      if (this.x + this.dx > this.canvas.width - this.ballRadius || this.x + this.dx < this.ballRadius) {
        this.dx = -this.dx;
        this.se[this.getRandomInterger(this.se.length)].play();
      }

      if (this.y + this.dy > this.canvas.height - this.ballRadius || this.y + this.dy < this.ballRadius) {
        this.dy = -this.dy;
        this.se[this.getRandomInterger(this.se.length)].play();
      }

      if (this.rightPressed) {
        this.paddleX = Math.min(this.paddleX + 3, this.canvas.width - this.paddleWidth);
      } else if (this.leftPressed) {
        this.paddleX = Math.max(this.paddleX - 3, 0);
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
  width: 480;
  height: 320;
}
/* h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
} */
</style>
