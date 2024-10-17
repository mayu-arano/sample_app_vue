<template>
  <tr class="table-item" :class="spaceLines" v-if="!isCreated">
    <td class="t_num">{{ order.t_num }}</td>
    <td class="time">{{ order.create_time }}</td>
    <td class="course" v-if="isShowCourse">{{ order.course }}</td>
    <td class="menu">{{ order.menu }}</td>
    <td class="topping" v-if="isShowTopping">{{ order.topping }}</td>
    <td class="number">{{ order.number }}</td>
    <td class="status">
        <span v-if="isCooked">調理済</span>
        <span v-else-if="isServed">配膳済</span>
    </td>
  </tr>
</template>

<script>
export default {
   name: "HistoryTableItem",
   props: ['order', 'spaceLines',  'isShowCourse', 'isShowTopping'],
   data() {
    return {
     passedTime: 0,
    }
   },

   computed: {
    isCreated: function() {
        return this.order.status == "created"
    },
    isCooked: function() {
        return this.order.status == "cooked"
    },

    isServed: function() {
        return this.order.status == "served"
    },

    isDanger: function() {
        return this.passedTime >= 10
    }
   }
}
</script>


<style lang="scss" scoped>
    .table-item{
        &.low {
            height: 3rem;
        }
        &.medium {
            height: 4rem;
        }
        &.high {
            height: 5rem;
        }
        border-bottom: 1px solid #ccc;
        text-align: center;
        .t_num{
            width: 12%;
        }
        .time{
            width: 20%;
        }
        .course{
            width: 12%;
        }
        .topping{
            width: 12%;
        }
        .number{
            width: 5%;
        }
        .status{
            width: 8%;
        }
    }
    
</style>