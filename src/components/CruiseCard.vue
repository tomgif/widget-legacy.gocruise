<template>
  <div class="ces-cruise">
    <div class="ces-cruise-row">
      <div class="ces-cruise-tags">
        <div class="ces-cruise-tag">
          <div class="ces-cruise-tag__title">Ночей</div>
          <div class="ces-cruise-tag__value" v-text="current.nights"></div>
        </div>
        <div class="ces-cruise-tag ces-cruise-tag--ship">
          <div class="ces-cruise-tag__title">Лайнер</div>
          <div class="ces-cruise-tag__value ces-cruise-tag__value_clickable"
               @click="show('CruiseShipModal', current.ships)">
            <div class="ces-cruise-tag__icon">
              <div class="ces-icon ces-icon-ship"></div>
            </div>&nbsp;
            <span v-text="ship"></span>
          </div>
        </div>
        <div class="ces-cruise-tag">
          <div class="ces-cruise-tag__title">Регион</div>
          <div class="ces-cruise-tag__value" v-text="region"></div>
        </div>
        <div class="ces-cruise-tag">
          <div class="ces-cruise-tag__title">Порт отправления / прибытия</div>
          <div class="ces-cruise-tag__value" v-text="port"></div>
        </div>
      </div>
    </div>
    <div class="ces-cruise-row">
      <div class="ces-cruise__title">
        Круиз &laquo;{{ current.title }}&raquo;
        <div class="ces-cruise__info">
          <div class="ces-cruise-button"
               @click="show('CruiseSchedule', current)">
            <div class="ces-icon ces-icon-map"></div>
            <div class="ces-cruise-button__title">План</div>
          </div>
          <div class="ces-cruise-button"
               @click="show('CruiseVisa', current.visaInfo)"
               v-if="current.visaInfo.options.length > 0">
            <div class="ces-icon ces-icon-visa"></div>
            <div class="ces-cruise-button__title">Виза</div>
          </div>
        </div>
      </div>
      <div class="ces-cruise__itinerary">
        <div class="ces-bold">Маршрут:</div>
        <span v-text="itinerary"></span>
      </div>
    </div>
    <div class="ces-cruise-row">
      <div class="ces-cruise-details">
        <div class="ces-cruise-details__tag" v-text="`${current.nights} ночей`"></div>
        <div class="ces-cruise-details__tag ces-cruise-details__tag--type" v-text="type"></div>
        <div class="ces-cruise-details__tag ces-cruise-details__tag--type"
             :class="{'ces-cruise-details__tag--has-flight': current.dynamicFlight.length}">
          <div class="ces-cruise-details__icon" v-if="current.dynamicFlight.length">
            <div class="ces-icon ces-icon-plane"></div>
          </div>&nbsp;
          <span v-text="flight"></span>
        </div>
      </div>
    </div>
    <div class="ces-cruise-row">
      <div class="ces-cruise-options">
        <div class="ces-cruise-options__calendar">
          <card-date v-model="selected" :dates="dates" :prefix="current.grouping" :extra="extra"></card-date>
        </div>
        <div class="ces-cruise-options__info">
          <div class="ces-bold">Выбрано <span v-text="selectedDate.format('D MMMM')"></span></div>
          <div class="ces-cruise-extra">
            <span v-if="!hasExtra">В этом круизе доступны:</span>
            <div class="ces-cruise-extra__item" v-for="(option, key) in extra" :key="`${current.grouping}-${key}`">
              <template v-if="option.value.length">
                <div class="ces-cruise-extra__option" :style="{'background-color': option.color}"></div>
                <span v-text="option.label"></span>
              </template>
            </div>
          </div>
        </div>
        <div class="ces-cruise-options__price">
          <div class="ces-cruise-options__cabin" v-text="cabinInfo"></div>
          <div class="ces-cruise-options__min-price">
            от <span v-text="beautifyPrice(minPrice + portCharge + dynamicFlightPrice)"></span>
          </div>
          <div class="ces-cruise-options__price-list"
               @click="show('CruisePriceList', current)">
            Все цены
          </div>
        </div>
      </div>
    </div>
    <component :is="component" v-model="content"></component>
  </div>
</template>

