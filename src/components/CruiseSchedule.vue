<template>
  <tiny-modal @close="$emit('input', false)">
    <template #header>
      Расписание круиза
    </template>
    <template #body>
      <div class="ces-cruise-row ces-cruise-modal">
        <div class="ces-cruise-modal__half" v-if="current.map || current.mapVendor">
          <img :src="current.map || current.mapVendor" :alt="current.title">
        </div>
        <div class="ces-cruise-modal__half">
          <div class="ces-cruise-modal__overflow">
            <table class="ces-cruise-modal__table" v-for="part in tour" :key="`${part.key}`">
              <thead>
              <tr>
                <td>#</td>
                <td>День</td>
                <td>Город</td>
                <td>Прибытие</td>
                <td>Отправление</td>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(day, index) in part.schedule" :key="`${current.id}-${index}`">
                <td v-text="day.day"></td>
                <td v-text="day.dayTitle"></td>
                <td v-text="day.city"></td>
                <td v-text="day.timeArr ? day.arrival : '-'"></td>
                <td v-text="day.timeDep ? day.departure : '-'"></td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>
  </tiny-modal>
</template>

<script>
import TinyModal from './TinyModal.vue'
import tour from '../mixins/tour.js'

export default {
  name: 'CruiseSchedule',
  components: {TinyModal},
  props: ['value'],
  mixins: [tour],
  computed: {
    current() {
      return this.value
    }
  }
}
</script>