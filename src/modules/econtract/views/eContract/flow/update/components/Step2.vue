<template>
  <validation-observer ref="observerStep2" v-slot="{ invalid }">
    <div class="wrap-content-contract">
      <div class="wrap-step2">
        <!-- Danh sach ben ky -->
        <h6 class="my-3">{{ $t("contract.listOfSignature") }}</h6>
        <container lock-axis="y" @drop="onDropListSigner">
          <draggable v-for="(represent, index) in listSigner" :key="index">
            <!-- Dai dien cua ban -->
            <v-card
              class="mb-10 group-sign rounded-xl"
              :class="groupSignType(represent)"
            >
              <div class="header-panel d-flex align-center pr-6">
                <v-tooltip
                  v-if="showRemoveSignator(represent)"
                  top
                  content-class="tooltip-top"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      class="btn-remove-signator"
                      v-bind="attrs"
                      @click="removeSignator(index)"
                      v-on="on"
                    >mdi-minus-circle-outline</v-icon>
                  </template>
                  <span>{{ $t("contract.tooltip.removeSignator") }}</span>
                </v-tooltip>

                <!-- <v-icon
                v-if="showRemoveSignator(represent)"
                class="btn-remove-signator"
                @click="removeSignator(index)"
              >mdi-minus-circle-outline</v-icon> -->
                <div class="index-panel">
                  <v-tooltip top content-class="tooltip-top">
                    <template v-slot:activator="{ on, attrs }">
                      <span v-bind="attrs" v-on="on">
                        {{ index + 1 }}
                      </span>
                    </template>
                    <span>{{ $t("contract.tooltip.stepSign") }}</span>
                  </v-tooltip>
                </div>
                <h6 class="white--text">{{ titlePanel(represent) }}</h6>
                <v-spacer />
                <div
                  v-if="isDisplayRepresent(represent.type)"
                  class="col-12 col-sm-3 pa-0"
                >
                  <v-select
                    v-model="represent.data.group"
                    dense
                    outlined
                    required
                    :items="selectGroup"
                    :item-text="(item) => $t(item.name)"
                    item-value="value"
                    @change="resetGroup(index)"
                  >
                    <template v-slot:append>
                      <v-icon>mdi-chevron-down</v-icon>
                    </template>
                  </v-select>
                </div>

                <div class="col-12 col-sm-4 py-0">
                  <!-- chon dai dien cua ban -->
                  <validation-provider
                    v-if="isDisplayGroup(represent.type)"
                    v-slot="{ errors }"
                    name="myRepresent"
                    rules="required"
                    :vid="`myRepresent-${index}`"
                  >
                    <v-select
                      v-model="represent.groupId"
                      dense
                      :placeholder="$t('contract.yourRepresentative')"
                      outlined
                      required
                      :items="groups"
                      item-text="groupName"
                      item-value="groupId"
                      :error-messages="errors"
                      @change="selectedGroup(represent.groupId, index)"
                    >
                      <template v-slot:append>
                        <v-icon>mdi-chevron-down</v-icon>
                      </template>
                    </v-select>
                  </validation-provider>
                  <!-- chon dai dien khach hang -->
                  <div
                    v-if="isDisplayPartner(represent)"
                    class="wrap-users-list"
                  >
                    <validation-provider
                      v-slot="{ errors }"
                      name="myRepresent"
                      rules="required"
                      :vid="`myRepresent-${index}`"
                    >
                      <v-text-field
                        v-model="represent.groupName"
                        outlined
                        dense
                        :placeholder="$t('contract.selectCustomer')"
                        required
                        :error-messages="errors"
                        @blur="resetFormOnput(index)"
                        @change="resetForm(index)"
                        @input="onInputSearch(represent.groupName, index)"
                      >
                        <vue-feather
                          slot="prepend-inner"
                          class="grey--text"
                          type="search"
                        />
                      </v-text-field>
                    </validation-provider>
                    <div v-show="represent.showFilterUser" class="wrap-users">
                      <v-list dense>
                        <v-list-item-group
                          v-model="selectedPartner"
                          color="primary"
                          @change="inputPartner(selectedPartner, index)"
                        >
                          <v-list-item
                            v-for="(group, idx) in groupsPartner"
                            :key="idx"
                            two-line
                            class="py-0"
                          >
                            <v-list-item-content class="py-0">
                              <v-list-item-title>{{
                                group.groupName
                              }}</v-list-item-title>
                              <v-list-item-subtitle>{{
                                $t("group.partnerLabel")
                              }}</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list-item-group>
                      </v-list>
                    </div>
                  </div>
                </div>
              </div>
              <div class="content-panel">
                <div
                  v-if="isDisplayPartner(represent)"
                  class="d-flex justify-end mr-4 option-select-coordinator"
                >
                  <v-checkbox
                    v-model="represent.data.isCoordinator"
                    hide-details
                    :label="$t('contract.selectCoordinator')"
                    class="mt-0 bg-transparent text--button"
                    @change="resetForm(index)"
                  />
                </div>
                <!-- Nguoi dieu phoi -->
                <v-expansion-panels
                  v-if="isDisplayCoordinator(represent)"
                  v-model="represent.openPanel"
                  class="elevation-0 panel-reviewer"
                  multiple
                >
                  <v-expansion-panel class="elevation-0 rounded-xl">
                    <v-expansion-panel-header class="mx-2">
                      <span class="pl-5 text--label text--body-1">
                        {{ $t("contract.coordinator") }}
                        <span class="color-require">*</span>
                      </span>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content class="mx-3 pb-3 rounded-lg">
                      <container lock-axis="y" class="bg-light-blue py-1">
                        <validation-observer ref="observerCoordinator">
                          <group-review
                            :disabled="checkDisabled(represent)"
                            :group-id="represent.groupId"
                            :is-review="true"
                            :is-coordinator="true"
                            :list-users="listUsers"
                            :signer="represent.data.coordinator"
                            @reset-signatures="resetListSignature"
                          />
                        </validation-observer>
                      </container>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>

                <!-- Nguoi xem xet -->
                <v-expansion-panels
                  v-if="showReviewer(represent)"
                  v-model="represent.openPanelReview"
                  multiple
                  class="elevation-0 panel-reviewer"
                >
                  <v-expansion-panel class="elevation-0 rounded-xl">
                    <v-expansion-panel-header class="mx-2">
                      <span class="pl-5 text--body-1">{{
                        $t("contract.reviewer")
                      }}</span>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content class="mx-3 pb-3 rounded-lg">
                      <container
                        lock-axis="y"
                        drag-class="bg-primary"
                        class="bg-light-blue py-2"
                        @drop="onDropReviews(index, $event)"
                      >
                        <draggable
                          v-for="(signer, idx) in represent.data.reviews"
                          :key="idx"
                        >
                          <validation-observer ref="observerReviews">
                            <group-review
                              :id="idx"
                              :disabled="checkDisabled(represent)"
                              :group="groups"
                              :is-review="true"
                              :group-id="represent.groupId"
                              :show-remove="represent.data.reviews.length > 1"
                              :signer="signer"
                              :list-users="listUsers"
                              :type="checkType(represent.type)"
                              :total-signers="represent.data.signers"
                              :total-reviews="represent.data.reviews"
                              @on-remove-signer="removeReviewer(index, idx)"
                              @reset-signatures="resetListSignature"
                            />
                          </validation-observer>
                        </draggable>
                      </container>
                      <div class="d-flex justify-start mt-3">
                        <btn-add
                          :tooltip="$t('contract.addReviewer')"
                          @on-click="addReviewer(index)"
                        />
                      </div>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
                <!-- Nguoi ky -->
                <v-expansion-panels
                  v-if="isDisplaySigner(represent.data)"
                  v-model="represent.openPanel"
                  multiple
                  class="elevation-0"
                >
                  <v-expansion-panel class="elevation-0 rounded-xl">
                    <v-expansion-panel-header class="mx-2">
                      <label class="pl-5 text--label text--body-1">
                        {{ $t("contract.signer") }}
                        <span class="color-require">*</span>
                      </label>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content class="mx-3 pb-3 rounded-lg">
                      <container
                        lock-axis="y"
                        class="bg-light-purple py-2"
                        drag-class="bg-primary"
                        @drop="onDropSigners(index, $event)"
                      >
                        <draggable
                          v-for="(signer, idx) in represent.data.signers"
                          :key="idx"
                        >
                          <validation-observer ref="observerSigner">
                            <group-signer
                              :id="idx"
                              :disabled="checkDisabled(represent)"
                              :group-id="checkGroupId(represent)"
                              :group-name="represent.groupName"
                              :is-review="false"
                              :show-remove="represent.data.signers.length > 1"
                              :signer="signer"
                              :type="checkType(represent.type)"
                              :total-signers="represent.data.signers"
                              :total-reviews="represent.data.reviews"
                              :list-users="listUsers"
                              @on-remove-signer="removeSigner(index, idx)"
                              @reset-signatures="resetListSignature"
                            />
                          </validation-observer>
                        </draggable>
                      </container>
                      <div class="d-flex justify-start mt-3">
                        <btn-add
                          :tooltip="$t('contract.addSigner')"
                          @on-click="addSigner(index)"
                        />
                      </div>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </div>
            </v-card>
          </draggable>
        </container>
        <v-btn
          block
          color="primary"
          outlined
          dark
          class="btn-add-group-signer"
          @click="addSignator"
        >
          <span class="text-add text--body-1">{{
            $t("contract.addSignator")
          }}</span>
          <v-icon size="40" class="icon-add">mdi-plus-circle-outline</v-icon>
        </v-btn>
      </div>
      <div class="d-flex justify-end align-center group-action-step">
        <v-btn
          class="my-2 w-150 py-5 mr-10 text--button"
          color="#0FAFE4"
          outlined
          rounded
          @click="showDialogCancel"
        >
          <span class="text-primary"> {{ $t("cancelLabel") }}</span>
        </v-btn>

        <v-btn
          class="my-2 w-150 py-5 mr-10 text--button"
          color="#0FAFE4"
          outlined
          rounded
          @click="prevStep"
        >
          <span class="text-primary"> {{ $t("contract.back") }}</span>
        </v-btn>
        <v-btn
          class="my-2 w-150 py-5 text--button"
          rounded
          color="primary"
          :disabled="invalid"
          @click="validateEmail"
        >
          {{ $t("contract.continue") }}
        </v-btn>
      </div>
    </div>
  </validation-observer>
