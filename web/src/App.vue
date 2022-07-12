<template>
  <nav>
    <div>Bot Name: {{bot_name}}</div>
    <div>Bot Rating: {{bot_rating}}</div>
  </nav>
  <router-view/>
</template>

<script>
import $ from 'jquery';
import {ref} from 'vue';
export default {
  name: "App",
  setup: () => {
    let bot_name = ref("");
    let bot_rating = ref("");
    $.ajax({
      url: "http://localhost:3000/battle/getBotInfo/",
      type: "get",
      success: resp => {
        // console.log(resp);
        bot_name.value = resp.name
        bot_rating.value = resp.rating
      }
    }); 
    return {
      bot_name,
      bot_rating
    };
  }
}
</script>

<style>
body{
  background-image: url("@/assets/background.png");
  background-size: cover;
}
</style>
