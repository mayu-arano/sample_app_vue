<script setup>
import axios from 'axios';
import {ref,onMounted} from 'vue';
const settings = ref();
const getSettingData = async ()=>{
    const res = await axios.get('https://sheets.googleapis.com/v4/spreadsheets/1IU5KIsjYWXrvZY8AugFYLQQow2wSCWIn5g3MaTBpc0U/values/SettingTable?key=AIzaSyAc1nR2J4crJMeNvgCGHlknH3Zj7Ue6PKw')
    const { data } = res
    const formatted_data = formatData({data})
    settings.value = JSON.parse(JSON.stringify(formatted_data[0], null, 2))
}
onMounted(async()=>{
    await getSettingData();
})

const formatData = ({data}) => {
  const keys = data.values[0];
  const _data = data.values.slice(1);
  const obj = _data.map(arr => Object.assign({}, ...keys.map((k, i) => ({ [k]: arr[i] }))));
  return obj
}
</script>
<template>
  <div class="settings">
    <DisplayOrderSetting :settings="settings"/>
    <OrderNotificationSetting :settings="settings" />
    <DeleteData />
  </div>
</template>
<script>
import DisplayOrderSetting from '../components/setting/DisplayOrderSetting.vue'
import OrderNotificationSetting from '../components/setting/OrderNotificationSetting.vue'
import DeleteData from '../components/setting/DeleteData.vue'

export default {
  name: "SettingVue",
  components: {
    DisplayOrderSetting,
    OrderNotificationSetting,
    DeleteData
  }
}
</script>

<style lang="scss">
.settings {
  width: 80%;
  margin: 3rem auto;
  .settingArea {
    margin-bottom: 20px;
    .settingItem{
      font-weight: bold;
      font-size: 1.5rem;
    }
  }
  
}

</style>
