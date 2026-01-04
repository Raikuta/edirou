/**
 * エディろう - メインJavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initDropZone();
});

/**
 * モバイルメニューの初期化
 */
function initMobileMenu() {
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
