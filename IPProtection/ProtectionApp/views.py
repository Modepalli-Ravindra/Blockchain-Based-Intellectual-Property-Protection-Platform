from django.shortcuts import render
from datetime import datetime
from django.template import RequestContext
from django.contrib import messages
from django.http import HttpResponse
from django.core.files.storage import FileSystemStorage
import os
import json
from web3 import Web3, HTTPProvider
import ipfsApi
import base64
import hashlib

global username, propertyList, rewardList, usersList
global contract, web3
api = ipfsApi.Client(host='http://127.0.0.1', port=5001)

#function to call contract
def getContract():
    global contract, web3
    blockchain_address = 'http://127.0.0.1:9545'
    web3 = Web3(HTTPProvider(blockchain_address))
    web3.eth.defaultAccount = web3.eth.accounts[0]
    compiled_contract_path = 'IP.json' #IP contract file
    deployed_contract_address = '0xaF0B65C3F95dDb9696ba5d37C8Dec2B7C59bdaF8' #contract address
    with open(compiled_contract_path) as file:
        contract_json = json.load(file)  # load contract info as JSON
        contract_abi = contract_json['abi']  # fetch contract's abi - necessary to call its functions
    file.close()
    contract = web3.eth.contract(address=deployed_contract_address, abi=contract_abi)
getContract()

def getUsersList():
    global usersList, contract
    usersList = []
    count = contract.functions.getUserCount().call()
    for i in range(0, count):
        user = contract.functions.getUsername(i).call()
        password = contract.functions.getPassword(i).call()
        phone = contract.functions.getPhone(i).call()
        email = contract.functions.getEmail(i).call()
        address = contract.functions.getAddress(i).call()
        usersList.append([user, password, phone, email, address])

def getRewardList():
    global rewardList, contract
    rewardList = []
    count = contract.functions.getRewardCount().call()
    for i in range(0, count):
        user = contract.functions.getName(i).call()
        verify_count = contract.functions.getVerificationCount(i).call()
        rewards = contract.functions.getRewards(i).call()
        rewardList.append([user, verify_count, rewards])

def getPropertyList():
    global propertyList, contract
    propertyList = []
    count = contract.functions.getPropertyCount().call()
    for i in range(0, count):
        pid = contract.functions.getPropertyid(i).call()
        cname = contract.functions.getCreator(i).call()
        desc = contract.functions.getDescription(i).call()
        fname = contract.functions.getFileName(i).call()
        hashcode = contract.functions.getHashcode(i).call()
        cdate = contract.functions.getDate(i).call()
        transfer = contract.functions.getTransfer(i).call()
        propertyList.append([pid, cname, desc, fname, hashcode, cdate, transfer])
getUsersList()
getRewardList()    
getPropertyList()

def Verification(request):
    if request.method == 'GET':
        return render(request,'Verification.html', {})

def ViewRewards(request):
    if request.method == 'GET':
        global rewardList, username
        output = '<table border=1 align=center>'
        output+='<tr><th><font size=3 color=black>Username</font></th>'
        output+='<th><font size=3 color=black>Numbeer of Verifications</font></th>'
        output+='<th><font size=3 color=black>Earned Rewards</font></th></tr>'
        for i in range(len(propertyList)):
            reward = rewardList[i]
            if reward[0] == username:
                output+='<tr><td><font size=3 color=black>'+reward[0]+'</font></td>'
                output+='<td><font size=3 color=black>'+reward[1]+'</font></td>'
                output+='<td><font size=3 color=black>'+reward[2]+'</font></td></tr>'
        output += "</table><br/><br/><br/><br/>"
        context= {'data':output}        
        return render(request,'UserScreen.html', context)    

def saveRewards(user):
    global rewardList
    status = 0
    for i in range(len(rewardList)):
        rewards = rewardList[i]
        if rewards[0] == user:
            counts = str(int(rewards[1]) + 1)
            value = str(int(rewards[2]) + 5)
            contract.functions.updateRewards(i, counts, value).transact()
            rewards[1] = counts
            rewards[2] = value
            status = 1
            break
    if status == 0:
        msg = contract.functions.saveRewards(user, "1", "5").transact()
        tx_receipt = web3.eth.waitForTransactionReceipt(msg)
        rewardList.append([user, "1", "5"])
        

def VerificationAction(request):
    if request.method == 'POST':
        global propertyList, username
        filename = request.FILES['t1'].name
        myfile = request.FILES['t1'].read()
        hash_object = hashlib.sha256(myfile)
        hex_digest = hash_object.hexdigest()
        output = "No matched found! Verification failed"
        for i in range(len(propertyList)):
            plist = propertyList[i]
            hashes = plist[4].split(",")
            if hashes[1] == hex_digest:
                output = '<table border=1 align=center>'
                output+='<tr><th><font size=3 color=black>Property ID</font></th>'
                output+='<th><font size=3 color=black>Creator Name</font></th>'
                output+='<th><font size=3 color=black>Description</font></th>'
                output+='<th><font size=3 color=black>Document Name</font></th>'
                output+='<th><font size=3 color=black>Document Hash</font></th>'
                output+='<th><font size=3 color=black>Created Date</font></th>'
                output+='<th><font size=3 color=black>Transfer Details</font></th></tr>'
                output+='<tr><td><font size=3 color=black>'+plist[0]+'</font></td>'
                output+='<td><font size=3 color=black>'+plist[1]+'</font></td>'
                output+='<td><font size=3 color=black>'+plist[2]+'</font></td>'
                output+='<td><font size=3 color=black>'+plist[3]+'</font></td>'
                output+='<td><font size=3 color=black>'+hashes[0][0:20]+'</font></td>'
                output+='<td><font size=3 color=black>'+plist[5]+'</font></td>'
                output+='<td><font size=3 color=black>'+plist[6]+'</font></td></tr>'
                output += "</table><br/><br/><br/><br/>"
                saveRewards(plist[1])
                break
        context= {'data':output}        
        return render(request,'UserScreen.html', context)    
                

