<template>
    <div class="dataClearArea settingArea">
        <p class="settingItem">データ</p>
        <div class="dataClearAreaContent section">
            <p class="section-title">データクリア</p>
            <button class="dataClearAreaContent-btn">注文データを削除する</button>
        </div>
    </div>
  
</template>

<script>
export default {
    name: "DeleteData",
}
</script>

<style lang="scss" scoped>
    .section{
        display: flex;
        width: 400px;
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

    .dataClearAreaContent {
        margin-top: 10px;
        &-btn{
            cursor: pointer;
            background-color: #fff;
            color: #ff6000;
            border: 1px solid rgb(131, 133, 135);
            border-radius: 3px;
            width: 10rem;
        }
    }
    
</style>