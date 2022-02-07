import {mapState} from 'vuex'
import dayJs from 'dayjs'

require('dayjs/locale/ru')

export default {
  computed: {
    ...mapState({
      options: state => state.options,
      cabin: state => state.cruises.ship,
      currency: state => state.settings.currency,
      currencies: state => state.options.currencies
    }),

    priceIntlFormat() {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: this.currency,
        minimumFractionDigits: 0
      })
    },

    port() {
      let {departurePort, destinationPort} = this.current
      return [departurePort, destinationPort]
      .filter((value, index, self) => self.indexOf(value) === index)
      .map(port => this.options.cities.cities[port].title)
      .join(' / ')
    },

    ship() {
      return this.current.ships
      .map(ship => this.options.ships[ship].title)
      .join(', ')
    },

    dynamicFlightPrice() {
      let dynamicFlight = this.current.dynamicFlight
      let adults = this.current.priceInfo.occupancy.adults, children = 0, total = 0

      if (this.current.priceInfo.occupancy.children.length) {
        this.current.priceInfo.occupancy.children.map(age => {
          if ((age >= 2) && (age < 12)) children++
          if (age >= 12) adults++
        })
      }

      if (dynamicFlight.length) {
        let priceNodes = dynamicFlight.map(flight => {
          let keys = Object.keys(flight), adultPrice = 0, childrenPrice = 0

          keys.filter(key => /pricerubYad/.test(key)).map(key => {
            if (adultPrice < flight[key]) adultPrice = flight[key]
          })

          keys.filter(key => /pricerubYch/.test(key)).map(key => {
            if (childrenPrice < flight[key]) childrenPrice = flight[key]
          })

          return adultPrice * adults + childrenPrice * children
        })

        total = Math.min(priceNodes)
      }

      return this.convertCurrency(total)
    },

    selectedDate() {
      return dayJs(this.current.date).locale('ru')
    },

    /**
     * Get cruise type name
     * @returns {*}
     */
    type() {
      return this.options.cruiseTypes[this.current.type].title
    },

    /**
     * Get dynamic flight city
     * @returns {*|string}
     */
    flight() {
      let city = this.current.dynamicFlight
      .map(flight => this.options.cities.cities[flight.cityId]['title'])
      .join(', ')

      return city || 'Без перелёта'
    },
  },

  methods: {
    /**
     * Converting currency
     * @param value
     * @param isRUB
     * @returns {number}
     */
    convertCurrency(value, isRUB = true) {
      let rate = this.currencies[this.currency].rate
      if (!isRUB) value = Math.ceil(value * this.currencies['EUR'].rate)
      return Math.ceil(value / rate)
    },

    /**
     * Beautify price to locale
     * @param price
     * @returns {*}
     */
    beautifyPrice(price) {
      return this.priceIntlFormat.format(price)
    }
  }
}