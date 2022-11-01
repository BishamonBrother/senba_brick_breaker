<template>
  <div>
    <div class="title">
      <img src="@/assets/images/title.png"/>
    </div>
    <div class="start">
      <img src="@/assets/images/i-so-kun.png" width="50" height="50" v-bind:class="[isStartMouseOver ? 'active' : 'nonactive']"/>
      <img src="@/assets/images/start.png" v-on:mouseover="onStartMouseOver" v-on:mouseleave="onStartMouseLeave" v-on:click="onStartClick"/>
    </div>
    <div class="setting">
      <img src="@/assets/images/i-so-kun.png" width="50" height="50" v-bind:class="[isSettingMouseOver ? 'active' : 'nonactive']"/>
      <img src="@/assets/images/setting.png" v-on:mouseover="onSettingMouseOver" v-on:mouseleave="onSettingMouseLeave" v-on:click="onSettingClick"/>
    </div>
    <div class="information">
      <img src="@/assets/images/i-so-kun.png" width="50" height="50" v-bind:class="[isInfoMouseOver ? 'active' : 'nonactive']"/>
      <img src="@/assets/images/information.png" v-on:mouseover="onInfoMouseOver" v-on:mouseleave="onInfoMouseLeave" v-on:click="onInfoClick"/>
    </div>
  </div>
</template>

<script>
import router from '../router/index'

export default {
  name: 'StartMenu',

  data () {
    return {
      startSe: new Audio(require('@/assets/sounds/SE_START.wav')),
      isStartMouseOver: false,
      isInfoMouseOver: false,
      isSettingMouseOver: false,
    }
  },

  mounted() {
    this.startSe.onended = function () {
      router.push("/bb");
    }

    let storageVolume = localStorage.getItem("volumeValue");
    if (storageVolume === null) {
      storageVolume = 0.3;
    }
    this.startSe.volume = storageVolume;
  },

  methods: {
    onStartMouseOver: function () {
      this.isStartMouseOver = true;
    },
    onStartMouseLeave: function () {
      this.isStartMouseOver = false;
    },
    onInfoMouseOver: function () {
      this.isInfoMouseOver = true;
    },
    onInfoMouseLeave: function () {
      this.isInfoMouseOver = false;
    },
    onSettingMouseOver: function () {
      this.isSettingMouseOver = true;
    },
    onSettingMouseLeave: function () {
      this.isSettingMouseOver = false;
    },
    onInfoClick: function () {
      console.log("onclick");
    },
    onStartClick: function () {
      this.startSe.play();
    },
    onSettingClick: function () {
      router.push("/setting");
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
img {
  width: 30;
  height: 30;
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
.setting {
  display: flex;
  justify-content: center;
  align-items:center;
  gap: 10px;
  font-size: 20px;
}
</style>