<script>
import map from 'lodash/map'
import CardDate from './CardDate.vue'
import cruise from '../mixins/cruise.js'
import modal from '../mixins/modal.js'

export default {
  name: 'CruiseCard',
  props: ['cruise'],
  mixins: [cruise, modal],
  components: {CardDate},

  data() {
    return {
      selected: 0,
      component: false,
      content: false
    }
  },

  watch: {
    component() {
      if (!(('id' in this.cabin) && this.cabin.id === this.current.ships[0])) {
        this.$store.commit('main/SET_LOADING', true)
        this.$store.dispatch('cruises/SET_SHIP', this.current.ships[0])
          .then(() => this.$store.commit('main/SET_LOADING', false))
      }
    }
  },

  computed: {
    current() {
      return this.cruise[this.selected]
    },

    dates() {
      return map(this.cruise, 'date')
    },

    extra() {
      let extra = {
        rus: {value: [], color: '#f00', label: 'Русскоязычная группа'},
        promo: {value: [], color: '#00f', label: 'СПО-тариф'}
      }

      this.cruise.map(cruise => {
        if (cruise.rus) extra.rus.value.push(cruise.date)
        cruise.priceInfo.fares.map(fare => {
          if (fare.isPromo && !~extra.promo.value.indexOf(cruise.date))
            extra.promo.value.push(cruise.date)
        })
      })

      return extra
    },

    hasExtra() {
      return !Object.keys(this.extra)
        .map(option => this.extra[option].value.length)
        .reduce((accumulator, current) => accumulator + current)
    },

    region() {
      return this.current.regions
        .map(region => this.options.regions[region].title)
        .join(', ')
    },

    itinerary() {
      const DAY_AT_SEA = 586
      let dictionary = this.options.cities

      let schedule = this.current.tourParts
        .filter(part => part.serviceType === 'cruise')
        .map(part => part.schedule)

      schedule = [].concat.apply([], schedule)

      let cities = schedule
        .map((day) => day.cityId)
        .filter((id) => id !== DAY_AT_SEA)

      return cities.map(cid => dictionary.countries[dictionary.city2country[cid]])
        .filter((value, index, self) => self.indexOf(value) === index)
        .join(', ')
    },

    minPriceOffer() {
      let fares = this.current.priceInfo.fares
      let prices = fares.map(fare => fare.grossPriceAmount)
      let min = Math.min.apply(null, prices)
      let index = prices.indexOf(min)
      return fares[index]
    },

    minPrice() {
      return this.convertCurrency(this.minPriceOffer.grossPriceAmount, false)
    },

    portCharge() {
      return this.convertCurrency(this.minPriceOffer.portCharge, false)
    },

    cabinInfo() {
      return this.options.cabins[this.minPriceOffer.categoryCode]
    }
  }
}
</script>

<style lang="scss">
.ces-cruise {
  padding: 16px;
  margin-bottom: 12px;
  background-color: #fff;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 0 1px 0 rgba(0, 0, 0, 0.14), 0 1px 1px 0 rgba(0, 0, 0, 0.2);

  &__title {
    font-size: 16px;
    font-weight: bold;
    display: flex;
    flex-flow: row nowrap;

    @media (min-width: 576px) {
      font-size: 24px;
      line-height: 32px;
      margin-bottom: 8px;
    }
  }

  &__itinerary {
    font-size: 10px;
    margin: 4px 0;

    @media (min-width: 576px) {
      font-size: 12px
    }
  }

  &__info {
    display: flex;
    flex-flow: row nowrap;
    margin-left: auto;
  }

  &__list {
    list-style: unset;
    padding-left: 16px;
  }
}

.ces-cruise-button {
  width: 24px;
  height: 24px;
  cursor: pointer;
  margin: 0 8px;
  opacity: 1;
  transition: opacity .5s ease;

  &:hover {
    opacity: .5
  }

  &__title {
    font-size: 10px;
    line-height: 24px;
    text-align: center;
  }
}

.ces-cruise-row {
  width: 100%;
  font-size: 11px;
  margin: 8px 0;
  position: relative;
}

