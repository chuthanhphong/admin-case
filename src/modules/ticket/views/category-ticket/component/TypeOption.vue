<template>
  <v-scroll-y-reverse-transition>
    <div
      v-show="animated"
      v-if="typeAttributes.valueType"
      class="type-option mx-auto"
    >
      <div class="type-item-group">
        <div class="input-option">
          <validation-provider
            v-slot="{ errors }"
            name="label"
            :rules="computedRules"
            :vid="`label-${index}`"
          >
            <v-text-field
              :ref="`label-${index}`"
              v-model="typeAttributes.name"
              prefix="|"
              :placeholder="$t('enter-label-name')"
              dense
              hide-details
              clearable
              class="mb-3 input-label"
              :maxlength="maximumExText"
              :error="errors.length > 0"
              :autofocus="hasAutofocus"
            >
              <template slot="append">
                <v-layout align-center>
                  <i class="type-icon" :class="renderClassAppendIcon()" />
                </v-layout>
              </template>
            </v-text-field>
            <v-text-field
              v-if="isTypeValue('INPUT')"
              outlined
              dense
              readonly
              disabled
              class="white"
              hide-details
            />
            <div v-if="isTypeValue('SELECT')">
              <v-scroll-y-reverse-transition group>
                <div
                  v-for="(item, indexSelect) in selectOptions"
                  :key="indexSelect"
                  class="d-flex align-center"
                >
                  <span class="text--label mr-1">{{ indexSelect + 1 }}.</span>
                  <type-option-select
                    :select-options="selectOptions"
                    :index="indexSelect"
                    :index-parent="index"
                    @remove-option="removeOption"
                  />
                </div>
                <validation-provider
                  :key="`input-select-options-${index}`"
                  :vid="`input-select-options-${index}`"
                  :rules="`max:${maximumSmallText}`"
                >
                  <input v-model="typeAttributes.value" type="hidden" />
                </validation-provider>
              </v-scroll-y-reverse-transition>
              <v-layout align-center>
                <v-btn
                  text
                  class="px-0"
                  color="#8E8EA1"
                  :disabled="hasLimited"
                  @click="addOption"
                >
                  <v-icon size="25" color="#8E8EA1">
                    mdi-plus-circle-outline
                  </v-icon>
                  <label class="text--label text--normal">
                    {{ $t("add-options") }}
                  </label>
                </v-btn>
                <v-spacer></v-spacer>
                <label
                  class="text--label text--normal"
                  :class="hasLimited ? 'error--text' : ''"
                >
                  {{ `${counterSelectOption}/${maximumSmallText}` }}
                </label>
              </v-layout>
            </div>
            <div v-if="isTypeValue('CHECK_BOX')">
              <v-scroll-y-reverse-transition group>
                <div
                  v-for="(item, indexSelect) in selectOptions"
                  :key="indexSelect"
                  class="d-flex align-center"
                >
                  <span class="text--label mr-1">{{ indexSelect + 1 }}.</span>
                  <type-option-mul-select
                    :select-options="selectOptions"
                    :index="indexSelect"
                    :index-parent="index"
                    @remove-option="removeOption"
                  />
                </div>
                <validation-provider
                  :key="`input-select-options-${index}`"
                  :vid="`input-select-options-${index}`"
                  :rules="`max:${maximumSmallText}`"
                >
                  <input v-model="typeAttributes.value" type="hidden" />
                </validation-provider>
              </v-scroll-y-reverse-transition>
              <v-layout align-center>
                <v-btn
                  text
                  class="px-0"
                  color="#8E8EA1"
                  :disabled="hasLimited"
                  @click="addOption"
                >
                  <v-icon size="25" color="#8E8EA1">
                    mdi-plus-circle-outline
                  </v-icon>
                  <label class="text--label text--normal">{{
                    $t("add-options")
                  }}</label>
                </v-btn>
                <v-spacer></v-spacer>
                <label
                  class="text--label text--normal"
                  :class="hasLimited ? 'error--text' : ''"
                >
                  {{ `${counterSelectOption}/${maximumSmallText}` }}
                </label>
              </v-layout>
            </div>

            <v-layout v-if="isTypeValue('FILE')" justify-space-between>
              <v-layout column>
                <label>
                  {{ $t("ticket-types.format-file-valid") }}
                </label>
                <label class="error--text">
                  {{ $t("ticket-types.maximum-file-size") }}
                </label>
              </v-layout>
              <v-btn class="border-file-upload" disabled>
                <i class="type-icon icon-file-upload" />
              </v-btn>
            </v-layout>
            <span class="text-danger text--overlined message-option">
              {{ errors.length > 0 ? errors[0] : "" }}
            </span>
          </validation-provider>
        </div>
        <div
          class="d-flex flex-column action-option"
          :class="isTypeValue('TITLE') ? '' : 'mt-10'"
        >
          <div class="d-flex justify-center">
            <v-btn fab icon small class="btn-move-option">
              <i class="icon-move" />
            </v-btn>
            <v-btn fab icon small @click="$emit('remove-type', index)">
              <vue-feather type="trash-2" size="18" />
            </v-btn>
          </div>
        </div>
        <v-switch
          v-if="!isTypeValue('TITLE')"
          v-model="typeAttributes.inputType"
          dense
          class="required-check pr-10"
        >
          <template v-slot:label>
            <span
              :class="
                typeAttributes.inputType
                  ? 'primary--text text--overlined'
                  : 'text--overlined'
              "
            >
              {{ $t("required") }}
            </span>
          </template>
        </v-switch>
      </div>
    </div>
  </v-scroll-y-reverse-transition>
