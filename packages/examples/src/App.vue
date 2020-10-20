<template>
  <basic-layout>
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </basic-layout>
</template>

<script>
import BasicLayout from './layouts/BasicLayout'

export default {
  name: 'App',
  components: {
    'basic-layout': BasicLayout
  }
}
</script>
