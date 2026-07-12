from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

DATABASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'instance', 'memos.db')


def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS memos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()


init_db()


# 获取所有备忘录
@app.route('/api/memos', methods=['GET'])
def get_memos():
    conn = get_db()
    memos = conn.execute('SELECT * FROM memos ORDER BY updated_at DESC').fetchall()
    conn.close()
    return jsonify([dict(m) for m in memos])


# 创建备忘录
@app.route('/api/memos', methods=['POST'])
def create_memo():
    data = request.get_json()
    if not data or not data.get('title') or not data.get('content'):
        return jsonify({'error': '标题和内容不能为空'}), 400

    now = datetime.now().isoformat()
    conn = get_db()
    cursor = conn.execute(
        'INSERT INTO memos (title, content, created_at, updated_at) VALUES (?, ?, ?, ?)',
        (data['title'], data['content'], now, now)
    )
    conn.commit()
    memo_id = cursor.lastrowid
    memo = conn.execute('SELECT * FROM memos WHERE id = ?', (memo_id,)).fetchone()
    conn.close()
    return jsonify(dict(memo)), 201


# 获取单个备忘录
@app.route('/api/memos/<int:memo_id>', methods=['GET'])
def get_memo(memo_id):
    conn = get_db()
    memo = conn.execute('SELECT * FROM memos WHERE id = ?', (memo_id,)).fetchone()
    conn.close()
    if memo is None:
        return jsonify({'error': '备忘录不存在'}), 404
    return jsonify(dict(memo))


# 更新备忘录
@app.route('/api/memos/<int:memo_id>', methods=['PUT'])
def update_memo(memo_id):
    data = request.get_json()
    if not data or not data.get('title') or not data.get('content'):
        return jsonify({'error': '标题和内容不能为空'}), 400

    now = datetime.now().isoformat()
    conn = get_db()
    cursor = conn.execute(
        'UPDATE memos SET title = ?, content = ?, updated_at = ? WHERE id = ?',
        (data['title'], data['content'], now, memo_id)
    )
    conn.commit()
    if cursor.rowcount == 0:
        conn.close()
        return jsonify({'error': '备忘录不存在'}), 404
    memo = conn.execute('SELECT * FROM memos WHERE id = ?', (memo_id,)).fetchone()
    conn.close()
    return jsonify(dict(memo))


# 删除备忘录
@app.route('/api/memos/<int:memo_id>', methods=['DELETE'])
def delete_memo(memo_id):
    conn = get_db()
    cursor = conn.execute('DELETE FROM memos WHERE id = ?', (memo_id,))
    conn.commit()
    conn.close()
    if cursor.rowcount == 0:
        return jsonify({'error': '备忘录不存在'}), 404
    return jsonify({'message': '删除成功'})


if __name__ == '__main__':
    app.run(debug=True, port=5000)
