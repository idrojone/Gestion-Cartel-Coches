<script setup lang="ts">
    import { ref } from 'vue'

    const username = ref('')
    const password = ref('')

    const handleSubmit = () => {
        alert (`Username: ${username.value}, Password: ${password.value}`)
    }
</script>

<template>
    <div>
        <h3>Iniciar Sessión</h3>

        <label for="username">Username:</label>
        <input id="username" type="text" v-model="username" placeholder="Ingresa tu nombre de usuario" />

        <label for="password">Password:</label>
        <input id="password" type="password" v-model="password" placeholder="Ingresa tu contraseña" />


        <button @click="handleSubmit">
            Iniciar Sessión
        </button>
    </div>
</template>