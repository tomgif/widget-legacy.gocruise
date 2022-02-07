import Vue from 'vue'
import VueRouter from 'vue-router'
import queryString from 'query-string'

Vue.use(VueRouter)

const routes = [
  {path: '/', name: 'search', component: () => import('../views/SearchPage.vue')},
  {path: '*', redirect: '/'}
]

const router = new VueRouter({
  routes,
  stringifyQuery(p) {
    let query = queryString.stringify(p, {
      arrayFormat: 'bracket',
      skipNull: true
    })

    return query.length ? `?${query}` : ''
  },

  parseQuery(q) {
    return queryString.parse(q, {
      arrayFormat: 'bracket',
      parseNumbers: true
    })
  }
})

export default router
