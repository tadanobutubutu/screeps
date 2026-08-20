import { router } from './router';
import { fileViewer } from './fileViewer';
import { fetchDoc } from './fetchDoc';

export { router, fileViewer, fetchDoc };

let errorMain;
const script = document.createElement('script');
script.src = 'localhost:3000/static/js/bundle.js';
script.onload = () => {
    // 初期化処理
    router.setDashboard(() => {
        // ダッシュボードの初期化処理
        document.body.appendChild(errorMain);
    });
};
document.head.appendChild(script);

// ダッシュボードエラーハンドリングの初期化コードを保持
const createErrorMain = () => {
    const main = document.createElement('main');
    main.style.padding = '2rem';
    main.style.fontFamily = 'monospace';
    main.innerHTML = `
        <h1 style="color: #b71c1c;">⚠️ エラー</h1>
        <pre tabIndex={0} aria-label="エラーメッセージ詳細" style="..."></pre>
        ...<!-- 他の要素 -->
    `;
    return main;
};

// エラーステート用のmainをキャッシュ
errorMain = createErrorMain();