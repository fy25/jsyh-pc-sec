<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">三公里营销系统</h3>
        <lang-select class="set-language" />
      </div>

      <el-form-item prop="`1`">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.name"
          :placeholder="$t('login.username')"
          name="username"
          type="text"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.pwd"
          :type="passwordType"
          :placeholder="$t('login.password')"
          name="password"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >{{ $t('login.logIn') }}</el-button>

      <!-- <div style="position:relative">
        <div class="tips">
          <span>{{ $t('login.username') }} : admin</span>
          <span>{{ $t('login.password') }} : {{ $t('login.any') }}</span>
        </div>
        <div class="tips">
          <span style="margin-right:18px;">{{ $t('login.username') }} : editor</span>
          <span>{{ $t('login.password') }} : {{ $t('login.any') }}</span>
        </div>

        <el-button class="thirdparty-button" type="primary" @click="showDialog=true">
          {{ $t('login.thirdparty') }}
        </el-button>
      </div>-->
    </el-form>

    <el-dialog :title="$t('login.thirdparty')" :visible.sync="showDialog">
      {{ $t('login.thirdpartyTips') }}
      <br />
      <br />
      <br />
      <social-sign />
    </el-dialog>
  </div>
</template>

<script>
// import { validUsername } from "@/utils/validate";
import LangSelect from "@/components/LangSelect";
import SocialSign from "./socialSignin";
import * as publicApi from "../../api/public";
import { Config } from "../../config/config";

export default {
  name: "Login",
  components: { LangSelect, SocialSign },
  data() {
    return {
      loginForm: {
        name: "",
        pwd: ""
      },
      passwordType: "password",
      loading: false,
      showDialog: false,
      redirect: undefined,
      Config
    };
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === "") {
      this.$refs.username.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },

    // 获取code
    getCode(name) {
      const data = {
        action: "md_info",
        name: name
      };
      return publicApi.publicApi("/ajax/Com_PCInfo.ashx", data);
    },

    // 登录
    signIn(name, pwd, code) {
      const data = {
        action: "get_user_info",
        name: name,
        pwd: pwd,
        code: code
      };
      return publicApi.publicApi("/ajax/Com_PCInfo.ashx", data);
    },

    handleLogin() {
      const { name, pwd } = this.loginForm;
      if (name == "") {
        this.$message({
          message: "请填写用户名",
          type: "warning"
        });
      } else if (pwd == "") {
        this.$message({
          message: "请填写密码",
          type: "warning"
        });
      } else {
        this.getCode(name)
          .then(res => {
            if (res.code == "success") {
              this.signIn(name, pwd, res.data).then(res => {
                if (res.code == "success") {
                  this.$message({
                    message: "登录成功",
                    type: "success"
                  });
                  let ISPUBLIC = null;
                  let IS_ALL = null;
                  let {
                    retailKey,
                    adminKey,
                    retailId,
                    corporateId,
                    retailOrganization,
                    corporationOrganization
                  } = this.Config;
                  let userid = res.data.USER_ID;
                  let { ORGANIZATION_ID } = res.data;
                  if (adminKey.indexOf(userid) != -1) {
                    ISPUBLIC = "";
                    IS_ALL = "1";
                  } else if (retailId.indexOf(userid) != -1) {
                    ISPUBLIC = "1";
                    IS_ALL = "1";
                  } else if (corporateId.indexOf(userid) != -1) {
                    ISPUBLIC = "0";
                    IS_ALL = "1";
                  } else {
                    IS_ALL = "0";
                    if (retailOrganization.indexOf(ORGANIZATION_ID) != -1) {
                      ISPUBLIC = "1";
                    } else if (
                      corporationOrganization.indexOf(ORGANIZATION_ID) != -1
                    ) {
                      ISPUBLIC = "0";
                    }
                  }
                  res.data.ISPUBLIC = ISPUBLIC;
                  res.data.IS_ALL = IS_ALL;
                  localStorage.setItem("userinfo", JSON.stringify(res.data));
                  this.$router.replace({ path: "/index" });
                }
              });
            }
          })
          .catch(err => {
            alert(err);
            this.$message({
              message: err,
              type: "warning"
            });
          });
      }
    }
  }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
