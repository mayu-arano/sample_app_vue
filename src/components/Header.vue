<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="header">
    <div class="header-inner">
      <h1 class="header-title">{{ msg }}</h1>
      <nav class="navigation">
          <RouterLink  active-class="link-active" to="/" class="navigation-item">Order</RouterLink>
          <RouterLink  active-class="link-active" to="/history" class="navigation-item">History</RouterLink>
          <RouterLink  active-class="link-active" to="/setting" class="navigation-item">Setting</RouterLink>
      </nav>
    </div>
  </div>
</template>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.header {
  background-color: #f56e00;
  color: #fff;
  &-inner{
    height: 100px;
    display: flex;
    justify-content: space-between;
    width: 80%;
    margin: 0 auto;

    padding-top: 25px;
    &-title{
      font-weight: bold;
      font-size: 2rem;
    }

    .navigation{
      display: flex;
      justify-content: flex-end;
      font-size: 30px;
      margin-top: 25px;
      &-item{
        background-color: orange;
        display: block;
        width: 190px;
        text-align: center;
        border-radius: 5px 5px 0 0;
        padding-top: 3px;
        margin-right: 8px;

        &.link-active{
          background-color: #fff;
          color: #000;
        }
      }
    }
  }
}


.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
