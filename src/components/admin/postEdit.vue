<template>
  <div>
    <el-tag effect="dark" class="my-tag">
      <svg viewBox="0 0 1024 1024" width="20" height="20" style="vertical-align: -3px;">
        <path d="M0 0h1024v1024H0V0z" fill="#202425" opacity=".01"></path>
        <path
          d="M682.666667 204.8h238.933333a34.133333 34.133333 0 0 1 34.133333 34.133333v648.533334a68.266667 68.266667 0 0 1-68.266666 68.266666h-204.8V204.8z"
          fill="#FFAA44"></path>
        <path
          d="M68.266667 921.6a34.133333 0 0 0 34.133333 34.133333h785.066667a68.266667 68.266667 0 0 1-68.266667-68.266666V102.4a34.133333 34.133333 0 0 0-34.133333-34.133333H102.4a34.133333 34.133333 0 0 0-34.133333 34.133333v819.2z"
          fill="#11AA66"></path>
        <path
          d="M238.933333 307.2a34.133333 34.133333 0 0 0 0 68.266667h136.533334a34.133333 34.133333 0 1 0 0-68.266667H238.933333z m0 204.8a34.133333 34.133333 0 1 0 0 68.266667h409.6a34.133333 34.133333 0 1 0 0-68.266667H238.933333z m0 204.8a34.133333 34.133333 0 1 0 0 68.266667h204.8a34.133333 34.133333 0 1 0 0-68.266667H238.933333z"
          fill="#FFFFFF"></path>
      </svg>
      文章信息
    </el-tag>
    <el-form :model="article" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
      <el-form-item label="标题" prop="articleTitle">
        <el-input maxlength="30" v-model="article.articleTitle"></el-input>
      </el-form-item>

      <el-form-item label="视频链接" prop="videoUrl">
        <el-input maxlength="1000" v-model="article.videoUrl"></el-input>
      </el-form-item>

      <el-form-item label="内容" prop="articleContent">
        <mavon-editor ref="md" @imgAdd="imgAdd" v-model="article.articleContent" />
      </el-form-item>

      <el-form-item label="是否启用评论" prop="commentStatus">
        <el-tag :type="article.commentStatus === false ? 'danger' : 'success'" disable-transitions>
          {{ article.commentStatus === false ? '否' : '是' }}
        </el-tag>
        <el-switch v-model="article.commentStatus"></el-switch>
      </el-form-item>

      <el-form-item label="是否推荐" prop="recommendStatus">
        <el-tag :type="article.recommendStatus === false ? 'danger' : 'success'" disable-transitions>
          {{ article.recommendStatus === false ? '否' : '是' }}
        </el-tag>
        <el-switch v-model="article.recommendStatus"></el-switch>
      </el-form-item>

      <el-form-item label="是否可见" prop="viewStatus">
        <el-tag :type="article.viewStatus === false ? 'danger' : 'success'" disable-transitions>
          {{ article.viewStatus === false ? '否' : '是' }}
        </el-tag>
        <el-switch v-model="article.viewStatus"></el-switch>
      </el-form-item>

      <el-form-item v-if="article.viewStatus === false" label="不可见时的访问密码" prop="password">
        <el-input maxlength="30" v-model="article.password"></el-input>
      </el-form-item>

      <el-form-item v-if="article.viewStatus === false" label="密码提示" prop="tips">
        <el-input maxlength="60" v-model="article.tips"></el-input>
      </el-form-item>

      <el-form-item label="封面" prop="articleCover">
        <div style="display: flex">
          <el-input v-model="article.articleCover"></el-input>
          <el-image class="table-td-thumb" lazy style="margin-left: 10px" :preview-src-list="[article.articleCover]"
            :src="article.articleCover" fit="cover"></el-image>
        </div>
        <uploadPicture :isAdmin="true" :prefix="'articleCover'" style="margin-top: 10px" @addPicture="addArticleCover"
          :maxSize="2" :maxNumber="1"></uploadPicture>
      </el-form-item>
      <el-form-item label="分类" prop="sortId">
        <el-select v-model="article.sortId" placeholder="请选择分类">
          <el-option v-for="item in sorts" :key="item.id" :label="item.sortName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签" prop="labelId">
        <el-select v-model="article.labelId" placeholder="请选择标签">
          <el-option v-for="item in labelsTemp" :key="item.id" :label="item.labelName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 图床选择 -->
      <!-- <el-form-item label="图床类型">
        <el-select v-model="currentImageHost" placeholder="请选择图床类型">
          <el-option label="IMGBB" value="imgbb"></el-option>
          <el-option label="LOIMAGE" value="loimage"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="图床类型">
        <div class="image-host-selector">
          <el-tag :type="currentImageHost === 'imgbb' ? 'success' : 'info'" @click="setImageHost('imgbb')"
            class="host-option">
            IMGBB
          </el-tag>
          <el-tag :type="currentImageHost === 'loPicCloudflare' ? 'success' : 'info'" 
            @click="setImageHost('loPicCloudflare')" class="host-option">
            Lo图床(CF)
          </el-tag>
          <el-tag :type="currentImageHost === 'loImageSource' ? 'success' : 'info'"
            @click="setImageHost('loImageSource')" class="host-option">
            Lo图床(原图)
          </el-tag>
          <el-tag :type="currentImageHost === 'loImageCompression' ? 'success' : 'info'"
            @click="setImageHost('loImageCompression')" class="host-option">
            Lo图床(压缩)
          </el-tag>
        </div>
      </el-form-item>

    </el-form>
    <div class="myCenter" style="margin-bottom: 22px">
      <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
      <el-button type="danger" @click="resetForm('ruleForm')">重置所有修改</el-button>
    </div>
  </div>
