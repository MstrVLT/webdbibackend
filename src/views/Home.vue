<template>
  <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="container">
        <button class="button is-link is-fullwidth" @click="connect">
          Connect Switch
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import { dbi } from './../dbi.js'

export default {
  name: "Home",
  methods: {
    connect: function() {
      // let self = this
      let _dbi = new dbi();
      _dbi.connect()
      // .then(function() {
      //
      //   self.$router.push({ name: "filelist" });
      // });
    }
  }
};
</script>
