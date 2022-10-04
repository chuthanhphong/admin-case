<template>
  <div>
    <div :class="isView ? 'py-3' : ''">
      <label class="label-field">
        {{ $t('task-manager.dialogs.type-task.description') }}
      </label>
      <v-textarea
        v-model.trim="dataTypeTask.description"
        rows="3"
        outlined
        maxlength="500"
        counter="500"
        name="note"
        class="text--body-5"
        :placeholder="isView ? '' : $t('task-manager.placeHolder.description-type-task')"
        :readonly="isView"
        :hide-details="isView"
      />
    </div>
    <div :class="isView ? 'py-3' : ''">
      <label class="label-field">
        {{ $t('task-manager.dialogs.type-task.unit-handle') }}
        <span class="color-require px-1">*</span>
      </label>
      <validation-provider
        v-slot="{ errors }"
        name="unitHandle"
        rules="required"
      >
        <v-autocomplete
          v-model="dataTypeTask.applyingGroupId"
          :items="listGroup"
          item-text="groupName"
          item-value="groupId"
          outlined
          maxlength="50"
          attach
          dense
          cache-items
          :placeholder="isView ? '' : $t('task-manager.placeHolder.unit-handle')"
          :filter="filterItems"
          required
          hide-no-data
          :readonly="isView || isTab"
          :error-messages="errors"
          :disabled="isTab && isUpdate"
          class="text--body-5"
        >
          <vue-feather
            v-show="!isTab && isUpdate"
            slot="prepend-inner"
            class="grey--text"
            type="search"
          />
          <template v-slot:append>
            <v-icon v-show="!isTab && isUpdate">mdi-chevron-down</v-icon>
          </template>

          <template v-slot:item="data">
            <div class="select-item flex-column d-flex">
              <div class="title-item">{{ data.item.groupName }}</div>
              <div class="desc-item">{{ data.item.parentPathName }}</div>
            </div>
          </template>
        </v-autocomplete>
      </validation-provider>
    </div>
    <div>
      <label class="label-field mb-4">
        {{ $t('task-manager.dialogs.type-task.choose-approve') }}
        <v-tooltip
          bottom
          nudge-right="200px"
          max-width="700px"
        >
          <template v-slot:activator="{ on, attrs }">
            <img
              src="@/assets/icons/task/type-task/information.png"
              class="px-2 cursor-pointer"
              v-bind="attrs"
              v-on="on"
            >
          </template>
          <div>
            <div>
              {{ $t('task-manager.tool-tip.user-create.description') }}
            </div>
            <ul>
              <li>
                <span class="fw-700">
                  {{ $t('task-manager.tool-tip.user-create.title.create') }}
                </span>
                :
                <span>
                  {{ $t('task-manager.tool-tip.user-create.content.create') }}
                </span>
              </li>
              <li>
                <span class="fw-700">
                  {{ $t('task-manager.tool-tip.user-create.title.receive') }}
                </span>
                :
                <span>
                  {{ $t('task-manager.tool-tip.user-create.content.receive') }}
                </span>
              </li>
              <li>
                <span class="fw-700">
                  {{ $t('task-manager.tool-tip.user-create.title.finish') }}
                </span>
                :
                <span>
                  {{ $t('task-manager.tool-tip.user-create.content.finish') }}
                </span>
              </li>
            </ul>
          </div>
        </v-tooltip>
      </label>
      <div
        class="wrapper m-wrapper"
        :class="isUpdate ? 'active' : ''"
      >
        <input v-model="dataTypeTask.sendFlag" type="checkbox" :disabled="isView">
        <hr class="divider">
        <input v-model="dataTypeTask.receiveFlag" type="checkbox" :disabled="isView">
        <hr class="divider">
        <input v-model="dataTypeTask.closeFlag" type="checkbox" :disabled="isView">
      </div>
      <div class="wrapper">
        <div class="d-flex justify-space-between align-center state-approve">
          <span>{{ $t('task-manager.dialogs.type-task.consider') }}</span>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <img
                src="@/assets/icons/task/type-task/information.png"
                class="px-2 cursor-pointer"
                v-bind="attrs"
                v-on="on"
              >
            </template>
            <span>{{ $t('task-manager.tool-tip.sendFlag') }}</span>
          </v-tooltip>
        </div>
        <div class="d-flex justify-space-between align-center state-approve">
          <span>{{ $t('task-manager.dialogs.type-task.receive') }}</span>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <img
                src="@/assets/icons/task/type-task/information.png"
                class="px-2 cursor-pointer"
                v-bind="attrs"
                v-on="on"
              >
            </template>
            <span>{{ $t('task-manager.tool-tip.receiveFlag') }}</span>
          </v-tooltip>
        </div>
        <div class="d-flex justify-space-between align-center state-approve">
          <span>{{ $t('task-manager.dialogs.type-task.finish') }}</span>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <img
                src="@/assets/icons/task/type-task/information.png"
                class="px-2 cursor-pointer"
                v-bind="attrs"
                v-on="on"
              >
            </template>
            <span>{{ $t('task-manager.tool-tip.closeFlag') }}</span>
          </v-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// mixins
import filterItems from '@/mixins/filterItems'

export default {
  mixins: [filterItems],
  props: {
    dataTypeTask: {
      type: Object,
      default: undefined
    },
    isView: {
      type: Boolean,
      default: undefined
    },
    isTab: {
      type: Boolean,
      default: undefined
    },
    isUpdate: {
      type: Boolean,
      default: undefined
    },
    listGroup: {
      type: Array,
      default: undefined
    }
  },
  data() {
    return {}
  },
  watch: {
  },
  mounted() {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>

.label-field {
  font-size: 14px !important;
  font-weight: 600 !important;
  line-height: 20px !important;
  text-transform: uppercase;
  display: flex;
  align-items: center;
}

.wrapper{
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.divider{
  flex-grow: 2;
  border-color: #000000;
  margin-top: 6px;
}

input[type=checkbox] {
  position: relative;
  cursor: pointer;
}

input[type=checkbox]:before {
  content: "";
  display: block;
  position: absolute;
  width: 20px;
  height: 20px;
  top: 0;
  left: 0;
  border: 2px solid #555555;
  border-radius: 3px;
  background-color: white;
}

.active {
  input[type=checkbox]:hover:before {
    border-radius: 50%;
    background-color: #c3c3c3;
    border: 1px solid #c3c3c3;
    transform: scale(2);
    transition: 0.5s;
  }
}

input[type=checkbox]:checked:after {
  content: "";
  display: block;
  width: 7px;
  height: 12px;
  border: solid #0FAFE4;
  border-width: 0 2px 2px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
  position: absolute;
  top: 2px;
  left: 6px;
}

.m-wrapper {
  margin: 0 40px 15px 40px;
}

.state-approve {
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}

.fw-700 {
  font-weight: 700;
}

</style>
