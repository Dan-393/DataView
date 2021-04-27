// 针对SellerPage路径显示

// 在这个组件中 --子组件Seller.vue
<template>
  <div class = 'com-page'> 
    <sell/>
  </div>
</template>

<script>
import Seller from '../components/Seller'
export default {
  name:'SellerPage',
  components:{
    // 标签名
    sell:Seller,
  }
}

</script>
<style lang='less' scoped>
</style>