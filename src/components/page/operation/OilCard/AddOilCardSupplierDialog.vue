<!-- 新增油卡所属公司弹出框 -->
<template>
    <el-dialog title="新增油卡所属公司" :visible.sync="visible" width="550px" :top="marginTop" @close="close">
        <el-form size="small" :model="addOilCardSupplierForm" :rules="addOilCardSupplierRules"
                 ref="addOilCardSupplierForm"
                 label-width="140px">
            <el-row>
                <el-col :span="20">
                    <el-form-item label="类型:" prop="belongType">
                        <dictionary-select option-name="TYPE_OF_COMPANY" style="display:block;"
                                           @change="changBelongType" filterable
                                           v-model="addOilCardSupplierForm.belongType"></dictionary-select>
                    </el-form-item>
                </el-col>
                <el-col :span="20">
                    <el-form-item
                        v-if='addOilCardSupplierForm.belongType == Constant.OIL_CARD_SUPPLIER_TYPE.PLANTFORM_COMPANY'
                        label="供应商:" prop="supplierId"
                        :rules="[{required:true,message:'请输入供应商',trigger:'blur'}]">
                        <supplier-select v-model="addOilCardSupplierForm.supplierId" :clearable="true"
                                         style="display:block;"
                                         placeholder="请输入供应商"></supplier-select>
                    </el-form-item>
                </el-col>
                <el-col :span="20">
                    <el-form-item
                        v-if='addOilCardSupplierForm.belongType== Constant.OIL_CARD_SUPPLIER_TYPE.HEADQUARTERS'
                        label="油卡所属公司:" prop="name" :rules="[{required:true,message:'请输入所属公司',trigger:'blur'}]">
                        <el-input v-model="addOilCardSupplierForm.name" style="display:block;" :clearable="true"
                                  placeholder="请输入所属公司"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="close">取 消</el-button>
                <el-button size="small" type="primary" @click="AddNewOilCardSuppliersubmit('addOilCardSupplierForm')">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import {Http, Api} from 'src/global'
    import {Constant} from 'src/global/constant'

    export default {
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            lineCollectForm: {
                type: Array,
                default: function () {
                    return []
                }
            }
        },
        data() {
            return {
                Constant: Constant,//常量
                visible: this.dialogVisible,
                addOilCardSupplierForm: {
                    name: '',
                    supplierId: '',
                    belongType: '',
                },
                addOilCardSupplierRules: {
                    belongType: [
                        {required: true, message: '请选择类型', trigger: 'blur'},
                    ]
                },
                multipleSelection: []
            }
        },
        computed: {
            marginTop: function () {
                if (document.documentElement.clientHeight > 900) {
                    return "10vh";
                } else if (document.documentElement.clientHeight < 700) {
                    return "2vh";
                } else {
                    return "6vh";
                }
            }
        },
        mounted() {
            //拷贝一个 model 用于重置
            this.initializeModel = _.cloneDeep(this._data);
        },
        methods: {
            cloneMode() {
                return _.cloneDeep(this.initializeModel)
            },
            close() {
                this.$emit('close');
            },
            changBelongType(){
                this.addOilCardSupplierForm.name="";
                this.addOilCardSupplierForm.supplierId="";
            },
            AddNewOilCardSuppliersubmit(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.oilCardSupplier.add, vm.addOilCardSupplierForm, response => {
                            vm.resetAddOilCardSupplierForm();
                            vm.close();
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetAddOilCardSupplierForm() {
                let vm = this;
                vm.addOilCardSupplierSearchForm = vm.cloneMode().addOilCardSupplierSearchForm
            },
        }
    }
</script>
