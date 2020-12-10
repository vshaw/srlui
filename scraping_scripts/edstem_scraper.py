# edx analytics fetcher

import sys
import json
import math
import urllib
import requests
import pandas as pd
import dns
import copy
import time
import datetime

from http.cookies import SimpleCookie
from pymongo import MongoClient
from datetime import datetime

# NOTE --
# -> You will need to sometimes update the following COOKIE
# if your session becomes inactive -- here's how:
#
# Open Brave (or Chrome) 
# Navigate to https://insights.edx.org/courses
# Open Developer Tools > Network tab and refresh (Cmd + R)
# Right click the /courses request, and Copy > Copy Request Headers
# Then extract the value from the cookie header and replace below...
#
# For some reason Python doesn't like "Cookie: xx" so make it "Cookie:xx"
#
# e.g. COOKIE = 'Cookie:<insert your cookie>'

CONNECTION_STRING = ''

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.80 Safari/537.36'
}


SKIP_INSIGHTS = True


DATES = {
    1 : '2020-09-27',
    2 : '2020-10-04',
    3 : '2020-10-11',
    4 : '2020-10-18',
    5 : '2020-10-25',
    6 : '2020-11-01',
    7 : '2020-11-08',
    8 : '2020-11-15',
    9 : '2020-11-22',
    10: '2020-11-29',
    11: '2020-12-06',
    12: '2020-12-13',
    13: '2020-12-20'
}

ACTVITY_MAP = {
    "1" : 0,
    "2" : 0,
    "3" : 0,
    "4" : 0,
    "5" : 0,
    "6" : 0,
    "7" : 0,
    "8" : 0,
    "9" : 0,
    "10": 0,
    "11": 0,
    "12": 0,
}

GOAL_MAP = [];

NUM_WEEKS = 12;

COURSE_MAP = {
    "course-v1:ColumbiaX+BAMM.101x+3T2020": 2344,
    "course-v1:ColumbiaX+BAMM.102x+3T2020": 2365,
    "course-v1:ColumbiaX+BAMM.103x+3T2020": 2342,
    "course-v1:ColumbiaX+BAMM.104x+3T2020": 2340,
    "course-v1:ColumbiaX+CSMM.101x+3T2020": 2345,
    "course-v1:ColumbiaX+CSMM.102x+3T2020": 2343,
    "course-v1:ColumbiaX+CSMM.103x+3T2020": 2346,
    "course-v1:ColumbiaX+CSMM.104x+3T2020": 2357
}

COURSES = [
    "course-v1:ColumbiaX+BAMM.101x+3T2020",
    "course-v1:ColumbiaX+CSMM.104x+3T2020",
    "course-v1:ColumbiaX+CSMM.101x+3T2020",
    "course-v1:ColumbiaX+BAMM.102x+3T2020",
    "course-v1:ColumbiaX+BAMM.103x+3T2020",
    "course-v1:ColumbiaX+CSMM.102x+3T2020",
    "course-v1:ColumbiaX+BAMM.104x+3T2020",
    "course-v1:ColumbiaX+CSMM.103x+3T2020"
]

# FOR INSIGHTS
def get_cookies2():
    """
    To substitute cookies here
    """
    cookies = {

    }

    return cookies

def get_headers():
    headers = {
        'Connection': 'keep-alive',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'X-NewRelic-ID': 'XA4GVl5ACwoAUFRQDw==',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'cors',
        'Referer': 'https://insights.edx.org/courses/course-v1:ColumbiaX+BAMM.101x+3T2019/learners/',
        'Accept-Encoding': 'gzip, deflate, br',
    }
    return headers

def api_learners_metadata_json_url(course_id):
    return f'https://insights.edx.org/api/learner_analytics/v0/course_learner_metadata/{course_id}'

def api_learners_engagement_json_url(user_id, course_id):
    return f'https://insights.edx.org/api/learner_analytics/v0/engagement_timelines/{user_id}?course_id={course_id}'

def api_learners_data_json_url(page, page_size, course_id, verified):
    base_url = f'https://insights.edx.org/api/learner_analytics/v0/learners?page={page}&page_size={page_size}&course_id={course_id}'
    if verified:
        return base_url + '&enrollment_mode=verified'
    return base_url

def api_learners_data_json_requests(page, page_size, course_id, verified):
    headers = get_headers()
    if verified:
        params = (
            ('page', page),
            ('page_size', page_size),
            ('course_id', course_id),
            ('enrollment_mode', 'verified')
        )
    else:
        params = (
            ('page', page),
            ('page_size', page_size),
            ('course_id', course_id)
        )
    resp = requests.get(
            url='https://insights.edx.org/api/learner_analytics/v0/learners',
            cookies=get_cookies2(),
            headers=headers,
            params=params
            )    
    return resp

