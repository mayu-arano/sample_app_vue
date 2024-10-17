<script setup>
import HistoryTable from '../components/history/HistoryTable.vue'
import SearchArea from '../components/history/SearchArea.vue'
</script>
<template>
  <SearchArea v-on:searchAction="recieveSearchParams"/>
  <HistoryTable v-bind:searchParams="searchParams"/>
</template>

<script>
export default {
  name: "HistoryVue",
  components: {
      SearchArea,
      HistoryTable
  },

  data() {
    return {
        searchParams: {
            searchTableName: "",
            searchDate: null,
            searchTime: null,
            searchCookedData: false,
            searchServedData: false,
            searchAllStatusData: true
        },
    }
  },

  methods: {
    recieveSearchParams(recievedSearchParams) {
        console.log("fire!")
        this.searchParams = recievedSearchParams;
    }
  }
}
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
