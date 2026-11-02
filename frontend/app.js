// 全局变量
let uploadedPhotoData = null; // base64格式的照片数据
let currentResult = null; // 当前的测评结果

// DOM元素
const quizPage = document.getElementById('quiz-page');
const resultPage = document.getElementById('result-page');
const uploadArea = document.getElementById('upload-area');
const photoInput = document.getElementById('photo-input');
const previewArea = document.getElementById('preview-area');
const previewImg = document.getElementById('preview-img');
const reuploadBtn = document.getElementById('reupload-btn');
const submitBtn = document.getElementById('submit-btn');
const loadingState = document.getElementById('loading-state');
const shareModal = document.getElementById('share-modal');
const closeModalBtn = document.getElementById('close-modal');
const shareBtn = document.getElementById('share-btn');
const retakeBtn = document.getElementById('retake-btn');
const downloadBtn = document.getElementById('download-btn');
const copyLinkBtn = document.getElementById('copy-link-btn');

// 上传区域点击事件
uploadArea.addEventListener('click', () => photoInput.click());

// 拖拽上传支持
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#ff6b95';
    uploadArea.style.background = 'linear-gradient(135deg, #ffe8ec 0%, #ffd8e2 100%)';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#ff9a9e';
    uploadArea.style.background = 'linear-gradient(135deg, #fff5f5 0%, #ffe8ec 100%)';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleImageUpload(file);
    }
    uploadArea.style.borderColor = '#ff9a9e';
    uploadArea.style.background = 'linear-gradient(135deg, #fff5f5 0%, #ffe8ec 100%)';
});

// 文件选择事件
photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleImageUpload(file);
    }
});

// 处理图片上传
function handleImageUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const imageData = e.target.result;
        uploadedPhotoData = imageData;
        previewImg.src = imageData;
        previewArea.style.display = 'flex';
        uploadArea.style.display = 'none';
        checkFormComplete();
    };
    reader.readAsDataURL(file);
}

// 重新上传
reuploadBtn.addEventListener('click', () => {
    uploadedPhotoData = null;
    previewArea.style.display = 'none';
    uploadArea.style.display = 'block';
    photoInput.value = '';
    checkFormComplete();
});

// 检查表单是否完成
function checkFormComplete() {
    const hasPhoto = uploadedPhotoData !== null;
    const hasAnswers = document.querySelector('input[name="q1"]:checked') &&
                      document.querySelector('input[name="q2"]:checked') &&
                      document.querySelector('input[name="q3"]:checked');
    submitBtn.disabled = !(hasPhoto && hasAnswers);
}

// 监听问题选择变化
document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', checkFormComplete);
});

// 提交按钮点击
submitBtn.addEventListener('click', async () => {
    if (submitBtn.disabled) return;

    // 收集答案
    const answers = {
        q1: document.querySelector('input[name="q1"]:checked').value,
        q2: document.querySelector('input[name="q2"]:checked').value,
        q3: document.querySelector('input[name="q3"]:checked').value
    };

    // 显示加载状态
    submitBtn.disabled = true;
    loadingState.style.display = 'block';
    quizPage.querySelector('.quiz-form').style.opacity = '0.5';

    // 调用后端API
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                photo: uploadedPhotoData,
                answers: answers
            })
        });

        if (!response.ok) {
            throw new Error('API请求失败');
        }

        const result = await response.json();
        currentResult = result;

        // 显示结果
        showResult(result);

    } catch (error) {
        console.error('错误:', error);
        alert('分析失败，请稍后重试。错误信息：' + error.message);
        submitBtn.disabled = false;
        loadingState.style.display = 'none';
        quizPage.querySelector('.quiz-form').style.opacity = '1';
    }
});

// 显示结果
function showResult(result) {
    // 切换到结果页面
    quizPage.classList.remove('active');
    resultPage.classList.add('active');

    // 动画显示分数
    animateNumber('score-number', 0, result.score, 1500);

    // 填充结果内容
    setTimeout(() => {
        document.getElementById('score-comment').textContent = result.scoreComment;
        document.getElementById('blossom-time').textContent = result.blossomTime;
        document.getElementById('love-advantage').textContent = result.loveAdvantage;
        document.getElementById('advice').textContent = result.advice;

        // 显示伴侣特征标签
        const traitsContainer = document.getElementById('partner-traits');
        traitsContainer.innerHTML = '';
        result.partnerTraits.forEach(trait => {
            const tag = document.createElement('span');
            tag.className = 'trait-tag';
            tag.textContent = trait;
            traitsContainer.appendChild(tag);
        });
    }, 100);

    loadingState.style.display = 'none';
}

