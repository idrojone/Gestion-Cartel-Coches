<script setup lang="ts">
import VehiculoForm from '@/components/VehiculoForm.vue';
import WelcomeComponent from '../components/Welcome.vue'
import CartelInfo from '@/components/CartelInfo.vue'
</script>

<template>
   <WelcomeComponent class="mb-10"/>
   <VehiculoForm />
   <CartelInfo class="mb-10" />
</template>
