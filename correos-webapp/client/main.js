import { Meteor } from 'meteor/meteor'
import { createApp } from 'vue'
import App from '../imports/ui/App.vue'
import router from '../imports/ui/router'
import './main.css'

Meteor.startup(() => {
  const app = createApp(App)
  app.use(router)
  app.mount('#app')
})
