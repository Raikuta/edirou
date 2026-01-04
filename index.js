/**
 * エディろう - メインJavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  // --- ダークモード切り替え機能 ---
  const headerInner = document.querySelector('.header__inner');
  if (headerInner) {
    // ボタン生成
    const themeBtn = document.createElement('button');
    themeBtn.className = 'header__menu-btn'; // スタイルを流用
    themeBtn.style.marginRight = '0.5rem';
    themeBtn.setAttribute('aria-label', 'テーマ切り替え');
    themeBtn.innerHTML = `
      <svg class="theme-icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
      <svg class="theme-icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
    `;

    // メニューボタンの前に挿入
    const menuBtn = document.getElementById('menu-btn');
    if (menuBtn) {
      headerInner.insertBefore(themeBtn, menuBtn);
    } else {
      headerInner.appendChild(themeBtn);
    }

    // テーマ適用関数
    const updateTheme = (isDark) => {
      const sunIcon = themeBtn.querySelector('.theme-icon-sun');
      const moonIcon = themeBtn.querySelector('.theme-icon-moon');

      if (isDark) {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
        localStorage.setItem('theme', 'light');
      }
    };

    // 初期化
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      updateTheme(true);
    } else {
      updateTheme(false);
    }

    // クリックイベント
    themeBtn.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark-mode');
      updateTheme(!isDark);
    });
  }

  // --- モバイルメニュー ---
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', isOpen);

    // アイコンを切り替え
    if (isOpen) {
      menuBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round"/>
        </svg>
      `;
    } else {
      menuBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 12h18M3 6h18M3 18h18" stroke-linecap="round"/>
        </svg>
      `;
    }
  });

  // メニューリンクをクリックしたら閉じる
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('is-open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 12h18M3 6h18M3 18h18" stroke-linecap="round"/>
        </svg>
      `;
    });
  });
}

/**
 * ドロップゾーンの初期化
 */
function initDropZone() {
    const dropZones = document.querySelectorAll('.drop-zone');

    dropZones.forEach(dropZone => {
      const input = dropZone.querySelector('.drop-zone__input');

      // クリックでファイル選択
      dropZone.addEventListener('click', () => {
        if (input) input.click();
      });

      // ドラッグイベント
      ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropZone.classList.add('is-dragover');
        });
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropZone.classList.remove('is-dragover');
        });
      });

      // ファイルドロップ
      dropZone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
          handleFiles(files, dropZone);
        }
      });

      // ファイル選択
      if (input) {
        input.addEventListener('change', (e) => {
          if (e.target.files.length > 0) {
            handleFiles(e.target.files, dropZone);
          }
        });
      }
    });
  }

/**
 * ファイル処理
 */
function handleFiles(files, dropZone) {
    const file = files[0];
    console.log('選択されたファイル:', file.name);

    // ファイル名を表示
    const titleEl = dropZone.querySelector('.drop-zone__title');
    if (titleEl) {
      titleEl.textContent = file.name;
    }

    // ファイルサイズを表示
    const descEl = dropZone.querySelector('.drop-zone__description');
    if (descEl) {
      const size = formatFileSize(file.size);
      descEl.textContent = `サイズ: ${size}`;
    }

    // カスタムイベントを発火
    const event = new CustomEvent('fileselected', { detail: { file } });
    dropZone.dispatchEvent(event);
  }

/**
 * ファイルサイズをフォーマット
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

/**
 * 処理中状態の表示
 */
function showProcessing(message = '処理中...') {
    // 処理中オーバーレイを作成（必要に応じて実装）
    console.log(message);
  }

/**
 * ダウンロードを開始
 */
function startDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
