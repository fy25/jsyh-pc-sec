<template>
  <el-container>
    <el-header>
      <h4>访客详情</h4>
    </el-header>
    <el-main>
      <el-table
        :data="visitorList"
        border
        style="width: 100%;margin-top:50px"
        :row-class-name="tableRowClassName"
      >
        <el-table-column prop="CALLER_NAME" label="受访人" width></el-table-column>
        <el-table-column prop="REMARK" label="受访备注" width></el-table-column>
        <el-table-column prop="CALLER_PHONE" label="受访人电话" width></el-table-column>
        <el-table-column prop="STATETEXT" label="受访人定位" width></el-table-column>
        <el-table-column prop="CREATEUSERNAME" label="创建人" width></el-table-column>
        <el-table-column prop="CREATEDATE" label="创建时间" width></el-table-column>
        <el-table-column prop="MODIFYUSERNAME" label="修改人" width></el-table-column>
        <el-table-column prop="MODIFYDATE" label="修改时间" width></el-table-column>
        <el-table-column prop="ACTIVITY_NAME" label="活动名称" width></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="navigateTo(`/visitor?id=${scope.row.ACTIVITY_ID}`)"
            >查看访客记录</el-button>
            <el-button size="mini" type="danger" @click="deletePoint(scope.row.CALLER_ID)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-row>
        <el-button type="primary" @click.native="openActivity">添加访客</el-button>
      </el-row>
    </el-footer>
    <el-dialog title="添加访客" :visible.sync="dialogFormVisible" center>
      <div class="activity">
        <div class="input-item">
          <el-input v-model="Caller_Name" placeholder="请输入受访人名称"/>
        </div>
        <div class="input-item">
          <el-input v-model="Caller_Phone" placeholder="请输入受访人电话"/>
        </div>
        <div class="input-item">
          <el-input
            v-model="Remark"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
          />
        </div>
        <div class="input-item">
          <el-select v-model="State" placeholder="请选择受访人定位">
            <el-option
              v-for="item in statelist"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="input-item">
          <input
            type="file"
            @change="changeImage($event)"
            accept="image/gif, image/jpeg, image/jpg, image/png"
          >
          <div class="img-list">
            <img v-for="item in uploadImg" :src="item" alt>
          </div>
        </div>
        <div class="btn-group">
          <button @click="submitTap">添加</button>
        </div>
      </div>
    </el-dialog>
  </el-container>
</template>

<style lang="scss" scoped >
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
.activity {
  .input-item {
    margin: 30px 0;
    .img-list {
      margin: 10px;
      img {
        width: 80px;
        height: 80px;
        margin: 0 10px;
      }
    }
  }
  .btn-group {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    button {
      border-radius: 5px;
      font-size: 14px;
      color: #fff;
      width: 350px;
      outline: none;
      border: 1px solid #ccc;
      height: 50px;
      margin: 10px 0;
      background-color: #fff;
      color: #666;
      cursor: pointer;
    }
    button:first-child {
      background-color: #006ab8;
      color: #fff;
    }
  }
}
</style>

