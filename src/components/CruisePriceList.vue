<template>
  <tiny-modal @close="$emit('input', false)">
    <template #header>
      {{ `Круиз &laquo;${current.title}&raquo;` }}
    </template>
    <template #body>
      <div class="ces-cruise-row">
        <div class="ces-cruise-row">
          <div class="ces-cruise-row ces-cruise-modal">
            <div class="ces-cruise-modal__half">
              <div class="ces-cruise-modal__title">Доступные тарифы:</div>
              <div class="ces-cruise-fare"
                   v-for="(fare, key, index) in fares"
                   :key="`${key}-${fare.id}`"
                   @click="offer = index">
                <div class="ces-cruise-fare__label"
                     :class="{'ces-cruise-fare__label_selected': offer === index}">
                  <div class="ces-cruise-fare__title"
                       :class="{'ces-cruise-fare__title_selected': offer === index}"
                       v-text="fare[0].title"></div>
                </div>
              </div>
            </div>
            <div class="ces-cruise-modal__half">
              <div class="ces-cruise-tags">
                <div class="ces-cruise-tag">
                  <div class="ces-cruise-tag__value ces-cruise-tag__value_clickable"
                       @click="show('CruiseShipModal', current.ships)">
                    <div class="ces-cruise-tag__icon">
                      <div class="ces-icon ces-icon-ship"></div>
                    </div>&nbsp;{{ ship }}
                  </div>
                </div>
                <div class="ces-cruise-tag">
                  <div class="ces-cruise-tag__value" v-text="selectedDate.format('DD.MM.YYYY')"></div>
                </div>
                <div class="ces-cruise-tag">
                  <div class="ces-cruise-tag__value" v-text="`${current.nights} ночей`"></div>
                </div>
                <div class="ces-cruise-tag">
                  <div class="ces-cruise-tag__value" v-text="type"></div>
                </div>
                <div class="ces-cruise-tag">
                  <div class="ces-cruise-tag__value">
                    <div class="ces-cruise-tag__icon" v-if="current.dynamicFlight.length">
                      <div class="ces-icon ces-icon-plane"></div>
                    </div>&nbsp;
                    <span v-text="flight"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="ces-cruise-modal__overflow">
            <table class="ces-cruise-modal__table">
              <thead>
              <tr>
                <th colspan="2">Категория каюты</th>
                <th>Этот тариф включает</th>
                <th>Стоимость</th>
              </tr>
              </thead>
              <tbody>
              <tr class="ces-cruise-modal__table-row_hoverable"
                  v-for="fare in currentOfferOrdering"
                  :key="`${fare.categoryCode}-${fare.id}`">
                <td @click="show('CruiseCabinModal', getCabinByCode(fare.categoryCode))"
                    v-text="fare.categoryCode"></td>
                <td @click="show('CruiseCabinModal', getCabinByCode(fare.categoryCode))">
                  {{ options.cabins[fare.categoryCode] }}
                  <div class="ces-cruise-service ces-cruise-service_tip">
                    <div class="ces-icon ces-icon-info"></div>
                  </div>
                </td>

                <td @click="show('CruiseServices', {...fare, dynamicFlightPrice})">
                  <div class="ces-cruise-service"
                       v-for="service in fare.includedServices"
                       :key="`${service.code}-${fare.id}`">
                    <div class="ces-icon"
                         :class="`ces-icon-${service.subtype.replace(/[^\w\s]/gi, '-')}`"></div>
                  </div>
                  <div class="ces-cruise-service ces-cruise-service_tip">
                    <div class="ces-icon ces-icon-info"></div>
                  </div>
                </td>
                <td @click="show('CruiseBookForm', getOffer(fare))">
                  {{
                    beautifyPrice(
                      convertCurrency(fare.grossPriceAmount, false)
                      + convertCurrency(fare.portCharge, false)
                      + dynamicFlightPrice
                    )
                  }}
                  <div class="ces-cruise-service ces-cruise-service_tip">
                    <div class="ces-icon ces-icon-cart"></div>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <component :is="component" v-model="content"></component>
      <div class="ces-cruise-row ces-cruise-modal">
        <div class="ces-cruise-modal__half" v-if="current.priceInfo.priceIncludes">
          <div class="ces-cruise-modal__title">В стоимость включено</div>
          <ul class="ces-cruise__list">
            <li v-for="(includes, key) in current.priceInfo.priceIncludes" :key="`${key}`"
                v-html="includes.replace(/<\/?[^>]+(>|$)/g, '')"></li>
          </ul>
        </div>

        <div class="ces-cruise-modal__half" v-if="current.priceInfo.priceExcludes">
          <div class="ces-cruise-modal__title">Оплачивается дополнительно</div>
          <ul class="ces-cruise__list">
            <li v-for="(excludes, key) in current.priceInfo.priceExcludes" :key="`${key}`"
                v-html="excludes.replace(/<\/?[^>]+(>|$)/g, '')"></li>
          </ul>
        </div>
      </div>
    </template>
  </tiny-modal>
