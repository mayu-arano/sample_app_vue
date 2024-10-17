<script setup>
    import OrderTableItem from './OrderTableItem.vue';
    import axios from 'axios';
    import {ref,onMounted, watch} from 'vue';
    const orders = ref();
    const sortedOrders = ref();
    const displayOrderTurns = ref('oldest');
    const spaceLines = ref('medium');
    const hideTimeAfterCooking = ref(3);
    const isShowCourse = ref(true); 
    const isShowTopping = ref(true);
    const isDelayAlert = ref(true);
    const delayAlertTime = ref(3);

    const getOrderData = async ()=>{
        const res = await axios.get('https://sheets.googleapis.com/v4/spreadsheets/1IU5KIsjYWXrvZY8AugFYLQQow2wSCWIn5g3MaTBpc0U/values/OrderTable?key=AIzaSyAc1nR2J4crJMeNvgCGHlknH3Zj7Ue6PKw')
        const { data } = res
        orders.value = formatData({data})
    }

    const stringToBoolean = (str)=> {
        return str.toLowerCase() === "true" || str === "1";
    }

    const getSettingData = async ()=>{
        const res = await axios.get('https://sheets.googleapis.com/v4/spreadsheets/1IU5KIsjYWXrvZY8AugFYLQQow2wSCWIn5g3MaTBpc0U/values/SettingTable?key=AIzaSyAc1nR2J4crJMeNvgCGHlknH3Zj7Ue6PKw')
        const { data } = res
        const formatted_data = await formatData({data})
        const settings = JSON.parse(JSON.stringify(formatted_data[0], null, 2))
        displayOrderTurns.value = settings.display_order_turns;
        spaceLines.value = settings.space_lines;
        hideTimeAfterCooking.value = parseInt(settings.hide_time_after_cooking);
        isShowCourse.value = stringToBoolean(settings.is_show_course);
        isShowTopping.value = stringToBoolean(settings.is_show_topping);
        isDelayAlert.value = stringToBoolean(settings.is_delay_alert);
        delayAlertTime.value = parseInt(settings.delay_alert_time);
    }


    const formatData = ({data}) => {
        const keys = data.values[0];
        const _data = data.values.slice(1);
        const obj = _data.map(arr => Object.assign({}, ...keys.map((k, i) => ({ [k]: arr[i] }))));
        return obj
    }


    const sortOrder = (orderList, mode) => {
        if (mode == "newest") {
            sortedOrders.value =  orderList.sort((a, b) => descTimeSort(new Date(a.create_time), new Date(b.create_time)))
            return
        }
        sortedOrders.value = orderList.sort((a, b) => ascTimeSort(new Date(a.create_time), new Date(b.create_time)))
    }

    const descTimeSort = (a, b) => {
        return a < b ? 1 : -1;
    }

    const ascTimeSort = (a, b) => {
        return a > b ? 1 : -1;
    }

    const changeDisplayOrderTurns = () => {
        switch ( displayOrderTurns.value ) {
            case 'oldest':
                displayOrderTurns.value = 'newest'
                console.log(displayOrderTurns.value)
                break
            case 'newest':
                displayOrderTurns.value = 'oldest'
                console.log(displayOrderTurns.value)
                break
        }
    }

    onMounted(async()=>{
        await getOrderData();
        await getSettingData();
        await sortOrder(orders.value, displayOrderTurns.value);
    })

    watch(displayOrderTurns, (newValue) => {
        sortOrder(orders.value, newValue)        
    })
</script>


<template>
  <table class="order-table">
    <tbody>
        <tr class="order-table-header">
            <th>
                テーブル・番号
            </th>
            <th>
                <a class="passed-time-btn" :class="displayOrderTurns" @click="changeDisplayOrderTurns()">
                    経過時間
                </a>
            </th>
            <th v-if="isShowCourse">
                コース
            </th>
            <th>
                メニュー
            </th>
            <th v-if="isShowTopping">
                トッピング
            </th>
            <th>
                数量
            </th>
            <th>
                状態
            </th>
        </tr>
        <OrderTableItem v-for="order in sortedOrders" :order="order" 
                    :spaceLines = "spaceLines"
                    :hideTimeAfterCooking = "hideTimeAfterCooking"
                    :isShowCourse="isShowCourse"
                    :isShowTopping="isShowTopping"
                    :isDelayAlert = "isDelayAlert"
                    :delayAlertTime = "delayAlertTime"></OrderTableItem>
    </tbody>
  </table>
</template>

<script>
export default {
    name: "OrderTable",
    components: {
        OrderTableItem
    },
}
</script>

<style lang="scss" scoped>
    .order-table{
        width: 85%;
        margin: 0 auto;
        margin-top: 30px;
        border-collapse: collapse;
        &-header th{
            height: 50px;
            border-bottom: 1px solid rgb(128, 128, 128);
            .passed-time-btn {
                display: block;
                cursor: pointer;
                position: relative;
                &.oldest:after {
                    content: "";
                    display: block;
                    width: 10px;
                    height: 10px;
                    position: absolute;
                    top: 5px;
                    right: 0px;
                    border-bottom: 2px solid;
                    border-right: 2px solid;
                    transform: rotate(45deg);
                }

                &.newest:after {
                    content: "";
                    display: block;
                    width: 10px;
                    height: 10px;
                    position: absolute;
                    top: 10px;
                    right: 0px;
                    border-bottom: 2px solid;
                    border-right: 2px solid;
                    transform: rotate(-135deg);
                }
            }
        }
    }
</style>