<script>
import * as publicApi from "../../api/public";
export default {
  data() {
    return {
      dialogFormVisible: false,
      Caller_Name: null,
      Caller_Phone: null,
      Remark: null,
      State: null,
      Activity_ID: null,
      statelist: [
        {
          value: "0",
          label: "不可发掘客户"
        },
        {
          value: "1",
          label: "未跟进客户"
        },
        {
          value: "2",
          label: "已跟进客户"
        }
      ],
      Img: "",
      visitorList: [],
      uploadImg: []
    };
  },
  mounted() {
    let userInfo = JSON.parse(localStorage.getItem("userinfo"));
    this.userInfo = userInfo;
    this.activity_id = this.$route.query.id;
    this.getVisitor();
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },

    // 打开活动弹窗
    openActivity() {
      this.dialogFormVisible = true;
    },

    // 提交活动
    submitTap() {
      let img = null;
      if (this.uploadImg.length > 0) {
        img = this.uploadImg.join("|");
      } else if (this.uploadImg.length == 0) {
        img = "";
      } else {
        img = this.uploadImg;
      }
      let { Caller_Name, Remark, Caller_Phone, State, Img } = this;
      if (Caller_Name == null) {
        this.$message({
          message: "请填写活动名称",
          type: "warning"
        });
      } else if (Caller_Phone == null) {
        this.$message({
          message: "请填写电话",
          type: "warning"
        });
      } else if (State == null) {
        this.$message({
          message: "请选择状态",
          type: "warning"
        });
      } else {
        let data = {
          action: "add_caller_index",
          _key: "",
          Caller_Name: Caller_Name,
          Remark: encodeURI(Remark),
          Caller_Phone: Caller_Phone,
          State: State,
          Img: img,
          user_id: this.userInfo.USER_ID,
          Activity_ID: this.activity_id
        };
        console.log(data);
        publicApi.publicApi("/ajax/Com_PCInfo.ashx", data).then(res => {
          console.log(res);
          if (res.code == "success") {
            this.$message({
              type: "success",
              message: "添加成功!"
            });
            this.getVisitor();
            this.dialogFormVisible = false;
          }
        });
      }
    },

    crtTimeFtt(val, row) {
      if (val != null) {
        var date = new Date(val);
        return (
          date.getFullYear() +
          "-" +
          (date.getMonth() + 1) +
          "-" +
          date.getDate()
        );
      }
    },

    // 获取单条数据
    getOne() {
      let data = {
        action: "get_sign_object",
        _key: this._key,
        user_id: this.userInfo.USER_ID
      };
      let { tableData } = this;
      console.log("/ajax/Com_PCInfo.ashx", data);
      publicApi.publicApi("/ajax/Com_PCInfo.ashx", data).then(res => {
        console.log(res, "lllll");
        if (res.code == "success") {
          switch (res.data.STATE) {
            case "0":
              res.data.STATETEXT = "未开发";
              break;
            case "1":
              res.data.STATETEXT = "正在开发";
              break;
            case "2":
              res.data.STATETEXT = "已开发";
              break;
          }
          tableData.push(res.data);
          this.tableData = tableData;
          console.log(this.tableData);
        }
      });
    },

    // 该活动下的所有访客
    getVisitor() {
      let data = {
        action: "get_caller_index",
        pageIndex: "1",
        pageSize: "10",
        is_all: "1",
        activity_id: this.activity_id,
        sign_id: this._key,
        user_id: this.userInfo.USER_ID
      };
      let { tableData } = this;
      publicApi.publicApi("/ajax/Com_PCInfo.ashx", data).then(res => {
        console.log(res, "oooooo");
        if (res.data.length != 0) {
          res.data.forEach(item => {
            item.REMARK = decodeURI(item.REMARK);
            switch (item.STATE) {
              case "0":
                item.STATETEXT = "不可挖掘客";
                break;
              case "1":
                item.STATETEXT = "未跟进";
                break;
              case "2":
                item.STATETEXT = "已跟进";
                break;
            }
          });
        }
        this.visitorList = res.data;
      });
    },
    // 选择图片
    changeImage(e) {
      console.log(e);
      let { uploadImg } = this;
      let file = e.target.files[0];
      if (file) {
        this.file = file;
        console.log(this.file);
        let reader = new FileReader();
        let that = this;
        reader.readAsDataURL(file);
        reader.onload = function(e) {
          // 这里的this 指向reader
          console.log(e);
          uploadImg.push(this.result);
          that.uploadImg = uploadImg;
          that.Img = this.result;
        };
      }
    },
    // 删除访客
    deletePoint(id) {
      this.$confirm("删除该标记, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let data = {
            action: "del_caller_index",
            pkVal: id,
            user_id: this.userInfo.USER_ID
          };
          console.log(data);
          publicApi.publicApi("/ajax/Com_PCInfo.ashx", data).then(res => {
            console.log(res);
            if (res.code == "success") {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getVisitor();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 跳转
    redirectTo(path) {
      this.$router.replace({ path: path });
    },

    navigateTo(path) {
      console.log(path);
      // this.$router.push({ path: path });
    }
  }
};
</script>