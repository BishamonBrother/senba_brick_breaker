<template>
  <div class="volumeSlider">
    <VolumeSlider v-bind:initialVolume="0.3" @vlomeChanged="onVolumeChanged"/>
  </div>
</template>

<script>
import VolumeSlider from "./VolumeSlider.vue"

export default {
  name: 'GameSetting',

  components: {
    VolumeSlider
  },

  data () {
    return {
      initialVolume: 0.3,
      sounds: [
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
    }
  },

  mounted() {
    
  },

  methods: {
    onVolumeChanged: function (volume) {
      this.sounds.forEach(s => s.volume = volume);
      this.sounds[this.getRandomInterger(this.sounds.length)].play();
    },

    getRandomInterger: function (max) {
      return Math.floor(Math.random() * max);
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
