# Создание директорий
$folders = @(
    "src\assets\images",
    "src\assets\styles",
    "src\components\kanban",
    "src\views\auth",
    "src\views\kanban",
    "src\router",
    "src\composables",
    "src\stores",
    "src\utils"
)

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Path $folder -Force
}

# Создание файлов
$files = @(
    "src\App.vue",
    "src\main.js",
    "src\router\index.js",
    "src\views\kanban\HomeView.vue",
    "src\views\auth\SignInView.vue",
    "src\views\auth\SignUpView.vue",
    "src\components\kanban\BaseHeader.vue",
    "src\components\kanban\TaskDesk.vue",
    "src\components\kanban\TaskColumn.vue",
    "src\components\kanban\Task.vue",
    "src\components\kanban\TaskModal.vue",
    "src\components\kanban\NewCardModal.vue",
    "src\components\kanban\ExitModal.vue",
    "src\composables\theme.js",
    "src\utils\api.js"
)

foreach ($file in $files) {
    New-Item -ItemType File -Path $file -Force
}