// 数字动画
function animateNumber(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    const range = end - start;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const current = Math.floor(start + range * easeProgress);
        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// 分享按钮点击
shareBtn.addEventListener('click', () => {
    if (!currentResult) return;
    generateShareCard();
    shareModal.classList.add('active');
});

// 关闭弹窗
closeModalBtn.addEventListener('click', () => {
    shareModal.classList.remove('active');
});

// 点击遮罩关闭
shareModal.addEventListener('click', (e) => {
    if (e.target === shareModal) {
        shareModal.classList.remove('active');
    }
});

// 生成分享卡片
function generateShareCard() {
    const canvas = document.getElementById('share-canvas');
    const ctx = canvas.getContext('2d');

    // 渐变背景
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#ffecd2');
    gradient.addColorStop(0.5, '#fcb69f');
    gradient.addColorStop(1, '#ff9a9e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 装饰圆形
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.arc(100, 100, 80, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(500, 700, 120, 0, Math.PI * 2);
    ctx.fill();

    // 标题
    ctx.fillStyle = '#ff6b95';
    ctx.font = 'bold 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('💕 桃花运测评报告', canvas.width / 2, 100);

    // 副标题
    ctx.fillStyle = '#666';
    ctx.font = '24px sans-serif';
    ctx.fillText('测测你的恋爱桃花运', canvas.width / 2, 150);

    // 分数圆圈
    ctx.fillStyle = 'rgba(255, 107, 149, 0.9)';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 300, 100, 0, Math.PI * 2);
    ctx.fill();

    // 分数
    ctx.fillStyle = 'white';
    ctx.font = 'bold 60px sans-serif';
    ctx.fillText(currentResult.score, canvas.width / 2, 295);

    // 分数标签
    ctx.font = '20px sans-serif';
    ctx.fillText('桃花运指数', canvas.width / 2, 345);

    // 桃花时间
    ctx.fillStyle = '#333';
    ctx.font = '28px sans-serif';
    ctx.fillText('🌸 桃花盛开时间', canvas.width / 2, 430);

    ctx.fillStyle = '#ff6b95';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(currentResult.blossomTime, canvas.width / 2, 470);

    // 理想伴侣
    ctx.fillStyle = '#333';
    ctx.font = '28px sans-serif';
    ctx.fillText('💝 理想伴侣特征', canvas.width / 2, 530);

    ctx.fillStyle = '#ff6b95';
    ctx.font = '22px sans-serif';
    ctx.fillText(currentResult.partnerTraits.join(' · '), canvas.width / 2, 570);

    // 底部文字
    ctx.fillStyle = '#999';
    ctx.font = '18px sans-serif';
    ctx.fillText('快来测测你的桃花运吧！', canvas.width / 2, 700);

    ctx.fillStyle = '#666';
    ctx.font = '16px sans-serif';
    ctx.fillText('AI恋爱桃花运测评', canvas.width / 2, 730);
}

// 下载图片
downloadBtn.addEventListener('click', () => {
    const canvas = document.getElementById('share-canvas');
    const link = document.createElement('a');
    link.download = '桃花运测评结果.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});

// 复制链接
copyLinkBtn.addEventListener('click', async () => {
    const link = window.location.href;
    try {
        await navigator.clipboard.writeText(link);
        alert('链接已复制到剪贴板！');
    } catch (err) {
        // 降级方案
        const textArea = document.createElement('textarea');
        textArea.value = link;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('链接已复制到剪贴板！');
    }
});

// 再测一次
retakeBtn.addEventListener('click', () => {
    // 重置表单
    uploadedPhotoData = null;
    previewArea.style.display = 'none';
    uploadArea.style.display = 'block';
    photoInput.value = '';
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });
    submitBtn.disabled = true;

    // 切换到测评页面
    resultPage.classList.remove('active');
    quizPage.classList.add('active');
});

// 页面加载完成
window.addEventListener('DOMContentLoaded', () => {
    console.log('AI恋爱桃花运测评网站已加载');
});
