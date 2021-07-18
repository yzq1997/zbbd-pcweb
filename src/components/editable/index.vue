<template>
    <div v-html="innerText"
         :contenteditable="canEdit"
         @focus="isLocked = true"
         @blur="onblur()"
         @input="changeText">
    </div>
</template>
<script>
import pubFun from "./../../utils/pub";
    export default{
        name: 'editDiv',
        props: {
            value: {
                type: String,
                default: ''
            },
            canEdit: {
                type: Boolean,
                default: true
            },
            limitValue: {
                default: 0,
            }
        },
        data(){
            return {
                innerText: this.value,
                isLocked: false
            }
        },
        watch: {
            'value'(){
                if (!this.isLocked || !this.innerText) {
                    this.innerText = this.value;
                }
            }
        },
        methods: {
            changeText(){
                this.$emit('input', this.$el.innerHTML);
            },
            onblur(){
               this.isLocked = false;
               let elstr=pubFun.delHtmlTag(this.$el.innerHTML);
                if (elstr.length > this.limitValue&&this.limitValue>0) {
                    this.$message.info('内容长度限制为'+this.limitValue);
                    this.$el.innerHTML =elstr.slice(0, this.limitValue);
                     this.$emit('input', this.$el.innerHTML);
                 }
            }
        }
    }
</script>
<style>
    p{
        margin-bottom: 0 !important;
    }
</style>