<template>
  <el-container>
    <el-header>
      <h4>标记详情</h4>
    </el-header>
    <el-main>
      <el-table :data="tableData" border style="width: 100%" :row-class-name="tableRowClassName">
        <el-table-column prop="STATETEXT" label="标记类型"></el-table-column>
        <el-table-column prop="SIGN_NAME" label="标记名称"></el-table-column>
        <el-table-column prop="CENAME" label="社区/企事业单位名称"></el-table-column>
        <el-table-column prop="BUG_NAME" label="分行名称"></el-table-column>
        <el-table-column prop="EXPAND" label="该社区/企事业单位总人数" v-if="ISPUBLIC=='1'"></el-table-column>
        <el-table-column prop="ENDEXPAND" label="该社区/企事业单位已拓展人数" v-if="ISPUBLIC=='1'"></el-table-column>
        <el-table-column prop="ACT_COUNT" label="总活动数量" v-if="ISPUBLIC=='1'"></el-table-column>
        <el-table-column prop="ACT_COUNT_BY" label="本月活动数量" v-if="ISPUBLIC=='1'"></el-table-column>
        <el-table-column prop="ACT_COUNT_BZ" label="本周活动数量" v-if="ISPUBLIC=='1'"></el-table-column>
        <el-table-column prop="ACT_COUNT_SY" label="上月活动数量" v-if="ISPUBLIC=='1'"></el-table-column>
        <el-table-column prop="ACT_COUNT_SZ" label="上周活动数量" v-if="ISPUBLIC=='1'"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="btngroup">
              <el-button size="mini" type="primary" @click="openPoint">编辑标记</el-button>
            </div>
            <div>
              <el-button size="mini" type="danger" @click.native="deletePoint">删除标记</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-table
        :data="activityList"
        border
        style="width: 100%;margin-top:50px"
        :row-class-name="tableRowClassName"
        v-if="ISPUBLIC=='1'"
      >
        <el-table-column prop="ACTIVITY_NAME" label="活动名称"></el-table-column>
        <el-table-column prop="REMARK" label="活动备注"></el-table-column>
        <el-table-column prop="URL" label="URL链接"></el-table-column>
        <el-table-column prop="BEGIN_DATE" label="开始时间"></el-table-column>
        <!-- <el-table-column prop="END_DATE" label="结束时间"></el-table-column> -->
        <!-- <el-table-column label="图片">
          <template slot-scope="scope">
            <img v-for="(item,inde) in scope.row.imgList" :src="item" alt>
          </template>
        </el-table-column>-->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="openActicity(scope.row.ACTIVITY_ID)">编辑活动</el-button>
            <el-button size="mini" type="danger" @click="deleteActivity(scope.row.ACTIVITY_ID)">删除活动</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-row>
        <el-button type="primary" @click.native="openActivity" v-if="ISPUBLIC=='1'">添加活动</el-button>
      </el-row>
    </el-footer>
    <el-dialog title="添加活动" :visible.sync="dialogFormVisible" center>
      <div class="activity">
        <div class="input-item">
          <el-input v-model="Activity_Name" placeholder="请输入标题" />
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
          <el-input v-model="Url" placeholder="请输入链接" />
        </div>
        <div class="input-item">
          <el-date-picker
            v-model="Begin_Date"
            type="date"
            placeholder="选择活动开始时间"
            :picker-options="pickerOptions0"
          ></el-date-picker>
        </div>
        <div class="input-item">
          <input
            type="file"
            @change="changeImage($event)"
            accept="image/gif, image/jpeg, image/jpg, image/png"
          />
          <div class="img-list">
            <img v-for="item in uploadImg" :src="item" alt />
          </div>
        </div>
        <div class="btn-group">
          <button @click="submitTap(true)" v-if="editActivity">修改</button>
          <button @click="submitTap(false)" v-else>添加</button>
        </div>
      </div>
    </el-dialog>

    <!-- 标记 -->
    <el-dialog title="修改标记" :visible.sync="pointDialog" center>
      <div class="activity">
        <div class="input-item">
          <el-input v-model="SIGN_NAME" :value="SIGN_NAME" placeholder="请输入标题" />
        </div>
        <div class="input-item">
          <el-input v-model="CENAME" :value="CENAME" placeholder="请输入企事业单位名称" />
        </div>
        <div class="input-item" v-if="IsPublic!=0">
          <el-input v-model="EXPAND" :value="EXPAND" placeholder="请输入拓展人数" />
        </div>
        <div class="input-item" v-if="IsPublic!=0">
          <el-input v-model="ENDEXPAND" :value="ENDEXPAND" placeholder="请输入已拓展人数" />
        </div>
        <div class="btn-group">
          <button @click="editTap">修改</button>
        </div>
      </div>
    </el-dialog>

    <div class="goback">
      <el-button type="info" @click="goBack">返回上一页</el-button>
    </div>
  </el-container>
