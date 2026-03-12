import streamlit as st
import json
import os
from pathlib import Path

st.set_page_config(
    page_title="Screeps Dashboard",
    page_icon="🤖",
    layout="wide",
)

st.title("🤖 Screeps Bot Dashboard")
st.caption("tadanobutubutu/screeps — ゲーム状況モニター")

# --- Sidebar ---
st.sidebar.header("📂 ファイル情報")

js_files = list(Path(".").glob("*.js"))
md_files = list(Path(".").glob("*.md"))

st.sidebar.metric("JSファイル数", len(js_files))
st.sidebar.metric("ドキュメント数", len(md_files))

if js_files:
    st.sidebar.subheader("JSファイル一覧")
    for f in sorted(js_files):
        st.sidebar.text(f"• {f.name}")

# --- Main Content ---
col1, col2, col3 = st.columns(3)

with col1:
    st.metric("🗂 JSファイル", len(js_files))

with col2:
    st.metric("📄 MDドキュメント", len(md_files))

with col3:
    total_size = sum(f.stat().st_size for f in js_files) if js_files else 0
    st.metric("📦 JSコード合計", f"{total_size // 1024} KB")

st.divider()

# --- Game Status ---
st.subheader("🎮 ゲームステータス")

game_status_path = Path("GAME_STATUS.md")
if game_status_path.exists():
    with open(game_status_path, "r", encoding="utf-8") as f:
        content = f.read()
    st.markdown(content)
else:
    st.info("GAME_STATUS.md が見つかりません")

st.divider()

# --- Game Stats ---
st.subheader("📊 ゲーム統計")

game_stats_path = Path("GAME_STATS.md")
if game_stats_path.exists():
    with open(game_stats_path, "r", encoding="utf-8") as f:
        content = f.read()
    st.markdown(content)
else:
    st.info("GAME_STATS.md が見つかりません")

st.divider()

# --- Role Files Viewer ---
st.subheader("🐛 クリープロール")

role_files = sorted(Path(".").glob("role.*.js"))

if role_files:
    selected_role = st.selectbox(
        "ロールを選択",
        [f.name for f in role_files]
    )
    selected_path = Path(selected_role)
    if selected_path.exists():
        with open(selected_path, "r", encoding="utf-8") as f:
            code = f.read()
        st.code(code, language="javascript")
else:
    st.info("role.*.js ファイルが見つかりません")

st.divider()

# --- Failed Workflows ---
st.subheader("⚠️ 失敗ワークフロー")

failed_path = Path("failed_workflows.json")
if failed_path.exists():
    with open(failed_path, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
            st.json(data)
        except json.JSONDecodeError:
            st.error("JSONの解析に失敗しました")
else:
    st.success("失敗ワークフローの記録はありません ✅")

st.divider()
st.caption("Built with Streamlit 🎈 | tadanobutubutu/screeps")
