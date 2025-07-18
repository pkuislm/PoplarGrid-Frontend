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
      class="filter-container bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    >
      <!-- 操作按钮 -->
      <div class="action-section mb-6">
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <span>筛选项目</span>
          <div class="action-buttons">
            <el-button size="large" @click="" class="reset-btn">
              <el-icon><RefreshLeft /></el-icon>
              &nbsp; 重置筛选
            </el-button>
            <el-button type="primary" size="large" @click="" class="search-btn">
              <el-icon><Search /></el-icon>
              &nbsp; 搜索
            </el-button>
          </div>
        </div>
      </div>

      <!-- 顶部搜索栏 -->
      <div class="search-section mb-6">
        <div class="flex items-center gap-4 mb-4">
          <div class="filter-item flex-1">
            <label class="filter-label">项目名称或编号</label>
            <el-input
              v-model="searchQuery"
              placeholder="搜索项目名称或编号"
              :prefix-icon="Search"
              class="search-input"
              clearable
              size="large"
            />
          </div>
          <div class="filter-item">
            <label class="filter-label">所属项目集</label>
            <el-select
              v-model="typeFilter"
              placeholder="选择项目集"
              clearable
              class="filter-select"
              size="large"
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
          <div class="filter-item">
            <label class="filter-label">排序方式</label>
            <el-select
              v-model="order_mode"
              placeholder="选择排序方式"
              class="filter-select"
              size="large"
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
      </div>

      <!-- 分管状态筛选 -->
      <div class="status-section">
        <div
          class="flex items-center gap-4 flex-wrap"
          style="justify-content: space-between"
        >
          <div
            v-for="(field, index) in status_fields"
            :key="field"
            class="filter-item"
          >
            <label class="filter-label">{{ field }}</label>
            <el-select
              :key="field"
              v-model="project_status_filter[index]"
              :placeholder="'选择' + field + '状态'"
              @change="handleStatusFilterChange"
              :disabled="status_filter_disable[index]"
              class="filter-select"
              size="large"
            >
              <!-- 自定义选中项显示 -->
              <template #label>
                <div class="status-option-display">
                  <component
                    :is="
                      status_options.find(
                        (item) => item.value == project_status_filter[index]
                      )?.icon
                    "
                    :class="
                      status_options.find(
                        (item) => item.value == project_status_filter[index]
                      )?.class
                    "
                  />
                  <span>{{
                    status_options.find(
                      (item) => item.value == project_status_filter[index]
                    )?.description
                  }}</span>
                </div>
              </template>

              <el-option
                v-for="option in status_options"
                :key="field + option.description"
                :value="option.value"
              >
                <div class="status-option">
                  <component :is="option.icon" :class="option.class" />
                  <span>{{ option.description }}</span>
                </div>
              </el-option>
            </el-select>
          </div>
          <div class="filter-item">
            <label class="filter-label">发布状态</label>
            <el-select
              v-model="pub_status"
              placeholder="选择发布状态"
              class="filter-select"
              size="large"
              @change="handleStatusFilterChange"
            >
              <template #label>
                <span>{{
                  pub_options.find((item) => item.value === pub_status)?.label
                }}</span>
              </template>
              <el-option
                v-for="option in pub_options"
                :key="option.label"
                :value="option.value"
                :label="option.label"
              />
            </el-select>
          </div>
        </div>
      </div>
    </div>

    <!-- 项目表格 -->
    <div class="table-container bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <!-- 表格标题栏 -->
      <div class="table-header">
        <div class="header-content">
          <div class="header-left">
            <h2 class="table-title">筛选结果</h2>
            <div class="result-count">
              ({{ (current_page - 1) * page_size + 1 }} -
              {{ current_page * page_size }}, 共 {{ total_projects }} 个)
            </div>
          </div>
          <div class="header-right">
            <el-pagination
              :page-size="15"
              :pager-count="5"
              layout="prev, pager, next"
              :current-page="current_page"
              @current-change="handleCurrentPageChange"
              :total="total_projects"
              class="header-pagination"
              size="large"
            />
          </div>
        </div>
      </div>

      <!-- 表格内容 -->
      <div class="table-content">
        <div class="overflow-x-auto">
          <el-table
            :data="filteredProjects"
            class="project-table"
            show-header="false"
            table-layout="fix"
            @expand-change="handleExpandChange"
            :expand-row-keys="expandRowKeys"
            row-key="id"
          >
            <!-- 项目编号 -->
            <el-table-column align="center">
              <template #default="scope">
                <div style="display: flex; justify-content: space-between">
                  <div
                    style="
                      display: flex;
                      justify-content: flex-start;
                      align-items: center;
                    "
                  >
                    <div class="serial-number mr-2">
                      {{ scope.row.serialNumber }}
                    </div>
                    <div class="project-name">
                      <el-link
                        @click="navigateToProject(scope.row)"
                        :underline="false"
                        class="project-link"
                      >
                        {{ scope.row.name }}
                      </el-link>
                    </div>
                  </div>
                  <div
                    style="
                      display: flex;
                      justify-content: flex-end;
                      align-items: center;
                    "
                  >
                    <div class="project-type mr-2">
                      <el-tag
                        v-if="scope.row.type"
                        effect="dark"
                        class="type-tag"
                        size="large"
                      >
                        {{ scope.row.type }}
                      </el-tag>
                    </div>
                    <div class="progress-container">
                      <div
                        v-for="(label, index) in status_fields_short"
                        :key="label"
                        class="progress-item"
                      >
                        <span class="progress-label">{{ label }}</span>
                        <component
                          :is="
                            getProgressIcon(scope.row.workStatus, index).icon
                          "
                          class="progress-icon"
                          :class="
                            getProgressIcon(scope.row.workStatus, index).class
                          "
                        />
                      </div>
                      <div class="progress-item">
                        <span
                          class="progress-label"
                          style="font-weight: 600; color: #3b82f6"
                          >发布</span
                        >
                        <component
                          :is="
                            pub_options.find(
                              (item) => item.value === scope.row.publishStatus
                            )?.icon
                          "
                          class="progress-icon"
                          :class="
                            pub_options.find(
                              (item) => item.value === scope.row.publishStatus
                            )?.class
                          "
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>

            <!-- 展开按钮 -->
            <el-table-column type="expand" width="50">
              <template #default="scope">
                <ProjectTableSpan :project="scope.row" />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <div class="table-header table-footer">
        <div class="header-right">
          <el-pagination
            :page-size="15"
            :pager-count="5"
            layout="prev, pager, next"
            :current-page="current_page"
            @current-change="handleCurrentPageChange"
            :total="total_projects"
            class="header-pagination"
            size="large"
          />
        </div>
      </div>

      <!-- 底部分页（移动端显示） -->
      <div class="bottom-pagination">
        <el-pagination
          :page-size="15"
          :pager-count="5"
          layout="prev, pager, next"
          :current-page="current_page"
          @current-change="handleCurrentPageChange"
          :total="total_projects"
          size="default"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
  CloseBold,
  Select,
  MoreFilled,
  Search,
  PriceTag,
  Refresh,
  Download,
  Star,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useSyncStore } from "@/stores/sync";
