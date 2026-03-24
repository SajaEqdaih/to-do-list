const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const totalTasksEl = document.getElementById("totalTasks");
const completedTasksEl = document.getElementById("completedTasks");
const remainingTasksEl = document.getElementById("remainingTasks");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const filterButtons = document.querySelectorAll(".filter-btn");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const themeToggle = document.getElementById("themeToggle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() { localStorage.setItem("tasks", JSON.stringify(tasks)); }

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    
    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    remainingTasksEl.textContent = total - completed;
    progressText.textContent = `${progress}%`;
    progressFill.style.width = `${progress}%`;
}

function renderTasks() {
    taskList.innerHTML = "";
    let filtered = tasks;
    if (currentFilter === "completed") filtered = tasks.filter(t => t.completed);
    if (currentFilter === "pending") filtered = tasks.filter(t => !t.completed);

    if (filtered.length === 0) {
        taskList.innerHTML = `<li style="text-align:center; padding:20px; color:#94a3b8;">لا يوجد مهام حالياً 🚀</li>`;
    }

    filtered.forEach(task => {
        const li = document.createElement("li");
        li.className = `task-item ${task.completed ? 'done' : ''}`;
        
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
            <div class="task-actions">
                <button class="icon-btn edit-btn">تعديل</button>
                <button class="icon-btn delete-btn">حذف</button>
            </div>
        `;

        // أحداث الأزرار داخل كل مهمة
        const check = li.querySelector("input");
        check.onchange = () => {
            task.completed = check.checked;
            saveTasks();
            renderTasks();
            if(task.completed) showToast("إنجاز رائع يا بطل! 🔥");
        };

        li.querySelector(".delete-btn").onclick = () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
            showToast("تم الحذف");
        };

        li.querySelector(".edit-btn").onclick = () => {
            const newText = prompt("عدل هدفك:", task.text);
            if (newText) { task.text = newText; saveTasks(); renderTasks(); }
        };

        taskList.appendChild(li);
    });
    updateStats();
}

addBtn.onclick = () => {
    const val = taskInput.value.trim();
    if (!val) return showToast("اكتب شيئاً أولاً! ✍️");
    tasks.unshift({ id: Date.now(), text: val, completed: false });
    saveTasks();
    taskInput.value = "";
    renderTasks();
    showToast("تمت الإضافة ✨");
};

filterButtons.forEach(btn => {
    btn.onclick = () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        renderTasks();
    };
});

clearAllBtn.onclick = () => {
    if (confirm("هل تريد مسح كل الأهداف؟")) { tasks = []; saveTasks(); renderTasks(); }
};

clearCompletedBtn.onclick = () => {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
};

themeToggle.onclick = () => {
    document.body.classList.toggle("dark");
    themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
};

renderTasks();
