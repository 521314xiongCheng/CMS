import Vue from 'vue'
import Router from 'vue-router'
import routes from 'vue-auto-routing'
// import routes from './router/index'
import {
  createRouterLayout
} from 'vue-router-layout'
import {
  readCookie,
  isLocalhost
} from '@/utility/index'
import Http from '@/api/http'

Vue.use(Router)

const RouterLayout = createRouterLayout(layout => {
  return import('@/layouts/' + layout + '.vue')
})
console.table(routes.filter(o => o.name.includes('product')))
const router = new Router({
  mode: 'history',
  routes: [{
      path: '/',
      component: RouterLayout,
      children: routes
    },
    {
      path: '*',
      redirect: '404'
    }
  ]
})
if (!isLocalhost()) {
  router.beforeEach((to, from, next) => {
    if (!readCookie('token')) {
      location.href = '/auth'
    } else {
      if (
        to.path === '/404' ||
        to.path === '/' ||
        to.path.indexOf('common') > -1
      )
        return next()
      Http({
          url: 'system/menus/validate',
          method: 'POST',
          data: {
            path: to.path
          }
        })
        .then(() => next())
        .catch(() =>
          next({
            path: '404'
          })
        )
    }
  })
}

export default router
