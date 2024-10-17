<template>
  <div class="search">
    <div class="search-table-id">
        <dt class="search-item">テーブル番号</dt>
        <dd><input class="search-input" v-model="tableName"></dd>
    </div>
    <div class="search-date">
        <dt class="search-item">注文日時</dt>
        <dd class="search-input">
            <Datepicker class="date-picker"
            :value = defaultValue
            format="yyyy-MM-dd"
            iconWidth="0"
            iconHeight="0"
            @selected="selectedDateEvent"
            :class="{selected: isSelected}"
            >
            </Datepicker>
            <select class="search-date-time" v-model="selectedTime">
                <option v-for="hour in hourList">{{ hour }}</option>
            </select>
        </dd>
    </div>
    <div class="search-status">
        <div class="check-cooked check-item"><input class="checkbox" type="checkbox" v-model="isCooked"><lable class="label">調理済</lable></div>
        <div class="check-served check-item"><input class="checkbox" type="checkbox" v-model="isServed"><lable class="label">配膳済</lable></div>
    </div>
    <div class="search-buttons">
        <button class="button clear-button" @click="clearSearchHandler()">クリア</button>
        <button class="button search-button" @click="searchHandler()">検索</button>
    </div>
  </div>
</template>

<script>
import Datepicker from 'vuejs3-datepicker';
import { ref } from 'vue';
import moment from "moment";

export default {
    name: "SearchArea",
    components: {
        Datepicker
    },
    setup(){
      const defaultValue = ref(new Date())
      return {
        defaultValue
      }
    },

    data() {
      return {
        selectedTime: "すべて",
        hourList: [],
        selectedDate: null,
        isSelected: false,
        isCooked: false,
        isServed: false,
        searchPalams: {
            searchTableName: "",
            searchDate: null,
            searchTime: null,
            searchCookedData: false,
            searchServedData: false,
            searchAllStatusData: true
        }
      }
    },

    created() {
        this.getHourList();
    },

    methods: {
        getHourList(){
            for(let i = 0; i<24; i++){
                this.hourList.push(this.zeroFill(i, 2)+"時台");
            }
            this.hourList.push("すべて");
        },

        zeroFill(number, width){
            width -= number.toString().length;
            if (width > 0){
                return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
            }
            return number + "";
        },

        getSelectedDate(payload) {
            this.selectedDate=moment(payload).format("YYYY-MM-DD").toString()
        },

        selectedDateEvent(payload){
            this.getSelectedDate(payload)
            this.isSelected = true;
        },

        getSearchParams() {
            this.searchPalams.searchTableName = this.tableName
            this.searchPalams.searchDate = this.selectedDate
            this.searchPalams.searchTime = this.selectedTime
            this.searchPalams.searchCookedData = this.isCooked
            this.searchPalams.searchServedData = this.isServed
            this.searchPalams.searchAllStatusData = !(this.isCooked||this.isServed)
        },

        clearSearchParams() {
            this.tableName = ""
            this.selectedDate = null
            this.selectedTime = "すべて"
            this.isCooked = false
            this.isServed = false
            this.isSelected = false;
            this.getSearchParams()
        },

        async searchHandler() {
            await this.getSearchParams()
            await this.$emit("searchAction", this.searchPalams);
        },

        async clearSearchHandler() {
            await this.clearSearchParams()
            await this.$emit("searchAction", this.searchPalams);
        }
    }
}
</script>

<style lang="scss">
* {
    box-sizing: border-box;
}
.search{
    display: flex;
    width: 85%;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
    margin-top: 20px;
    &-input{
        display: block;
        height: 3rem;
        border: solid 1px rgb(118, 118, 118);
        border-radius: 5px;
        color: rgb(44, 62, 80);
    }
    &-item{
        display: block;
        margin-right: 1rem;
    }

    &-table-id{
        display: flex;
        align-items: center;
        .search-input {
            width: 10rem;
            padding: 8px;
        }
    }
    &-date{
        display: flex;
        align-items: center;
        .search-input{
            display: flex;
            .date-picker{
                width: 8rem;
                &.vuejs3-datepicker #calendar-div{
                    .vuejs3-datepicker__icon{
                        display: none;
                    }
                    .vuejs3-datepicker__value{
                        min-width: 100%;
                        line-height: calc(3rem - 2px);
                        padding: 0 8px;
                        display: block;
                        border-radius: 5px 0 0 5px;
                        border: 0;
                        border-right: 1px solid rgb(118, 118, 118);
                        color: rgb(164, 164, 164);
                    }
                }

                &.selected.vuejs3-datepicker #calendar-div .vuejs3-datepicker__value{
                    color: rgb(44, 62, 80);
                }
            }
            .search-date-time{
                display: block;
                height: 100%;
                padding: 0 8px;
                border: 0;
                border-radius: 0 5px 5px 0;
                option{
                    padding: 0;
                }
                &:focus {
                    outline: none;
                }
            }
        }
    }
    &-status{
        display: flex;
        align-items: center;
        .check-served{
            margin-left: 10px;
        }
        .check-item {
            .checkbox{
                display: inline-block;
                vertical-align: middle;
                width: 18px;
                height: 18px;
            }
            .label{
                display: inline-block;
                vertical-align: middle;
                margin-left: 10px;
            }
        }
    }
    &-buttons{
        .button{
            width: 7rem;
            height: 3rem;
            border-radius: 7px;
            font-size: 1rem;
            cursor: pointer;
        }

        .clear-button{
            background-color: #fff;
            border: solid 1px #666;
            margin-right: 1rem;
            &:hover {
                background-color: rgb(63, 60, 59);
                color: #fff;
                font-weight: bold;
            }
        }

        .search-button{
            background-color: #f56e00;
            color: #fff;
            border: none;
            font-weight: bold;

            &:hover {
                opacity: 0.7;
            }
        }

    }
}
    
</style>