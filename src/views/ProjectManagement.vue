<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">所有项目</h1>
      <div class="flex space-x-3">
        <el-button
          v-if="authStore.isAdmin"
          @click="showTagManager = true"
          :icon="PriceTag"
        >
          标签管理
        </el-button>
        <el-button
          type="primary"
          @click="handleSync"
          :loading="syncStore.isSyncing"
          :icon="Refresh"
          v-if="authStore.isAdmin"
        >
          {{ syncStore.isSyncing ? "同步中..." : "同步项目" }}
        </el-button>
        <el-button
          v-if="authStore.isAdmin"
          @click="handleExport"
          :icon="Download"
        >
          导出数据
        </el-button>
      </div>
    </div>

    <!-- 同步结果提示 -->
    <div
      v-if="syncStore.lastSyncResult"
      class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
    >
      <div class="flex items-center">
        <svg
          class="w-5 h-5 text-green-600 dark:text-green-400 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <p class="text-sm font-medium text-green-800 dark:text-green-200">
            同步完成！共同步 {{ syncStore.lastSyncResult.syncedCount }} 个项目
          </p>
          <p class="text-xs text-green-600 dark:text-green-400 mt-1">
            新增: {{ syncStore.lastSyncResult.newCount }} | 更新:
            {{ syncStore.lastSyncResult.updatedCount }}
          </p>
        </div>
      </div>
    </div>

    <!-- 筛选器 -->
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
      style="display: flex; flex-direction: column; gap: 2vh"
    >
      <div class="flex flex-wrap items-center" style="gap: 2vw">
        <div style="display: flex; gap: 1vw; align-items: center">
          <span> 项目名称 </span>
          <el-input
            v-model="searchQuery"
            placeholder="搜索项目名称..."
            :prefix-icon="Search"
            class="w-64"
            style="width: 30vw"
          />
        </div>
        <div style="display: flex; gap: 1vw; align-items: center">
          <span> 所属项目集 </span>
          <el-select
            v-model="typeFilter"
            placeholder="选择项目集"
            clearable
            class="w-40"
          >
            <el-option label="全部类型" value="" />
            <el-option
              v-for="tag in syncStore.projectTags"
              :key="tag.id"
              :label="tag.name"
              :value="tag.name"
            />
          </el-select>
        </div>
        <div style="display: flex; gap: 1vw; align-items: center">
          <span> 发布状态 </span>
          <el-select
            v-model="pub_status"
            placeholder="选择发布状态"
            clearable
            class="w-40"
          >
            <el-option label="全部类型" value="" />
          </el-select>
        </div>
      </div>
      <div
        style="
          display: flex;
          justify-content: left;
          gap: 2vw;
          align-items: center;
        "
      >
        <span> 分管状态 </span>
        <div
          v-for="(field, index) in status_fields"
          style="display: flex; align-items: center; gap: 1vw"
        >
          <el-tag type="info" size="large" effect="dark">{{ field }}</el-tag>
          <el-select
            :key="field"
            style="width: 10vw"
            v-model="project_status_filter[index]"
            clearable
            :placeholder="'选择' + field + '状态'"
            @change="handleStatusFilterChange"
            :disabled="status_filter_disable[index]"
          >
            <!-- 自定义选中项显示 -->
            <template #label>
              <div
                style="
                  display: flex;
                  align-items: center;
                  justify-content: left;
                  gap: 0.5vw;
                "
                v-if="project_status_filter[index] !== undefined"
              >
                <component
                  :is="status_options[project_status_filter[index]]?.icon"
                  :class="status_options[project_status_filter[index]]?.class"
                />
                <span>{{
                  status_options[project_status_filter[index]]?.description
                }}</span>
              </div>
            </template>

            <el-option
              v-for="option in status_options"
              :key="field + option.description"
              :value="option.value"
            >
              <div
                style="
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                "
              >
                <component :is="option.icon" :class="option.class" />
                <span>{{ option.description }}</span>
              </div>
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="flex flex-wrap items-center" style="gap: 2vw">
        <span> 排序方式 </span>
        <el-select
          v-model="order_mode"
          placeholder="选择排序方式"
          class="w-40"
        >
          <template #label>
            <span>{{ order_options[order_mode].label }}</span>
          </template>
          <el-option
            v-for="option in order_options"
            :key="option.label"
            :value="option.value"
          >
            {{ option.label }}
          </el-option>
        </el-select>
      </div>
    </div>

    <!-- 项目表格 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow" width="100%">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          项目列表 ({{ (current_page - 1) * page_size + 1 }} -
          {{ current_page * page_size }}，共{{ total_projects }}个)
        </h2>
      </div>

      <div v-if="syncStore.isLoading" class="flex justify-center py-12">
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

      <div v-else-if="filteredProjects.length === 0" class="text-center py-12">
        <p class="text-gray-500 dark:text-gray-400">
          {{
            searchQuery || typeFilter
              ? "没有找到匹配的项目"
              : "暂无项目，请先同步数据"
          }}
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <el-table
          :data="filteredProjects"
          class="py-6"
          show-header="false"
          table-layout="fix"
          @expand-change="handleExpandChange"
          :expand-row-keys="expandRowKeys"
          row-key="id"
        >
          <!-- 项目编号 -->
          <el-table-column width="50vw" align="center" label="serialNumber">
            <template #default="scope">
              {{ scope.row.serialNumber }}
            </template>
          </el-table-column>

          <!-- 项目名 -->
          <el-table-column align="left">
            <template #default="scope">
              <span
                class="text-sm font-medium text-blue-600 dark:text-blue-400 underline cursor-pointer"
                @click="navigateToProject(scope.row)"
              >
                <el-link underline="never">{{ scope.row.name }}</el-link>
              </span>
            </template>
          </el-table-column>

          <!-- 所属项目集 -->
          <el-table-column width="100vw" align="right">
            <template #default="scope">
              <div class="inline-flex items-center justify-end">
                <el-tag
                  v-if="scope.row.type"
                  :color="getTagColor(scope.row.type)"
                  effect="light"
                >
                  {{ scope.row.type }}
                </el-tag>
              </div>
            </template>
          </el-table-column>

          <!-- 发布状态 -->
          <el-table-column width="80vw" align="center">
            <template #default="scope">
              <el-tag :type="getPublishStatusType(scope.row.publishStatus)">
                {{ getPublishStatusText(scope.row.publishStatus) }}
              </el-tag>
            </template>
          </el-table-column>

          <!-- 项目进度 -->
          <el-table-column width="200vw" align="right">
            <template #default="scope">
              <div class="flex space-x-3 justify-center">
                <div
                  v-for="(label, index) in ['翻', '校', '嵌', '审']"
                  :key="label"
                  class="flex items-center space-x-1"
                >
                  <span class="text-sm">{{ label }}</span>
                  <component
                    :is="getProgressIcon(scope.row.workStatus, index).icon"
                    class="w-4 h-4"
                    :class="getProgressIcon(scope.row.workStatus, index).class"
                  />
                </div>
              </div>
            </template>
          </el-table-column>

          <!-- 展开按钮 -->
          <el-table-column type="expand">
            <template #default="scope">
              <ProjectTableSpan :project="scope.row" />
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div
          style="
            margin-bottom: 2vh;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          <el-pagination
            :page-size="15"
            :pager-count="5"
            layout="prev, pager, next"
            :current-page="current_page"
            @current-change="handleCurrentPageChange"
            :total="1000"
          />
        </div>
      </div>
    </div>

    <!-- 标签管理对话框 -->
    <el-dialog v-model="showTagManager" title="标签管理" width="600px">
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium">项目标签</h3>
          <el-button type="primary" size="small" @click="showCreateTag = true">
            新建标签
          </el-button>
        </div>

        <div class="grid grid-cols-1 gap-3">
          <div
            v-for="tag in syncStore.projectTags"
            :key="tag.id"
            class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <div
                class="w-4 h-4 rounded-full"
                :style="{ backgroundColor: tag.color }"
              ></div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ tag.name }}
                </p>
                <p class="text-sm text-gray-500" v-if="tag.description">
                  {{ tag.description }}
                </p>
              </div>
            </div>
            <el-button
              type="danger"
              size="small"
              @click="handleDeleteTag(tag.id)"
              :icon="Delete"
            >
              删除
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 创建标签对话框 -->
    <el-dialog v-model="showCreateTag" title="创建标签" width="400px">
      <el-form
        ref="tagFormRef"
        :model="tagForm"
        :rules="tagRules"
        label-width="80px"
      >
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="tagForm.name" placeholder="请输入标签名称" />
        </el-form-item>

        <el-form-item label="标签颜色" prop="color">
          <el-color-picker v-model="tagForm.color" />
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input
            v-model="tagForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入标签描述（可选）"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showCreateTag = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleCreateTag"
            :loading="creating"
          >
            创建
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import {
  CloseBold,
  Select,
  MoreFilled,
  Search,
  Delete,
  PriceTag,
  Refresh,
  Download,
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useSyncStore } from "@/stores/sync";
import { useAuthStore } from "@/stores/auth";
import * as XLSX from "xlsx";
import type { FormInstance, FormRules } from "element-plus";
import ProjectTableSpan from "@/components/ProjectTableSpan.vue";
import { authApi } from "@/api/auth";

