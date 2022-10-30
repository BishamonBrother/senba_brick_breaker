<template>
  <div>
    <div class="title">
      <img src="@/assets/images/title.png"/>
    </div>
    <div class="start">
      <img src="@/assets/images/i-so-kun.png" width="50" height="50" v-bind:class="[startSelected ? 'active' : 'nonactive']"/>
      <img src="@/assets/images/start.png"/>
      <!-- <p>スタート</p> -->
      <!-- <p>Press Enter Noja!</p> -->
    </div>
    <div class="information">
      <img src="@/assets/images/i-so-kun.png" width="50" height="50" v-bind:class="[infoSelected ? 'active' : 'nonactive']"/>
      <img src="@/assets/images/information.png"/>
      <!-- <p>インフォメーション</p> -->
    </div>
    <p>上下カーソルキーとEnterキーで選択なのじゃ！</p>
  </div>
</template>

<script>
export default {
  name: 'StartMenu',

  data () {
    return {
      startSelected: true,
      infoSelected: false,
    }
  },

  mounted() {
    document.addEventListener('keydown', this.onKeyDown);
  },

  methods: {
    onKeyDown: function (e) {
      if (e.key === "Up" || e.key === "ArrowUp") {
        this.startSelected = !this.startSelected;
        this.infoSelected = !this.infoSelected;
      } else if (e.key === "Down" || e.key === "ArrowDown") {
        this.startSelected = !this.startSelected;
        this.infoSelected = !this.infoSelected;
      } else if (e.key === "Enter") {
        // this.playing = true;
      }
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
img {
  width: 30;
  height: 30;
}
p {
  color: black;
}
.active {
  visibility: visible;
}
.nonactive {
  visibility: hidden;
}
.start {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  font-size: 20px;
}
.information {
  display: flex;
  justify-content: center;
  align-items:center;
  gap: 10px;
  font-size: 20px;
}
</style>
