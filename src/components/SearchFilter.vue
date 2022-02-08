<template>
  <div class="ces-search-filter">
    <select-box v-model="currencyModel"
                :options="currencies"
                :default-value="false"
                options-sort="order"
                label="Валюта"
                :filters="settings.currencies"
                v-if="settings.currencies.length > 1"></select-box>
    <select-box v-model="flightFromModel"
                :options="cities"
                label="Город вылета"
                :default-value="0"
                default-value-label="Без перелета"
                options-sort="title"
                :filters="getAvailable('flightFrom')"></select-box>
    <select-box v-model="cruiseTypeModel"
                :options="cruiseTypes"
                label="Тип круиза"
                default-value-label="Все типы"
                options-sort="title"
                :filters="getAvailable('type')"></select-box>
    <select-box v-model="regionsModel" is-multiple
                :options="regions"
                label="Регионы"
                default-value-label="Все регионы"
                options-sort="title"
                :filters="getAvailable('regions')"></select-box>
    <select-box v-model="departurePortModel" is-multiple
                :options="cities"
                label="Город начала круиза"
                default-value-label="Все порты"
                options-sort="title"
                :filters="getAvailable('departurePort')"></select-box>
    <select-box v-model="shipsModel" is-multiple
                :options="ships"
                label="Лайнер"
                default-value-label="Все лайнеры"
                options-sort="title"
                :filters="getAvailable('ships')"></select-box>
    <select-box v-model="faresModel" is-multiple
                :options="fares"
                label="Тариф"
                default-value-label="Все тарифы"
                options-sort="title"
                :filters="getAvailable('fares')"></select-box>
    <select-box v-model="nightsModel"
                :options="nightsOptions"
                label="Продолжительность"
                default-value-label="Все варианты"
                :filters="getAvailable('nights')"></select-box>
    <div class="ces-search-control ces-search-control--double">
      <person-control v-model="adults"
                      :min-value="1"
                      :max-value="maxAdults"
                      label="Взрослых"></person-control>
      <person-control v-model="childrenModel"
                      :min-value="0"
                      :max-value="maxChildren"
                      :ages="children"
                      label="Детей"></person-control>
    </div>
    <div class="ces-search-control ces-search-control--double">
      <date-picker v-model="dateFrom"
                   label="Даты начала"
                   :min-date="minDateFrom"
                   :events="dates"
                   @on-select="onDateFromSelect"></date-picker>
      <date-picker v-model="dateTill"
                   :events="dates"
                   :min-date="minDateTill"></date-picker>
    </div>
    <div class="ces-search-control ces-search-control--double">
      <form-switch v-model="rus"
                   label="Рус-яз группа"
                   :disabled="!getAvailable('rus').includes(true)"></form-switch>
      <form-switch v-model="available"
                   label="Наличие кают"
                   :disabled="!getAvailable('available').includes(true)"></form-switch>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import dayJs from 'dayjs'

const customParseFormat = require('dayjs/plugin/customParseFormat')
dayJs.extend(customParseFormat)
import FormSwitch from '../components/FormSwitch.vue'
import PersonControl from '../components/PersonControl.vue'
import SelectBox from '../components/SelectBox.vue'
import DatePicker from '../components/DatePicker.vue'

