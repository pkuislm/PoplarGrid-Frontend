<template>
  <div class="space-y-6" v-if="projectStore.projectDetail">
    <div class="flex items-center space-x-4">
      <el-button @click="goBackToProjects" :icon="ArrowLeft"
        >返回项目列表</el-button
      >
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ projectStore.projectDetail.title }}
      </h1>
      <el-tag :type="statusType">{{ statusText }}</el-tag>
    </div>

    <!-- 完整视图 -->
    <div>
      <!-- 标签页 -->
      <el-tabs v-model="activeTab" class="project-detail-tabs">
        <el-tab-pane label="项目概览" name="overview">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- 项目信息 -->
            <div class="lg:col-span-2 space-y-6">
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2
                  class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
                >
                  项目详情
                </h2>
                <div class="space-y-3">
                  <div>
                    <span class="text-sm font-medium text-gray-500"
                      >描述：</span
                    >
                    <p class="text-gray-900 dark:text-white">
                      {{ projectStore.projectDetail.description || "暂无描述" }}
                    </p>
                  </div>
                  <div class="flex space-x-6">
                    <div>
                      <span class="text-sm font-medium text-gray-500"
                        >创建时间：</span
                      >
                      <span class="text-gray-900 dark:text-white">{{
                        formatDate(projectStore.projectDetail.createdAt)
                      }}</span>
                    </div>
                    <div>
                      <span class="text-sm font-medium text-gray-500"
                        >更新时间：</span
                      >
                      <span class="text-gray-900 dark:text-white">{{
                        formatDate(projectStore.projectDetail.updatedAt)
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 项目图片 -->
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2
                  class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
                >
                  项目图片
                </h2>

                <div
                  v-if="projectStore.projectFile.length === 0"
                  class="text-center py-8"
                >
                  <svg
                    class="w-12 h-12 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z"
                    />
                  </svg>
                  <p class="text-gray-500 dark:text-gray-400">暂无图片</p>
                </div>

                <div
                  v-else
                  class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                  <div
                    v-for="(file, index) in projectStore.projectFile"
                    :key="file.id"
                    class="relative group cursor-pointer rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 aspect-square"
                    @click="openTranslator(file.id, index)"
                  >
                    <img
                      v-if="file.coverUrl"
                      :src="file.coverUrl"
                      :alt="file.name"
                      class="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div
                      v-else
                      class="w-full h-full flex items-center justify-center"
                    >
                      <svg
                        class="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z"
                        />
                      </svg>
                    </div>

                    <!-- Overlay -->
                    <div
                      class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center"
                    >
                      <div
                        class="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <svg
                          class="w-8 h-8 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </div>
                    </div>

                    <!-- Page Number -->
                    <div
                      class="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded"
                    >
                      {{ index + 1 }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- 进度管理 -->
              <div
                v-if="true"
                class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <h2
                  class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
                >
                  进度管理
                </h2>

                <div class="space-y-6">
                  <div v-if="true">
                    <div class="flex justify-between items-center mb-2">
                      <span
                        class="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >翻译进度</span
                      >
                      <div class="flex items-center space-x-2">
                        <span class="text-sm text-gray-500">{{ 70 }}%</span>
                        <el-button
                          size="small"
                          @click="showProgressDialog('translation')"
                          >调整</el-button
                        >
                      </div>
                    </div>
                    <el-progress
                      :percentage="70"
                      :stroke-width="8"
                      color="#3b82f6"
                    />
                  </div>

                  <div v-if="true">
                    <div class="flex justify-between items-center mb-2">
                      <span
                        class="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >校对进度</span
                      >
                      <div class="flex items-center space-x-2">
                        <span class="text-sm text-gray-500">{{ 70 }}%</span>
                        <el-button
                          size="small"
                          @click="showProgressDialog('proofreading')"
                          >调整</el-button
                        >
                      </div>
                    </div>
                    <el-progress
                      :percentage="70"
                      :stroke-width="8"
                      color="#10b981"
                    />
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      v-if="true"
                      class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded"
                    >
                      <span
                        class="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >嵌字状态</span
                      >
                      <!-- <el-select
                        :model-value="project.progress.typesetting"
                        @change="updateTypesetting"
                        size="small"
                      >
                        <el-option label="未嵌字" value="not_started" />
                        <el-option label="嵌字中" value="in_progress" />
                        <el-option label="已完成嵌字" value="completed" />
                      </el-select> -->
                    </div>

                    <div
                      v-if="true"
                      class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded"
                    >
                      <span
                        class="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >审核状态</span
                      >
                      <!-- <el-select
                        :model-value="project.progress.review"
                        @change="updateReview"
                        size="small"
                      >
                        <el-option label="未审核" value="not_reviewed" />
                        <el-option label="审核中" value="reviewing" />
                        <el-option label="已审核" value="reviewed" />
                      </el-select> -->
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 侧边栏 -->
            <div class="space-y-6">
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3
                  class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
                >
                  快速统计
                </h3>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400"
                      >总源文本</span
                    >
                    <span class="font-medium">{{ 100 }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400"
                      >已完成</span
                    >
                    <span class="font-medium">{{ 100 }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400"
                      >完成率</span
                    >
                    <span class="font-medium"> {{ 100 }}% </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400"
                      >图片数量</span
                    >
                    <span class="font-medium">{{
                      projectStore.projectFile.length
                    }}</span>
                  </div>
                </div>
              </div>

              <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3
                  class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
                >
                  快速操作
                </h3>
                <!-- <div class="space-y-2">
                  <el-button
                    v-if="userPermissions.canEditProject"
                    type="primary"
                    class="w-full"
                    >编辑项目</el-button
                  >
                  <el-button
                    v-if="userPermissions.canViewTranslations"
                    class="w-full"
                    >查看文件</el-button
                  >
                  <el-button
                    v-if="userPermissions.canExportFiles"
                    class="w-full"
                    >导出项目</el-button
                  >
                  <el-button
                    v-if="userPermissions.canEditProject"
                    type="danger"
                    class="w-full"
                    >删除项目</el-button
                  >
                </div> -->
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="成员管理" name="members">
          <!-- <ProjectMembers :project="project" /> -->
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 申请加入对话框 -->
    <el-dialog v-model="showApplyDialog" title="申请加入项目" width="500px">
      <el-form
        ref="applyFormRef"
        :model="applyForm"
        :rules="null"
        label-width="80px"
      >
        <el-form-item label="申请角色" prop="roles">
          <el-checkbox-group v-model="applyForm.roles">
            <el-checkbox label="image_source">图源</el-checkbox>
            <el-checkbox label="artist">美工</el-checkbox>
            <el-checkbox label="translator">翻译</el-checkbox>
            <el-checkbox label="proofreader">校对</el-checkbox>
            <el-checkbox label="typesetter">嵌字</el-checkbox>
            <el-checkbox label="reviewer">审核</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="申请理由" prop="message">
          <el-input
            v-model="applyForm.message"
            type="textarea"
            :rows="3"
            placeholder="请简单介绍您的经验和能力..."
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showApplyDialog = false">取消</el-button>
          <el-button
            type="primary"
            @click="submitApplication"
            :loading="submittingApplication"
          >
            提交申请
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 进度调整对话框 -->
    <el-dialog
      v-model="showProgressEditDialog"
      :title="`调整${progressType === 'translation' ? '翻译' : '校对'}进度`"
      width="400px"
    >
      <div class="space-y-4">
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            进度百分比
          </label>
          <el-slider v-model="newProgress" :max="100" :min="0" show-input />
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showProgressEditDialog = false">取消</el-button>
          <el-button type="primary" @click="updateProgress" :loading="updating">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>

  <div
    v-else-if="projectStore.project_detail_loading"
    class="flex justify-center py-12"
  >
    <div class="flex items-center space-x-2">
      <svg
        class="animate-spin h-5 w-5 text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span class="text-gray-600 dark:text-gray-400">加载中...</span>
    </div>
  </div>

  <div v-else class="text-center py-12">
    <p class="text-gray-500 dark:text-gray-400">项目不存在</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft, User } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useProjectsStore } from "@/stores/projects";
import { useAuthStore } from "@/stores/auth";
import { useMembersStore } from "@/stores/members";
import {
  getUserProjectDetailPermissions,
  isProjectDetailOwner,
  isProjectDetailManager,
  isProjectDetailMember,
} from "@/utils/permissions";
import ProjectMembers from "@/components/ProjectMembers.vue";
import type { ProjectDetail, ProjectRole } from "@/types";

const route = useRoute();
const router = useRouter();
const projectStore = useProjectsStore();
const authStore = useAuthStore();
const membersStore = useMembersStore();

const activeTab = ref("overview");
const showProgressEditDialog = ref(false);
const showApplyDialog = ref(false);
const progressType = ref<"translation" | "proofreading">("translation");
const newProgress = ref(0);
const updating = ref(false);
const submittingApplication = ref(false);

const applyForm = reactive({
  roles: [] as ProjectRole[],
  message: "",
});

//
//
//

// 分页相关（缩略图）
const current_page = ref<number>(1);
const page_size = 15;

// 项目状态
const project_status = ref<number[]>([]);

const isOwner = computed(() => {
  if (!project.value || !authStore.user) return false;
  return isProjectOwner(authStore.user, project.value);
});

const isManager = computed(() => {
  if (!project.value || !authStore.user) return false;
  return isProjectManager(authStore.user, project.value);
});

const isMember = computed(() => {
  if (!project.value || !authStore.user) return false;
  return isProjectMember(authStore.user, project.value);
});

const userPermissions = computed(() => {
  if (!projectStore.projectDetail || !authStore.user) {
    return {
      canTranslate: false,
      canProofread: false,
      canViewTranslations: false,
      canSetTypesettingStatus: false,
      canSetReviewStatus: false,
      canExportFiles: false,
      canManageMembers: false,
      canEditProject: false,
    };
  }
  return getUserProjectDetailPermissions(
    authStore.user,
    projectStore.projectDetail
  );
});

const statusType = computed(() => {
  if (!projectStore.projectDetail) return "info";
  return "info";
});

const statusText = computed(() => {
  if (!projectStore.projectDetail) return "未知";
  return "未知";
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const goBackToProjects = () => {
  router.push("/projects");
};

const openTranslator = (fileId: string, pageIndex: number) => {
  if (!userPermissions.value.canViewTranslations) {
    ElMessage.warning("您没有权限查看翻译内容");
    return;
  }

  // Navigate to translator mode
  router.push(
    `/translator/${projectStore.projectDetail!.id}/${fileId}?page=${pageIndex}`
  );
};

const showProgressDialog = (type: "translation" | "proofreading") => {
  progressType.value = type;
  showProgressEditDialog.value = true;
};

const updateProgress = async () => {
  if (!projectStore.projectDetail) return;

  updating.value = true;
  try {
    await projectStore.updateProjectProgress(projectStore.projectDetail.id, {
      [progressType.value]: newProgress.value,
    });
    ElMessage.success("进度更新成功");
    showProgressEditDialog.value = false;
  } catch (error) {
    ElMessage.error("进度更新失败");
  } finally {
    updating.value = false;
  }
};

const updateTypesetting = async (value: string) => {
  if (!project.value) return;

  try {
    await projectsStore.updateProjectProgress(project.value.id, {
      typesetting: value as any,
    });
    ElMessage.success("嵌字状态更新成功");
  } catch (error) {
    ElMessage.error("嵌字状态更新失败");
  }
};

const updateReview = async (value: string) => {
  if (!project.value) return;

  try {
    await projectsStore.updateProjectProgress(project.value.id, {
      review: value as any,
    });
    ElMessage.success("审核状态更新成功");
  } catch (error) {
    ElMessage.error("审核状态更新失败");
  }
};

const submitApplication = async () => {
  if (!applyFormRef.value || !project.value) return;

  await applyFormRef.value.validate(async (valid) => {
    if (valid) {
      submittingApplication.value = true;
      try {
        await membersStore.applyToProject(
          project.value!.id,
          applyForm.roles,
          applyForm.message
        );
        ElMessage.success("申请已提交，请等待项目负责人审核");
        showApplyDialog.value = false;

        // 重置表单
        Object.assign(applyForm, { roles: [], message: "" });
        applyFormRef.value?.resetFields();
      } catch (error) {
        ElMessage.error("提交申请失败");
      } finally {
        submittingApplication.value = false;
      }
    }
  });
};

onMounted(async () => {
  // 获取项目详情
  const projectId = Number(route.params.id as string);
  if (projectId) {
    await projectStore.fetchProject(projectId);
  } else {
    ElMessage.error("不是合法的项目id");
    router.push("/projects");
  }

  // 获取项目文件
  await projectStore.fetchProjectFiles(projectId);
});
</script>

<style scoped>
.project-detail-tabs :deep(.el-tabs__content) {
  padding-top: 20px;
}
</style>
