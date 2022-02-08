<template>
  <tiny-modal @close="$emit('input', false)">
    <template #header>
      {{ `Тариф &laquo;${value.title}&raquo;` }}
    </template>
    <template #body>
      <ul class="ces-cruise__list">
        <li class="ces-cruise__list-item">
          <div class="ces-bold">Категория каюты:</div>
          <span v-text="value.categoryCode"></span>
        </li>
        <li class="ces-cruise__list-item" v-if="value.validTill">
          <div class="ces-bold">Действует до:</div>
          <span v-text="value.validTill"></span>
        </li>
        <li class="ces-cruise__list-item">
          <div class="ces-bold">Стоимость:</div>
          <ul class="ces-cruise__list">
            <li class="ces-cruise__list-item">
              <div class="ces-bold">Каюта:</div>
              <span v-text="beautifyPrice(convertCurrency(value.grossPriceAmount, false))"></span>
            </li>
            <li class="ces-cruise__list-item" v-if="value.commissionAmount">
              <div class="ces-bold">Комиссия:</div>
              <span v-text="beautifyPrice(convertCurrency(value.commissionAmount, false))"></span>
            </li>
            <li class="ces-cruise__list-item" v-if="value.discountAmount">
              <div class="ces-bold">Скидка:</div>
              <span v-text="beautifyPrice(convertCurrency(value.discountAmount, false))"></span>
            </li>
            <li class="ces-cruise__list-item" v-if="value.portCharge">
              <div class="ces-bold">Портовый сбор:</div>
              <span v-text="beautifyPrice(convertCurrency(value.portCharge, false))"></span>
            </li>
            <li class="ces-cruise__list-item" v-if="value.dynamicFlightPrice">
              <div class="ces-bold">Авиаперелёт:</div>
              <span v-text="beautifyPrice(convertCurrency(value.dynamicFlightPrice, false))"></span>
            </li>
          </ul>
          <br>
        </li>
        <li class="ces-cruise__list-item" v-if="value.includedServices.length">
          <div class="ces-bold">Включено в тариф:</div>
          <ul class="ces-cruise__list">
            <li class="ces-cruise__list-item" v-for="service in value.includedServices" :key="`${service.code}`">
              <div class="ces-cruise-service">
                <div class="ces-icon"
                     :class="`ces-icon-${service.subtype.replace(/[^\w\s]/gi, '-')}`"></div>
              </div>&nbsp;
              <span v-text="service.tmp_descr"></span>
            </li>
          </ul>
          <br>
        </li>
        <li class="ces-cruise__list-item">
          <div class="ces-bold">Сборы за отмену:</div>
          <ul class="ces-cruise__list">
            <li class="ces-cruise__list-item" v-for="cancel in value.cancellationFees" :key="cancel.datefrom">
              {{
                `${formatDate(cancel.datefrom)} - ${beautifyPrice(
                  convertCurrency(cancel.amount, false)
                )}`
              }}
            </li>
          </ul>
          <br>
        </li>
        <li class="ces-cruise__list-item" v-text="value.nameChangeTerms"></li>
      </ul>
    </template>
  </tiny-modal>
</template>

<script>
import TinyModal from './TinyModal.vue'
import dayJs from 'dayjs'
import {mapState} from 'vuex'

export default {
  name: 'CruiseServices',
  components: {TinyModal},
  props: ['value'],
  computed: {
    ...mapState({
      currency: state => state.settings.currency,
      currencies: state => state.options.currencies,
    }),

    priceIntlFormat() {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: this.currency,
        minimumFractionDigits: 0
      })
    }
  },

  methods: {
    formatDate(dateString) {
      return dayJs(dateString)
        .format('DD.MM.YYYY')
    },

    convertCurrency(value, isRUB = true) {
      let rate = this.currencies[this.currency].rate

      if (!isRUB) {
        value = Math.ceil(value * this.currencies['EUR'].rate)
      }

      return Math.ceil(value / rate)

    },

    beautifyPrice(price) {
      return this.priceIntlFormat.format(price)
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
