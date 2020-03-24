<template>
  <div id="app">
    <keep-alive exclude="Home">
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
  @import "assets/css/base.css";
</style>
