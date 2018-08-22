<template>
    <div>
        <div class="busyLoadingComponent"></div>
        <v-layout style="position: absolute; z-index: 3; width: 100%" justify-center align-center fill-height>
            <v-progress-circular :size="size" :style="{color: color}" indeterminate :width="width" >
            </v-progress-circular>
        </v-layout>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
export default class BusyLoadingComponent extends Vue {
    @Prop({default: 70}) size: number;
    @Prop({default: "#e6e6e6"}) maskColor: string;
    @Prop({default: "#1976d2"}) color: string;
    @Prop({default: 5}) width: number;
}
</script>

<style scoped>
    .busyLoadingComponent {
        position: absolute;
        z-index: 3;
        left:0;
        right:0;
        top: 0;
        bottom: 0;
        background-color: #e6e6e6;
        opacity: 0.3;
    }
</style>
