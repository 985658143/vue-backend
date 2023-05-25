<template>
    <AbsoluteContainer>
        <page-header title="蔬菜列表">
            <!-- <template #content>
                <p>AbsoluteContainer</p>
                <p style="margin-bottom: 0;">该组件是一个 absolute 固定容器，表格自适应需要自行实现，可参考演示源码，缩小浏览器窗口高度可查看最终效果</p>
            </template> -->
        </page-header>
        <!-- 搜索栏 -->
        <page-main class="page-main" style="height: auto;">
            <el-form :model="search" size="small" label-width="120px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="搜索蔬菜">
                            <div class="search_wrap">
                                <el-input v-model="search.name" placeholder="请输入蔬菜名称，支持模糊查询" clearable />
                                <el-button type="primary" icon="el-icon-search" @click="searchClick()">搜索</el-button>
                                <el-button v-auth="'func.addVege'" type="primary" @click="handleAdd()">添加</el-button>
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
            <el-table :data="vegeList" border stripe highlight-current-row>
                <el-table-column type="index" label="id" width="50" />
                <el-table-column prop="vid" label="蔬菜编号" width="80"/>
                <el-table-column prop="vname" label="蔬菜姓名" width="100" />
                <el-table-column prop="vpurchasedate" label="保质期" width="100"/>
                <el-table-column prop="flag" label="保质期预警" width="100" align="center">
                    <template slot-scope="scope">
                        <img class="icon" v-if="scope.row.flag == 1" src="../../../../src/assets/images/warning.png" alt="warning">
                        <img class="icon" v-else src="../../../../src/assets/images/security.png" alt="security">
                    </template>
                </el-table-column>
                <el-table-column prop="vprice" label="价格" width="100"/>
                <el-table-column prop="vtotal" label="总量" width="100"/>
                <el-table-column prop="storage" label="仓库" width="120"/>
                <el-table-column prop="supplier" label="供应商" width="120"/>
                <el-table-column prop="func" label="操作">
                    <template slot-scope="scope">
                        <el-button v-auth="'func.addOrder'" size="mini" type="primary" @click="handleUserAdd(scope.$index, scope.row)">购买</el-button>
                        <el-button v-auth="'func.updateVege'" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 弹窗 -->
            <Drawer ref="child" :title="title" @submitConfirm="sumRequest()" @clearForm="clearForm()">
                <template v-slot:form-content >
                    <el-form :model="form" v-if="node == 'add'">
                        <el-form-item label="蔬菜类型" :label-width="formLabelWidth">
                            <el-select v-model="form.vtypeid" placeholder="蔬菜类型选择">
                                <el-option v-for="(item, i) in typeList[0]" :key="i" :label="item.tname" :value="item.tid"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="蔬菜姓名" :label-width="formLabelWidth">
                            <el-input v-model="form.vname" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="保质期" :label-width="formLabelWidth">
                            <el-input v-model="form.vexpirationdate" autocomplete="off">
                                <template slot="append">天</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="价格" :label-width="formLabelWidth">
                            <el-input v-model="form.vprice" autocomplete="off">
                                <template slot="append">元</template></el-input>
                        </el-form-item>
                        <el-form-item label="供应商" :label-width="formLabelWidth">
                            <el-select v-model="form.vsupid" placeholder="供应商选择">
                                <el-option v-for="(item, i) in typeList[1]" :key="i" :label="item.sname" :value="item.sid"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="仓库" :label-width="formLabelWidth">
                            <el-select v-model="form.stid" placeholder="仓库选择" @change="searchStorage(form.stid)">
                                <el-option v-for="(item, i) in typeList[2]" :key="i" :label="item.stname" :value="item.stid"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="总量" :label-width="formLabelWidth">
                            <el-input v-model="form.vtotal" autocomplete="off"></el-input>
                            <div style="color: red;">(仓库剩余量：{{ maxNum }})</div>
                        </el-form-item>
                    </el-form>
                    <el-form :model="form" v-if="node == 'userAdd'">
                        <el-form-item label="用户" :label-width="formLabelWidth">
                            <el-input v-model="form.uid" disabled placeholder="用户" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="蔬菜" :label-width="formLabelWidth" >
                            <el-input v-model="form.vname" disabled placeholder="蔬菜" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="订购数量" :label-width="formLabelWidth">
                            <el-input v-model="form.oweight" autocomplete="off"></el-input>
                            <div style="color: red;">(蔬菜剩余量：{{ form.vtotal }})</div>
                        </el-form-item>
                    </el-form>
                    <el-form :model="form" v-if="node == 'edit'">
                        <el-form-item label="vid" :label-width="formLabelWidth">
                            <el-input disabled v-model="form.vid" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="价格" :label-width="formLabelWidth">
                            <el-input v-model="form.vprice" autocomplete="off">
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                    </el-form>
                </template>
            </Drawer>
        </page-main>
    </AbsoluteContainer>
</template>

