<template>
  <div>
    <!-- 框 -->
    <textarea
      class="comment-textarea"
      v-model="commentContent"
      placeholder="写下点什么..."
      maxlength="1000" />
    <!-- 按钮 -->
    <div class="myBetween" style="margin-bottom: 10px">
      <div style="display: flex">
        <div :class="{'emoji-active': showEmoji}" @click="toggleEmojiPicker">
          <i class="el-icon-orange myEmoji"></i>
        </div>
        <!-- <el-checkbox v-model="anonymousComment" style="margin-left: 10px;">我要匿名留言(免登录)</el-checkbox> -->
      </div>
      <div style="display: flex">
        <proButton
          :info="'提交'"
          @click.native="submitComment"
          :before="$constant.before_color_2"
          :after="$constant.after_color_2">
        </proButton>
      </div>
    </div>
    <!-- 表情选择器 -->
    <div v-show="showEmoji" class="emoji-picker">
      <div
        v-for="emoji in emojiList"
        :key="emoji.shortname"
        class="emoji-item"
        v-html="renderEmoji(emoji)"
        @click="addEmoji(emoji)">
      </div>
    </div>
  </div>
</template>

<script>
import emojione from "emojione"; // 使用 EmojiOne 渲染
const proButton = () => import("../common/proButton");

export default {
  components: {
    proButton,
  },
  data() {
    return {
      commentContent: "",
      showEmoji: false,
      anonymousComment: false,
      emojiList: [], // Emoji 列表
    };
  },
  created() {
    // 加载 Emoji 列表
    this.emojiList = this.getEmojiList();
  },
  methods: {
    toggleEmojiPicker() {
      this.showEmoji = !this.showEmoji;
    },
    getEmojiList() {
      // 获取部分 Emoji 示例（可以使用完整的库）
      return [
      { shortname: ":grinning:", unicode: "1F600" },
        { shortname: ":smiley:", unicode: "1F603" },
        { shortname: ":laughing:", unicode: "1F606" },
        { shortname: ":blush:", unicode: "1F60A" },
        { shortname: ":heart_eyes:", unicode: "1F60D" },
        { shortname: ":sunglasses:", unicode: "1F60E" },
        { shortname: ":cry:", unicode: "1F622" },
        { shortname: ":joy:", unicode: "1F602" },
        { shortname: ":angry:", unicode: "1F620" },
        { shortname: ":kissing_heart:", unicode: "1F618" },
        { shortname: ":sweat_smile:", unicode: "1F605" },
        { shortname: ":thinking:", unicode: "1F914" },
        { shortname: ":star_struck:", unicode: "1F929" },
        { shortname: ":money_mouth_face:", unicode: "1F911" },
        { shortname: ":nerd_face:", unicode: "1F913" },
        { shortname: ":smirk:", unicode: "1F60F" },
        { shortname: ":unamused:", unicode: "1F612" },
        { shortname: ":flushed:", unicode: "1F633" },
        { shortname: ":pensive:", unicode: "1F614" },
        { shortname: ":frowning:", unicode: "1F626" },
        { shortname: ":disappointed:", unicode: "1F61E" },
        { shortname: ":exploding_head:", unicode: "1F92F" },
        { shortname: ":poop:", unicode: "1F4A9" },
        { shortname: ":clap:", unicode: "1F44F" },
        { shortname: ":thumbsup:", unicode: "1F44D" },
        { shortname: ":thumbsdown:", unicode: "1F44E" },
        { shortname: ":v:", unicode: "270C" },
        { shortname: ":peace:", unicode: "✌" },
        { shortname: ":wave:", unicode: "1F44B" },
        { shortname: ":raised_hand:", unicode: "270B" },
        { shortname: ":pray:", unicode: "1F64F" },
        { shortname: ":muscle:", unicode: "1F4AA" },
        { shortname: ":ok_hand:", unicode: "1F44C" },
        { shortname: ":point_up:", unicode: "261D" },
        { shortname: ":punch:", unicode: "1F44A" },
        { shortname: ":handshake:", unicode: "1F91D" },
        { shortname: ":two_hearts:", unicode: "1F495" },
        { shortname: ":heart:", unicode: "2764" },
        { shortname: ":broken_heart:", unicode: "1F494" },
        { shortname: ":sparkling_heart:", unicode: "1F496" },
        { shortname: ":heartbeat:", unicode: "1F493" },
        { shortname: ":purple_heart:", unicode: "1F49C" },
        { shortname: ":blue_heart:", unicode: "1F499" },
        { shortname: ":green_heart:", unicode: "1F49A" },
        { shortname: ":yellow_heart:", unicode: "1F49B" },
        { shortname: ":black_heart:", unicode: "1F5A4" },
        { shortname: ":100:", unicode: "1F4AF" },
        { shortname: ":fire:", unicode: "1F525" },
        { shortname: ":boom:", unicode: "1F4A5" },
        { shortname: ":anger:", unicode: "1F4A2" },
        { shortname: ":trophy:", unicode: "1F3C6" },
        { shortname: ":medal:", unicode: "1F3C5" },
        { shortname: ":soccer:", unicode: "26BD" },
        { shortname: ":basketball:", unicode: "1F3C0" },
        { shortname: ":baseball:", unicode: "26BE" },
        { shortname: ":football:", unicode: "1F3C8" },
        { shortname: ":rugby_football:", unicode: "1F3C9" },
        { shortname: ":tennis:", unicode: "1F3BE" },
        { shortname: ":volleyball:", unicode: "1F3D0" },
        { shortname: ":ping_pong:", unicode: "1F3D3" },
        { shortname: ":badminton:", unicode: "1F3F8" },
        { shortname: ":boxing_glove:", unicode: "1F94A" },
        { shortname: ":field_hockey:", unicode: "1F3D1" }
      ];
    },
    renderEmoji(emoji) {
      // 使用 EmojiOne 渲染 Emoji
      return emojione.toImage(emoji.shortname);
    },
    addEmoji(emoji) {
      this.commentContent += emojione.shortnameToUnicode(emoji.shortname);
      this.showEmoji = false; // 关闭表情选择器
    },
    submitComment() {
      if (!this.anonymousComment) {
        if (this.$common.isEmpty(this.$store.state.currentUser)) {
          this.$message({
            message: "请先登录！",
            type: "error"
          });
          return;
        }
      }

      if (this.commentContent.trim() === "") {
        this.$message({
          message: "你还没写呢~",
          type: "warning"
        });
        return;
      }

      this.$emit("submitComment", this.commentContent.trim());
      this.commentContent = "";
    },
  },
};
</script>

<style scoped>
.comment-textarea {
  border: 1px solid var(--lightGray);
  width: 100%;
  font-size: 14px;
  padding: 15px;
  min-height: 180px;
  resize: none;
  outline: none;
  border-radius: 4px;
  background-image: var(--commentURL);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: 100%;
  margin-bottom: 10px;
}

.comment-textarea:focus {
  border-color: var(--themeBackground);
}

.myEmoji {
  font-size: 18px;
  cursor: pointer;
  transition: all 0.5s;
  margin-right: 12px;
}

.myEmoji:hover {
  transform: rotate(360deg);
  font-size: 22px;
}

.emoji-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px;
  border: 1px solid var(--lightGray);
  border-radius: 4px;
  background-color: var(--background);
}

.emoji-item {
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease;
}

.emoji-item:hover {
  transform: scale(1.2);
}

.emoji-active {
  color: var(--red);
}
</style>
