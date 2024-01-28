<template>
	<div calss="table">
		<h3> Data Table </h3>
		<table>
			<thead>
				<th v-for = "item in header" :key="item">{{item}}</th>
			</thead>
			<tbody>
				<tr v-for = "line in dataArr" :key="line">
					<td v-for = "item in line" :key="item">{{item}}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
export default {
	name: 'dds',
	created(){
		this.$socket.on('openDDSDataEmit', (data)=>{
			this.dataArr = {
				...data
			}
		})
	},
	data() {
		return {
			dataArr: [], //데이터 정의
			header: ["topicCount", "decription", "name", "UnitSymbol"]
		}
	},
}

</script>

<style>
.table{
	border: 1px solid #444444;
	border-collapse: collapse;
}
th{
	background-color: rgb(199, 223, 231);
	border-bottom: 1px solid #444444;
	padding: 10px
}
td{
	border-bottom: 1px solid #444444;
	padding: 10px
}
</style>