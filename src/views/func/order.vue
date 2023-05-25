<template>
    <AbsoluteContainer>
        <page-header title="订单列表">
        </page-header>
        <!-- 搜索栏 -->
        <page-main class="page-main" style="height: auto;">
            <el-form :model="search" size="small" label-width="120px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="搜索蔬菜">
                            <div class="search_wrap">
                                <el-input v-model="search.id" placeholder="请输入蔬菜id查询" clearable />
                                <el-button type="primary" icon="el-icon-search" @click="searchClick()">搜索</el-button>
                                </div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <!-- 时间段选取 -->
            <div class="date_box">
                <div class="data_text">按时间查询</div>
                <el-date-picker
                    v-model="dataValue"
                    type="daterange"
                    @change="dateChange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
            </div>
        </page-main>
        <page-main>
            <el-table :data="orderList" border stripe highlight-current-row>
                <el-table-column type="index" label="id" width="50" />
                <el-table-column prop="user.uname" label="订购人" width="80" />
                <el-table-column prop="vegetable.vname" label="蔬菜" width="80" />
                <el-table-column prop="storage.stname" label="仓库" width="150" />
                <el-table-column prop="ototal" label="成交额" width="100" />
                <el-table-column prop="oweight" label="总量"  width="100"/>
                <el-table-column prop="odate" label="订购日期" />
            </el-table>
        </page-main>
    </AbsoluteContainer>
</template>

<script>
export default {
    name: 'order',
    props: {},
    data() {
        return {
            search: {
                id: '',
            },
            dataValue: "",
            uid: "",
            orderList: [],
        }
    },
    beforeMount() {
        this.userAuthority();
    },
    mounted() {
        this.$nextTick(() => {
            // 获取表头高度，然后设置 .el-table__body-wrapper 的 height
            let height = document.getElementsByClassName('el-table__header-wrapper')[0].offsetHeight
            document.getElementsByClassName('el-table__body-wrapper')[0].style.height = `calc(100% - ${height}px)`
        })
        this.listRequest("sum");
    },
    methods: {
        // 时间段选取
        dateChange() {
            let val = this.dataValue;
            let data = {
                startIndex: val[0],
                endIndex: val[1]
            }
            this.listRequest("sum", data)
        },
        // 查询蔬菜订单
        searchClick() {
            if(this.search.id == "") {
                this.listRequest("sum")
            }else {
                let data = {vid: this.search.id};
                this.listRequest("vege", data)
            }
        },
        // 查询单个蔬菜的数量
        searchSingle(val) {
            console.log(val)
            let data = {
                vid: val
            }
            this.$store.dispatch("order/searchSingle",data).then((res) => {
                console.log(res)
                if(res.resultCode == 200) {
                    // 请求成功
                    this.maxNum = res.data.vtotal;
                }else {
                    this.$message(res.message)
                }
            })
        },
        // 查询请求汇总
        listRequest(val, data) {
            const urls = {
                sum: {
                    url: 'order/orderList',
                    data: {uid: this.uid, ...data}
                },
                vege: {
                    url: 'order/searchVege',
                    data: {...data}
                }
            }
            console.log(urls[val].data)
            this.$store.dispatch(urls[val].url, urls[val].data).then((res) => {
                console.log(res)
                if(res.resultCode == 200) {
                    let list = res.data;
                    list.forEach((item)=> {
                        item.odate = item.odate.slice(0, 10)
                    })
                    this.orderList = list;
                    console.log(res)
                }else {
                    this.$message(res.message)
                }
            })
        },
        // 获取权限
        userAuthority() {
            let uid = localStorage.getItem("uid");
            console.log(uid)
            this.uid = uid;
        },
    }
}
</script>

<style lang="scss" scoped>

.page-main {
    display: flex;
    flex-direction: column;

    // 减去的 40px 为 page-main 的上下 margin
    // 减去的 130px 为 page-header 的高度，如果没有设置，可以去掉

    height: calc(100% - 40px - 130px);
    ::v-deep .el-table {
        height: 100%;
        .el-table__body-wrapper {
            overflow-y: auto;
        }
    }
    .date_box {
        display: block;
        position: relative;
        width: 550px;
        box-sizing: border-box;
        .data_text {
            display: inline-block;
            width: 120px;
            text-align: right;
            font-size: 14px;
            padding-right: 10px;
        }
    }
    .icon {
        width: 30px;
        height: 30px;
    }
    .search_wrap {
        display: flex;
        width: 100%;
        height: 100%;
    }
}
</style>
