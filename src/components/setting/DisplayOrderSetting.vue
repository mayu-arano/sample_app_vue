<template>
    <div class="displayOrderArea settingArea">
        <p class="settingItem">注文表示</p>
        <div class="displayOrderTurns section">
            <p class="section-title">並び順</p>
            <select class="section-input displayOrderTurns-input" v-model="selectedOrderTurn" @change="changeDisplayOrderTurn()">
                <option value="oldest">注文が古い順</option>
                <option value="newest">注文が新しい順</option>
            </select>
        </div>
        <div class="spaceLines section">
            <p class="section-title">行間</p>
            <select class="section-input spaceLines-input" v-model="selectedSpaceLines" @change="changeSpaceLines()">
                <option value="low">低</option>
                <option value="medium">中（デフォルト）</option>
                <option value="high">高</option>
            </select>
        </div>
        <div class="hideTimeAfterCooking section">
            <p class="section-title">調理済後<br>非表示時間</p>
            <input class="section-input hideTimeAfterCooking-input" type="text" v-model="hideTimeAfterCooking" placeholder="3" @input="validationHideTimeAfterCooking()" @change="changeHideTimeAfterCooking()">
        </div>
        <div class="showCourseName section">
            <p class="section-title">コース名表示</p>
            <VueToggles 
            :value=isShowCourse
            checkedBg= "rgb(6, 193, 103)"
            uncheckedBg="rgb(200, 206, 214)"
            width="48"
            height="28"
            reverse=true
            @click="changeIsShowCourse()" />
        </div>
        <div class="showTopping section">
            <p class="section-title">トッピング表示</p>
            <VueToggles 
            :value=isShowTopping
            checkedBg= "rgb(6, 193, 103)"
            uncheckedBg="rgb(200, 206, 214)"
            width="48"
            height="28"
            reverse=true
            @click="changeIsShowTopping()" />
        </div>
    </div>
</template>

<script>
import { VueToggles } from "vue-toggles";
import {useToast} from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

const $toast = useToast();

const updateTurnURL = "https://script.google.com/macros/s/AKfycbyQGPZEdsWTTIIae4fEpMQ4m4gbPGKNxHbumE9GWply1vNuaU-WlCHQ057KJjx7YzOi/exec"
const updateSpaceLinesURL = "https://script.google.com/macros/s/AKfycbyWb-WZhIW-Jzg70jlsGApxreVR-T_eBzHTTv80k5MmdzlKKJB4fVvhwDJxbtYWk94/exec"
const updateHideTimeAfterCookingURL = "https://script.google.com/macros/s/AKfycbyHQh2OBCoRO1kSbtb3YbW7ze7FOtEl7xWhnfeFhj4Y8aWzHy7SxmyOke2DuGHOt4_l/exec"
const updateIsShowCourseURL = "https://script.google.com/macros/s/AKfycbxNyDaUhPMooQmUBGTQIikn1FBMV7sPkog22KJftTG6dodaDcpNaG4JmGSL23c6iiY/exec"
const updateIsShowToppingURL = "https://script.google.com/macros/s/AKfycbzrRdGQnnEk5qq_YRIpYYE80DOexIYzX6s8UFqXCuqEUOGYP3viy0sCNaZ5z--xKuA/exec"

export default {
    name: "DisplayOrderSetting",
    components: {
        VueToggles
    },
    props: ['settings'],

    data() {
        return {
            selectedOrderTurn: null,
            selectedSpaceLines: "medium",
            hideTimeAfterCooking: 3,
            isShowCourse: true,
            isShowTopping: true,
            previousHideTimeAfterCooking: 3,
        }
    },

    watch: {
        settings: {
            immediate: true,
            handler(newVal) {
                const regex = /^\d+$/
                if (newVal) {
                    this.selectedOrderTurn = newVal.display_order_turns;
                    this.selectedSpaceLines = newVal.space_lines;
                    if(regex.test(newVal.hide_time_after_cooking)) {
                        this.hideTimeAfterCooking = newVal.hide_time_after_cooking;
                        this.previousHideTimeAfterCooking = newVal.hide_time_after_cooking;
                    }            
                    this.isShowCourse = this.stringToBoolean(newVal.is_show_course);
                    this.isShowTopping = this.stringToBoolean(newVal.is_show_topping);
                }
            }
        },
    },

    methods: {
        async updateData (data, url){
            const target = JSON.parse(JSON.stringify(data))
            const URL = url
            const postParam = {
                "method": 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: target
            }

            try {
                const response = await fetch(URL,postParam) 
                if (!response.ok) {
                    throw new Error("fetchに失敗しました");
                }
                $toast.success('保存しました', { position: 'top-right'});
                return true;
            }catch(err) { 
                console.error("error: " + err);
                $toast.error('エラーが発生しました');
                return false;
            }
        },

        changeDisplayOrderTurn() {
            const postData = `{"display_order_turns": "` + this.selectedOrderTurn + `"}`;
            this.updateData(postData, updateTurnURL);
        },

        changeSpaceLines() {
            const postData = `{"space_lines": "` + this.selectedSpaceLines + `"}`;
            this.updateData(postData, updateSpaceLinesURL);
        },

        changeHideTimeAfterCooking() {
            
            if ( this.hideTimeAfterCooking > 100 ) {
                this.hideTimeAfterCooking = 100;
            }
            const postData = `{"hide_time_after_cooking": "` + this.hideTimeAfterCooking + `"}`;
            this.updateData(postData, updateHideTimeAfterCookingURL).then(result => {
                if (result) {
                    this.previousHideTimeAfterCooking = this.hideTimeAfterCooking
                };
            });
            
        },

        changeIsShowCourse() {
            this.isShowCourse = !this.isShowCourse;
            const postData = `{"is_show_course": ` + this.isShowCourse + `}`;
            this.updateData(postData, updateIsShowCourseURL)
        },

        changeIsShowTopping() {
            this.isShowTopping = !this.isShowTopping;
            const postData = `{"is_show_topping": ` + this.isShowTopping + `}`;
            this.updateData(postData, updateIsShowToppingURL);
        },

        stringToBoolean(str) {
            return str.toLowerCase() === "true" || str === "1";
        },

        validationHideTimeAfterCooking() {
            const regex = /^\d+$/
            if(!regex.test(this.hideTimeAfterCooking)) {
                this.hideTimeAfterCooking = ""
            }
        }
   },
}
</script>

<style lang="scss" scoped>
    .section{
        display: flex;
        width: 300px;
        margin-bottom: 15px;
        line-height: 2.5rem;
        &-title {
            flex-basis: 50%;
        }
        &-input {
            color: rgb(44, 62, 80);
            padding: 5px;
            font-size: 15px;
        }
    }

    .displayOrderTurns {
        margin-top: 10px;
        &-input {
            width: 9rem;
        }
    }

    .spaceLines {
         &-input {
            width: 9rem;
         }
    }

    .hideTimeAfterCooking {
        .section-title {
            line-height: 1.4;
        }
        &-input {
            width: 4rem;
        }
    }
    
</style>