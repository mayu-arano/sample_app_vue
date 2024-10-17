<template>
    <div class="orderNotificationArea settingArea">
        <p class="settingItem">遅延アラート</p>
        <div class="delayAlertTime section">
            <p class="section-title">経過時間</p>
            <input class="section-input delayAlertTime-input" type="text" v-model="delayAlertTime" placeholder="1" @input="validationDelayAlertTime()" @change="changeDelayAlertTime()">
        </div>
        <div class="isDelayAlert section">    
            <p class="section-title">通知音</p>
            <VueToggles 
            :value=isDelayAlert
            checkedBg= "rgb(6, 193, 103)"
            uncheckedBg="rgb(200, 206, 214)"
            width="48"
            height="28"
            reverse=true
            @click="changeIsDelayAlert()"
            />
        </div>
    </div>
  
</template>

<script>
import { VueToggles } from "vue-toggles";
import {useToast} from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

const $toast = useToast();

const updateIsDelayAlertURL = "https://script.google.com/macros/s/AKfycbztJyx73oHsM9BmNteoICDx_39emYFOdU9TL4beGdhTZ0Y262ZfJ15zHFazMvHcdyI/exec"
const updateDelayAlertTimeURL = "https://script.google.com/macros/s/AKfycbzqzi4mrKvJ79eRgJB9Wbfce0pC_uyAjczMN2i3c-76ah9mZ7vyUmX2VXqD1UgVXAo/exec"

export default {
    name: "OrderNotificationSetting",
    components: {
        VueToggles
    },

    props: ['settings'],

    data() {
        return {
            delayAlertTime: 1,
            previousDelayAlertTime: 1,
            isDelayAlert: true,
        }
    },

    watch: {
        settings: {
            immediate: true,
            handler(newVal) {
                const regex = /^\d+$/
                if (newVal) {
                    if(regex.test(newVal.delay_alert_time)) {
                        this.delayAlertTime = newVal.delay_alert_time;
                        this.previousDelayAlertTime = newVal.delay_alert_time;
                    }            
                    this.isDelayAlert = this.stringToBoolean(newVal.is_delay_alert);
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

        changeDelayAlertTime() {
            const regex = /^\d+$/;
            if(!regex.test(this.delayAlertTime)) {
                this.delayAlertTime = this.previousDelayAlertTime;
                return
            }
            if ( this.delayAlertTime > 60 ) {
                this.delayAlertTime = 60;
            }
            const postData = `{"delay_alert_time": "` + this.delayAlertTime + `"}`;
            this.updateData(postData, updateDelayAlertTimeURL).then(result => {
                if (result) {
                    this.previousDelayAlertTime = this.delayAlertTime
                };
            });
            
        },

        changeIsDelayAlert() {
            this.isDelayAlert = !this.isDelayAlert;
            const postData = `{"is_delay_alert": "` + this.isDelayAlert + `"}`;
            this.updateData(postData, updateIsDelayAlertURL)
        },

        validationDelayAlertTime() {
            const regex = /^\d+$/
            if(!regex.test(this.delayAlertTime)) {
                this.delayAlertTime = ""
            }
        },

        stringToBoolean(str) {
            return str.toLowerCase() === "true" || str === "1";
        },
    }
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

    .delayAlertTime{
        margin-top: 10px;
        &-input {
            width: 4rem;
        }
    }
    
</style>