def TransferAction(request):
    if request.method == 'POST':
        global propertyList, username
        pid = request.POST.get('t1', False)
        transfer = request.POST.get('t2', False)
        for i in range(len(propertyList)):
            plist = propertyList[i]
            if plist[0] == pid:
                contract.functions.updateTransfer(i, transfer).transact()
                plist[6] = transfer
                break
        context= {'data':'Property successfully transferred to : '+transfer}
        return render(request, 'UserScreen.html', context)            

def Transfer(request):
    if request.method == 'GET':
        global username
        pid = request.GET['pid']
        output = '<tr><td><font size="3" color="black">Property&nbsp;ID</td><td><input type="text" name="t1" size="15" value="'+pid+'" readonly/></td></tr>'
        context= {'data1':output}
        return render(request,'Transfer.html', context)

def ViewProperty(request):
    if request.method == 'GET':
        global propertyList, username
        output = '<table border=1 align=center>'
        output+='<tr><th><font size=3 color=black>Property ID</font></th>'
        output+='<th><font size=3 color=black>Creator Name</font></th>'
        output+='<th><font size=3 color=black>Description</font></th>'
        output+='<th><font size=3 color=black>Document Name</font></th>'
        output+='<th><font size=3 color=black>Document Hash</font></th>'
        output+='<th><font size=3 color=black>Created Date</font></th>'
        output+='<th><font size=3 color=black>Transfer Details</font></th>'
        output+='<th><font size=3 color=black>Click Here to Transfer</font></th></tr>'
        for i in range(len(propertyList)):
            plist = propertyList[i]
            if plist[1] == username:
                hashcode = plist[4].split(",")[0]
                output+='<tr><td><font size=3 color=black>'+plist[0]+'</font></td>'
                output+='<td><font size=3 color=black>'+plist[1]+'</font></td>'
                output+='<td><font size=3 color=black>'+plist[2]+'</font></td>'
                output+='<td><font size=3 color=black>'+plist[3]+'</font></td>'
                output+='<td><font size=3 color=black>'+hashcode[0:20]+'</font></td>'
                output+='<td><font size=3 color=black>'+plist[5]+'</font></td>'
                output+='<td><font size=3 color=black>'+plist[6]+'</font></td>'
                output+='<td><a href=\'Transfer?pid='+plist[0]+'\'><font size=3 color=red>Click Here to Transfer</font></a></td></tr>'
        output += "</table><br/><br/><br/><br/>"
        context= {'data':output}        
        return render(request,'UserScreen.html', context)      

def RecordPropertyAction(request):
    if request.method == 'POST':
        global propertyList, username
        desc = request.POST.get('t1', False)
        property_id = str(len(propertyList) + 1)
        filename = request.FILES['t2'].name
        myfile = request.FILES['t2'].read()
        hashcode = api.add_pyobj(myfile)
        hash_object = hashlib.sha256(myfile)
        hex_digest = hash_object.hexdigest()
        current_date = str(datetime.now().date())
        msg = contract.functions.saveProperty(str(property_id), username, desc, filename, hashcode+","+hex_digest, current_date, "-").transact()
        tx_receipt = web3.eth.waitForTransactionReceipt(msg)
        propertyList.append([str(property_id), username, desc, filename, hashcode+","+hex_digest, current_date, "-"])
        context= {'data':'Property details added to Blockchain with ID = '+str(property_id)+'<br/><br/>'+str(tx_receipt)}
        return render(request, 'RecordProperty.html', context)        

def RecordProperty(request):
    if request.method == 'GET':
        return render(request,'RecordProperty.html', {})

def index(request):
    if request.method == 'GET':
        return render(request,'index.html', {})

def Register(request):
    if request.method == 'GET':
       return render(request, 'Register.html', {})
    
def UserLogin(request):
    if request.method == 'GET':
       return render(request, 'UserLogin.html', {})

def RegisterAction(request):
    if request.method == 'POST':
        global usersList
        username = request.POST.get('t1', False)
        password = request.POST.get('t2', False)
        contact = request.POST.get('t3', False)
        email = request.POST.get('t4', False)
        address = request.POST.get('t5', False)
        status = "none"
        for i in range(len(usersList)):
            users = usersList[i]
            if username == users[0]:
                status = "exists"
                break
        if status == "none":
            msg = contract.functions.saveUser(username, password, contact, email, address).transact()
            tx_receipt = web3.eth.waitForTransactionReceipt(msg)
            usersList.append([username, password, contact, email, address])
            context= {'data':'Signup Process Completed<br/>'+str(tx_receipt)}
            return render(request, 'Register.html', context)
        else:
            context= {'data':'Given username already exists'}
            return render(request, 'Register.html', context)

def UserLoginAction(request):
    if request.method == 'POST':
        global username, contract, usersList
        username = request.POST.get('t1', False)
        password = request.POST.get('t2', False)
        status = 'none'
        for i in range(len(usersList)):
            ulist = usersList[i]
            user1 = ulist[0]
            pass1 = ulist[1]            
            if user1 == username and pass1 == password:
                status = "success"
                break
        if status == 'success':
            output = 'Welcome '+username
            context= {'data':output}
            return render(request, "UserScreen.html", context)
        if status == 'none':
            context= {'data':'Invalid login details'}
            return render(request, 'UserLogin.html', context)
        



        


        