</template>

<script>
const uploadPicture = () => import("../common/uploadPicture");

export default {
  components: {
    uploadPicture
  },
  data() {
    return {
      currentImageHost: 'loPicCloudflare', // 默认选择 loImageCompression
      id: this.$route.query.id,
      article: {
        articleTitle: "",
        articleContent: "",
        commentStatus: true,
        recommendStatus: false,
        viewStatus: true,
        password: "",
        tips: "",
        articleCover: "",
        videoUrl: "",
        sortId: null,
        labelId: null
      },
      sorts: [],
      labels: [],
      labelsTemp: [],
      rules: {
        articleTitle: [
          { required: true, message: '请输入标题', trigger: 'change' }
        ],
        articleContent: [
          { required: true, message: '请输入内容', trigger: 'change' }
        ],
        commentStatus: [
          { required: true, message: '是否启用评论', trigger: 'change' }
        ],
        recommendStatus: [
          { required: true, message: '是否推荐', trigger: 'change' }
        ],
        viewStatus: [
          { required: true, message: '是否可见', trigger: 'change' }
        ],
        articleCover: [
          { required: true, message: '封面', trigger: 'change' }
        ],
        sortId: [
          { required: true, message: '分类', trigger: 'change' }
        ],
        labelId: [
          { required: true, message: '标签', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {
    'article.sortId'(newVal, oldVal) {
      if (oldVal !== null) {
        this.article.labelId = null;
      }
      if (!this.$common.isEmpty(newVal) && !this.$common.isEmpty(this.labels)) {
        this.labelsTemp = this.labels.filter(l => l.sortId === newVal);
      }
    }
  },
  created() {
    this.getSortAndLabel();
  },
  mounted() {

  },
  methods: {
    setImageHost(host) {
      this.currentImageHost = host;
    },
    imgAdd(pos, file) {
      if (this.currentImageHost === 'imgbb') {
        this.imgAdd_imgbb(pos, file);
      } else if (this.currentImageHost === 'loImageSource') {
        this.imgAdd_loimage_source(pos, file);
      } else if (this.currentImageHost === 'loImageCompression') {
        this.imgAdd_loimage_source_compression(pos, file);
      } else if (this.currentImageHost === 'loPicCloudflare') {
        this.imgAdd_loPic_cloudflare_TG(pos, file);
      }
    },
    imgAdd_imgbb(pos, file) {
      const formData = new FormData();
      formData.append('image', file);

      // imgbb API key
      const apiKey = 'd1baf40245b1dd967190a528cf2afc5e';

      // Make request to imgbb API
      fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            const url = data.data.url;
            this.$refs.md.$img2Url(pos, url);
          } else {
            this.$message({
              message: '图片上传失败',
              type: 'error'
            });
          }
        })
        .catch(error => {
          this.$message({
            message: error.message,
            type: 'error'
          });
        });
    },
    imgAdd_loimage_source(pos, file) {
      const formData = new FormData();
      formData.append('file', file); // 添加文件
      formData.append('strategy_id', '4'); // 添加文件

      const headers = {
        'Accept': 'application/json',
        'Authorization': 'Bearer 1|39WTFQwfVfzeGNBoENW3WbAxueUqC7t46IXprZDB' // 添加 Authorization header
      };

      // 发起上传请求到新图床
      fetch('https://img.lozone.site/api/v1/upload', {
        method: 'POST',
        headers: headers, // 添加 headers
        body: formData
      })
        .then(response => response.json()) // 解析响应为 JSON
        .then(data => {
          if (data.status === true) {
            const url = data.data.links.url; // 获取返回的图片 URL
            this.$refs.md.$img2Url(pos, url); // 调用 Markdown 编辑器的插入图片方法
            this.$message({
              message: '图片上传成功',
              type: 'success'
            });
          } else {
            // 如果接口返回失败
            this.$message({
              message: `图片上传失败: ${data.message || '未知错误'}`,
              type: 'error'
            });
          }
        })
        .catch(error => {
          // 捕获网络或其他错误
          this.$message({
            message: `图片上传失败: ${error.message}`,
            type: 'error'
          });
        });
    },
    imgAdd_loimage_source_compression(pos, file) {
      const formData = new FormData();
      formData.append('file', file); // 添加文件
      formData.append('strategy_id', '4'); // 添加文件

      const headers = {
        'Accept': 'application/json',
        'Authorization': 'Bearer 2|HK10FPRDQe4xOXGnzz743ghMicqNqFRFF6r4EyxG' // 添加 Authorization header
      };

      // 发起上传请求到新图床
      fetch('https://img.lozone.site/api/v1/upload', {
        method: 'POST',
        headers: headers, // 添加 headers
        body: formData
      })
        .then(response => response.json()) // 解析响应为 JSON
        .then(data => {
          if (data.status === true) {
            const url = data.data.links.url; // 获取返回的图片 URL
            this.$refs.md.$img2Url(pos, url); // 调用 Markdown 编辑器的插入图片方法
            this.$message({
              message: '图片上传成功',
              type: 'success'
            });
          } else {
            // 如果接口返回失败
            this.$message({
              message: `图片上传失败: ${data.message || '未知错误'}`,
              type: 'error'
            });
          }
        })
        .catch(error => {
          // 捕获网络或其他错误
          this.$message({
            message: `图片上传失败: ${error.message}`,
            type: 'error'
          });
        });
    },
    imgAdd_loPic_cloudflare_TG(pos, file) {
      const formData = new FormData();
      formData.append('file', file);

      const uploadUrl = 'https://photo.lozone.site/upload?authCode=Lo7&uploadChannel=cfr2&autoRetry&uploadFolder=img/';
      const baseUrl = 'https://photo.lozone.site';

      fetch(uploadUrl, {
        method: 'POST',
        body: formData
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP错误: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          if (Array.isArray(data) && data.length > 0 && data[0].src) {
            const url = baseUrl + data[0].src;
            this.$refs.md.$img2Url(pos, url);
            this.$message({
              message: '图片上传成功',
              type: 'success'
            });
          } else {
            this.$message({
              message: '上传成功但未返回有效图片链接',
              type: 'error'
            });
          }
        })
        .catch(error => {
          this.$message({
            message: `图片上传失败: ${(error && error.message) || '未知错误'}`,
            type: 'error'
          });
        });
    },
    addArticleCover(res) {
      this.article.articleCover = res;
    },
    getSortAndLabel() {
      this.$http.get(this.$constant.baseURL + "/webInfo/listSortAndLabel")
        .then((res) => {
          if (!this.$common.isEmpty(res.data)) {
            this.sorts = res.data.sorts;
            this.labels = res.data.labels;
            if (!this.$common.isEmpty(this.id)) {
              this.getArticle();
            }
          }
        })
        .catch((error) => {
          this.$message({
            message: error.message,
            type: "error"
          });
        });
    },
    getArticle() {
      this.$http.get(this.$constant.baseURL + "/admin/article/getArticleById", { id: this.id }, true)
        .then((res) => {
          if (!this.$common.isEmpty(res.data)) {
            this.article = res.data;
          }
        })
        .catch((error) => {
          this.$message({
            message: error.message,
            type: "error"
          });
        });
    },
    submitForm(formName) {
      if (this.article.viewStatus === false && this.$common.isEmpty(this.article.password)) {
        this.$message({
          message: "文章不可见时必须输入密码！",
          type: "error"
        });
        return;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.$common.isEmpty(this.id)) {
            this.saveArticle(this.article, "/article/saveArticle")
          } else {
            this.article.id = this.id;
            this.saveArticle(this.article, "/article/updateArticle")
          }
        } else {
          this.$message({
            message: "请完善必填项！",
            type: "error"
          });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      if (!this.$common.isEmpty(this.id)) {
        this.getArticle();
      }
    },
    saveArticle(value, url) {
      this.$confirm('确认保存？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success',
        center: true
      }).then(() => {
        this.$http.post(this.$constant.baseURL + url, value, true)
          .then((res) => {
            this.$message({
              message: "保存成功！",
              type: "success"
            });
            this.$router.push({ path: '/postList' });
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      }).catch(() => {
        this.$message({
          type: 'success',
          message: '已取消保存!'
        });
      });
    }
  }
}
</script>

<style scoped>
.image-host-selector {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
  gap: 5px;
  /* 调整按钮之间的间距 */
}

.host-option {
  cursor: pointer;
  /* 鼠标移上去显示手形标志 */
  font-size: 12px;
  padding: 3px 5px;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
}

.host-option:hover {
  background-color: #f5f5f5;
  /* 鼠标悬停时的背景色变化 */
}

.host-option[type='success'] {
  background-color: #f56c6c;
  color: white;
}

.my-tag {
  margin-bottom: 20px;
  width: 100%;
  text-align: left;
  background: var(--lightYellow);
  border: none;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  color: var(--black);
}

.table-td-thumb {
  border-radius: 2px;
  width: 40px;
  height: 40px;
}

.el-switch {
  margin-left: 10px;
}

.el-form-item {
  margin-bottom: 40px;
}
</style>