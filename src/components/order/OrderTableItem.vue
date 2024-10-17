<template>
  <tr class="table-item" :class="spaceLines" v-if="!isCooked && !isServed">
    <td class="t_num">{{ order.t_num }}</td>
    <td class="time"><div :class="{ 'warning': isDanger }">{{ passedTime }}分経過</div></td>
    <td class="course" v-if="isShowCourse">{{ order.course }}</td>
    <td class="menu">{{ order.menu }}</td>
    <td class="topping" v-if="isShowTopping">{{ order.topping }}</td>
    <td class="number">{{ order.number }}</td>
    <td class="status"><a class="status-button" :class="{'cancel-button': isLoading}, spaceLines" @click="statusChanged()">
        <span v-if="isCreated">調理済にする</span>
        <span v-else-if="isLoading">キャンセル</span>
    </a></td>
  </tr>
</template>

<script>
import { onMounted, watch } from 'vue';
export default {
   name: "TableItem",
   
   props: ['order', 'spaceLines', 'hideTimeAfterCooking', 'isShowCourse', 'isShowTopping', 'isDelayAlert', 'delayAlertTime'],

   setup(props) {

        const setAnimationDulation = (selector, dulation) => {
            const styleSheet = document.styleSheets[0];
            styleSheet.insertRule(selector + " { animation-duration: " + dulation + "s; }", styleSheet.cssRules.length);
        }
        onMounted(async()=>{
            setAnimationDulation(".status-button::before", props.hideTimeAfterCooking);
        });
       
    },

   mounted: function(){
    this.calcDuration()
   },

   data() {
    return {
     passedTime: 0,
    }
   },

   computed: {
    isCreated: function() {
        return this.order.status == "created"
    },

    isLoading: function() {
        return this.order.status == "loading"
    },

    isCooked: function() {
        return this.order.status == "cooked"
    },

    isServed: function() {
        return this.order.status == "served"
    },

    isDanger: function() {
        return this.passedTime >= this.delayAlertTime
    }
   },

   watch: {
    isDanger: function(){
        if(this.isDelayAlert) {
            this.warningSoundPlay('https://www.springin.org/wp-content/uploads/2022/06/%E5%AE%8C%E4%BA%864.mp3')
        }
    },
   },

   methods: {
        statusChanged(){
            if(this.isCreated) {
                this.order.status = "loading"
            } else if(this.isLoading) {
                this.order.status = "created"
            }
            var self = this;
            setTimeout(function() {
                if(self.isLoading) {
                    self.order.status = "cooked"
                    self.updateData(self.order)
                }
            }, 5000)
        },

        calcDuration: function(){
            var now = new Date()
            var orderTime = new Date(this.order.create_time)
            var diffMillSeconds = now.valueOf()-orderTime.valueOf()
            // 小数点以下切り捨て
            var diffMinutes = Math.floor(diffMillSeconds/(60*1000))
            // console.log(diffMinutes)
            this.passedTime = diffMinutes

            var self = this;
            setTimeout(function() {
                self.calcDuration()
            }, 1000)
        },

        async updateData (data){
            const target = JSON.parse(JSON.stringify(data))
            console.log(JSON.stringify(target))
            const URL = 'https://script.google.com/macros/s/AKfycbyRikSnZjOwMyyclNB7mNo28tT_kDMoA2yCFLCWEQ2haGWdzWs9jDihUrXTB2aBBXA/exec'
            const postParam = {
                "method": 'POST',
                "mode": "no-cors",
                headers: {
                'Content-Type': "application/json",
                },
                body: JSON.stringify(target)
            }
            console.log(postParam)
            await fetch(URL,postParam) 
            .then(res => console.log(res))
            .catch(err => console.error("error" + err))
        },

        warningSoundPlay: function(url){
            // オブジェクト生成
            var soundObj = new Audio();
            soundObj.onerror = function() {
                // エラー時の処理
                alert("再生できませんでした");
            }
            // URL設定
            soundObj.src = url;
            // 再生(できないときはエラーに行く)
            soundObj.play();
        },

   },

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
            width: 10%;
            .warning{
                color: red;
            }
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
            width: 15rem;
            &-button{
                display: block;
                width: 80%;
                height: 3rem;
                line-height: 3rem;
                max-height: 3rem;
                margin: 0 auto;
                background-color: #f56e00;
                font-size: 1.2rem;
                font-weight: bold;
                color: #fff;
                border: none;
                border-radius: 5px;
                cursor: pointer;

                &.low {
                    height: 2.5rem;
                    line-height: 2.5rem;
                }

                &.cancel-button{
                    position: relative;
                    background-color: rgb(223, 25, 25);
                    overflow: hidden;
                    & span {
                        position: relative;
                        z-index: 1;
                    }
                }
                &.cancel-button::before{
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    background-color: rgb(156, 16, 1);
                    width: 100%;
                    height: 100%;
                    z-index: 1;
                    transform: translateX(-100%);
                    animation-name: test_box_slide;
                    animation-fill-mode: forwards;
                    animation-timing-function: linear;
                }
                @keyframes test_box_slide {
                    0% {
                        transform: translate(-100%,0)
                    }
                    100% {
                        transform: translate(0,0)
                    }
                }
            }
        }
    }
    
</style>