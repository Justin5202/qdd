<!-- 登录 组件 -->

<template>
  <div class="register">
      <top-bar txt="注册" returnShow="true"></top-bar>
      <div class="content">
          <setpsw isReg="true"></setpsw>
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
  computed: {},
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
.register {
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