<script>
export default {
    name: 'vegetable',
    props: {},
    data() {
        return {
            search: {
                name: '',
            },
            vid: "",
            uid: "",
            dataValue: "",
            title: "",
            form: {},
            node: "",
            empty: {
                vid: "",
                stid: "",
                vtypeid: "",
                vsupid: "",
                vname: "",
                vexpirationdate: "",
                vprice: "",
                vtotal: "",
            },
            formLabelWidth: '80px',
            vegeList: [],
            typeList: {},
            typeList2: {},
            maxNum: "",
        }
    },
    created() {},
    beforeMount() {
        this.userAuthority();
    },
    mounted() {
        this.$nextTick(() => {
            // 获取表头高度，然后设置 .el-table__body-wrapper 的 height
            let height = document.getElementsByClassName('el-table__header-wrapper')[0].offsetHeight
            document.getElementsByClassName('el-table__body-wrapper')[0].style.height = `calc(100% - ${height}px)`
        })
        let val = window.location.href.split("?vname=")[1];
        console.log(val)
        val ? this.listRequest(1, {vague: decodeURI(val)}) : this.listRequest(0);
        this.getType();
        this.getVege();
    },
    methods: {
        // 获取权限
        userAuthority() {
            let uid = localStorage.getItem("uid");
            console.log(uid)
            this.uid = uid;
            this.empty2.uid = uid;
        },
        // 模糊查询
        searchClick() {
            let data = {vague: this.search.name}
            this.listRequest(1, data)
        },
        // 时间段选取
        dateChange() {
            let val = this.dataValue;
            let data = {
                startIndex: val[0],
                endIndex: val[1]
            }
            this.listRequest(2, data)
        },
        // 查询单个仓库信息
        searchStorage(val) {
            console.log(val)
            let data = {
                stid: val
            }
            this.$store.dispatch('repository/singleStorage', data).then((res) => {
                if(res.resultCode == 200) {
                    console.log(res)
                    this.maxNum = res.data.stsurplus;
                }else {
                    this.$message(res.message)
                }
            })
        },
        // 查询请求汇总
        listRequest(val, data) {
            const urls = [
            'vegetable/vegeList',
            'vegetable/searchVege',
            'vegetable/searchTime'
            ]
            // 0 是所有蔬菜列表 1是模糊查询 2是时间段查询
            this.$store.dispatch(urls[val], data).then((res) => {
                if(res.resultCode == 200) {
                    console.log(res.data)
                    let list = res.data;
                    list.forEach((item)=> {
                        item.vpurchasedate = item.vpurchasedate.slice(0, 10);
                        item.storage = item.storage.stname;
                        item.supplier = item.supplier.sname;
                    })
                    this.vegeList = list;
                }else {
                    this.$message(res.message)
                }
            })
        },
        // 获取仓库和供应商类型
        getType() {
            this.$store.dispatch('vegetable/getType').then((res) => {
                if(res.resultCode == 200) {
                    console.log(res)
                    this.typeList = res.data;
                }else {
                    this.$message(res.message)
                }
            })
        },
         // 获取 三个添加信息
         getVege() {
            let data = {}
            this.$store.dispatch("order/vegeInfo",data).then((res) => {
                console.log(res)
                if(res.resultCode == 200) {
                    let list = res.data;
                    this.typeList2 = list;
                }else {
                    this.$message(res.message)
                }
            })
        },
        // 打开添加弹窗
        handleAdd() {
            this.form = {...this.empty};
            this.title = "添加蔬菜";
            this.node = "add";
            this.$refs.child.showDialog();
        },
        // 打开用户购买弹窗
        handleUserAdd(index, obj) {
            this.form = {
                uid: this.uid,
                vid: obj.vid,
                vname: obj.vname,
                oweight: "",
                vtotal: obj.vtotal,
            };
            this.title = "购买蔬菜";
            this.node = "userAdd";
            this.$refs.child.showDialog();
        },
        // 打开修改弹窗
        handleEdit(index, obj) {
            console.log(index, obj);
            this.form = {
                vid: obj.vid,
                vprice: obj.vprice,
            };
            this.title = "修改蔬菜价格";
            this.node = "edit";
            this.$refs.child.showDialog();
        },
        // 增改请求
        sumRequest() {
            let val = this.node;
            const urls = {
                add: "vegetable/addVegetable",
                userAdd: "order/addOrder",
                edit: "vegetable/updateVege",
            }
            let data = this.form;
            if(val == "add" && data.vtotal > this.maxNum) {
                this.$message("蔬菜添加数量大于仓库剩余量")
                return
            }
            if(val == "userAdd" && data.oweight > this.form.vtotal) {
                this.$message("蔬菜订购数量大于蔬菜剩余量")
                return
            }
            this.$store.dispatch(urls[val], data).then((res) => {
                if(res.resultCode == 200) {
                    // 请求成功
                    this.$message({
                        type: 'success',
                        message: res.message
                    })
                    setTimeout(()=> {
                        // 刷新列表数据
                        this.listRequest(0);
                        // 关闭弹窗
                        this.$refs.child.showDialog();
                    }, 1500)
                    console.log(res)
                }else {
                    this.$message(res.message)
                }
            })
        },
        // 清空添加表单
        clearForm() {
            // let list = this.empty;
            // list.forEach((item) => item = "")
            this.form = {};
            this.maxNum = "";
            this.maxVege = ""
        }
    }
}
</script>

<style lang="scss" scoped>
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
}
</style>
