class PersonalWebsiteEditor {
    constructor() {
        this.websiteCount = 1;
        this.isOwnerView = true; // 標記是否為擁有者視圖
        this.initializeElements();
        this.attachEventListeners();
        this.checkIfPublicView();
        this.loadInitialData();
    }

    initializeElements() {
        this.editPage = document.getElementById('editPage');
        this.previewPage = document.getElementById('previewPage');
        this.personalWebsite = document.getElementById('personalWebsite');
        this.previewBtn = document.getElementById('previewBtn');
        this.backBtn = document.getElementById('backBtn');
        this.saveBtn = document.getElementById('saveBtn');
        this.addWebsiteBtn = document.getElementById('addWebsiteBtn');
        this.changeAvatarBtn = document.getElementById('changeAvatarBtn');
        this.avatarImg = document.getElementById('avatarImg');
        this.nameInput = document.getElementById('nameInput');
        this.additionalWebsites = document.getElementById('additionalWebsites');
        this.previewAvatar = document.getElementById('previewAvatar');
        this.previewName = document.getElementById('previewName');
        this.previewWebsites = document.getElementById('previewWebsites');
        this.personalAvatar = document.getElementById('personalAvatar');
        this.personalName = document.getElementById('personalName');
        this.personalWebsites = document.getElementById('personalWebsites');
        this.personalWebsiteHeader = document.getElementById('personalWebsiteHeader');
        this.backToEditBtn = document.getElementById('backToEditBtn');
        this.shareBtn = document.getElementById('shareBtn');
        this.successMessage = document.getElementById('successMessage');
        this.viewWebsiteBtn = document.getElementById('viewWebsiteBtn');
        this.shareModal = document.getElementById('shareModal');
        this.shareUrl = document.getElementById('shareUrl');
        this.copyUrlBtn = document.getElementById('copyUrlBtn');
        this.qrCodeBtn = document.getElementById('qrCodeBtn');
        this.closeShareBtn = document.getElementById('closeShareBtn');
    }

    attachEventListeners() {
        this.previewBtn.addEventListener('click', () => this.showPreview());
        this.backBtn.addEventListener('click', () => this.showEdit());
        this.saveBtn.addEventListener('click', () => this.saveData());
        this.addWebsiteBtn.addEventListener('click', () => this.addWebsite());
        this.changeAvatarBtn.addEventListener('click', () => this.changeAvatar());
        this.viewWebsiteBtn.addEventListener('click', () => this.showPersonalWebsite());
        // 僅在擁有者模式下綁定編輯和分享事件
        if (this.isOwnerView) {
            this.backToEditBtn.addEventListener('click', () => this.showEdit());
            this.shareBtn.addEventListener('click', () => this.showShareModal());
        }
        this.copyUrlBtn.addEventListener('click', () => this.copyUrl());
        this.qrCodeBtn.addEventListener('click', () => this.generateQRCode());
        this.closeShareBtn.addEventListener('click', () => this.hideShareModal());
    }

    loadInitialData() {
        const savedData = this.loadData();
        if (savedData) {
            this.nameInput.value = savedData.name || '黃曉明';
            this.avatarImg.src = savedData.avatar || this.avatarImg.src;
            if (savedData.websites && savedData.websites.length > 1) {
                for (let i = 1; i < savedData.websites.length; i++) {
                    this.addWebsite(savedData.websites[i]);
                }
            }
        }
    }

    checkIfPublicView() {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('user');
        if (userId) {
            this.isOwnerView = false;
            this.showPublicWebsite(userId);
        }
    }

    showPublicWebsite(userId) {
        this.editPage.style.display = 'none';
        this.previewPage.style.display = 'none';
        this.personalWebsiteHeader.style.display = 'none'; // 隱藏返回編輯和分享按鈕
        this.personalWebsite.classList.add('active');
        this.loadPublicUserData(userId);
    }

    loadPublicUserData(userId) {
        const savedData = this.loadData();
        if (savedData) {
            this.personalAvatar.src = savedData.avatar;
            this.personalName.textContent = savedData.name || '用戶';
            this.personalWebsites.innerHTML = '';
            if (savedData.websites) {
                savedData.websites.forEach((website, index) => {
                    this.createPersonalWebsiteItem(website.url, website.name, index);
                });
            }
        } else {
            this.personalName.textContent = '用戶不存在';
            this.personalWebsites.innerHTML = '<p style="color: #666; text-align: center;">該用戶還沒有設置個人資訊</p>';
        }
    }

    showPreview() {
        if (!this.isOwnerView) return; // 公開模式禁止訪問預覽
        this.updatePreview();
        this.editPage.classList.remove('active');
        this.previewPage.classList.add('active');
    }

    showEdit() {
        if (!this.isOwnerView) return; // 公開模式禁止訪問編輯
        this.previewPage.classList.remove('active');
        this.personalWebsite.classList.remove('active');
        this.editPage.classList.add('active');
    }

    updatePreview() {
        this.previewAvatar.src = this.avatarImg.src;
        this.previewName.textContent = this.nameInput.value || '未設定姓名';
        this.previewWebsites.innerHTML = '';
        const websiteItems = document.querySelectorAll('.website-item');
        websiteItems.forEach(item => {
            const urlInput = item.querySelector('input[type="url"]');
            const nameInput = item.querySelector('input[type="text"]');
            if (urlInput.value && nameInput.value) {
                this.createPreviewWebsiteItem(urlInput.value, nameInput.value);
            }
        });
    }

    createPreviewWebsiteItem(url, name) {
        const item = document.createElement('a');
        item.className = 'preview-website-item';
        item.href = url;
        item.target = '_blank';
        item.innerHTML = `
            <div class="preview-website-icon"></div>
            <div class="preview-website-text">
                <div class="preview-website-name">${name}</div>
                <div class="preview-website-url">${url}</div>
            </div>
        `;
        this.previewWebsites.appendChild(item);
    }

