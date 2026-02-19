<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import BaseInput from './BaseInput.vue'
import BaseButton from './BaseButton.vue'
import { clientesService } from '@/services/clientes.service'
import { dashboardService } from '@/services/dashboard.service'
import { userStore } from '@/store/store'
import Swal from 'sweetalert2'

const router = useRouter()

type AuthMode = 'login' | 'register'

const mode = ref<AuthMode>('login')
const isLoading = ref(false)
const errorMsg = ref('')
const errorEmail = ref('')
const errorDni = ref('')
const errorPassword = ref('')

const validarEmail = (email : string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validarDni = (dni : string) => {
  const dniRegex = /^[0-9]{8}[A-Z]$/
  return dniRegex.test(dni)
}


const loginForm = reactive({
  dni: '',
  password: ''
})

const registerForm = reactive({
  nombre: '',
  dni: '',
  contacto: '',
  password: ''
})

// Limpiar errores al cambiar de modo
watch(mode, () => {
  errorDni.value = ''
  errorEmail.value = ''
  errorPassword.value = ''
  errorMsg.value = ''
})

const onLogin = async () => {
  // Resetear errores
  errorDni.value = ''
  errorPassword.value = ''
  errorMsg.value = ''
  
  let isValid = true
  
  if (!validarDni(loginForm.dni)) {
    errorDni.value = 'El DNI debe tener 8 números y una letra mayúscula'
    isValid = false
  }
  
  if (loginForm.password.length < 5) {
    errorPassword.value = 'La contraseña debe tener al menos 5 caracteres'
    isValid = false
  }
  
  if (!isValid){
    return
  }

  isLoading.value = true
  try {
    const res = await clientesService.login(loginForm.dni, loginForm.password)
    if (res.success) {
      await Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: res.message,
        timer: 1500,
        showConfirmButton: false
      })
      
      // Chequear si había un caso pendiente
      await checkPendingCase()

      router.push('/')
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: res.message
      })
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error de conexión',
      text: 'No se pudo conectar con el servidor.'
    })
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const onRegister = async () => {
  // Resetear errores
  errorDni.value = ''
  errorEmail.value = ''
  errorPassword.value = ''
  errorMsg.value = ''
  
  let isValid = true
  
  if (!registerForm.nombre) {
    errorMsg.value = 'El nombre es obligatorio'
    isValid = false
  }

  if (!validarDni(registerForm.dni)) {
    errorDni.value = 'El DNI debe tener 8 números y una letra mayúscula'
    isValid = false
  }
  
  if (!validarEmail(registerForm.contacto)) {
    errorEmail.value = 'El formato del email no es válido'
    isValid = false
  }

  if (registerForm.password.length < 5) {
    errorPassword.value = 'La contraseña debe tener al menos 5 caracteres'
    isValid = false
  }
  
  if (!isValid){
    return
  }

  isLoading.value = true
  try {
    const res = await clientesService.register(registerForm.nombre, registerForm.dni, registerForm.contacto, registerForm.password)
    if (res.success) {
      await Swal.fire({
        icon: 'success',
        title: '¡Cuenta creada!',
        text: res.message,
        timer: 1500,
        showConfirmButton: false
      })

      // Chequear si había un caso pendiente ---> ver donde ponemos
      await checkPendingCase()

      router.push('/')
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: res.message
      })
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error de conexión',
      text: 'No se pudo conectar con el servidor.'
    })
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

/**
 * Verifica si hay un caso pendiente de guardar en localStorage.
 * Si existe, lo asigna al usuario actual y lo envía al dashboard.
 */