</template>

<script>
import groupBy from 'lodash/groupBy'
import mapValues from 'lodash/mapValues'
import omit from 'lodash/omit'
import orderBy from 'lodash/orderBy'
import TinyModal from './TinyModal.vue'
import cruise from '../mixins/cruise.js'
import modal from '../mixins/modal.js'
import tour from '../mixins/tour.js'

export default {
  name: 'CruisePriceList',
  components: {TinyModal},
  props: ['value'],
  mixins: [cruise, modal, tour],

  data() {
    return {
      offer: 0,
      content: false,
      component: false
    }
  },

  watch: {
    content(value) {
      if (!value) this.component = false
    }
  },

  computed: {
    current() {
      return this.value
    },

    fares() {
      return mapValues(groupBy(this.current.priceInfo.fares, 'code'), list => list.map(offer => omit(offer, 'code')))
    },

    currentOffer() {
      let offer = Object.keys(this.fares)[this.offer]
      return this.fares[offer]
    },

    currentOfferOrdering() {
      if (this.cabin.cabinCategories) {
        let orderDictionary = {}
        this.cabin.cabinCategories.map(item => {
          orderDictionary[item.vendorCode] = item.ordering
        })
        return orderBy(
          this.currentOffer.map(item => ({
            ...item, ordering: orderDictionary[item.categoryCode]
          })),
          ['ordering', 'categoryCode'],
          ['asc', 'asc']
        )
      }
      return this.currentOffer
    }
  },

  methods: {
    getOffer(fare) {
      let experience = this.cabin.cabinCategories
        .filter(cabin => cabin.vendorCode === fare.categoryCode)
        .shift()
        .experience
      let price = this.beautifyPrice(
        this.convertCurrency(fare.grossPriceAmount, false)
        + this.convertCurrency(fare.portCharge, false)
        + this.dynamicFlightPrice
      )

      let offer = {
        id: this.current.id,
        title: this.current.title,
        date: this.selectedDate.format('DD.MM.YYYY'),
        category: fare.categoryCode,
        type: this.options.cabins[fare.categoryCode],
        occupancy: this.current.priceInfo.occupancy,
        port: this.port,
        ship: this.ship,
        schedule: this.tour,
        experience,
        price
      }

      if (this.settings.email) {
        offer['email'] = this.settings.email
      }

      return offer
    },

    capitalize(s) {
      if (typeof s !== 'string') return ''
      return s.charAt(0).toUpperCase() + s.slice(1)
    },

    getIconComponent(type) {
      const componentsList = Object.keys(this.$options.components)
      let icon = type.split('.')
        .map(word => this.capitalize(word))
      icon.unshift('Icon')
      icon = icon.join('')
      return componentsList.includes(icon) ? icon : false
    }
  }
}
</script>