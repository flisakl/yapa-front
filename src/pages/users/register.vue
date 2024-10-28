<script setup>
import { ref, onMounted } from 'vue';
import { useAPI } from '@/composables/api.js';
import { useAppStore } from '@/stores/app.js';
import { useRouter } from 'vue-router';

// composables
const api = useAPI()
const app = useAppStore()
const router = useRouter()

// refs
const redirect_to = { name: '/dashboard'}
const email = ref('')
const first_name = ref('')
const last_name = ref('')
const password1 = ref('')
const password2 = ref('')
const passwordFieldType = ref('password')
const errors = ref({})
const loading = ref(false)

// functions
const togglePasswordVisibility = () => {
  if (passwordFieldType.value == 'password')
    passwordFieldType.value = 'text'
  else
    passwordFieldType.value = 'password'
}

const sendForm = async () => {
  errors.value = {}
  loading.value = true;
  const response = await api.register(
  first_name.value, last_name.value, email.value, password1.value, password2.value)
  loading.value = false;
  if ("errors" in response) errors.value = response.errors
  else {
      app.setUser(response)
      router.push({ name: '/users/avatar' })
  }
}

// hooks
onMounted(() => {
  if (app.is_authenticated) router.push(redirect_to)
})
</script>

<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col>
        <v-card elevation="0" max-width="30rem" class="mx-auto">
          <v-card-item>
            <v-card-title>We're glad you want to join us!</v-card-title>
            <v-card-subtitle>With Yappa life is easier.</v-card-subtitle>
          </v-card-item>

          <v-card-text>
            <v-row class="mt-3">
              <v-col class="py-0 mb-1" cols="12" sm="6"> <v-text-field :error-messages="errors.first_name" v-model.trim="first_name" name="first_name" label="first name" /></v-col>
              <v-col class="py-0 mb-1" cols="12" sm="6"><v-text-field :error-messages="errors.last_name" v-model.trim="last_name" name="last_name" label="last name" /></v-col>
              <v-col class="py-0 mb-1" cols="12"><v-text-field :error-messages="errors.email" v-model.trim="email" name="email" type="email" label="email address" /></v-col>
              <v-col class="py-0 mb-1" cols="12" sm="6"><v-text-field :error-messages="errors.password1" v-model.trim="password1" name="password1" :type="passwordFieldType" label="password"/></v-col>
              <v-col class="py-0 mb-1" cols="12" sm="6"><v-text-field :error-messages="errors.password2" v-model.trim="password2" name="password2" :type="passwordFieldType" append-inner-icon="mdi-eye" @click:append-inner="togglePasswordVisibility" label="password confirmation" /></v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-btn type="submit" color="primary" variant="elevated" block text="sign up" @click.stop="sendForm" :loading="loading"/>
          </v-card-actions>
          <v-divider thickness="2" class="my-4 mx-8"/>
          <RouterLink to='/users/login'>
          <div class="text-subtitle-2 text-center pb-4 px-4">Already have account? <span class="text-primary">Sign in.</span></div>
            </RouterLink>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
