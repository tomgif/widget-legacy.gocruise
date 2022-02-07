import dayJs from 'dayjs'

const initialState = () => {
  const dateFormat = 'YYYY-MM-DD'
  let dateFrom = dayJs().add(1, 'day').format(dateFormat)
  let dateTill = dayJs().add(3, 'month').format(dateFormat)

  return {
    /**
     * Город вылета, единственный выбор, по-умолчанию - Без перелета
     */
    flightFrom: 0,

    /**
     * Тип круиза, единственный выбор, по-умолчанию - Круиз
     */
    type: 1,

    /**
     * Регион плавания, множественный выбор
     */
    regions: [],

    /**
     * Порт отправления, множественный выбор
     */
    departurePort: [],

    /**
     * Лайнер, множественный выбор
     */
    ships: [],

    /**
     * Тариф, множественный выбор
     */
    fares: [],

    /**
     * Продолжительность, множественный выбор, [1-6 ночей, 7-15 ночей, 16 и более ночей]
     */
    minLength: null,
    maxLength: null,

    /**
     * Календарь (с возможностью выбора интервала).
     * - календарь должен уметь выделять даты, в которые возможен круиз
     * - календарь должен уметь ограничивать максимально доступный интервал
     */
    dateFrom,
    dateTill,

    /**
     * Взрослых, числовой, по-умолчанию - 2
     */
    adults: 2,

    /**
     * Детей, числовой, по-умолчанию - 0
     * - Каждый раз при добавлении нового ребёнка требовать указать его возраст
     * - Введённые возраста показывать под контролом
     */
    children: [],

    /**
     * Наличие русской группы, бинарный, по-умолчанию - false
     */
    rus: null,

    /**
     * Наличие кают, бинарный, по умолчанию - true
     */
    available: 1,

    timestamp: dayJs().unix()
  }
}

const state = {
  ...initialState()
}

const mutations = {
  SET_FLIGHT_FROM: (state, flightFrom) => state.flightFrom = flightFrom,
  SET_TYPE: (state, type) => state.type = type,
  SET_REGIONS: (state, regions) => state.regions = regions,
  SET_DEPARTURE_PORT: (state, departurePort) => state.departurePort = departurePort,
  SET_SHIPS: (state, ships) => state.ships = ships,
  SET_FARES: (state, fares) => state.fares = fares,
  SET_MIN_LENGTH: (state, minLength) => state.minLength = minLength,
  SET_MAX_LENGTH: (state, maxLength) => state.maxLength = maxLength,
  SET_DATE_FROM: (state, dateFrom) => state.dateFrom = dateFrom,
  SET_DATE_TILL: (state, dateTill) => state.dateTill = dateTill,
  SET_ADULTS: (state, adults) => state.adults = adults,
  SET_CHILDREN: (state, children) => state.children = children,
  SET_RUS: (state, rus) => state.rus = rus,
  SET_AVAILABLE: (state, available) => state.available = available
}

export default {
  namespaced: true,
  state,
  mutations: {
    ...mutations,

    RESET_STATE(state, urlState) {
      Object.keys(urlState).map(key => {
        if (Object.hasOwnProperty.call(state, key)) {
          if (Array.isArray(state[key])) {
            state[key] = []
            urlState[key].map(value => state[key].push(value))
          } else {
            state[key] = urlState[key]
          }
        }
      })

      state.timestamp = dayJs().unix()
    },

    DEFAULT_STATE() {
      Object.assign(state, initialState())
    }
  }
}
