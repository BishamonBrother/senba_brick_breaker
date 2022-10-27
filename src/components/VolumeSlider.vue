<template>
  <div class="volume">
    <img src="@/assets/images/volume.png" width="30" height="30">
    <input type="range" ref="volumeSlider" max="1" min="0" step = "0.01" v-bind:value="volumeValue" v-on:change="onVolumeChange">
  </div>
</template>

<script>
export default {
  name: 'VolumeSlider',
  props: {
    initialVolume: Number
  },

  data() {
    return {
      volumeValue: this.initialVolume
    }
  },

  mounted() {
    /* ローカルストレージからボリュームの値を取得する。 */
    let storageVolume = localStorage.getItem("volumeValue");
    if (this.volumeValue != storageVolume) {
      this.volumeValue = storageVolume;
      this.$emit("vlomeChanged", this.volumeValue);
    }
  },

  methods: {
    onVolumeChange: function () {
      /* リロードしてもボリュームを保持するためローカルストレージに入れる */
      this.volumeValue = this.$refs["volumeSlider"].value;
      localStorage.setItem("volumeValue", this.volumeValue);

      this.$emit("vlomeChanged", this.volumeValue);
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.volume {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  margin-left: 30px;
}
</style>