.ces-cruise-details {
  display: flex;
  flex-flow: row nowrap;
  margin: 16px 0;

  &__tag {
    padding: 4px;
    margin: 0 4px;

    &--type {
      background-color: rgba(0, 0, 0, .25);
      color: #fff;
      border-radius: 2px;
    }

    &--has-flight {
      background-color: rgba(0, 0, 0, 1)
    }
  }

  &__icon {
    display: inline-block;
    vertical-align: middle;
    width: 11px;
    height: 11px;
  }
}

.ces-cruise-options {
  display: flex;

  @media (min-width: 320px) {
    flex-flow: row wrap
  }

  &__calendar {
    flex: 2;

    @media (max-width: 576px) {
      flex: 100%;
      margin-bottom: 16px;
    }
  }

  &__info {
    flex: 1;

    .ces-bold {
      &:before {
        content: '';
        display: inline-block;
        vertical-align: middle;
        margin-right: 4px;
        width: 12px;
        height: 12px;
        background-color: #000;
      }

      span {
        color: rgba(0, 0, 0, .5);
        display: inline-block;
      }
    }
  }

  &__price {
    flex: 1;
    text-align: right;
    border-left: 1px solid rgba(0, 0, 0, .25);
  }

  &__cabin {
    color: #8a8787
  }

  &__min-price {
    font-size: 24px;
    font-weight: 300;
    color: #b71c1c;
    margin-bottom: 8px;
  }

  &__price-list {
    display: inline-block;
    color: #fff;
    border-radius: 2px;
    font-size: 14px;
    padding: 8px;
    background-color: rgba(0, 0, 0, .25);
    cursor: pointer;

    &:hover {
      background-color: rgba(0, 0, 0, 1)
    }
  }
}

.ces-cruise-tags {
  display: flex;
  flex-flow: row nowrap;
  margin-left: -4px;
  margin-right: -4px;
  margin-bottom: 16px;

  @media (max-width: 575px) {
    flex-flow: row wrap
  }
}

.ces-cruise-tag {
  margin: 4px;
  flex: 3;

  @media (min-width: 320px) and (max-width: 575px) {
    flex: 3 33%
  }

  &:first-child {
    flex: 1;

    @media (min-width: 320px) and (max-width: 575px) {
      flex: 1 33%
    }
  }

  &:last-child {
    @media (min-width: 320px) and (max-width: 575px) {
      flex: 100%
    }
  }

  &__title {
    color: #9e9e9e
  }

  &__value {
    color: #fff;
    background-color: rgba(0, 0, 0, .25);
    padding: 4px;
    border-radius: 2px;
    text-align: center;
    transition: background-color .3s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &_clickable {
      cursor: pointer;

      &:hover {
        background-color: rgba(0, 0, 0, 1)
      }
    }
  }

  &__icon {
    width: 11px;
    height: 11px;
  }
}

.ces-cruise-modal {
  display: flex;
  flex-flow: row nowrap;

  @media (max-width: 413px) {
    flex-flow: column-reverse
  }

  &__half {
    flex: 1 50%;

    @media (max-width: 413px) {
      flex: 100%
    }
  }

  &__title {
    font-size: 16px;
    margin-bottom: 4px;
  }

  &__table {
    width: 100%;
    font-size: 14px;
    border-collapse: collapse;
    border-spacing: 0;

    td {
      padding: 16px 8px;
      font-size: 12px;
      position: relative;

      &:after {
        content: '';
        position: absolute;
        width: 1px;
        height: 100%;
        border-right: 1px solid rgba(0, 0, 0, 0.12);
        top: 0;
        right: 0;
      }

      &:last-child {
        &:after {
          border-right: 0
        }
      }
    }

    th {
      text-align: left;
      padding: 16px 8px;
    }

    tr {
      border-bottom: 1px solid rgba(0, 0, 0, 0.12)
    }
  }

  &__table-row {
    &_hoverable:hover {
      background-color: rgba(0, 0, 0, .5);
      cursor: pointer;
      color: #fff;

      td:hover {
        background-color: #222
      }
    }
  }

  &__overflow {
    overflow-x: auto
  }

  .ces-cruise-tags {
    align-items: center;

    @media (min-width: 576px) {
      flex-flow: row wrap;
      margin: 4px 0;
    }
  }

  .ces-cruise-tag {
    @media (min-width: 576px) {
      flex: unset;
      width: 186px;
      margin: 4px;
    }
  }
}

