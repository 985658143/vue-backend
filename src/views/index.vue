<template>
    <div>
        <page-header title="欢迎使用 蔬菜管理系统">
            <template #content>
                <div>
                    <div v-if="identity == 0">系统管理员,你好！</div>
                    <div v-else>{{uname +","}}你好！</div>
                    <div>系统介绍：（自己写）</div>
                </div>
            </template>
        </page-header>
        <page-main>
            <div class="swiper">
                <MySwiper :noSwiper="noSwiper" :imgList="imgList"></MySwiper>
            </div>
        </page-main>
    </div>
</template>

<script>
import MySwiper from '../components/MySwiper';
export default {
    components: {
      MySwiper,
    },
    data() {
        return {
            identity: 0,
            uname: "",
            noSwiper: 'swiper-no-swiping',                // 控制     -> swiper是否能滑动
            swiper: null,
            imgList: [1,2,3]
        }
    },
    // 判断权限
    beforeMount() {
        this.userAuthority();
    },
    mounted() {
        this.mySwiper();
        
    },
    methods: {
        // swiper轮播
        mySwiper () {
            MySwiper.methods.initSwiper({
                onInit: (swiper) => {
                    this.swiper = swiper;
                }
            });
        },
        userAuthority() {
            let val = localStorage.getItem("identity");
            let uname = localStorage.getItem("account");
           
            val = JSON.parse(val);
            this.identity = val;
            this.uname = uname;
            console.log(uname)
        }
    },
}
</script>

<style lang="scss" scoped>

    .swiper {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        width: 919px;
        height: 800px;
        margin: 0 auto;
    }
</style>
