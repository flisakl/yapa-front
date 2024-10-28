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
const password = ref('')
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
  const response = await api.login(email.value, password.value)
  loading.value = false;
  if ("errors" in response) errors.value = response.errors
  else {
      app.setUser(response)
      router.push(redirect_to)
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
            <v-card-title>Sign in</v-card-title>
            <v-card-subtitle>Sign in to continue using the app</v-card-subtitle>
          </v-card-item>

          <v-card-text>
            <v-text-field :error-messages="errors.email" v-model.trim="email" name="email" type="email" label="email address" />
            <v-text-field :error-messages="errors.password" v-model.trim="password" name="password" :type="passwordFieldType" append-inner-icon="mdi-eye"
              @click:append-inner="togglePasswordVisibility" label="password" />
            <RouterLink to="/users/forgot_password">
            <div class="text-right text-subtitle-2 text-disabled">Forgot password?</div>
              </RouterLink>
          </v-card-text>

          <v-card-actions>
            <v-btn type="submit" color="primary" variant="elevated" block text="sign in" @click.stop="sendForm" :loading="loading"/>
          </v-card-actions>
          <v-divider thickness="2" class="my-4 mx-8"/>
          <RouterLink to='/users/register'>
          <div class="text-subtitle-2 text-center pb-4 px-4">Don't have an account? <span class="text-primary">Create one.</span></div>
            </RouterLink>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
