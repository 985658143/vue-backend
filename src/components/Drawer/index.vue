<template>
    <div class="form_drawer">
        <el-drawer
            :title="title"
            :visible.sync="dialog"
            direction="rtl"
            custom-class="demo-drawer"
            ref="drawer"
            >
            <div class="demo-drawer__content" style="padding: 20px;">
                <slot name="form-content"></slot>
                <div class="demo-drawer__footer">
                    <el-button @click="cancelForm">取 消</el-button>
                    <el-button type="primary" @click="handleClose()" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script>
export default {
    name: 'Drawer',
    props: {
        title: {
            type: String,
        },
    },
    data() {
        return {
            dialog: false,
            table: false,
            loading: false,
            timer: null,
            };
    },
    created() {},
    mounted() {},
    methods: {
        showDialog() {
            this.dialog = !this.dialog;
        },
        handleClose() {
            if (this.loading) {
                return;
            }
            this.$confirm('确定要提交表单吗？')
            .then(_ => {
                this.loading = true;
                // 请求表单
                this.$emit("submitConfirm")
                this.timer = setTimeout(() => {
                    // 动画关闭需要一定的时间
                    setTimeout(() => {
                    this.loading = false;
                    }, 400);
                }, 2000);
                })
            .catch(_ => {});
        },
        cancelForm() {
            this.loading = false;
            this.dialog = false;
            clearTimeout(this.timer);
            // 将有 添加操作 的表单清空
            this.$emit("clearForm")
        }
    }
}
</script>

