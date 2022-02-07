<template>
  <div class="ces-search-results">
    <div v-if="loaded && Object.keys(results).length">
      <div class="ces-search-results__title"></div>
      <div class="ces-search-results__container">
        <cruise-card v-for="(cruise, key) in results" :key="key" :cruise="cruise"></cruise-card>
      </div>
    </div>
    <div class="ces-search-results__title ces-search-results__title_not-found"
         v-if="loaded && !Object.keys(results).length">
    </div>
  </div>
</template>

<script>
import CruiseCard from './CruiseCard.vue'
import {mapState} from 'vuex'

export default {
  name: 'SearchResults',
  components: {CruiseCard},
  props: ['results'],
  computed: {
    ...mapState({
      loaded: state => state.cruises.loaded
    })
  }
}
</script>

<style lang="scss">
.ces-search-results {
  &__title {
    margin: 4px 0;
    font-weight: 400;
    font-size: 24px;
    line-height: 36px;
    color: #000;
    text-transform: uppercase;
    letter-spacing: 2.5px;
    padding: 16px 0;

    &:before {
      content: 'Результаты поиска'
    }

    &_not-found {
      &:before {
        content: 'По вашему запросу ничего не найдено'
      }
    }
  }
}
</style>