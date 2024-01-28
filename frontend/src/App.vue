<template>
  <div>
    <div class="toolbar">
      <span>   OpenDDS Web Integration Service</span>
    </div>
    <div id="app">
      <dds/> <!--app.vue에서 바로 dds.vue를 보여주도록 함-->
    </div>
  </div>
</template>

<script>
import dds from './components/dds.vue'

export default {
	name: 'app',
	components: {
		dds
	}
}
</script>

<style>
.toolbar {
	background-color: #808080;
	color: #ffffff;
	font-weight: bold;
	font-size: 22px;
	height: 30px;
}
</style>