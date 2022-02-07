import {mapState} from 'vuex'

export default {
  computed: {
    ...mapState({
      cabin: state => state.cruises.ship
    }),
  },

  watch: {
    content(value) {
      if (!value) {
        this.component = false
      }
    }
  },

  methods: {
    /**
     * Dynamic component loading
     * @param componentName
     * @param content
     */
    show(componentName, content) {
      this.content = content
      this.component = () => ({component: import(`../components/${componentName}`)})
    },

    /**
     * Get cabin category by code
     * @param code
     * @returns {*}
     */
    getCabinByCode(code) {
      return this.cabin.cabinCategories
      .filter(category => category.vendorCode === code)
      .shift()
    }
  }
}