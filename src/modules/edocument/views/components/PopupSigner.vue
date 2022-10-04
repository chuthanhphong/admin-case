<template>
  <v-fade-transition>
    <div
      v-show="activeIndex == index"
      :class="{ active: listShowPopup[index] }"
    >
      <div class="popup-list-signer-management">
        <div class="popup-header d-flex align-center justify-space-between">
          <div>
            <span>{{ $t("listSign") }}</span>
            <span> ({{ item.signers.length }})</span>
          </div>
          <v-btn
            text
            icon
            class="btn-close-list-signer"
            @click="closePopupCustomer(index)"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <v-divider class="my-1" />
        <div class="list-signer">
          <div
            v-for="(signer, itemIndex) in item.signers"
            :key="itemIndex"
            class="list-item-signer pb-2"
          >
            <div class="d-flex align-center">
              <v-avatar size="32" :color="lstColors[itemIndex % 5]">
                <span class="text-uppercase white--text">
                  {{ getFirstCharacter(signer) }}
                </span>
              </v-avatar>
              <div class="d-flex flex-column pl-2 text-left">
                <b v-if="item.signers.length === 1">{{ renderSignerName(signer) }}</b>
                <b v-else>{{ itemIndex + 1 }}. {{ renderSignerName(signer) }}</b>
                <div class="signer-document">
                  <span v-html="renderEmailPhone(signer)" />
                  <span v-html="renderSignerPosition(signer)" />
                  <span v-html="renderSignerInfo(signer)" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-fade-transition>
</template>

<script>
export default {
  props: {
    activeIndex: {
      type: Number,
      default: undefined,
    },
    index: {
      type: Number,
      default: undefined,
    },
    listShowPopup: {
      type: Array,
      default: undefined,
    },
    item: {
      type: Object,
      default: undefined,
    },
    lstColors: {
      type: Array,
      default: undefined,
    },
  },
  methods: {
    closePopupCustomer(index) {
      this.$emit("close-popup-signer", index);
    },
    getFirstCharacter(signer) {
      if (!signer) return "";
      if (parseInt(signer.signProcessType) === 1 || signer.fullName) {
        return this.genAvatar(signer.fullName);
      }
      return this.genAvatar(signer.position);
    },
    genAvatar(name) {
      if (!name) return "";
      if (name.includes("+")) return name;
      if (name.includes(" ")) {
        // lay ky tu dau tien cua lastname.
        const lastName = name.split(" ").pop();
        return lastName[0].toUpperCase();
      }
      return name[0].toUpperCase();
    },
    renderSignerName(signer) {
      return signer.fullName ? signer.fullName : signer.position;
    },
    renderSignerInfo(signer) {
      return signer.groupPathName ? signer.groupPathName + "<br/>" : "";
    },
    renderEmailPhone(signer) {
      if (!signer.email && !signer.phone) return "";
      if (!signer.email) return signer.phone + "<br>";
      if (!signer.phone) return signer.email + "<br>";
      return signer.email + " - " + signer.phone + "<br>";
    },
    renderSignerPosition(signer) {
      const signerPositionName = signer.position;
      // if (parseInt(signer.signProcessType) !== 1) {
      //   signerPositionName =
      //     signerPositionName +
      //     ' (' +
      //     this.$t('document.signaturePosition') +
      //     ')'
      // }
      return signerPositionName ? signerPositionName + "<br/>" : "";
    },
  },
};
</script>

<style lang="scss" scoped>
.popup-list-signer-management {
  position: absolute;
  background: #ffffff;
  border-radius: 8px;
  filter: drop-shadow(0px 2px 10px rgba(0, 0, 0, 0.15));
  width: 250px;
  padding: 15px 10px;
  left: -260px;
  top: -25px;
  z-index: 9;
  .btn-close-list-signer {
    position: absolute;
    right: 0;
    top: 2px;
  }
  &::after {
    content: url("../../../../assets/icons/arrow-right-signer.png");
    position: absolute;
    right: -10px;
    top: 15px;
  }
  .popup-header {
    color: #22242c;
    font-weight: 700;
  }
  .list-signer {
    max-height: 360px;
    overflow-y: auto;
  }
  .list-item-signer {
    b {
      color: #22242c;
      font-weight: 600;
      font-size: 14px;
    }
    font-size: 12px;
    color: #9fa2b4;
  }
}
</style>