</template>

<style lang="scss" scoped >
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
.btngroup {
  padding: 10px 0;
}
.goback {
  display: flex;
  justify-content: center;
  align-items: center;
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
import { Config } from "../../utils/config";
export default {
  data() {
    return {
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6;
        }
      },
      Config,
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
      // Begin_Date: "",
      activityList: [],
      uploadImg: [],
      Url: "",
      pointDialog: false,
      BUG_ID: "",
      CENAME: "",
      CITY: "",
      ENDEXPAND: "",
      EXPAND: "",
      IsPublic: "",
      ISPUBLIC: "",
      LATITUDE: "",
      LONGITUDE: "",
      PROVINCE: "",
      REMARK: "",
      SIGN_ID: "",
      SIGN_NAME: "",
      STATE: "",
      STREET: "",
      DISTRICT: "",
      editActivity: false
    };
  },
  mounted() {
    let userInfo = JSON.parse(localStorage.getItem("userinfo"));
    this.userInfo = userInfo;
    this.sign_id = this.$route.query._key;
    this._key = this.$route.query._key;
    this.getBranch();
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

    goBack() {
      this.$router.go(-1);
    },

    // 打开活动弹窗
    openActivity() {
      this.dialogFormVisible = true;
    },

    // 获取单条活动
    getActivityOne(id) {
      let data = {
        action: "get_activity_object",
        _key: id,
        user_id: this.userInfo.USER_ID
      };
      publicApi.publicApi("/ajax/Com_PCInfo.ashx", data).then(res => {
        console.log(res, "yuyuyuyuy");
        this.Activity_Name = res.data.ACTIVITY_NAME;
        this.Remark = decodeURI(res.data.REMARK);
        this.Url = res.data.URL;
      });
    },

    // 开启活动修改
    openActicity(id) {
      this.getActivityOne(id);
      this.dialogFormVisible = true;
      this.editActivity = true;
      this._key = id;
    },

    // 提交活动
    submitTap(id) {
      // console.log(this.crtTimeFtt(this.Begin_Date));
      let img = null;
      if (this.uploadImg.length > 0) {
        img = this.uploadImg.join("|");
      } else if (this.uploadImg.length == 0) {
        img = "";
      } else {
        img = this.uploadImg;
      }
      let { Activity_Name, Remark, Begin_Date, State, Url } = this;
      if (Activity_Name == null) {
        this.$message({
          message: "请填写活动名称",
          type: "warning"
        });
      } else if (Begin_Date == null) {
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
          Begin_Date: this.crtTimeFtt(Begin_Date),
          State: State,
          Img: img,
          user_id: this.userInfo.USER_ID,
          Sign_ID: this.tableData[0].SIGN_ID,
          Url: Url
        };
        if (id) {
          console.log("iu该");
          this.editActivity = true;
          data._key = this._key;
        } else {
          console.log("正常添加");
          this.editActivity = false;
        }
        console.log(data);
        publicApi.publicApi("/ajax/Com_PCInfo.ashx", data).then(res => {
          console.log(res);
          if (res.code == "success") {
            this.$message({
              type: "success",
              message: "成功"
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
      this.tableData = [];
      let data = {
        action: "get_sign_object",
        _key: this.sign_id,
        user_id: this.userInfo.USER_ID
      };
      let { tableData } = this;
      publicApi.publicApi("/ajax/Com_PCInfo.ashx", data).then(res => {
        console.log(res, "lllll");
        if (res.code == "success") {
          switch (res.data.ISPUBLIC) {
            case "0":
              res.data.STATETEXT = "公司业务部";
              break;
            case "1":
              res.data.STATETEXT = "零售业务部";
              break;
            case "&nbsp;":
              res.data.STATETEXT = "老数据无法读取类型";
              break;
          }
          tableData.push(res.data);
          this.tableData = tableData;
          this.BUG_ID = res.data.BUG_ID;
          this.CENAME = res.data.CENAME;
          this.BUG_NAME = res.data.BUG_NAME;
          this.CITY = res.data.CITY;
          this.ENDEXPAND = res.data.ENDEXPAND;
          this.EXPAND = res.data.EXPAND;
          this.ISPUBLIC = res.data.ISPUBLIC;
          this.LATITUDE = res.data.LATITUDE;
          this.LONGITUDE = res.data.LONGITUDE;
          this.PROVINCE = res.data.PROVINCE;
          this.REMARK = res.data.REMARK;
          this.SIGN_ID = res.data.SIGN_ID;
          this.SIGN_NAME = res.data.SIGN_NAME;
          this.STATE = res.data.STATE;
          this.STREET = res.data.STREET;
          this.IMG = "";
        }
      });
    },

    // 该标注下的所有活动
    getActivity() {
      let that = this;
      let data = {
        action: "get_activity_index",
        pageIndex: "1",
        pageSize: "10",
        is_all: "1",
        sign_id: this.sign_id,
        user_id: this.userInfo.USER_ID
      };
      let { tableData } = this;
      publicApi.publicApi("/ajax/Com_PCInfo.ashx", data).then(res => {
        console.log(res, "oooooo");
        if (res.code == "success") {
          if (res.data.length != 0) {
            res.data.forEach(item => {
              item.REMARK = decodeURI(item.REMARK);
              let imgList = [];
              if (item.IMG.indexOf(",") != -1) {
                imgList = item.IMG.split(",");
                let temp = [];
                imgList.forEach(sub => {
                  temp.push(`${this.Config.server}${sub}`);
                });
                item.imgList = temp;
              } else {
                item.imgList = `${this.Config.server}${item.IMG}`;
              }
            });
          }
        }
        this.activityList = res.data;
        console.log(this.activityList, "pppp");
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
            } else {
              this.$message.error(res.message);
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
    },

    // 打开修改标记
    openPoint() {
      this.pointDialog = true;
    },

    // 修改标记
    editTap() {
      let data = {
        action: "add_sign_index",
        _key: this._key,
        Sign_Name: this.SIGN_NAME,
        Remark: encodeURI(this.Remark),
        Longitude: this.LONGITUDE,
        Latitude: this.LATITUDE,
        State: this.STATE,
        user_id: this.userInfo.USER_ID,
        BUG_ID: this.BUG_ID,
        Province: this.PROVINCE,
        City: this.CITY,
        District: this.DISTRICT,
        Street: this.STREET,
        Img: "",
        IsPublic: this.ISPUBLIC,
        CEName: this.CENAME
      };
      if (this.ISPUBLIC == 1) {
        data.Expand = this.EXPAND;
        data.EndExpand = this.ENDEXPAND;
        if (this.SIGN_NAME == "") {
          this.$message({
            message: "请填写标记名称",
            type: "warning"
          });
        } else if (this.CENAME == "") {
          this.$message({
            message: "请输入企事业单位名称",
            type: "warning"
          });
        } else if (this.EXPAND == "") {
          this.$message({
            message: "请输入拓展人数",
            type: "warning"
          });
        } else if (this.ENDEXPAND == "") {
          this.$message({
            message: "请输入已拓展人数",
            type: "warning"
          });
        } else {
          publicApi
            .publicApi("/ajax/Com_PCInfo.ashx", data)
            .then(res => {
              console.log(res, "llll");
              if (res.code == "success") {
                this.$message({
                  type: "success",
                  message: "修改成功!"
                });
                this.pointDialog = false;
                this.getOne();
              }
            })
            .catch(err => {
              this.$message({
                message: "服务器出现错误",
                type: "warning"
              });
            });
        }
      } else {
        if (this.SIGN_NAME == "") {
          this.$message({
            message: "请填写标记名称",
            type: "warning"
          });
        } else if (this.CENAME == "") {
          this.$message({
            message: "请输入企事业单位名称",
            type: "warning"
          });
        } else {
          publicApi
            .publicApi("/ajax/Com_PCInfo.ashx", data)
            .then(res => {
              console.log(res, "llll");
              if (res.code == "success") {
                this.$message({
                  type: "success",
                  message: "修改成功!"
                });
                this.pointDialog = false;
                this.getOne();
              }
            })
            .catch(err => {
              this.$message({
                message: "服务器出现错误",
                type: "warning"
              });
            });
        }
      }
    },
    // 获取分行信息
    getBranch() {
      let data = {
        action: "get_user_group_index",
        user_id: this.userInfo.USER_ID,
        bug_id: this.userInfo.USERGROUP_ID
      };
      publicApi.publicApi(`/ajax/Com_PCInfo.ashx`, data).then(res => {
        this.branchlist = res.data;
      });
    }
  }
};
</script>