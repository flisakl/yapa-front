<script setup>
import { ref } from 'vue';
import { useAPI } from '@/composables/api.js';
import { useAppStore } from '@/stores/app.js';
import { useRouter } from 'vue-router';

// composables
const api = useAPI()
const app = useAppStore()
const router = useRouter()

// refs
const redirect_to = { name: '/dashboard'}
const avatar = ref(null)
const errors = ref({})
const loading = ref(false)

api.setUser(app.user)

const sendForm = async () => {
  errors.value = {}
  loading.value = true;
  const response = await api.uploadAvatar(avatar.value)
  loading.value = false;
  if ("errors" in response) errors.value = response.errors
  else {
      app.setUser(response)
      router.push(redirect_to)
  }
}

</script>

<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col>
        <v-card elevation="0" max-width="30rem" class="mx-auto">
          <v-card-item>
            <v-card-title>Show yourself</v-card-title>
            <v-card-subtitle>Upload your picture, you'll be easier to find.</v-card-subtitle>
          </v-card-item>

          <v-card-text>
            <v-file-input prepend-icon="" accept="image/*" v-model="avatar" label="image" :error-messages="errors.avatar"/>
          </v-card-text>

          <v-card-actions>
            <v-btn type="submit" color="primary" variant="elevated" block text="upload" @click.stop="sendForm" :loading="loading"/>
          </v-card-actions>
          <v-divider thickness="2" class="my-4 mx-8"/>
          <RouterLink to='/users/register'>
          <div class="text-subtitle-2 text-center pb-4 px-4">Take me to app.</div>
            </RouterLink>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