import { useAuthStore } from "@/stores/auth";
import * as XLSX from "xlsx";
import type { FormInstance, FormRules } from "element-plus";
import ProjectTableSpan from "@/components/ProjectTableSpan.vue";
import { authApi } from "@/api/auth";
import { labelInner } from "echarts/types/src/label/labelStyle.js";

const router = useRouter();
const syncStore = useSyncStore();
const authStore = useAuthStore();

const typeFilter = ref("");
const searchQuery = ref("");
const showTagManager = ref(false);
const expandRowKeys = ref<any[]>([]);

// 筛选器相关
const project_status_filter = ref<number[]>([3, 3, 3, 3]);
const status_filter_disable = ref<boolean[]>([false, false, false, false]);
const pub_status = ref<number>(2); // 发布状况
const order_mode = ref<number>(0); // 显示排序方式
const status_fields = ["翻译", "校对", "嵌字", "审核"];
const status_fields_short = ["翻", "校", "嵌", "审"];
const status_options = [
  {
    icon: Star,
    class: "text-blue-500 w-4 h-4",
    description: "全部状态",
    value: 3,
  },
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
const pub_options = [
  {
    label: "全部状态",
    value: 2,
    icon: Star,
    class: "text-blue-500 w-4 h-4",
  },
  {
    label: "未发布",
    value: 0,
    icon: CloseBold,
    class: "text-gray-500 w-4 h-4",
  },
  {
    label: "已发布",
    value: 1,
    icon: Select,
    class: "text-green-500 w-4 h-4",
  },
];

// 分页相关
const current_page = ref<number>(1);
const page_size = 15;

// 总项目数
const total_projects = ref<number>(1024);

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

const getPublishStatusText = (status: number) => {
  switch (status) {
    case 1:
      return "已发布";
    case 0:
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
    const data = filteredProjects.value.map((project, _) => ({
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

  // 检查发布状态筛选
  if (pub_status.value === 1) {
    for (let j = 0; j < 4; j++) {
      status_filter_disable.value[j] = true;
      project_status_filter.value[j] = 2;
    }
  }

  // 取消禁用状态的筛选器，将清除选项
  for (let j = 0; j < 4; j++) {
    if (
      old_filter_disable[j] === true &&
      status_filter_disable.value[j] === false
    ) {
      for (let k = 0; k <= j; k++) {
        project_status_filter.value[k] = 3;
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
/* 表格样式 */
.table-container {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.table-container:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.dark .table-container {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-color: #475569;
}

.table-header {
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px 12px 0 0;
  border-bottom: 1px solid #e2e8f0;
  backdrop-filter: blur(10px);
}

.table-footer {
  display: flex;
  justify-content: flex-end;
}

.dark .table-header {
  background: rgba(30, 41, 59, 0.8);
  border-color: #475569;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.table-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.dark .table-title {
  color: #f9fafb;
}

.result-count {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.dark .result-count {
  color: #9ca3af;
}

.header-right {
  display: flex;
  align-items: center;
}

.header-pagination {
  margin: 0;
}

.table-content {
  padding: 0;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 0 0 12px 12px;
}

.dark .table-content {
  background: rgba(30, 41, 59, 0.9);
}

.project-table {
  width: 100%;
  background: transparent;
}

.serial-number {
  width: 3vw;
  font-weight: 600;
  color: #374151;
  font-size: 18px;
  text-align: left;
}

.dark .serial-number {
  color: #d1d5db;
}

.project-name {
  padding: 8px 12px;
  padding-left: 0;
}

.project-link {
  font-weight: 600;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.project-link:hover {
  color: #1d4ed8;
  transform: translateX(2px);
}

.dark .project-link {
  color: #60a5fa;
}

.dark .project-link:hover {
  color: #93c5fd;
}

.project-type {
  display: flex;
  justify-content: center;
  align-items: center;
}

.type-tag {
  font-weight: 600;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 14px;
}

.progress-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 8px;
}

.progress-item {
  display: flex;
  align-items: center;
  gap: 0.5vw;
}

.progress-label {
  font-size: 18px;
  font-weight: 500;
  color: #6b7280;
}

.dark .progress-label {
  color: #9ca3af;
}

.progress-icon {
  width: 16px;
  height: 16px;
}

.bottom-pagination {
  display: none;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 0 0 12px 12px;
  border-top: 1px solid #e2e8f0;
  justify-content: center;
}

.dark .bottom-pagination {
  background: rgba(30, 41, 59, 0.8);
  border-color: #475569;
}

/* 表格 响应式设计 */
@media (max-width: 1250px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
  }

  .header-left {
    width: 100%;
    justify-content: center;
  }

  .header-divider {
    display: none;
  }

  .header-right {
    display: none;
  }

  .bottom-pagination {
    display: flex;
  }

  .table-footer {
    display: none;
  }
}

@media (max-width: 1250px) {
  .table-container {
    margin: 0 -16px;
    border-radius: 0;
  }

  .table-header {
    padding: 16px;
    border-radius: 0;
  }

  .header-left {
    flex-direction: column;
    gap: 8px;
  }

  .table-title {
    font-size: 16px;
  }

  .result-count {
    font-size: 13px;
  }

  .progress-container {
    gap: 8px;
  }

  .progress-item {
    gap: 2px;
  }

  .progress-label {
    font-size: 11px;
  }

  .progress-icon {
    width: 14px;
    height: 14px;
  }

  .bottom-pagination {
    padding: 16px;
  }
}

@media (max-width: 1250px) {
  .progress-container {
    flex-direction: column;
    gap: 8px;
  }

  .progress-item {
    flex-direction: row;
    gap: 6px;
  }

  .project-name {
    padding: 4px 8px;
  }

  .project-link {
    font-size: 13px;
  }

  .type-tag,
  .status-tag {
    font-size: 12px;
    padding: 2px 6px;
  }
}

/* Element Plus 组件样式覆盖 */
:deep(.el-table) {
  background: transparent;
}

:deep(.el-table__body-wrapper) {
  background: transparent;
}

:deep(.el-table tr) {
  background: transparent;
  transition: all 0.2s ease;
}

:deep(.el-table tr:hover) {
  background: rgba(59, 130, 246, 0.05);
}

:deep(.dark .el-table tr:hover) {
  background: rgba(59, 130, 246, 0.1);
}

:deep(.el-table td) {
  border-bottom: 1px solid #f1f5f9;
  padding: 12px 8px;
}

:deep(.dark .el-table td) {
  border-color: #374151;
}

:deep(.el-table__expand-icon) {
  color: #6b7280;
  transition: all 0.2s ease;
}

:deep(.el-table__expand-icon:hover) {
  color: #3b82f6;
  transform: scale(1.1);
}

:deep(.el-pagination) {
  padding: 0;
}

:deep(.el-pagination .el-pager li) {
  background: transparent;
  border: 1px solid #e2e8f0;
  margin: 0 2px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

:deep(.el-pagination .el-pager li:hover) {
  background: #3b82f6;
  color: white;
  transform: translateY(-1px);
}

:deep(.el-pagination .el-pager li.is-active) {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

:deep(.el-pagination .btn-prev, .el-pagination .btn-next) {
  background: transparent;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  margin: 0 4px;
  transition: all 0.2s ease;
}

:deep(.el-pagination .btn-prev:hover, .el-pagination .btn-next:hover) {
  background: #3b82f6;
  color: white;
  transform: translateY(-1px);
}

:deep(.dark .el-pagination .el-pager li) {
  border-color: #475569;
  color: #d1d5db;
}

:deep(.dark .el-pagination .btn-prev, .dark .el-pagination .btn-next) {
  border-color: #475569;
  color: #d1d5db;
}

/* 展开样式 */
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

/* 展开 响应式 */
@media (max-width: 1250px) {
  .expand-inner {
    padding: 12px 16px;
    margin: 4px 0;
  }
}

/* 筛选器样式 */
.filter-container {
  background: #cfd6ec 0%;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.dark .filter-container {
  background: #1e293b 0%;
  border-color: #475569;
}

.search-section {
  padding: 20px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  backdrop-filter: blur(10px);
}

.dark .search-section {
  background: rgba(30, 41, 59, 0.7);
  border-color: #475569;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;
}

.filter-label {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
  margin-bottom: 4px;
}

.dark .filter-label {
  color: #d1d5db;
}

.search-input {
  width: 100%;
  max-width: 400px;
}

.filter-select {
  width: 200px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.dark .section-title {
  color: #f9fafb;
}

.status-section {
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.dark .status-section {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #e2e8f0;
}

.status-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: flex-start;
}

.status-filter-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 180px;
}

.status-label-container {
  display: flex;
  justify-content: center;
}

.status-tag {
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.status-select {
  width: 100%;
}

.status-option-display {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.action-section {
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  font-weight: 600;
}

.dark .action-section {
  background: rgba(30, 41, 59, 0.8);
  border-color: #475569;
}

.action-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: right;
}

.reset-btn {
  border: 2px solid #6b7280;
  color: #6b7280;
  font-weight: 600;
}

.reset-btn:hover {
  border-color: #4b5563;
  color: #4b5563;
}

.search-btn {
  background: #3b82f6 0%;
  border: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.search-btn:hover {
  background: #1e40af 100%;
}

/* 筛选器 样式 */
@media (max-width: 1250px) {
  .filter-container {
    padding: 16px;
  }

  .search-section {
    padding: 16px;
  }

  .search-section .flex {
    flex-direction: column;
    gap: 16px;
  }

  .filter-item {
    min-width: 100%;
  }

  .search-input {
    max-width: 100%;
  }

  .filter-select {
    width: 100%;
  }

  .status-filters {
    flex-direction: column;
    gap: 16px;
  }

  .status-filter-item {
    min-width: 100%;
  }

  .action-section .flex {
    flex-direction: column;
    gap: 16px;
  }

  .action-buttons {
    width: 100%;
    justify-content: right;
  }
}

/* Element Plus 组件样式覆盖 */
:deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-select .el-input__wrapper) {
  border-radius: 8px;
}

:deep(.el-button) {
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
}

:deep(.el-tag) {
  border-radius: 8px;
}
</style>
