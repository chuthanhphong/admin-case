<template>
  <div class="emoji_picker">
    <div class="picker_container">
      <div v-for="category in categories" :key="`category_${category}`" class="category">
        <span>{{ category }}</span>
        <div class="emojis_container">
          <button v-for="(emoji, index) in category_emojis(category)" :key="`emoji_${index}`" @click="handleEmojiClick($event, emoji)">
            {{ emoji }}
          </button>
        </div>
      </div>
    </div>
    <div class="bottom_arrow"></div>
  </div>

</template>
<script>

import data from '@/./modules/etask/mixins/emojis-data.json';

export default {
  props: {
  },
  data() {
    return {
      listEmoji: [],
      isPost: false
    }
  },
  computed:
      {
        categories() {
          return Object.keys(data);
        },
        category_emojis: () => (category) => {
          return Object.values(data[category]);
        }
      },
  methods:
      {
        handleEmojiClick(e, emoji) {
          e.preventDefault();
          this.isPost = !this.isPost
          this.$emit('emoji_click', emoji);
        },
      }
}
</script>

<style scoped>
.emoji_picker
{
  display: flex;
  flex-direction: column;
  width: 20rem;
  height: 20rem;
  max-width: 100%;
}
.emoji_picker,
.bottom_arrow
{
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, .0975);
}
.emoji_picker,
.picker_container
{
  border-radius: 0.5rem;
  background: white;
}
.picker_container
{
  padding: 1rem;
  overflow: auto;
  z-index: 1;
}
.category
{
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  color: rgb(169, 169, 169);
}
.emojis_container
{
  display: flex;
  flex-wrap: wrap;
}
.category button
{
  margin: 0.5rem;
  margin-left: 0;
  background: inherit;
  border: none;
  font-size: 1.75rem;
  padding: 0;
}
.bottom_arrow
{
  left: 50%;
  bottom: 0;
  width: 0.75rem;
  height: 0.75rem;
  transform: translate(-50%, 50%) rotate(45deg);
  background: white;
}
</style>

