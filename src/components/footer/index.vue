<template>
  <div class="footer">
    <a class="foot-link" @click="goHome">ENOTAMS</a>
    <div class="divider"></div>
    <a href="/">{{ $t('setting.foot.title') }}</a>
    <!-- 还未开源 先注释掉 -->
    <div class="divider"></div>
    <a href="https://baike.baidu.com/item/%E4%B8%AD%E5%9B%BD%E6%B0%91%E7%94%A8%E8%88%AA%E7%A9%BA%E4%B8%AD%E5%8D%97%E5%9C%B0%E5%8C%BA%E7%AE%A1%E7%90%86%E5%B1%80/2119643?fr=ge_ala">
      <img src="@/assets/images/atclogo.png" alt="github" />
    </a>
  </div>
</template>

<script lang="ts" setup>
import router from '@/router';

function goHome() {
  router.push({ name: 'Work' });
}
</script>

<style lang="less" scoped>
.footer {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ti-default-font-color);
  font-size: var(--ti-default-font-size);
  font-family: var(--ti-default-font-family);
  text-align: center;

  .divider {
    width: 2px;
    height: 18px;
    margin: 0 10px;
    margin-top: 1px;
    background: #7b7e84;
    opacity: 0.3;
  }

  .foot-link {
    color: #8a8e99;
    text-decoration: none;
  }

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8a8e99;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    text-decoration: none;

    img {
      width: 18px;
      height: 19px;
    }
  }
}
</style>
