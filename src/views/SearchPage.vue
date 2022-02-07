<template>
  <div class="ces-search-page">
    <loader-spinner v-if="isLoading"></loader-spinner>
    <form @submit="onSubmit">
      <div class="ces-search-form">
        <search-filter></search-filter>
        <div class="ces-search-form__footer">
          <button class="ces-search-form__button ces-search-form__button_type_reset" @click="reset($event)"></button>
          <button class="ces-search-form__button ces-search-form__button_type_submit"></button>
        </div>
      </div>
    </form>
    <search-results :results="cruises"></search-results>
  </div>
</template>

<script>
import SearchFilter from '../components/SearchFilter.vue'
import SearchResults from '../components/SearchResults.vue'
import LoaderSpinner from '../components/LoaderSpinner.vue'
import {mapState} from 'vuex'
import {mapValues, groupBy, omit} from 'lodash'

export default {
  name: 'SearchPage',
  components: {SearchFilter, SearchResults, LoaderSpinner},

  watch: {
    $route: 'fetchData'
  },

  created() {
    this.$store.commit('form/RESET_STATE', this.$route.query)
  },

  computed: {
    ...mapState({
      params: state => state.form,
      results: state => state.cruises.results,
      isLoading: state => state.main.isLoading,
      showResults: state => state.settings.showResults
    }),

    cruises() {
      return mapValues(
        groupBy(this.results, 'grouping'),
        list => list.map(cruise => omit(cruise, 'grouping'))
      )
    }
  },

  methods: {
    fetchData() {
      this.$store.commit('main/SET_LOADING', true)
      this.$store.dispatch('cruises/SET_RESULTS', this.params)
        .then(() => this.$store.commit('main/SET_LOADING', false))
    },

    reset(event) {
      event.preventDefault()
      this.$store.commit('form/DEFAULT_STATE')
      this.$store.commit('cruises/SET_RESULTS', [])
      this.$store.commit('cruises/SET_LOADED', false)
    },

    onSubmit(event) {
      event.preventDefault()
      this.$router.push({query: this.params})
        .catch(() => false)
    }
  }
}
</script>

<style lang="scss">
.ces-search-form {
  background-color: #e1ebf3;
  padding: 8px;
  min-width: 320px;
  display: block;

  &__footer {
    border-top: 1px solid #cfdfec;
    padding: 8px 0 0;
  }

  &__button {
    display: inline-block;
    background-color: rgba(0, 0, 0, .25);
    border: 0;
    color: #fff;
    padding: 4px 8px;
    font-weight: 700;
    font-size: 14px;
    line-height: 18px;
    width: 185px;
    cursor: pointer;
    transition: opacity .5s ease;
    will-change: opacity;
    margin: 8px;
    text-align: center;

    &_type {
      &_reset {
        &:before {
          content: 'Сбросить'
        }
      }

      &_submit {
        &:before {
          content: 'Подобрать'
        }
      }
    }

    &:hover {
      opacity: 1
    }
  }
}

.lingallery {
  &_thumbnails {
    img {
      width: 64px;
      height: 64px;
      object-fit: cover;
    }
  }
}
</style>