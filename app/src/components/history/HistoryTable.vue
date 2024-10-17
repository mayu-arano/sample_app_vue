<template>
  <table class="history-table">
    <tbody>
        <tr class="history-table-header">
            <th>
                テーブル・番号
            </th>
            <th>
                <a class="created-time-btn" :class="displayOrderTurns" @click="changeDisplayOrderTurns()">
                    注文日時
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
        <HistoryTableItem v-for="order in orders" :order="order" 
                    :spaceLines = "spaceLines"
                    :isShowCourse="isShowCourse"
                    :isShowTopping="isShowTopping"></HistoryTableItem>
    </tbody>
  </table>
</template>

<script>
import HistoryTableItem from './HistoryTableItem.vue';
import axios from 'axios';
import {ref, onMounted, watch, toRefs} from 'vue';
const orders = ref();
const sortedOrders = ref();
const displayOrderTurns = ref('oldest');
const spaceLines = ref('medium');
const isShowCourse = ref(true); 
const isShowTopping = ref(true);
export default {
    name: "HistoryTable",
    components: {
        HistoryTableItem
    },

    props: {
        searchParams: {
            required: false,
            type: Object,
        },
    },

    setup(props) {
        let baseOrders = [];
        const stringToBoolean = (str)=> {
            return str.toLowerCase() === "true" || str === "1";
        }

        const getOrderData = async ()=>{
            const res = await axios.get('https://sheets.googleapis.com/v4/spreadsheets/1IU5KIsjYWXrvZY8AugFYLQQow2wSCWIn5g3MaTBpc0U/values/OrderTable?key=AIzaSyAc1nR2J4crJMeNvgCGHlknH3Zj7Ue6PKw')
            const { data } = res
            orders.value = formatData({data})
            baseOrders = orders.value
        }

        const getSettingData = async ()=>{
            const res = await axios.get('https://sheets.googleapis.com/v4/spreadsheets/1IU5KIsjYWXrvZY8AugFYLQQow2wSCWIn5g3MaTBpc0U/values/SettingTable?key=AIzaSyAc1nR2J4crJMeNvgCGHlknH3Zj7Ue6PKw')
            const { data } = res
            const formatted_data = await formatData({data})
            const settings = JSON.parse(JSON.stringify(formatted_data[0], null, 2))
            displayOrderTurns.value = settings.display_order_turns;
            spaceLines.value = settings.space_lines;
            isShowCourse.value = stringToBoolean(settings.is_show_course);
            isShowTopping.value = stringToBoolean(settings.is_show_topping);
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

        const { searchParams } = toRefs(props);

        const searchOrder = (params) => {
          let machedOrder = baseOrders.map(order => JSON.parse(JSON.stringify(order, null, 2)));
          if(typeof params.searchTableName === 'string' && params.searchTableName != "") {
            console.log(params.searchTableName)
              machedOrder = searchTableName(machedOrder, params.searchTableName)
          }
          if(params.searchDate) {
              machedOrder = searchDate(machedOrder, params.searchDate)
          }

          if(params.searchTime != "すべて") {
              console.log(params.searchTime)
              let hour = params.searchTime.replace("時台", "")
              hour = parseInt(hour, 10)
              machedOrder = searchTime(machedOrder, hour)
          }

          if(!params.searchAllStatusData) {
              if(params.searchCookedData) {
                  machedOrder = searchStatus(machedOrder, 'cooked')
              }
              if(params.searchServedData) {
                  machedOrder = searchStatus(machedOrder, 'served')
              }
          }
          orders.value = machedOrder
        }

        const searchTableName = (baseOrders, tableName) => {
            return baseOrders.filter(order => {
                return order.t_num === tableName})
        }

        const searchDate = (baseOrders, date) => {
            return baseOrders.filter(order => { 
                const orderDate = new Date(order.create_time)
                const year = orderDate.getFullYear(); // 年
                const month = zeroFill(orderDate.getMonth() + 1, 2); // 月 (0-indexedなので+1する)
                const day = orderDate.getDate(); 
                return `${year}-${month}-${day}` === date
            })
        }

        const searchTime = (baseOrders, hour) => {
            return baseOrders.filter(order => {
                return new Date(order.create_time).getHours() === hour
            })
        }

        const searchStatus = (baseOrders, status) => {
            return baseOrders.filter(order => {
                return order.status === status
            })
        }

        const zeroFill = (number, width) => {
            width -= number.toString().length;
            if (width > 0){
                return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
            }
            return number + "";
        }

        watch(searchParams, (newValue, oldValue) => {
            const params = JSON.parse(JSON.stringify(newValue, null, 2));
            console.log(params)
            console.log(params.searchAllStatusData)
            searchOrder(params)
            
        },
        { deep: true })

        return {
            orders,
            displayOrderTurns,
            spaceLines,
            isShowCourse,
            isShowTopping,
            changeDisplayOrderTurns
        };
    },


}
</script>

<style lang="scss" scoped>
    .history-table{
        width: 85%;
        margin: 0 auto;
        margin-top: 30px;
        border-collapse: collapse;
        &-header th{
            height: 50px;
            border-bottom: 1px solid rgb(128, 128, 128);
            font-weight: normal;

            .created-time-btn {
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
                    right: 0;
                    left: 90px;
                    margin: 0 auto;
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
                    right: 0;
                    left: 90px;
                    margin: 0 auto;
                    border-bottom: 2px solid;
                    border-right: 2px solid;
                    transform: rotate(-135deg);
                }
            }
        }
    }
</style>