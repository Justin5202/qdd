<!-- 登录 组件 -->

<template>
  <div class="resetpsw">
      <top-bar v-if="type == 'login'" txt="找回登录密码" returnShow="true"></top-bar>
      <top-bar v-else txt="找回支付密码" returnShow="true"></top-bar>
      <div class="content">
          <setpsw isRset="true" :type="type"></setpsw>
      </div>
  </div>
</template>

<script>
import TopBar from '@/components/common/top-bar/top-bar'
import Setpsw from '@/components/common/setpsw/setpsw'

export default {
  components: {
    TopBar,
    Setpsw
  },
  data () {
    return {}
  },
  props: {},
  watch: {},
  methods: {},
  filters: {},
  computed: {
    type () {
      return this.$route.params.type
    }
  },
  created () {},
  mounted () {
    mui.back = function() {
      history.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/const.scss';
@import '~@/assets/scss/mixin.scss';
.resetpsw {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    background-color: #f7f7f7;
}

.content {
    height: 10.7rem;
    margin: 1.2rem 0.3rem 0 0.3rem;
    padding: 0.3rem;
    background: #FFFFFF;
    box-shadow: 0 0.02rem 0.04rem 0 rgba(0,0,0,0.18);
    border-radius: 0.1rem;
}
</style>
