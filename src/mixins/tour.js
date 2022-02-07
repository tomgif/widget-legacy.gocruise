import {mapState} from 'vuex'
import dayJs from 'dayjs'

export default {
  computed: {
    ...mapState({
      options: state => state.options,
      settings: state => state.settings
    }),

    tour() {
      return this.current.tourParts
      .filter(part => part.serviceType === 'cruise')
      .map(part => {
        part.schedule.map(item => {
          item.city = this.options.cities.cities[item.cityId]['title']
          item.dayTitle = dayJs(item.date).locale('ru').format('D MMM / dd')
          item.arrival = dayJs(item.date + ' ' + item.timeArr).format('HH:mm')
          item.departure = dayJs(item.date + ' ' + item.timeDep).format('HH:mm')
          return item
        })
        return part
      })
    }
  }
}