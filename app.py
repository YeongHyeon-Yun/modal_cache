from flask import Flask, render_template, jsonify, request
from pymongo import MongoClient
import requests
import time
import sys
import urllib
from bs4 import BeautifulSoup
from flask_apscheduler import APScheduler
import bCrawling


class Config:
    SCHEDULER_API_ENABLED = True


app = Flask(__name__)
app.config.from_object(Config())

client = MongoClient("mongodb://localhost:27017/")
# client = MongoClient('mongodb://test:test@localhost', 27017)
db = client.dbTil

"""
주기적 실행을 위한 flask-apscheduler 라이브러리 (https://viniciuschiele.github.io/flask-apscheduler/rst/usage.html)
"""
scheduler = APScheduler()
scheduler.init_app(app)
scheduler.start()


@scheduler.task('interval', id='autocraw', seconds=100, misfire_grace_time=900)
def autocraw():
    bCrawling.titleCrawling()



@scheduler.task('interval', id='autoPiccraw', seconds=100, misfire_grace_time=900)
def autoPiccraw():
    bCrawling.getPic()


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/review/<keyword>')
def review(keyword):
    print(keyword)
    # onwer = db.tilreview.find_one({"idx":keyword}, {})

    return render_template('review.html', idx=keyword)


"""
첫 로딩시 velog 정보와 tistory 정보를 나눠서 view로 쏴주는 컨트롤러
"""


@app.route('/sorted', methods=['GET'])
def sorting():
    news = list(db.userStack.find({}, {'_id': False}))
    news.reverse()
    velogcards = []
    tistorycards = []

    for x in news:
        tempname = x['name']
        tempurl = db.userInfo.find_one({'name': tempname}, {'_id': False})['url']
        if 'velog' in tempurl:
            velogcards.append(db.userInfo.find_one({'name': tempname}, {'_id': False}))
        elif 'tistory' in tempurl:
            tistorycards.append(db.userInfo.find_one({'name': tempname}, {'_id': False}))


    return jsonify({'velogcards': velogcards, 'tistorycards': tistorycards})

# 리뷰 띄우기
@app.route('/memo', methods=['GET'])
def listing():
    memos = list(db.tilreview.find({}, {'_id': False}))
    return jsonify({'all_memos':memos})

# 검색
@app.route('/search', methods=['GET'])
def search():
    txt = request.args.get("txt")
    userdb = db.userInfo.find_one({'name': txt}, {'_id': False})
    return jsonify(userdb)


# 리뷰

@app.route('/article', methods=['POST'])
def update_post():
    idx = request.form.get('idx')
    writer = request.form.get('title')
    reviewcontent = request.form.get('content')
    db.tilreview.insert({
        'owner':idx,
        'writer': writer,
        'reviewcontent': reviewcontent
    })
    return {"result": "success"}

@app.route('/review', methods=['POST'])
def modalReview():
    owner_receive = request.form['owner_give']
    user_receive = request.form['user_give']
    review_receive = request.form['review_give']

    doc = {

        'owner': owner_receive,
        'writer': user_receive,
        'reviewcontent': review_receive

    }
    db.tilreview.insert_one(doc)

    return jsonify({'msg': '저장되었습니다!'})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