    addWebsite(data = null) {
        if (!this.isOwnerView) return; // 公開模式禁止添加網站
        this.websiteCount++;
        const websiteItem = document.createElement('div');
        websiteItem.className = 'website-item';
        websiteItem.innerHTML = `
            <button class="btn-remove" onclick="this.parentElement.remove()">×</button>
            <label>網站${this.websiteCount}</label>
            <input type="url" placeholder="https://example.com/" value="${data ? data.url : ''}">
            <label>網站名稱</label>
            <input type="text" placeholder="網站名稱" value="${data ? data.name : ''}">
        `;
        this.additionalWebsites.appendChild(websiteItem);
    }

    changeAvatar() {
        if (!this.isOwnerView) return; // 公開模式禁止更改頭像
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.avatarImg.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
            fileInput.remove();
        });
        document.body.appendChild(fileInput);
        fileInput.click();
    }

    saveData() {
        if (!this.isOwnerView) return; // 公開模式禁止儲存
        const data = {
            name: this.nameInput.value,
            avatar: this.avatarImg.src,
            websites: []
        };
        const websiteItems = document.querySelectorAll('.website-item');
        websiteItems.forEach(item => {
            const urlInput = item.querySelector('input[type="url"]');
            const nameInput = item.querySelector('input[type="text"]');
            if (urlInput.value && nameInput.value) {
                data.websites.push({
                    url: urlInput.value,
                    name: nameInput.value
                });
            }
        });
        localStorage.setItem('personalWebsiteData', JSON.stringify(data));
        this.showSuccessMessage();
    }

    loadData() {
        const savedData = localStorage.getItem('personalWebsiteData');
        return savedData ? JSON.parse(savedData) : null;
    }

    showSuccessMessage() {
        if (!this.isOwnerView) return; // 公開模式禁止顯示成功訊息
        this.successMessage.classList.add('show');
        setTimeout(() => {
            this.successMessage.classList.remove('show');
        }, 3000);
    }

    showPersonalWebsite() {
        if (!this.isOwnerView) return; // 公開模式由 showPublicWebsite 處理
        this.updatePersonalWebsite();
        this.successMessage.classList.remove('show');
        this.editPage.classList.remove('active');
        this.previewPage.classList.remove('active');
        this.personalWebsite.classList.add('active');
        this.personalWebsiteHeader.style.display = 'flex'; // 擁有者模式顯示頭部
        this.generateShareUrl();
    }

    updatePersonalWebsite() {
        this.personalAvatar.src = this.avatarImg.src;
        this.personalName.textContent = this.nameInput.value || '未設定姓名';
        this.personalWebsites.innerHTML = '';
        const websiteItems = document.querySelectorAll('.website-item');
        websiteItems.forEach((item, index) => {
            const urlInput = item.querySelector('input[type="url"]');
            const nameInput = item.querySelector('input[type="text"]');
            if (urlInput.value && nameInput.value) {
                this.createPersonalWebsiteItem(urlInput.value, nameInput.value, index);
            }
        });
    }

    createPersonalWebsiteItem(url, name, index) {
        const item = document.createElement('a');
        item.className = 'personal-website-item';
        item.href = url;
        item.target = '_blank';
        const icon = this.getWebsiteIcon(url);
        item.innerHTML = `
            <div class="personal-website-icon">${icon}</div>
            <div class="personal-website-text">
                <div class="personal-website-name">${name}</div>
                <div class="personal-website-url">${this.formatUrl(url)}</div>
            </div>
        `;
        this.personalWebsites.appendChild(item);
    }

    getWebsiteIcon(url) {
        if (url.includes('youtube.com') || url.includes('youtu.be')) return '📺';
        if (url.includes('instagram.com')) return '📷';
        if (url.includes('facebook.com')) return '👥';
        if (url.includes('twitter.com') || url.includes('x.com')) return '🐦';
        if (url.includes('linkedin.com')) return '💼';
        if (url.includes('github.com')) return '💻';
        if (url.includes('tiktok.com')) return '🎵';
        return '🌐';
    }

    formatUrl(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname;
        } catch {
            return url;
        }
    }

    generateShareUrl() {
        const baseUrl = window.location.origin + window.location.pathname;
        const userId = this.generateUserId();
        this.shareUrl.value = `${baseUrl}?user=${userId}`;
    }

    generateUserId() {
        const name = this.nameInput.value || 'user';
        const timestamp = Date.now().toString(36);
        return name.toLowerCase().replace(/[^a-z0-9]/g, '') + timestamp;
    }

    showShareModal() {
        if (!this.isOwnerView) return; // 公開模式禁止顯示分享彈窗
        this.shareModal.classList.add('show');
    }

    hideShareModal() {
        this.shareModal.classList.remove('show');
    }

    async copyUrl() {
        try {
            await navigator.clipboard.writeText(this.shareUrl.value);
            this.copyUrlBtn.textContent = '已複製!';
            setTimeout(() => {
                this.copyUrlBtn.textContent = '複製';
            }, 2000);
        } catch {
            this.shareUrl.select();
            document.execCommand('copy');
            this.copyUrlBtn.textContent = '已複製!';
            setTimeout(() => {
                this.copyUrlBtn.textContent = '複製';
            }, 2000);
        }
    }

    generateQRCode() {
        alert(`QR碼生成功能開發中！\n\n網址：${this.shareUrl.value}\n\n你可以手動分享這個網址，或使用瀏覽器的分享功能。`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PersonalWebsiteEditor();
});