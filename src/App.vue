<template>
  <div id="app">
    <router-view></router-view>
  </div>
  <!--  <div id="app">-->
  <!--    <div id="nav">-->
  <!--      <router-link to="/">Home</router-link> |-->
  <!--      <router-link to="/about">About</router-link>-->
  <!--    </div>-->
  <!--    <router-view/>-->
  <!--  </div>-->
</template>

<script>
export default {
  name: "HelloWorld",
  data: function() {
    return {
      count: 0
    };
  },
  methods: {
  }
};
</script>

<style>
@import "./assets/bulma.min.css";
</style>
