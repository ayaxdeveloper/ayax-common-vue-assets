<template>
  <v-text-field
    v-model="formattedValue"
    @keydown="formatInput()"
    @keyup="formatInput()"
    @keypress="formatInput()"
    @input="formatInput()"
    @blur="formatInput()"
    @focus="formatInput()"
    v-bind="$attrs"
    ref="phone-input"
    maxlength="17"
  ></v-text-field>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch, Emit } from "vue-property-decorator";

@Component({
  name: "a-phone-input"
})
export default class PhoneInputComponent extends Vue {
  @Prop({ type: String || Number, default: "" }) value: string | number;
  @Prop({ type: Number, default: 0 }) forceFormatting: number;

  formattedValue: string = this.value.toString();

  @Watch("forceFormatting")
  onForce() {
    this.formatInput(true);
  }

  created() {
    this.formatInput(true);
  }

  mounted() {
    setTimeout(() => this.formatInput(true), 500);
  }

  formatInput(initial = false) {
    const inputEvent = event as any;
    if (
      !inputEvent ||
      (inputEvent.inputType &&
        inputEvent.inputType !== "deleteContentBackward" &&
        inputEvent.inputType !== "deleteContentForward")
    ) {
      let inputValue = this.formattedValue.replace(/\D/g, "");

      if (initial) {
        if (inputValue.length < 11) {
          inputValue = "8" + inputValue.substring(0, inputValue.length);
        }
      }

      if (this.formattedValue) {
        if (
          inputEvent &&
          inputEvent.inputType &&
          inputEvent.inputType === "insertFromPaste"
        ) {
          let pasteValue = inputEvent.target.value.replace(/\D/g, "");
          if (pasteValue.length < 11) {
            inputValue = "8" + inputValue.substring(0, inputValue.length);
          }
        }

        const reg = /^(\d{1})(\d{3})(\d{3})?(\d{2})?(\d{2})?/;
        inputValue = inputValue.replace(reg, "8 ($2) $3-$4-$5");

        this.formattedValue = inputValue;

        setTimeout(() => {
          this.$refs["phone-input"]["$refs"]["input"].value = inputValue;
        }, 0);
      }
    }
  }

  @Watch("formattedValue")
  onFormat() {
    let result = "";
    if (this.formattedValue) {
      result = this.formattedValue.replace(/\D/g, "");
    }
    this.emitValue(result);
  }

  @Emit("input")
  emitValue(value) {}

  @Watch("value")
  onValueChange(value) {
    this.formattedValue = value.toString();
    this.formatInput(true);
  }
}
</script>
