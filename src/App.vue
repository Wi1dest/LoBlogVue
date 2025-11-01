<template>
  <div id="app">
    <router-view/>
    <pwa-update-popup />
  </div>
</template>

<script>
import PwaUpdatePopup from './components/common/PwaUpdatePopup.vue'

export default {
  components: {
    PwaUpdatePopup
  },
  
  data() {
    return {}
  },

  computed: {},

  watch: {},

  created() {

  },

  mounted() {

  },

  methods: {}
}
</script>

<style scoped>

</style>