.ces-cruise-fare {
  &__label {
    background: white;
    border: 1px solid #eee;
    border-radius: 2px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    cursor: pointer;
    display: inline-block;
    font-weight: 600;
    margin: 0 auto 10px;
    padding: 8px 8px 8px 32px;
    position: relative;
    transition: .3s ease all;
    width: 100%;

    &:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05)
    }

    &:before {
      background: #eee;
      border-radius: 50%;
      content: '';
      height: 16px;
      left: 8px;
      position: absolute;
      top: calc(50% - 8px);
      transition: .3s ease background-color;
      width: 16px;
    }

    &_selected {
      background-color: #fff;
      border-color: rgba(0, 0, 0, .25);

      &:before {
        background-color: rgba(0, 0, 0, .25);
        background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIyNiIgaGVpZ2h0PSIyMCIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIyLjAyOTY4IC00MC4wOTAzIDI2IDIwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48IS0tR2VuZXJhdGVkIGJ5IElKU1ZHIChodHRwczovL2dpdGh1Yi5jb20vaWNvbmphci9JSlNWRyktLT48cGF0aCBkPSJNMjcuOTc0MywtMzYuMTI3MmMwLDAuNDQ2NDI4IC0wLjE1NjI1LDAuODI1ODkzIC0wLjQ2ODc1LDEuMTM4MzlsLTEyLjEyMDUsMTIuMTIwNWwtMi4yNzY3OSwyLjI3Njc5Yy0wLjMxMjUsMC4zMTI1IC0wLjY5MTk2NCwwLjQ2ODc1IC0xLjEzODM5LDAuNDY4NzVjLTAuNDQ2NDI4LDAgLTAuODI1ODkzLC0wLjE1NjI1IC0xLjEzODM5LC0wLjQ2ODc1bC0yLjI3Njc5LC0yLjI3Njc5bC02LjA2MDI3LC02LjA2MDI3Yy0wLjMxMjUsLTAuMzEyNSAtMC40Njg3NSwtMC42OTE5NjUgLTAuNDY4NzUsLTEuMTM4MzljMCwtMC40NDY0MjkgMC4xNTYyNSwtMC44MjU4OTMgMC40Njg3NSwtMS4xMzgzOWwyLjI3Njc5LC0yLjI3Njc5YzAuMzEyNSwtMC4zMTI1IDAuNjkxOTY1LC0wLjQ2ODc1IDEuMTM4MzksLTAuNDY4NzVjMC40NDY0MjksMCAwLjgyNTg5MywwLjE1NjI1IDEuMTM4MzksMC40Njg3NWw0LjkyMTg4LDQuOTM4NjJsMTAuOTgyMSwtMTAuOTk4OWMwLjMxMjUsLTAuMzEyNSAwLjY5MTk2NCwtMC40Njg3NSAxLjEzODM5LC0wLjQ2ODc1YzAuNDQ2NDI4LDAgMC44MjU4OTMsMC4xNTYyNSAxLjEzODM5LDAuNDY4NzVsMi4yNzY3OCwyLjI3Njc5YzAuMzEyNSwwLjMxMjUgMC40Njg3NSwwLjY5MTk2NCAwLjQ2ODc1LDEuMTM4MzlaIiB0cmFuc2Zvcm09InNjYWxlKDEuMDAxOTgpIiBmaWxsPSIjZmZmIj48L3BhdGg+PC9zdmc+');
        background-repeat: no-repeat;
        background-position: center;
        background-size: 8px;
      }
    }
  }

  &__title {
    user-select: none
  }
}

.ces-cruise-service {
  margin: 0 8px;
  width: 16px;
  height: 16px;
  display: inline-block;
  vertical-align: middle;

  &_tip {
    float: right
  }
}

.ces-cruise-extra {
  line-height: 16px;
  margin: 4px 0;

  &__option {
    display: inline-block;
    vertical-align: middle;
    width: 4px;
    height: 4px;
    margin: 1px;
    border-radius: 50%;
  }
}

.ces-book {
  min-width: 320px
}
</style>