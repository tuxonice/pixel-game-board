import { createApp } from 'vue'
import App from './App.vue'
import store from './store'

// Create the app instance
const app = createApp(App)

// Use Vuex store
app.use(store)

// Mount the app to the DOM
app.mount('#app')