</template>

<script>
import constants from "@/constants";

import mixinTypeValue from "@/modules/ticket/mixins/mixinTypeValue";
import mixinAnimate from "@/modules/ticket/mixins/mixinAnimate";
import { mapValueTypeToCSSClass } from "@/modules/ticket/helpers/ticketUtils";
import TypeOptionSelect from "./TypeOptionSelect.vue";
import TypeOptionMulSelect from "./TypeOptionMulSelect.vue";

export default {
  components: { TypeOptionSelect, TypeOptionMulSelect },
  mixins: [mixinTypeValue, mixinAnimate],
  props: {
    typeAttributes: {
      type: Object,
      default: undefined,
    },
    index: {
      type: Number,
      default: undefined,
    },
    categoryAttributes: {
      type: Array,
      default: null,
    },
    isUpdate: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      maximumExText: constants.MAXIMUM_EX_TEXT,
      maximumSmallText: constants.MAXIMUM_SMALL_TEXT,
      selectOptions: [],
    };
  },
  computed: {
    computedRules() {
      if (this.categoryAttributes && this.categoryAttributes.length > 0) {
        // const results = []
        // this.categoryAttributes.forEach((item, idx) => {
        //   if (this.index !== idx && item.name !== '' && item.valueType === this.typeAttributes.valueType) {
        //     results.push(item)
        //   }
        // })

        // if (results.length > 0) {
        //   let excludedVal = ''
        //   const len = results.length
        //   results.forEach((item, idx) => {
        //     if (idx === len - 1) {
        //       excludedVal += item.name.trim()
        //     } else {
        //       excludedVal += item.name.trim() + ','
        //     }
        //   })

        //   // return `required|excluded:${excludedVal}`
        //   return `required`
        // } else {
        //   return 'required'
        // }
        return "required";
      } else {
        return "required";
      }
    },
    counterSelectOption() {
      return this.selectOptions.join(",").length;
    },
    hasLimited() {
      return this.counterSelectOption > this.maximumSmallText;
    },
    hasAutofocus() {
      return this.index === this.categoryAttributes.length - 1;
    },
  },
  watch: {
    typeAttributes(val) {
      if (val.value) {
        this.selectOptions = val.value.toString().split(",");
      } else {
        this.selectOptions = [""];
      }
    },
    selectOptions(val) {
      this.typeAttributes.value = this.selectOptions.join(",");
      if (this.typeAttributes.value.length > this.maximumSmallText) {
        this.categoryAttributes[this.index]["error"] = true;
      } else {
        this.categoryAttributes[this.index]["error"] = false;
      }
    },
  },
  created() {
    this.startAnimated();
    this.genderSelectOptions();
  },
  methods: {
    genderSelectOptions() {
      if (this.isTypeValue("SELECT") || this.isTypeValue("CHECK_BOX")) {
        if (this.isUpdate && this.typeAttributes.value) {
          this.selectOptions = this.typeAttributes.value.split(",");
        } else {
          this.selectOptions = [""];
        }
      }
    },
    // Add option
    addOption() {
      if (this.selectOptions.length < constants.MAXIMUM_OPTION) {
        this.selectOptions.push("");
      }
    },
    // Remove option
    removeOption(index) {
      if (this.selectOptions.length > 1) {
        this.selectOptions.splice(index, 1);
      }
    },
    renderClassAppendIcon() {
      const value = this.typeAttributes.valueType;
      const type = mapValueTypeToCSSClass.find(
        (vType) => vType.value === value
      );
      if (!type) {
        return "";
      }
      return `${type.icon}`;
    },
  },
};
</script>

<style lang="scss" scoped></style>
