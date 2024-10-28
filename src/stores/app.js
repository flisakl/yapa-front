import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAppStore = defineStore('app', () => {
  const user = ref({})

  // computed props
  const is_authenticated = computed(() => user.value.token ? true : false)


  // functions
  const setUser = (usr) => {
    user.value = usr
    window.localStorage.setItem("user", JSON.stringify(usr))
  }
  const getUserFromLS = () => {
    const usr = window.localStorage.getItem("user")
    if (usr) user.value = JSON.parse(usr)
  }

  const logout = () => window.localStorage.removeItem("user")


  return { user, is_authenticated, getUserFromLS, setUser, logout }
})
