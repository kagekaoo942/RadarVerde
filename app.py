import os
from flask import Flask, abort, jsonify, render_template, send_from_directory

app = Flask(__name__, static_folder=None)


@app.route('/static/<path:filename>', endpoint='static')
def static_files(filename):
    folder, separator, relative_path = filename.partition('/')
    folders = {'css': 'css', 'images': 'images', 'js': 'JS'}
    if not separator or folder not in folders:
        abort(404)
    return send_from_directory(folders[folder], relative_path)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/health')
def health():
    return jsonify(status='ok')


@app.route('/mapa')
def mapa():
    return render_template('mapa.html')


@app.route('/guia')
def guia():
    return render_template('guia.html')


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)