const router = useRouter();
const syncStore = useSyncStore();
const authStore = useAuthStore();

const typeFilter = ref("");
const searchQuery = ref("");
const showTagManager = ref(false);
const showCreateTag = ref(false);
const creating = ref(false);
const tagFormRef = ref<FormInstance>();
const expandRowKeys = ref<any[]>([]);

// 筛选器相关
const project_status_filter = ref<(number | undefined)[]>([
  undefined,
  undefined,
  undefined,
  undefined,
]);
const status_filter_disable = ref<boolean[]>([false, false, false, false]);
const pub_status = ref<number | undefined>(undefined); // 发布状况
const order_mode = ref<number>(0); // 显示排序方式
const status_fields = ["翻译", "校对", "嵌字", "审核"];
const status_options = [
  {
    icon: CloseBold,
    class: "text-gray-500 w-4 h-4",
    description: "未开始",
    value: 0,
  },
  {
    icon: MoreFilled,
    class: "text-yellow-500 w-4 h-4",
    description: "进行中",
    value: 1,
  },
  {
    icon: Select,
    class: "text-green-500 w-4 h-4",
    description: "已完成",
    value: 2,
  },
];
const order_options = [
  {
    label: "更新时间由新到旧",
    value: 0,
  },
  {
    label: "更新时间由旧到新",
    value: 1,
  },
  {
    label: "项目编号由小到大",
    value: 2,
  },
  {
    label: "项目编号由大到小",
    value: 3,
  },
];