export default {
  name: 'SearchFilter',
  components: {FormSwitch, PersonControl, SelectBox, DatePicker},
  data() {
    let date = dayJs().add(1, 'day')
    return {
      maxPersons: 5,
      minDateFrom: new Date(date.year(), date.month(), date.date()),
      minDateTill: new Date(date.year(), date.month(), date.date())
    }
  },

  computed: {
    ...mapState({
      ships: state => state.options.ships,
      regions: state => state.options.regions,
      cities: state => state.options.cities.cities,
      fares: state => state.options.fares,
      cruiseTypes: state => state.options.cruiseTypes,
      children: state => state.form.children,
      nightsOptions: state => state.options.nights,
      form: state => state.form,
      variants: state => state.options.variants,
      settings: state => state.settings,
      currencies: state => state.options.currencies
    }),

    flightFromModel: {
      get() {
        return this.$store.state.form.flightFrom
      },

      set(value) {
        this.$store.commit('form/SET_FLIGHT_FROM', value)
      }
    },

    cruiseTypeModel: {
      get() {
        return this.$store.state.form.type
      },

      set(value) {
        this.$store.commit('form/SET_TYPE', value)
      }
    },

    shipsModel: {
      get() {
        return this.$store.state.form.ships
      },

      set(value) {
        this.$store.commit('form/SET_SHIPS', value)
      }
    },

    regionsModel: {
      get() {
        return this.$store.state.form.regions
      },

      set(value) {
        this.$store.commit('form/SET_REGIONS', value)
      }
    },

    departurePortModel: {
      get() {
        return this.$store.state.form.departurePort
      },

      set(value) {
        this.$store.commit('form/SET_DEPARTURE_PORT', value)
      }
    },

    faresModel: {
      get() {
        return this.$store.state.form.fares
      },

      set(value) {
        this.$store.commit('form/SET_FARES', value)
      }
    },

    currencyModel: {
      get() {
        return this.$store.state.settings.currency
      },

      set(value) {
        this.$store.commit('settings/SET_CURRENCY', value)
      }
    },

    nightsModel: {
      get() {
        let {minLength} = this.$store.state.form
        let item = Object.values(this.nightsOptions)
          .find(item => item.minLength === minLength)
        return item ? item.id : null
      },

      set(value) {
        if (value) {
          let item = this.nightsOptions[value]
          this.$store.commit('form/SET_MIN_LENGTH', item.minLength)
          this.$store.commit('form/SET_MAX_LENGTH', item.maxLength)
        } else {
          this.$store.commit('form/SET_MIN_LENGTH', null)
          this.$store.commit('form/SET_MAX_LENGTH', null)
        }
      }
    },

    adults: {
      get() {
        return +this.$store.state.form.adults
      },

      set(value) {
        this.$store.commit('form/SET_ADULTS', value)
      }
    },

    maxAdults() {
      return this.maxPersons - this.$store.state.form.children.length
    },

    childrenModel: {
      get() {
        return this.$store.state.form.children.length
      },

      set(value) {
        let {children} = this.$store.state.form

        if (children.length < value) {
          let age = window.prompt('Введите возраст ребёнка', '12')

          if (age && !isNaN(+age) && age < 18) {
            children.push(parseInt(age))
          }
        } else {
          children.splice(-1, 1)
        }

        this.$store.commit('form/SET_CHILDREN', children)
      }
    },

    maxChildren() {
      return this.maxPersons - this.$store.state.form.adults
    },

    dateFrom: {
      get() {
        return this.$store.state.form.dateFrom
      },

      set(value) {
        this.$store.commit('form/SET_DATE_FROM', value)
      }
    },

    dateTill: {
      get() {
        return this.$store.state.form.dateTill
      },

      set(value) {
        this.$store.commit('form/SET_DATE_TILL', value)
      }
    },

    dates() {
      return this.getAvailable('date')
        .filter((item, position, self) => self.indexOf(item) === position)
        .map(date => +dayJs(date))
    },

    rus: {
      get() {
        return !!this.$store.state.form.rus
      },

      set(value) {
        this.$store.commit('form/SET_RUS', value ? 1 : null)
      }
    },

    available: {
      get() {
        return !!this.$store.state.form.available
      },

      set(value) {
        this.$store.commit('form/SET_AVAILABLE', value ? 1 : null)
      }
    }
  },

  methods: {
    onDateFromSelect(selectedDate) {
      dayJs.extend(customParseFormat)
      const format = process.env.VUE_APP_DATE_FORMAT
      this.$set(this, 'minDateTill', selectedDate)
      let date = dayJs(selectedDate)
      const {dateFrom, dateTill} = this.$store.state.form
      if (date.isValid()) {

        if (dayJs(dateFrom, format).isAfter(dayJs(dateTill, format))) {

          this.$store.commit('form/SET_DATE_TILL', date.add(3, 'month').format(format))
        }
      }
    },

    getDatesRange(dateFrom, dateTill) {
      let from = dayJs(dateFrom)
      let till = dayJs(dateTill).add(1, 'day')
      let output = []
      while (!from.isAfter(till)) {
        output.push(from.format('YYYY-MM-DD'))
        from = from.add(1, 'day')
      }
      return output
    },

    isAvailable(variant, filter) {
      if (+filter.flightFrom && +filter.flightFrom !== variant.flightFrom) return false
      if (filter.type && filter.type.length && !filter.type.includes(variant.type)) return false
      if (filter.regions && filter.regions.length && !filter.regions.includes(variant.regions)) return false
      if (filter.departurePort && filter.departurePort.length && !filter.departurePort.includes(variant.departurePort)) return false
      if (filter.ships && filter.ships.length && !filter.ships.includes(variant.ships)) return false
      if (filter.fares && filter.fares.length && !filter.fares.includes(variant.fares)) return false
      if (filter.nights && filter.nights !== variant.nights) return false
      if (filter.date && !filter.date.includes(variant.date)) return false
      if (filter.rus && filter.rus !== variant.rus) return false
      return !(filter.available && filter.available !== variant.available)
    },

    getAvailable(field) {
      let form = Object.assign({}, this.form)
      form['nights'] = this.nightsModel
      form['date'] = this.getDatesRange(form.dateFrom, form.dateTill)
      form['rus'] = !!form['rus']
      form['available'] = !!form['available']
      delete form[field]
      return this.variants.filter(item => this.isAvailable(item, form)).map(item => item[field])
        .filter((item, position, self) => self.indexOf(item) === position)
    }
  }
}
</script>

<style lang="scss">
.ces-search-filter {
  display: flex;
  flex-flow: row wrap;
  padding: 8px;
}

.ces-search-control {
  position: relative;

  @media (min-width: 320px) {
    width: 100%
  }

  @media (min-width: 375px) {
    width: 50%;
    margin-bottom: 8px;
  }

  @media (min-width: 576px) {
    width: 172px
  }

  &--double {
    display: flex;
    flex-flow: row nowrap;

    @media (min-width: 375px) {
      justify-content: space-between
    }
  }
}

.ces-cruise-date {
  text-decoration: underline;
  font-weight: bold;
}
</style>