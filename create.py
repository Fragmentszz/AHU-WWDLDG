import pandas as pd
import random
import sys
import os
import faker
headers = ["cid","phone","qq"]    #customer
headers = ["sid","phone","qq","address"]    #seller
# headers = ["fid","totcost","credit"]            #forwarder
headers = ["gid","price","num","describe","lab","status","sid","gname","img"] # goods
datadict = {}
imglist = os.listdir("./html/img")
for li in headers:
    datadict[li] = []
random.seed(1354);
fk = faker.Faker(locale="zh_CN")

for i in range(5000):
    for head in headers:
        nowr = object()
        if(head[-2:] == "id"):
            nowr = head[0] + '%07d' % i
        elif(head == "phone"):
            nowr = str(random.randint(10000000000,19999999999))
        elif(head == "qq"):
            nowr = str(random.randint(100000000,9999999999))
        elif(head == "address"):
           nowr = fk.address()[:20]
           nowr = nowr[:-7]
        elif(head == "totcost" or head == "price"):
            nowr = random.uniform(0.0,100.0)
        elif(head == "credit"):
            nowr = random.randint(0,5)
        elif(head == "num"):
            nowr = random.randint(1,50)
        elif(head == "lab"):
            nowr = random.choice(["study","other","life","transport"])
        elif(head == "status"):
            nowr = 0
        elif(head == "img"):
            nowr = random.choice(imglist)
        elif(head == "gname"):
            nowr = random.choice(["想不出来商品名1","想不出来商品名2","想不出来商品名3","想不出来商品名4"])
        elif(head == "describe"):
            nowr = fk.sentence()
        datadict[head].append(str(nowr))



outdata = pd.DataFrame(data=datadict,columns=headers)
outdata.to_excel("./data/goods.xlsx")
print(outdata)