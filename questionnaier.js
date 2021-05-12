let app = new Vue({
    el: '#app',
    data: {
        pageNumber: 1,
        total: 3,
        gender: '',
        fruits: [],
        introduce: '',
        notNextPage: true,
        notSubmit: true,
    },
    watch: {
        gender: function (val) {
            if(val) {
                this.notNextPage = false;
            } else {
                this.notNextPage = true;
            }
        },
        fruits: function (val) {
            if (val.length === 2 || val.length === 3) {
                this.notNextPage = false;
            } else {
                this.notNextPage = true;
            }
        },
        introduce: function(val) {
            if (val.length >= 10) {
                this.notSubmit = false;
            } else {
                this.notSubmit = true;
            }
        },
    }
})