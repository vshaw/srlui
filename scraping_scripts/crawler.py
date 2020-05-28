import copy
import csv
import datetime
import json
import requests
import time
import os
import sys

from pymongo import MongoClient

# Please configure this setting mannually
MONGO_URI = "mongodb://heroku_rt94x15q:hnv7s9garpfdu3ng19q9bl7n5@ds321749-a0.mlab.com:21749,ds321749-a1.mlab.com:21749/heroku_rt94x15q?replicaSet=rs-ds321749&retryWrites=false"
DB_NAME = "heroku_rt94x15q"
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db["activity"]

COURSE_MAP = {
    "BAMM101": 283,
    "BAMM102": 290,
    "BAMM103": 299,
    "BAMM104": 291,
    "CSMM101": 293,
    "CSMM102": 298,
    "CSMM103": 292,
    "CSMM104": 289
}

COURSE_MAP_RE = {v:k for k,v in COURSE_MAP.items()}

class EdCrawler():

    def __init__(self):
        try:
            with open('data.json', 'r') as infile:
                self.token = json.load(infile)["token"]
        except:
            print("No such file exists!")
            self.token = input("Please input a valid token:")

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
                                 'discussion_analytics.csv',
                                 headers=headers,
                                 data=data)

        if response.status_code == 200:
            dt = datetime.datetime.now()
            timestamp = dt.timestamp()
            r = response.content.decode("utf-8")[1:]
            with open(f'{course}.csv', 'w', newline='') as f:
                writer = csv.writer(f)
                for line in r.split("\n"):
                    writer.writerow(line.split(','))
            with open(f'{course}.csv', 'r') as f:
                reader = csv.DictReader(f, 
                                        fieldnames = ['Name',
                                                     'Email',
                                                     'Role',
                                                     'Tutorial',
                                                     'Views',
                                                     'Questions',
                                                     'Posts',
                                                     'Announcements',
                                                     'Comments',
                                                     'Answers',
                                                     'Hearts',
                                                     'Endorsements',
                                                     'Declines',
                                                     'Declines Given',
                                                     'Days Active',
                                                     'Last Active',
                                                     'Enrolled'])
                data = []
                for i, row in enumerate(reader):
                    if i and row.get("Answers", ""):  # discard the name row
                        # print(row)
                        row['Aggregated post'] = int(row['Questions']) \
                                                + int(row["Posts"]) \
                                                + int(row["Comments"]) \
                                                + int(row["Answers"])
                        row["Course Number"] = course_number
                        row["Course ID"] = course
                        row["Timestamp"] = timestamp                        
                        data.append(copy.copy(row))
                        # row["Date"] = dt.date()
                        collection.insert_one(row)
            out = json.dumps(data)
            with open(f"{course}.json", "w") as f:
                f.write(out)
            print(f"{course} done!")
        else:
            print(f"{course} fail!")

    def download_all_csv(self):
        for course in COURSE_MAP.keys():
            self.download_csv(course)



if __name__ == "__main__":
    course = "BAMM102"
    crawler = EdCrawler()
    print(crawler.get_token())
    crawler.refresh_token()
    print(crawler.get_token())    
    crawler.download_all_csv()
    while 1:
        t = time.time()
        if t % 86400 < 100:            
            crawler.refresh_token()
            crawler.download_all_csv()
            print(f"Task of {datetime.date.today()} done!")
            time.sleep(100)
            