Vue.component('button-group', {
    props: {
        value: {
            type: Number,
            required: true,
            default: 1,
        },
        total: {
            type: Number,
            required: true,
        },
        notNextPage: {
            type: Boolean,
            required: true,
            default: true,
        },
        notSubmit: {
            type: Boolean,
            required: true,
            default: true,
        },
    },
    data: function (){
        return {
            currentValue: this.value,
            currentNotNext: this.notNextPage,
        };
    },
    created: function () {  //每次将下一步按钮先置灰，然后更新父组件的数据，否则父组件又给改回去了
        this.currentNotNext = true;
        this.$parent.notNextPage = true;
    },
    template: '\
    <div> \
        <button v-show="value!==1" class="btn btn-primary mr-2" @click="lastP">上一步</button> \
        <button v-show="value!==total" :disabled="notNextPage" class="btn btn-primary mr-2" @click="nextP">下一步</button> \
        <button class="btn btn-primary mr-2" @click="reset">重置</button> \
        <button v-show="value===total" :disabled="notSubmit" class="btn btn-primary mr-2" @click="submit">提交</button> \
    </div> \
        ',
    watch: {
        currentValue: function (val) {
            this.$emit('input', val);
        },
    },
    methods: {
        nextP: function() {
            this.currentValue++;
        },
        lastP: function() {
            this.currentValue--;
        },
        reset: function() {
            if (this.currentValue === 1) {
                this.$parent.gender = '';
            }
            if (this.currentValue === 2) {
                this.$parent.fruits = [];
            }
            if (this.currentValue === 3) {
                this.$parent.introduce = '';
            }
        },
        submit: function () {
            let gender = this.$parent.gender;
            let fruits = this.$parent.fruits;
            let info = this.$parent.introduce;
            alert("Information:\r"+"gender: "+gender+"\rLike fruits: "+fruits+"\rIntroduce: "+info);
        },
    },
})