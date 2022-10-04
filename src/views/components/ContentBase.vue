<template>
  <div class="content">
    <span class="title-content">{{ title }}</span>
    <v-card v-if="items.length" outlined class="mx-auto" style="border: none">
      <v-virtual-scroll :items="items" height="210" item-height="101">
        <template v-slot:default="{ item }">
          <div
            v-if="code == $t(`gloabal-dashboard.HDDT.code`)"
            class="delivery-note hover-btn"
            @click="$emit('onDetailContract', item.id)"
          >
            <v-list-item-title class="title-note">{{
              item.title
            }}</v-list-item-title>
            <div
              class="process-contract"
              v-html="renderProcessContract(item.process)"
            />
          </div>

          <div
            v-if="code == $t(`gloabal-dashboard.KDT.code`)"
            class="delivery-note hover-btn"
            @click="$emit('onDetailSig', item.documentId)"
          >
            <v-list-item-title class="title-note">{{
              item.title
            }}</v-list-item-title>
            <div class="signature">
              <v-progress-linear
                class="process-inProcess mr-2"
                :buffer-value="item.totalProcessedSigners"
                :value="valueProgress(item)"
                :color="colorProgess(item.docState)"
                height="15"
              />
              <span class="text-process">
                {{ item.totalProcessedSigners }}/{{ item.totalSigners }}
              </span>
            </div>
          </div>
          <div
            v-if="code == $t(`gloabal-dashboard.QLVB.code`)"
            class="delivery-note hover-btn"
            @click="$emit('onDetail', item.documentId)"
          >
            <v-list-item-title class="title-note">{{
              item.title
            }}</v-list-item-title>
            <div class="btn-read" @click.stop="$emit('onRead', item.documentId)">
              {{ $t(`gloabal-dashboard.QLVB.btnRead`) }}
            </div>
          </div>
        </template>
      </v-virtual-scroll>
    </v-card>
  </div>
</template>

<script>
import contract from "@/mixins/contracts";
import constants from "@/constants";

export default {
  mixins: [contract],
  props: {
    title: {
      type: String,
      require: true,
      default: "",
    },
    items: {
      type: Array,
      require: true,
      default: () => [],
    },
    code: {
      type: String,
      require: true,
      default: "",
    },
  },

  methods: {
    valueProgress(item) {
      return (item.totalProcessedSigners / item.totalSigners) * 100;
    },
    colorProgess(item) {
      if (item === constants.DOC_STATES.COMPLETE) {
        return "#1c49e9";
      }
      return "#ffaf2e";
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  margin-top: 14px;
  .title-content {
    padding: 10px;
    color: #9fa2b4;
    font-weight: 700;
    font-size: 14px;
    line-height: 18px;
  }
}

.delivery-note {
  margin-top: 8px;
  border: 1px solid #dfe0eb;
  border-radius: 8px;
  height: 94px;
  cursor: pointer;
  .title-note {
    padding: 15px;
    font-weight: 600;
    font-size: 14px;
    line-height: 18px;
    color: #4b506d;
  }
  .signature {
    display: flex;
    padding: 0px 15px 0px 15px;
  }

  .process-inProcess {
    border: none;
    color: lightblue;
    background: #e7ecf1;
    border-radius: 20px;
    width: 90%;

    @media screen and (max-width: 1440px) {
      height: 10px;
    }
  }

  .process-inProcess::-webkit-progress-bar {
    background: #e7ecf1;
    border-radius: 20px;
  }

  .process-inProcess::-webkit-progress-value {
    background: linear-gradient(154.49deg, #ffd085 6.61%, #ffaf2e 89.72%);
    border-radius: 20px;
  }

  .process-inProcess::-moz-progress-bar {
    background: #0fafe4;
    border-radius: 20px;
  }

  .text-process {
    font-weight: 600;
    font-size: 14px;
    color: #22242c;

    @media screen and (max-width: 1440px) {
      font-size: 12px;
      line-height: 15px;
    }
  }
}

.btn-read {
  height: 32px;
  background: #0fafe4;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
  border-radius: 40px;
  margin: 0px 13px 0px 13px;
  text-align: center;
  color: #ffffff;
  font-weight: 550;
  font-size: 14px;
  line-height: 20px;
  padding-top: 6px;
  text-transform: uppercase;
  cursor: pointer;
  &:hover {
    background: #2cbff0;
  }
}
.hover-btn {
  margin-right: 10px;

  &:hover {
    background-color: #f9f9f9!important;

    & .title-note {
      color: #0fafe4 !important;
    }
  }
}
</style>

