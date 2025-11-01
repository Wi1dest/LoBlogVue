<template>
  <div class="emoji-picker">
    <!-- 使用 v-for 渲染 emoji 列表 -->
    <div
      v-for="emoji in emojiList"
      :key="emoji.shortname"
      class="emoji-item"
      v-html="renderEmoji(emoji)"
      @click="selectEmoji(emoji)">
    </div>
  </div>
</template>

<script>
import emojione from "emojione"; // 引入 EmojiOne 库

export default {
  props: {
    emojiList: {
      type: Array,
      default: () => [
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
        // 添加更多的 emoji
        { shortname: ":star_struck:", unicode: "1F929" },
        { shortname: ":money_mouth_face:", unicode: "1F911" },
        { shortname: ":nerd_face:", unicode: "1F913" },
        { shortname: ":smirk:", unicode: "1F60F" },
        { shortname: ":unamused:", unicode: "1F612" },
        { shortname: ":face_with_raised_eyebrow:", unicode: "1F928" },
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
        // 更多 emoji
      ], // 可继续添加更多表情
    },
  },
  methods: {
    renderEmoji(emoji) {
      // 使用 EmojiOne 渲染 shortname 为图片
      return emojione.toImage(emoji.shortname);
    },
    selectEmoji(emoji) {
      // 点击后触发父组件事件，传递选中的 emoji
      this.$emit("addEmoji", emojione.shortnameToUnicode(emoji.shortname));
    },
  },
};
</script>

<style scoped>
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
</style>