def fetch_learners2(course_id, verified):
    cookies = get_cookies2()
    resp = api_learners_data_json_requests(1, 100, course_id, verified)

    if resp.status_code != 200:
        return False

    body = resp.json()
    count = body['count']
    num_pages = math.ceil(count / 100)

    # TODO: make this async
    responses = []
    for i in range(1, num_pages + 1):
        resp = api_learners_data_json_requests(i, 100, course_id, verified)
        responses.append(resp)

    results = []
    for i in range(0, num_pages):
        results += responses[i].json()['results']

    filename = f'data-learners_{course_id[10:]}.json'
    with open(filename, 'w') as f:
        json.dump(results, f, indent=4)
    print(f'    INFO: wrote {filename} to disk.')

    return results

def fetch_engagement(course_id, verified):

    course_users = []

    cookies = get_cookies2()

    print(f"Fetching learners info for {course_id}...")

    learners = fetch_learners2(course_id, verified)

    # Check the request succeeded
    if not learners:
        print("Learners request failed, try updating the insights cookie")
        return False

    num_learners = len(learners)
    print(f"Learners request succeeded. Found {num_learners} verified learners.")

    crawler = EdCrawler()
    crawler.refresh_token()

    print(f"Fetching discussion post info for {course_id}...")

    if course_id in COURSE_MAP: 
        all_user_posts = crawler.download_csv(course_id)    
    else: 
        all_user_posts = []   

    threadNumber = len(all_user_posts)
    postFileName = str(COURSE_MAP[course_id]) + "_posts.json"

    print(f"Found {threadNumber} user threads. Dumping json to {postFileName}")

    with open(postFileName, 'w', encoding="utf-8") as outfile:
        json.dump(all_user_posts, outfile, indent=4)

    client = MongoClient(CONNECTION_STRING)
    db = client.srlui2020.activity

    # TODO: make this async
    responses = []
    for i in range(0, num_learners):
        row = {}
        # url = api_learners_engagement_json_url(learners[i]['username'], course_id)
        user_name = learners[i]["username"]
        user_id = learners[i]["user_id"]
        user_email = learners[i]["email"].lower()

        resp = requests.get(
                    url=f'https://insights.edx.org/api/learner_analytics/v0/engagement_timelines/{user_name}/', 
                    cookies=cookies, 
                    headers={
                        'Connection': 'keep-alive',
                        'Pragma': 'no-cache',
                        'Cache-Control': 'no-cache',
                        'Accept': 'application/json, text/javascript, */*; q=0.01',
                        'X-NewRelic-ID': 'XA4GVl5ACwoAUFRQDw==',
                        'X-Requested-With': 'XMLHttpRequest',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36',
                        'Sec-Fetch-Site': 'same-origin',
                        'Sec-Fetch-Mode': 'cors',
                        'Referer': f'https://insights.edx.org/courses/{course_id}/learners/',
                        'Accept-Encoding': 'gzip, deflate, br',
                        'Accept-Language': 'zh-CN,zh;q=0.9',
                    },
                    params = (
                        ('course_id', course_id),
                    )
                )

        # Add data to mongodb, per week
        if resp.status_code == 200:

            courseString = course_id.split(":")[1]

            row["username"] = user_name
            row["courseId"] = courseString
            row["userId"] = user_id
            row["email"] = user_email

            videos = copy.deepcopy(ACTVITY_MAP)
            posts = copy.deepcopy(ACTVITY_MAP)
            problems = copy.deepcopy(ACTVITY_MAP)

            if not SKIP_INSIGHTS:
                days = resp.json()["days"]
                for day in days: 
                    date = datetime.strptime(day["date"], '%Y-%m-%d').date()

                    for x in range(1, NUM_WEEKS + 1):
                        weekDate = datetime.strptime(DATES[x], '%Y-%m-%d').date()
                        if date <= weekDate:
                            videos[str(x)] += day["videos_viewed"]
                            problems[str(x)] += day["problems_completed"]
                            break

                row["problems"] = problems
                row["videos"] = videos

            if user_email in all_user_posts: 
                user_posts = all_user_posts[user_email]

                for post in user_posts: 
                    time = post["created_at"].split("T")
                    date = datetime.strptime(time[0], '%Y-%m-%d').date()

                    for x in range(1, NUM_WEEKS + 1):
                        weekDate = datetime.strptime(DATES[x], '%Y-%m-%d').date()
                        if date <= weekDate:
                            posts[str(x)] += 1
                            break

            row["posts"] = posts

            db.find_one_and_update(
                {'email': user_email, 'courseId': courseString}, 
                {'$set': row, 
                '$setOnInsert': { 'goals': GOAL_MAP }}, 
                upsert=True)

        responses.append(resp)

    results = {}
    for i in range(0, num_learners):
        # Skip learners with no engagement data
        if responses[i].status_code != 200: continue
        json_response = responses[i].json()
        results[learners[i]['username']] = json_response


    filename = f'data-engagement_{course_id[10:]}.json'

    print(f"Finished updating learner activity data. Dumping engagement data to {filename}")

    with open(filename, 'w') as f:
        json.dump(results, f, indent=4)

    return results
 

