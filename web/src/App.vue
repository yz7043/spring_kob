<template>
  <NavBar></NavBar>
  <router-view/>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
export default {
  components: {
    NavBar
  }
}

</script>

<style>
body{
  /* @ means the src directory */
  background-image: url("@/assets/images/background.png");
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
