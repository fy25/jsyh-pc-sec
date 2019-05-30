<template>
  <el-container>
    <el-header>
      <h4>标记详情</h4>
    </el-header>
    <el-main>
      <el-table :data="tableData" border style="width: 100%" :row-class-name="tableRowClassName">
        <el-table-column prop="SIGN_NAME" label="标记名称" width></el-table-column>
        <el-table-column prop="CENAME" label="企事业单位" width></el-table-column>
        <el-table-column prop="STATETEXT" label="标记状态" width></el-table-column>
        <el-table-column prop="PROVINCE" label="省" width></el-table-column>
        <el-table-column prop="CITY" label="市" width></el-table-column>
        <el-table-column prop="DISTRICT" label="区" width></el-table-column>
        <el-table-column prop="STREET" label="街道" width></el-table-column>
      </el-table>

      <el-table
        :data="activityList"
        border
        style="width: 100%;margin-top:50px"
        :row-class-name="tableRowClassName"
      >
        <el-table-column prop="ACTIVITY_NAME" label="活动名称" width></el-table-column>
        <el-table-column prop="REMARK" label="活动备注" width></el-table-column>
        <el-table-column prop="STATETEXT" label="活动状态" width></el-table-column>
        <el-table-column prop="BEGIN_DATE" label="开始时间" width></el-table-column>
        <el-table-column prop="END_DATE" label="结束时间" width></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="navigateTo(`/visitor?id=${scope.row.ACTIVITY_ID}`)"
            >查看访客记录</el-button>
            <el-button size="mini" type="danger" @click="deleteActivity(scope.row.ACTIVITY_ID)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-row>
        <el-button type="primary" @click.native="openActivity">添加活动</el-button>
        <!-- <el-button type="success">修改标记</el-button> -->
        <el-button type="danger" @click.native="deletePoint">删除标记</el-button>
      </el-row>
    </el-footer>
    <el-dialog title="添加活动" :visible.sync="dialogFormVisible" center>
      <div class="activity">
        <div class="input-item">
          <el-input v-model="Activity_Name" placeholder="请输入标题"/>
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
          <el-input v-model="Url" placeholder="请输入链接"/>
        </div>
        <!-- <div class="input-item">
          <el-select v-model="State" placeholder="请选择开发状态">
            <el-option
              v-for="item in statelist"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>-->
        <div class="input-item">
          <el-date-picker
            v-model="time"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
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
      tableData: [],
      dialogFormVisible: false,
      Activity_Name: null,
      Remark: null,
      Begin_Date: null,
      End_Date: null,
      State: null,
      Sign_ID: null,
      statelist: [
        {
          value: "0",
          label: "未开始"
        },
        {
          value: "1",
          label: "开始"
        },
        {
          value: "2",
          label: "结束"
        },
        {
          value: "3",
          label: "超时"
        }
      ],
      Img: "",
      time: "",
      activityList: [],
      uploadImg: [],
      Url: ""
    };
  },
  mounted() {
    let userInfo = JSON.parse(localStorage.getItem("userinfo"));
    this.userInfo = userInfo;
    this._key = this.$route.query._key;
    this.getOne();
    this.getActivity();
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
      let { Activity_Name, Remark, time, State, Url } = this;
      if (Activity_Name == null) {
        this.$message({
          message: "请填写活动名称",
          type: "warning"
        });
      } else if (time == "") {
        this.$message({
          message: "请选择时间",
          type: "warning"
        });
      } else {
        let data = {
          action: "add_activity_index",
          _key: "",
          Activity_Name: Activity_Name,
          Remark: encodeURI(Remark),
          Begin_Date: this.crtTimeFtt(time[0]),
          End_Date: this.crtTimeFtt(time[1]),
          State: State,
          Img: img,
          user_id: this.userInfo.USER_ID,
          Sign_ID: this.tableData[0].SIGN_ID,
          Url: Url
        };
        console.log(data);
        publicApi.publicApi("/ajax/Com_PCInfo.ashx", data).then(res => {
          console.log(res);
          if (res.code == "success") {
            this.$message({
              type: "success",
              message: "添加成功!"
            });
            this.getActivity();
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

    // 该标注下的所有活动
    getActivity() {
      let data = {
        action: "get_activity_index",
        pageIndex: "1",
        pageSize: "10",
        is_all: "1",
        sign_id: this._key,
        user_id: this.userInfo.USER_ID
      };
      let { tableData } = this;
      publicApi.publicApi("/ajax/Com_PCInfo.ashx", data).then(res => {
        console.log(res, "oooooo");
        if (res.code == "success") {
          if (res.data.length != 0) {
            res.data.forEach(item => {
              item.REMARK = decodeURI(item.REMARK);
              switch (item.STATE) {
                case "0":
                  item.STATETEXT = "未开始";
                  break;
                case "1":
                  item.STATETEXT = "开始";
                  break;
                case "2":
                  item.STATETEXT = "结束";
                  break;
                case "3":
                  item.STATETEXT = "超时";
                  break;
              }
            });
          }
        }
        this.activityList = res.data;
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
    // 删除标记
    deletePoint() {
      this.$confirm("删除该标记, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let data = {
            action: "del_sign_index",
            pkVal: this._key,
            user_id: this.userInfo.USER_ID
          };
          publicApi.publicApi("/ajax/Com_PCInfo.ashx", data).then(res => {
            console.log(res);
            if (res.code == "success") {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.redirectTo("/index");
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

    // 删除活动
    deleteActivity(id) {
      this.$confirm("删除该标记, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let data = {
            action: "del_activity_index",
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
              this.getActivity();
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
      // console.log(path)
      this.$router.push({ path: path });
    }
  }
};
</script>