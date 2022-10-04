<template>
  <div class="col-12 col-md-8 wrap-ticket-types">
    <v-card class="px-5">
      <div class="row pt-2">
        <!--  -->
        <type-value @add-type="addType" />
        <!--  -->
        <div class="ticket-preview col-12 col-md-9">
          <div class="text--subtitle font-weight-bold">
            {{ $t("sample-ticket-type") }}
          </div>
          <div class="preview-detail mt-6">
            <type-common
              :title="formData.name"
              :is-update="isUpdate"
              :status="formData.status"
            />
            <div
              v-if="formData"
              ref="virtualScrollPreview"
              class="wrap-type-options"
            >
              <container
                lock-axis="y"
                drag-handle-selector=".btn-move-option"
                @drop="onDropTypeOption"
              >
                <draggable
                  v-for="(
                    typeAttributes, index
                  ) in formData.categoryAttributeDtos"
                  :key="index"
                >
                  <type-option
                    :type-attributes="typeAttributes"
                    :index="index"
                    :category-attributes="formData.categoryAttributeDtos"
                    :is-update="isUpdate"
                    @remove-type="removeType"
                  />
                </draggable>
              </container>
            </div>
          </div>
        </div>
      </div>
    </v-card>
    <base-preload :dialog="loading" />
  </div>
</template>

<script>
// Libs
import { mapActions } from "vuex";
// Components
import TypeOption from "./TypeOption.vue";
import TypeValue from "./TypeValue.vue";
import TypeCommon from "./TypeCommon.vue";

// Utils
import { applyDrag } from "@/helpers/utils";

export default {
  components: { TypeOption, TypeValue, TypeCommon },
  props: {
    formData: {
      type: Object,
      default: undefined,
    },
    isUpdate: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      timeoutScrollToEnd: null,
    };
  },
  computed: {},
  updated() {
    this.$nextTick(() => this.scrollToEnd());
  },
  methods: {
    ...mapActions("layout", ["setNotify"]),
    addType(type) {
      const newType = {
        name: null,
        valueType: null,
        orderNo: 0,
        inputType: false,
        description: null,
      };
      type.name = "";
      Object.assign(newType, type);
      this.formData.categoryAttributeDtos.push({ ...newType });
    },
    removeType(index) {
      this.formData.categoryAttributeDtos.splice(index, 1);
    },
    onDropTypeOption(resultDrop) {
      this.formData.categoryAttributeDtos = applyDrag(
        this.formData.categoryAttributeDtos,
        resultDrop
      );
    },
    prepareOrderNoForCategoryAttributes(categoryAttribute) {
      categoryAttribute.map((attr, index) => {
        attr.orderNo = index + 1;
        attr.inputType = attr.inputType ? 1 : 0;
        return attr;
      });
      return categoryAttribute;
    },
    scrollToEnd() {
      this.timeoutScrollToEnd && clearTimeout(this.timeoutScrollToEnd);
      this.timeoutScrollToEnd = setTimeout(() => {
        var el = this.$refs.virtualScrollPreview;
        const heightBox = el.offsetHeight;
        const heightContent = el.querySelector(
          ".smooth-dnd-container"
        ).offsetHeight;
        const scrollTop = 127 + heightContent - heightBox;
        if (scrollTop > 0) {
          el.scrollTop = scrollTop;
        }
      }, 50);
    },
  },
};
</script>

<style lang="scss" scoped></style>