# DISCUSSION POSTS

COURSE_MAP_RE = {v:k for k,v in COURSE_MAP.items()}

class EdCrawler():

    def __init__(self):
        self.token = ""

    def refresh_token(self):
        headers = {
            'Sec-Fetch-Mode': 'cors',
            'Referer': 'https://us.edstem.org/courses/100/analytics/discussion',
            'Origin': 'https://us.edstem.org',
            'x-token': self.token,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/'
                          '537.36 (KHTML, like Gecko) Chrome/'
                          '76.0.3809.132 Safari/537.36',
        }
        response = requests.post('https://us.edstem.org/api/renew_token',
                                 headers=headers)
        if response.status_code != 200:
            print("Wrong response!")
            self.token = input("Please input a valid token:"
                               "(just copy and it from the website "
                               "inspection page)")
        else:
            info = response.json()
            self.token = response.json()["token"]
            self.save_info(info)

    def get_token(self):
        return self.token

    def save_info(self, info):
        with open('data.json', 'w') as outfile:
            json.dump(info, outfile)

    def download_csv(self, course):
        course_number = COURSE_MAP[course]
        headers = {
            'authority': 'us.edstem.org',
            'pragma': 'no-cache',
            'cache-control': 'no-cache',
            'origin': 'https://us.edstem.org',
            'upgrade-insecure-requests': '1',
            'content-type': 'application/x-www-form-urlencoded',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/'
                          '537.36 (KHTML, like Gecko) Chrome/'
                          '76.0.3809.132 Safari/537.36',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-user': '?1',
            'accept': 'text/html,application/xhtml+xml,application/xml;'
                      'q=0.9,image/webp,image/apng,*/*;'
                      'q=0.8,application/signed-exchange;v=b3',
            'sec-fetch-site': 'same-origin',
            'referer': 'https://us.edstem.org/courses/'
                       f'{course_number}/analytics/discussion',
            'accept-encoding': 'gzip, deflate, br',
            'cookie': '__cfduid=d2baabd554f0bd49c9b12400afbc569591568386892',
        }

        data = {'_token': self.token}

        response = requests.post('https://us.edstem.org/api/courses/'
                                 f'{course_number}/analytics/'
                                 'discussion_threads.json',
                                 headers=headers,
                                 data=data)

        threadsFileName = str(course_number) + "_discussion_threads.json"
        print(f"Dumping discussion thread data to {threadsFileName}")

        with open(threadsFileName, 'w') as outfile:
          json.dump(response.json(), outfile, indent=4)

        return parse_threads(threadsFileName)

def parse_threads(file_name, save=True):
    with open(file_name, "rb") as f:
        data = json.load(f, encoding="utf8")

    posts = {}
    for post in data:
      get_info(posts, post, "")

    return posts


def get_info(posts, post, postType):
  info = {}
  infoList = []

  email = post["user"]["email"].lower()
  if "type" in post:
    info["type"] = post["type"]
  else:
    info["type"] = postType
  info["created_at"] = post["created_at"]

  infoList.append(info)

  if email in posts:
    posts[email].extend(infoList)
  else:
    posts[email] = infoList

  if post.get("comments"):
      for sub_post in post.get("comments"):
          posts = get_info(posts, sub_post, "comment")

  if post.get("answers"):
      for sub_post in post.get("answers"):
          posts = get_info(posts, sub_post, "answer")

  return posts

def read_subposts(posts, sub_post, post_type):
  infoList = []
  email = sub_post["user"]["email"].lower()
  p_list = get_info(posts, sub_post, post_type)
  infoList.append(p_list)

  if email in posts:
    posts[email].extend(infoList)
  else:
    posts[email] = infoList

  return posts


if __name__ == '__main__':

    while True: 

        print('Starting edX activity scraping')
        print()

        for course in COURSES: 
            results = fetch_engagement(course, True)
            print(f'{course} finished!')
            print()

        print()

        localtime = time.asctime( time.localtime(time.time()) )

        print(f"All courses finished on {localtime}.")

        print()
        print("Sleeping...")
        time.sleep(21600)
