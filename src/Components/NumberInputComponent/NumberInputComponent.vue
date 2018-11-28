<template>
    <div>
        <v-text-field
            v-model="formattedValue"
            @keydown="formatInput()"
            @keyup="formatInput()"
            @keypress="formatInput()"
            @input="formatInput()"
            @blur="formatInput()"
            @focus="formatInput()"
            v-bind="$attrs"
            ref="number-input"
        ></v-text-field>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch, Emit } from "vue-property-decorator";

@Component({
    name: "a-number-input"
})
export default class NumberInputComponent extends Vue {
    @Prop({ default: "" }) value: any;
    @Prop({ default: 2 }) numbersAfterComma: number;

    formattedValue: string = this.value.toString();

    created() {
        this.formatInput(true);
    }

    formatInput(initial = false) {
        if (this.formattedValue) {
            let inputValue = this.formattedValue.replace(/^\D/g, "");

            if (this.numbersAfterComma > 0) {
                inputValue = inputValue.replace(/,/g, ".");
                inputValue = inputValue.replace(/([^\d,.])/g, "");

                if (inputValue.includes(".")) {
                    let str = inputValue.split(".", 2);
                    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                    str[0] += ".";
                    if (str.length > 1) {
                        str[1].replace(".", "");
                        if (str[1].length > this.numbersAfterComma) {
                            str[1] = str[1].slice(0, this.numbersAfterComma);
                        }
                    }
                    inputValue = str.join("");
                } else {
                    inputValue = inputValue.replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        " "
                    );
                }
            } else {
                inputValue = inputValue.replace(/([^\d])/g, "");
                inputValue = inputValue.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            }

            this.formattedValue = inputValue;
            if (!initial) {
                setTimeout(() => {
                    this.$refs["number-input"]["$refs"][
                        "input"
                    ].value = inputValue;
                }, 0);
            }
        }
    }

    @Watch("formattedValue")
    onFormat() {
        let result = "";
        if (this.formattedValue) {
            result = this.formattedValue.replace(/\s/g, "");
        }
        this.emitValue(parseFloat(result));
    }

    @Emit("input")
    emitValue(value) {}
}
</script>
