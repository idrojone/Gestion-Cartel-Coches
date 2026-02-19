<script setup lang="ts">
import type { DashboardCase } from '../../services/dashboard.service';

defineProps<{
    cases: DashboardCase[];
    updating: string | null;
    estadoOptions: string[];
    accionOptions: string[];
}>();

const emit = defineEmits<{
    (e: 'update', payload: { c: DashboardCase, field: 'Estado' | 'Accion', value: string }): void;
}>();

const handleUpdate = (c: DashboardCase, field: 'Estado' | 'Accion', value: string) => {
    emit('update', { c, field, value });
};
</script>

<template>
    <div class="overflow-x-auto bg-white rounded-lg shadow-md">
        <table class="w-full border-collapse min-w-[800px]">
            <thead>
                <tr>
                    <th class="p-4 text-left border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold text-sm uppercase tracking-wider">ID Caso</th>
                    <th class="p-4 text-left border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold text-sm uppercase tracking-wider">DNI</th>
                    <th class="p-4 text-left border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold text-sm uppercase tracking-wider">Vehículo</th>
                    <th class="p-4 text-left border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold text-sm uppercase tracking-wider">Estado</th>
                    <th class="p-4 text-left border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold text-sm uppercase tracking-wider">Acción</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="c in cases" :key="c.idCaso || c._row" class="hover:bg-slate-50 last:border-b-0">
                    <td class="p-4 text-left border-b border-slate-200">{{ c.idCaso }}</td>
                    <td class="p-4 text-left border-b border-slate-200">{{ c.DNI }}</td>
                    <td class="p-4 text-left border-b border-slate-200">
                        <div class="flex flex-col">
                            <span>{{ c.Marca }} {{ c.Modelo }}</span>
                            <small class="text-slate-500 text-xs mt-0.5">{{ c.Matricula }}</small>
                        </div>
                    </td>
                    <td class="p-4 text-left border-b border-slate-200">
                        <select 
                            :value="c.Estado" 
                            @change="(e: Event) => handleUpdate(c, 'Estado', (e.target as HTMLSelectElement).value)"
                            :disabled="updating === c.idCaso"
                            class="py-2 px-3 rounded-md border border-slate-300 bg-white cursor-pointer text-sm w-full min-w-[160px] transition-all hover:border-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-70 disabled:cursor-wait"
                            :class="{'opacity-70 cursor-wait': updating === c.idCaso}"
                        >
                            <option disabled value="">Seleccionar...</option>
                            <option v-for="opt in estadoOptions" :key="opt" :value="opt">{{ opt }}</option>
                        </select>
                    </td>
                    <td class="p-4 text-left border-b border-slate-200">
                        <select 
                            :value="c.Accion" 
                            @change="(e: Event) => handleUpdate(c, 'Accion', (e.target as HTMLSelectElement).value)"
                            :disabled="updating === c.idCaso"
                            class="py-2 px-3 rounded-md border border-slate-300 bg-white cursor-pointer text-sm w-full min-w-[160px] transition-all hover:border-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-70 disabled:cursor-wait"
                            :class="{'opacity-70 cursor-wait': updating === c.idCaso}"
                        >
                            <option disabled value="">Seleccionar...</option>
                            <option v-for="opt in accionOptions" :key="opt" :value="opt">{{ opt }}</option>
                        </select>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

