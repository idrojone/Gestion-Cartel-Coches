<script setup lang="ts">
import { onMounted } from 'vue';
import { useDashboardCases } from '../composables/useDashboardCases';
import DashboardHeader from '../components/dashboard/DashboardHeader.vue';
import DashboardTable from '../components/dashboard/DashboardTable.vue';

const { 
    cases, 
    loading, 
    error, 
    updating, 
    ESTADO_OPTIONS, 
    ACCION_OPTIONS, 
    loadCases, 
    handleUpdate 
} = useDashboardCases();

onMounted(() => {
    loadCases();
});
</script>

<template>
    <div class="p-5 mx-auto w-full max-w-[1400px]">
        <DashboardHeader 
            :loading="loading" 
            @refresh="loadCases" 
        />

        <div v-if="error" class="bg-red-100 text-red-800 p-3 rounded-md mb-5 border border-red-200">
            {{ error }}
        </div>

        <div v-if="loading" class="text-center p-10 text-slate-500 text-lg">
            Cargando datos...
        </div>

        <DashboardTable 
            v-else
            :cases="cases"
            :updating="updating"
            :estado-options="ESTADO_OPTIONS"
            :accion-options="ACCION_OPTIONS"
            @update="({ c, field, value }) => handleUpdate(c, field, value)"
        />
    </div>
</template>