// 分页相关
const current_page = ref<number>(1);
const page_size = 15;

// 总项目数
const total_projects = ref<number>(1024);

const tagForm = reactive({
  name: "",
  color: "#3b82f6",
  description: "",
});

const tagRules: FormRules = {
  name: [{ required: true, message: "请输入标签名称", trigger: "blur" }],
};

const filteredProjects = computed(() => {
  let filtered = syncStore.syncedProjects;

  if (typeFilter.value) {
    filtered = filtered.filter((p) => p.type === typeFilter.value);
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.originalName.toLowerCase().includes(query)
    );
  }

  return filtered.sort((a, b) => a.serialNumber - b.serialNumber);
});

const getTagColor = (tagName: string) => {
  return "#eaa2f6";
};

const getPublishStatusType = (status: string) => {
  switch (status) {
    case "published":
      return "success";
    case "pending":
      return "warning";
    case "not_published":
      return "info";
    default:
      return "info";
  }
};

const getPublishStatusText = (status: string) => {
  switch (status) {
    case "published":
      return "已发布";
    case "pending":
      return "待发布";
    case "not_published":
      return "未发布";
    default:
      return "未知";
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getProgressIcon = (status: number, index: number) => {
  const trit = status.toString(3).padStart(4, "0")[index];

  if (trit === "2") return { icon: Select, class: "text-green-500" };
  if (trit === "1") return { icon: MoreFilled, class: "text-yellow-500" };
  return { icon: CloseBold, class: "text-gray-500" };
};

const handleSync = async () => {
  try {
    await syncStore.syncProjects();
    ElMessage.success("项目同步成功");
  } catch (error) {
    ElMessage.error("项目同步失败");
  }
};

const handleExport = async () => {
  try {
    // 使用 XLSX 库在前端生成 Excel 文件
    const data = filteredProjects.value.map((project, index) => ({
      序号: project.serialNumber,
      项目名称: project.name,
      项目类型: project.type || "",
      图源: project.imageSource || "",
      美工: project.artist || "",
      翻译: project.translator || "",
      校对: project.proofreader || "",
      嵌字: project.typesetter || "",
      审核: project.reviewer || "",
      发布状态: getPublishStatusText(project.publishStatus),
      上次更新日期: formatDate(project.lastUpdated),
      备注: project.notes || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "项目列表");

    const fileName = `项目列表_${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    ElMessage.success("导出成功");
  } catch (error) {
    ElMessage.error("导出失败");
  }
};

const navigateToProject = (project: any) => {
  if (project.externalProjectId) {
    // 跳转到项目详情页
    router.push(`/projects/${project.id}`);
  } else {
    ElMessage.info("该项目暂无详情页面");
  }
};

const handleCreateTag = async () => {
  if (!tagFormRef.value) return;

  await tagFormRef.value.validate(async (valid) => {
    if (valid) {
      creating.value = true;
      try {
        await syncStore.createProjectTag(tagForm);
        ElMessage.success("标签创建成功");
        showCreateTag.value = false;

        // 重置表单
        Object.assign(tagForm, {
          name: "",
          color: "#3b82f6",
          description: "",
        });
        tagFormRef.value?.resetFields();
      } catch (error) {
        ElMessage.error("标签创建失败");
      } finally {
        creating.value = false;
      }
    }
  });
};

const handleDeleteTag = async (tagId: string) => {
  try {
    await ElMessageBox.confirm("确定要删除这个标签吗？", "确认删除", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    await syncStore.deleteProjectTag(tagId);
    ElMessage.success("标签删除成功");
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("标签删除失败");
    }
  }
};

const handleExpandChange = async (row: any, expandedRows: any[]) => {
  expandRowKeys.value = expandedRows.length > 0 ? [row.id] : [];
  console.log(expandRowKeys.value);
};

const handleCurrentPageChange = async (page: number) => {
  current_page.value = page;

  // TODO by influ3nza:
  // query backend w/ page_serial, page_size, sort, status, tag_id g/ project[]
};

const handleStatusFilterChange = (_: any) => {
  const last_index = project_status_filter.value.lastIndexOf(2);
  const old_filter_disable = [...status_filter_disable.value];

  for (let j = 0; j < 4; j++) {
    status_filter_disable.value[j] = false;
  }

  if (last_index !== -1) {
    for (let j = 0; j < last_index; j++) {
      project_status_filter.value[j] = 2;
      status_filter_disable.value[j] = true;
    }
  }

  // 取消禁用状态的筛选器，将清除选项
  for (let j = 0; j < 4; j++) {
    if (
      old_filter_disable[j] === true &&
      status_filter_disable.value[j] === false
    ) {
      for (let k = 0; k <= j; k++) {
        project_status_filter.value[k] = undefined;
        status_filter_disable.value[k] = false;
      }
    }
  }
};

onMounted(async () => {
  await Promise.all([
    syncStore.fetchSyncedProjects(),
    syncStore.fetchProjectTags(),
  ]);

  // TODO by influ3nza:
  // query backend w/ - g/ number
});
</script>

<style scoped>
/* 展开动画效果 */
.expand-content {
  margin: 0 12px;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
}

.expand-inner {
  padding: 16px 24px;
  background: #f8fafc;
  border-radius: 8px;
  margin: 8px 0;
  border: 1px solid #e2e8f0;
  transform: translateY(-10px);
  opacity: 0;
  animation: expandIn 0.3s ease-out forwards;
}

@keyframes expandIn {
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 深色模式样式 */
.dark .expand-inner {
  background: #1e293b;
  border-color: #475569;
}

/* 单元格项目样式 */
.cell-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #374151;
}

.dark .cell-item {
  color: #d1d5db;
}

/* 描述列表样式优化 */
:deep(.el-descriptions) {
  --el-descriptions-item-bordered-label-background: #f8fafc;
  --el-descriptions-item-bordered-content-background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.dark :deep(.el-descriptions) {
  --el-descriptions-item-bordered-label-background: #374151;
  --el-descriptions-item-bordered-content-background: #1f2937;
}

/* 表格行悬停效果 */
:deep(.el-table__row) {
  transition: all 0.2s ease;
}

:deep(.el-table__row:hover) {
  background-color: #f8fafc !important;
}

.dark :deep(.el-table__row:hover) {
  background-color: #374151 !important;
}

/* 展开按钮样式 */
:deep(.el-table__expand-icon) {
  transition: transform 0.2s ease;
}

:deep(.el-table__expand-icon--expanded) {
  transform: rotate(90deg);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .expand-inner {
    padding: 12px 16px;
    margin: 4px 0;
  }
}
</style>