const checkPendingCase = async () => {
  const pendingCaseJson = localStorage.getItem('pendingCase');
  if (pendingCaseJson) {
      try {
          const store = userStore();
          const user = store.getUser;

          if (!user) return;

          const pendingCase = JSON.parse(pendingCaseJson);
          
          // Actualizar datos del usuario en el caso pendiente
          pendingCase.Nombre = user.Nombre;
          pendingCase.DNI = user.DNI;
          pendingCase.ID_Cliente = user.ID_Cliente;

          // Guardar en Dashboard
          const response = await dashboardService.createCase(pendingCase);

          if (response.status === 'ok') {
              await Swal.fire({
                  icon: 'success',
                  title: '¡Consulta Guardada!',
                  text: `Hemos registrado tu coche automáticamente tras el inicio de sesión. ID Caso: ${response.idCaso}`,
                  timer: 4000,
                  showConfirmButton: false
              });
              localStorage.removeItem('pendingCase');
          } else {
              // console.error('Error al guardar caso pendiente:', response);
              Swal.fire({
                  icon: 'error',
                  title: 'Error al guardar caso pendiente',
                  text: response.message
              });
          }

      } catch (e) {
          console.error('Error procesando caso pendiente:', e);
      }
  }
}

</script>

<template>
  <div class="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">

      <!-- Card -->
      <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-800">

        <!-- Logo -->
        <div class="mb-6 flex flex-col items-center gap-2">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 17h2a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2H5m14 0h-2a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h2" />
              <path d="M3 9l2.5-5h13L21 9" />
              <path d="M3 9h18v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
              <circle cx="7.5" cy="15.5" r="1.5" />
              <circle cx="16.5" cy="15.5" r="1.5" />
            </svg>
          </div>
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">Cartel Coches</h1>
        </div>

        <!-- Tabs -->
        <div class="mb-6 flex rounded-lg border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-700">
          <button
            class="flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all"
            :class="mode === 'login'
              ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-600 dark:text-white'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'"
            @click="mode = 'login'"
          >
            Iniciar Sesión
          </button>
          <button
            class="flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all"
            :class="mode === 'register'
              ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-600 dark:text-white'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'"
            @click="mode = 'register'"
          >
            Registrarse
          </button>
        </div>

        <!-- Error Message Global -->
        <div v-if="errorMsg" class="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
          {{ errorMsg }}
        </div>

        <!-- LOGIN -->
        <form v-if="mode === 'login'" class="flex flex-col gap-4" @submit.prevent>
          <BaseInput
            id="login-dni"
            v-model="loginForm.dni"
            label="DNI"
            placeholder="12345678A"
            :error="errorDni"
            required
          />

          <BaseInput
            id="login-password"
            v-model="loginForm.password"
            label="Contraseña"
            type="password"
            placeholder="Tu contraseña"
            :error="errorPassword"
            required
          />

          <BaseButton type="submit" variant="primary" class="mt-2 w-full" :loading="isLoading" @click="onLogin">
            Iniciar Sesión
          </BaseButton>

          <p class="text-center text-sm text-gray-500 dark:text-gray-400">
            ¿No tienes cuenta?
            <button type="button" class="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" @click="mode = 'register'">
              Regístrate
            </button>
          </p>
        </form>

        <!-- REGISTER -->
        <form v-else class="flex flex-col gap-4" @submit.prevent>
          <BaseInput
            id="register-nombre"
            v-model="registerForm.nombre"
            label="Nombre"
            placeholder="Tu nombre completo"
            required
          />

          <BaseInput
            id="register-dni"
            v-model="registerForm.dni"
            label="DNI"
            placeholder="12345678A"
            :error="errorDni"
            required
          />

          <BaseInput
            id="register-contacto"
            v-model="registerForm.contacto"
            label="Contacto (Email)"
            type="email"
            placeholder="tu@email.com"
            :error="errorEmail"
            required
          />

          <BaseInput
            id="register-password"
            v-model="registerForm.password"
            label="Contraseña"
            type="password"
            placeholder="Mínimo 5 caracteres"
            :error="errorPassword"
            required
          />

          <BaseButton type="submit" variant="primary" class="mt-2 w-full" :loading="isLoading" @click="onRegister">
            Registrarse
          </BaseButton>

          <p class="text-center text-sm text-gray-500 dark:text-gray-400">
            ¿Ya tienes cuenta?
            <button type="button" class="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" @click="mode = 'login'">
              Inicia sesión
            </button>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
