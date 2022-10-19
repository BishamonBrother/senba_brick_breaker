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
    }
  },

  mounted() {
    const canvas = this.$refs["brickBreakerCanvas"];
    this.x = canvas.width / 2;
    this.y = canvas.height - 30;
    setInterval(this.draw, 10);
    this.se.forEach(se => se.volume = 0.0)
  },
  methods: {
    drawBall: function () {
      const canvas = this.$refs["brickBreakerCanvas"];
      const ctx = canvas.getContext("2d");
      
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#0095DD";
      ctx.fill();
      ctx.closePath();
    },
    draw: function () {
      const canvas = this.$refs["brickBreakerCanvas"];
      const ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.drawBall();

      this.x += this.dx;
      this.y += this.dy;

      if (this.x + this.dx > canvas.width - this.ballRadius || this.x + this.dx < this.ballRadius) {
        this.dx = -this.dx;
        this.se[this.getRandomInterger(this.se.length)].play();
      }

      if (this.y + this.dy > canvas.height - this.ballRadius || this.y + this.dy < this.ballRadius) {
        this.dy = -this.dy;
        this.se[this.getRandomInterger(this.se.length)].play();
      }
    },
    getRandomInterger: function (max) {
      return Math.floor(Math.random() * max);
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