</template>

<script>
// import _ from 'lodash'
import BtnAdd from "../../create/components/BtnAdd.vue";
import GroupSigner from "./GroupSigner";
import { mapActions, mapState } from "vuex";
import { Container, Draggable } from "vue-smooth-dnd";
import { applyDrag } from "@/helpers/utils";
import { UsersService } from "@/services/usersService";
import { GroupService } from "@/services/groupService";
import GroupReview from "./GroupReview";
import constants from "@/constants";
import _ from "lodash";

const initSignerData = {
  email: "",
  phone: "",
  name: "",
  userId: null,
  signMethods: [],
  signType: "",
  page: "",
  x: "",
  y: "",
  clone: false,
};
export default {
  name: "Step2",
  components: {
    BtnAdd,
    GroupSigner,
    Draggable,
    Container,
    GroupReview,
  },
  data() {
    return {
      tempPartner: null,
      selectedPartner: null,
      completed: false,
      listUsers: [],
      selectGroup: [
        { name: "contract.group", value: constants.GROUPS.GROUP },
        { name: "contract.personal", value: constants.GROUPS.PERSONAL },
      ],
      groupsPartner: [],
      groups: [],
      listSigner: [],
    };
  },
  computed: {
    filteredList() {
      return this.postList.filter((post) => {
        return post.title.toLowerCase().includes(this.search.toLowerCase());
      });
    },
    ...mapState("contract", ["contractDetail", "checkGroupSeleted"]),
  },
  watch: {
    checkGroupSeleted() {
      if (this.checkGroupSeleted) {
        this.searchGroup();
      }
      this.setCheckGroupSelected(false);
    },
    contractDetail() {
      const { representGroups } = this.contractDetail;
      this.listSigner = [];
      representGroups.map((rep) => {
        // Nguoi ky
        const signers = rep.signers;
        if (signers.length > 0) {
          signers.map((s) => {
            s.name = s.fullName;
            if (s.signMethod === constants.SIGN_METHODS.ALL) {
              s.signMethods = [
                constants.SIGN_METHODS.IMAGE_SIGN,
                constants.SIGN_METHODS.DIGITAL_SIGN,
              ];
            } else {
              s.signMethods = [s.signMethod];
            }
          });
        }

        // Nguoi xem xet
        var reviewers = rep.reviewers;
        var openPanelReview = [];
        if (reviewers.length > 0) {
          reviewers.map((s) => (s.name = s.fullName));
          openPanelReview.push(0);
        }

        // Nguoi dieu phoi
        var coordinator = rep.coordinator;
        if (coordinator) {
          coordinator.name = coordinator.fullName;
        }
        const item = {
          type: rep.groupType,
          data: {
            reviews: reviewers.length > 0 ? reviewers : [{ ...initSignerData }],
            signers: signers || [{ ...initSignerData }],
            group:
              rep.groupId || rep.groupName
                ? constants.GROUPS.GROUP
                : constants.GROUPS.PERSONAL,
            isCoordinator: rep.coordinator != null && signers.length === 0,
            coordinator: coordinator || { ...initSignerData },
          },
          groupId: rep.groupId,
          groupName: rep.groupName,
          openPanel: [0],
          openPanelReview,
          showFilterUser:
            rep.groupType === constants.GROUPS.INTERNAL ? false : null,
        };
        this.listSigner.push(item);
      });
      setTimeout(() => {
        this.searchGroup();
      }, 100);
    },
  },
  async created() {
    this.searchFlowGroup();
  },
  methods: {
    ...mapActions("contract", [
      "setListSigner",
      "setResetSignatures",
      "setCheckGroupSelected",
      "setAllowLoadFileSign",
    ]),
    ...mapActions("flow", ["setRepresentGroup"]),

    resetFormOnput(index) {
      setTimeout(() => {
        this.listSigner[index].showFilterUser = false;
        this.resetForm(index);
      }, 300);
    },
    // check groupId
    checkGroupId(value) {
      let groupId = null;
      if (value.data.group !== constants.GROUPS.PERSONAL) {
        groupId = value.groupId;
      }
      return groupId;
    },
    // check hien thi neu la dai dien cua ban
    isDisplayGroup(value) {
      let check = false;
      if (value === constants.GROUPS.INTERNAL) {
        check = true;
      }
      return check;
    },
    // check hien thi neu la doi tac
    isDisplayRepresent(value) {
      let check = false;
      if (value !== constants.GROUPS.INTERNAL) {
        check = true;
      }
      return check;
    },
    // check hien thi group nguoi dieu phoi
    isDisplayCoordinator(value) {
      let check = false;
      if (
        value.type !== constants.GROUPS.INTERNAL &&
        value.data.group !== constants.GROUPS.PERSONAL &&
        value.data.isCoordinator
      ) {
        check = true;
      }
      return check;
    },
    // check hien thi group dai dien khach hang
    isDisplayPartner(value) {
      let check = false;
      if (
        value.type !== constants.GROUPS.INTERNAL &&
        value.data.group !== constants.GROUPS.PERSONAL
      ) {
        check = true;
        // trigger show required
        // try {
        //   const groupPepresents = this.$refs.observerStep2.refs;
        //   if (groupPepresents) {
        //     const keys = Object.keys(groupPepresents);
        //     for (const i of keys) {
        //       groupPepresents[i].validate();
        //     }
        //   }
        // } catch (error) {
        //   console.debug(error.message);
        // }
      }
      return check;
    },
    // check hien thi group nguoi dieu phoi
    isDisplaySigner(value) {
      let check = false;
      if (!value.isCoordinator || value.group === constants.GROUPS.PERSONAL) {
        check = true;
      }
      return check;
    },
    // chon doi tac trong list doi tac khach hang
    inputPartner(value, index) {
      const partner = this.groupsPartner[value];
      if (partner) {
        this.tempPartner = partner;
      }
      this.partnerItem(this.tempPartner, index);
      this.listSigner[index].showFilterUser = false;
    },
    // luu thong tin cong ty doi tac
    partnerItem(value, index) {
      const group = this.groupsPartner.find((g) => {
        return g.groupId === value.groupId;
      });
      if (group) {
        // Validate group duplicate
        const isDuplicate = this.listSigner.find(
          (signer) => signer.groupId === group.groupId
        );
        if (isDuplicate) {
          const message = `${this.$t("group.name")} <b>${
            group.groupName
          }</b> ${this.$t("contract.duplicateEmail")}`;
          const typeAlert = "error";
          this.$emit("show-alert", { message, typeAlert });
          return;
        }
        // set groupID va groupName cho dai dien khach hang
        if (this.listSigner[index].type === constants.GROUPS.EXTERNAL) {
          this.listSigner[index].groupId = group.groupId;
          this.listSigner[index].groupName = group.groupName;
        }
      }
    },
    // reset lai form, groupName va nguoi dieu phoi
    resetGroup(index) {
      this.listSigner[index].groupId = null;
      this.listSigner[index].data.isCoordinator = false;
      this.listSigner[index].groupName = null;
      this.resetForm(index);
    },
    // reset lai from
    resetForm(index) {
      this.listSigner[index].data.coordinator = { ...initSignerData };
      this.listSigner[index].data.signers = [{ ...initSignerData }];
      this.listSigner[index].data.reviews = [{ ...initSignerData }];
      this.setResetSignatures(true);
    },
    // load danh sach user co group id
    async selectedGroup(groupId, index) {
      try {
        const param = {
          groupId: groupId,
          pageSize: 100000,
          groupType: constants.GROUPS.INTERNAL,
          restrictHierarchy: "false",
          excludeRoleCodes: "ROLE_ADMIN",
        };
        const groupSelect = this.groups.find((g) => g.groupId === groupId);
        this.listSigner[index].groupName = groupSelect.groupName;
        const response = await UsersService.searchUser(param);
        this.listUsers = response.data.data;
        this.listSigner[index].data.signers = [{ ...initSignerData }];
        this.listSigner[index].data.reviews = [{ ...initSignerData }];
      } catch (error) {
        console.log(error);
      }
    },
    // load tat ca user doi tac
    onInputSearch(value, index) {
      this.listSigner[index].groupId = null;
      setTimeout(async() => {
        if (value.length === 0) {
          this.listSigner[index].groupId = null;
          this.listSigner[index].showFilterUser = false;
          return;
        }
        const params = {
          groupName: value,
          restrictHierarchy: "false",
          groupType: constants.GROUPS.EXTERNAL,
          pageSize: 100000,
        };
        const response = await GroupService.search(params);
        if (response.success) {
          this.groupsPartner = response.data.data;
          if (this.groupsPartner.length < 0) {
            this.listSigner[index].groupId = null;
            this.listSigner[index].showFilterUser = false;
            return;
          }
          this.listSigner[index].showFilterUser = this.groupsPartner.length > 0;
        } else {
          console.log(response.messages);
        }
      }, 100);
    },
    // tra ve type dai dien cua ban
    checkType(represent) {
      if (represent === constants.GROUPS.INTERNAL) return true;
    },
    checkDisabled(value) {
      let check = true;
      if (value.groupName || value.data.group === constants.GROUPS.PERSONAL) {
        check = false;
      }
      return check;
    },
    // Tieu de
    titlePanel(represent) {
      return represent.type === constants.GROUPS.INTERNAL
        ? this.$t("contract.yourRepresentative")
        : this.$t("contract.customerRepresentative");
    },
    // Mau sac panel
    groupSignType(represent) {
      return represent.type === constants.GROUPS.INTERNAL
        ? "group-blue"
        : "group-cyan";
    },
    // Them nguoi xem xet
    addReviewer(index) {
      this.listSigner[index]["data"]["reviews"].push({ ...initSignerData });
    },
    // Xoa nguoi xem xet
    removeReviewer(index, idReviewer) {
      this.listSigner[index]["data"]["reviews"].splice(idReviewer, 1);
    },
    resetListSignature() {
      this.setResetSignatures(true);
    },
    // Them  nguoi ky
    addSigner(index) {
      this.listSigner[index]["data"]["signers"].push({
        ...initSignerData,
      });
      this.setResetSignatures(true);
    },
    // Xoa  nguoi ky
    removeSigner(index, idSigner) {
      this.listSigner[index]["data"]["signers"].splice(idSigner, 1);
      this.setResetSignatures(true);
    },
    // Keo tha nguoi xet duyet
    onDropReviews(index, resultDrop) {
      this.listSigner[index]["data"]["reviews"] = applyDrag(
        this.listSigner[index]["data"]["reviews"],
        resultDrop
      );
    },
    // Keo tha nguoi ky
    onDropSigners(index, resultDrop) {
      this.listSigner[index]["data"]["signers"] = applyDrag(
        this.listSigner[index]["data"]["signers"],
        resultDrop
      );
      this.$refs.observerStep2.reset();
    },
    // Keo tha ben dai dien
    onDropListSigner(resultDrop) {
      this.listSigner = applyDrag(this.listSigner, resultDrop);
      this.$refs.observerStep2.reset();
    },
    // Them ben tham gia ky
    addSignator() {
      this.listSigner.push({
        type: constants.GROUPS.EXTERNAL,
        data: {
          reviews: [
            {
              ...initSignerData,
            },
          ],
          signers: [{ ...initSignerData }],
          // Nguoi dieu phoi
          isCoordinator: false,
          coordinator: { ...initSignerData },
          group: constants.GROUPS.GROUP,
        },
        groupId: null,
        groupName: null,
        openPanel: [0],
        showFilterUser: false,
      });
      this.setResetSignatures(true);
    },
    // Xoa ben them gia ky
    removeSignator(index) {
      this.listSigner.splice(index, 1);
      this.setResetSignatures(true);
    },
    // Hien thi action xoa ben tham gia
    showRemoveSignator(represent) {
      return (
        represent.type === constants.GROUPS.EXTERNAL &&
        this.listSigner.length > 2
      );
    },
    // Hien thi nguoi xem xet
    showReviewer(represent) {
      return (
        represent.type === constants.GROUPS.INTERNAL ||
        (represent.data.group === constants.GROUPS.GROUP &&
          !represent.data.isCoordinator)
      );
    },
    // Lay danh sach group
    async searchGroup() {
      try {
        const response = await GroupService.getRepresentGroup();
        this.groups = response.data;
        if (this.groups.length === 0) {
          return;
        }

        const groupInternal = this.listSigner.find(
          (group) => group.type === constants.GROUPS.INTERNAL
        );
        if (groupInternal.groupId) {
          // Kiem tra co group hay ko
          const isExitsGroup = this.groups.some(
            (g) => g.groupId === groupInternal.groupId
          );
          if (isExitsGroup) {
            this.getUsersByGroupId(groupInternal.groupId);
          } else {
            groupInternal.groupId = null;
            groupInternal.groupName = null;
            // Reset data don vi cua ban
            groupInternal.data.signers = [{ ...initSignerData }];
            groupInternal.data.reviews = [{ ...initSignerData }];
            this.listUsers = [];
          }
        } else {
          this.listSigner[0].groupId = this.groups[0].groupId;
          this.listSigner[0].groupName = this.groups[0].groupName;
          this.getUsersByGroupId(this.listSigner[0].groupId);
        }

        // const groupInternal = this.listSigner.find(
        //   group => group.type === constants.GROUPS.INTERNAL
        // )
        // this.getUsersByGroupId(groupInternal.groupId)
      } catch (error) {
        console.log(error);
      }
    },
    // Lay danh sach pham vi
    async searchFlowGroup() {
      const response = await GroupService.getFlowGroup();
      this.setRepresentGroup(response.data);
    },
    // Load danh sach user theo don vi
    async getUsersByGroupId(groupId) {
      try {
        const params = {
          groupId: groupId,
          pageSize: 100000,
          groupType: constants.GROUPS.INTERNAL,
          restrictHierarchy: "false",
          excludeRoleCodes: "ROLE_ADMIN",
        };
        const response = await UsersService.searchUser(params);
        if (response.success) {
          this.listUsers = response.data.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    validateEmail() {
      var totalEmail = [];
      this.listSigner.map((element) => {
        totalEmail.push(...element.data.reviews);
        totalEmail.push(...element.data.signers);
        if (
          element.data.signers.length === 1 &&
          element.data.signers[0]["email"] === ""
        ) {
          totalEmail.push({ ...element.data.coordinator });
        }
      });
      totalEmail = totalEmail.filter((e) => e.email !== "");
      const emailDuplicates = [];
      const groupEmails = _.groupBy(totalEmail, "email");
      const keysEmail = Object.keys(groupEmails);
      keysEmail.map((k) => {
        if (groupEmails[k].length > 1) {
          emailDuplicates.push(k);
        }
      });

      if (emailDuplicates.length > 0) {
        const message = `${emailDuplicates[0]} ${this.$t(
          "contract.duplicateEmail"
        )}`;
        const typeAlert = "error";
        this.$emit("show-alert", { message, typeAlert });
        return;
      }
      this.nextStep();
    },
    nextStep() {
      this.$refs.observerStep2.validate().then((valid) => {
        if (valid) {
          this.setAllowLoadFileSign(true);
          this.updateListSigner();
          this.$emit("next-step", 3);
          this.setResetSignatures(false);
        }
      });
    },
    prevStep() {
      this.$emit("next-step", 1);
    },
    // Hien thi dialog huy
    showDialogCancel() {
      this.$emit("show-cancel");
    },
    // Cap nhat lai list signer
    updateListSigner() {
      this.setListSigner(null);
      this.setListSigner(this.listSigner);
    },
  },
};
</script>

<style lang="scss"></style>
