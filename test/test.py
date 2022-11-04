from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import Select
import time
print("You must sign up/log in first")
newuser =  input("New User?\n")
username = input("Username\n")
password = input("Password\n")
s = Service("/usr/local/bin/chromedriver")
br = webdriver.Chrome(service=s)
br.get("http://localhost:3900/")
time.sleep(2)
if newuser == "yes":
    br.find_element(By.ID, "signup").click()
    br.find_element(By.ID, 'username').send_keys(username)
    br.find_element(By.ID, 'password').send_keys(password)
    br.find_element(By.ID, 'Start Book keeping!').click()
    time.sleep(2)
    br.find_element(By.ID, 'username').send_keys(username)
    br.find_element(By.ID, 'password').send_keys(password)
    br.find_element(By.ID, 'Start Book keeping!').click()
else:
    br.find_element(By.ID, "login").click()
    br.find_element(By.ID, 'username').send_keys(username)
    br.find_element(By.ID, 'password').send_keys(password)
    br.find_element(By.ID, 'Start Book keeping!').click()

print("Enter 1 for change password\n")
print("Enter 2 for add a book\n")
print("Enter 3 for add/delete a book from wish list\n")
print("Enter 4 for test wrote note function\n")
print("Enter 5 for edit/delete book function\n")
print("Enter 6 for friend request function\n")
print("Enter 7 for recommandation function\n")
testFunc = input("Input an number\n")

if(testFunc == "1"):
    new_pass = input("input new password\n")    
    br.find_element(By.ID, 'settings').click()
    br.find_element(By.ID, 'password1').send_keys(password)
    br.find_element(By.ID, 'password2').send_keys(new_pass)
    br.find_element(By.ID, 'change-password').click()
elif(testFunc == "2"):
    path = input("Input the path of your book image: ")
    title = input("Input a title for your book: ")
    author = input("Input author of your book: ")
    genre = input("Input genre of your book: ")
    add_wishlist = input("Do you wanna add to wish list?(Yes/No): ")
    br.find_element(By.ID, 'add-book').click()
    br.find_element(By.ID, 'image').send_keys(path)
    br.find_element(By.ID, 'title').send_keys(title)
    br.find_element(By.ID, 'author').send_keys(author)
    Select(br.find_element(By.ID, 'genre')).select_by_value(genre)
    Select(br.find_element(By.ID, 'wishlist')).select_by_value(add_wishlist)
    br.find_element(By.ID, 'description').send_keys("this book is added by selenium for testing")
    time.sleep(3)
    br.find_element(By.ID, 'save-book').click()
elif(testFunc == "3"):
    wish = input("do you want delete a book from wish list or add a book to wish list?(delete/add): ")
    if(wish == "add"):
        print("adding your first book to your wish list")
        br.find_element(By.XPATH, "/html/body/div[@class='container']/div[@class='container']/div[@class='card shadow']/div[@id='library']/div[@class='container']/div[@class='row']/div[@class='book-card col-lg-6 mb-3'][1]").click()
        time.sleep(3)
        br.find_element(By.ID, 'add-to-wishlist').click()
        print("Success")
    elif(wish == "delete"):
        print("delete your first book from your wish list")
        br.find_element(By.XPATH, "/html/body/div[@class='container']/div[@class='container']/div[@class='card shadow']/div[@id='library']/div[@class='container']/div[@class='row']/div[@class='book-card col-lg-6 mb-3'][1]").click()
        time.sleep(3)
        br.find_element(By.ID, 'remove-from-wishlist').click()
        print("Success")
elif(testFunc == "4"):
    print("adding notes to your first book")
    br.find_element(By.XPATH, "/html/body/div[@class='container']/div[@class='container']/div[@class='card shadow']/div[@id='library']/div[@class='container']/div[@class='row']/div[@class='book-card col-lg-6 mb-3'][1]").click()
    time.sleep(2)
    br.find_element(By.ID, 'header').send_keys("testing header")
    br.find_element(By.ID, 'comments').send_keys("testing comments is created by selenium")
    br.find_element(By.ID, 'add-note').click()
    print("Success")
elif(testFunc == "5"):
    br.find_element(By.XPATH, "/html/body/div[@class='container']/div[@class='container']/div[@class='card shadow']/div[@id='library']/div[@class='container']/div[@class='row']/div[@class='book-card col-lg-6 mb-3'][1]").click()
    a = input("edit/delete books: \n")
    if(a == "edit"):
        br.find_element(By.ID, 'edit-book').click()
        time.sleep(3)
        br.find_element(By.ID, 'title').send_keys("test-titile")
        br.find_element(By.ID, 'author').send_keys("test-author")
        br.find_element(By.ID, 'save-edit').click()
    elif(a == "delete"):
        time.sleep(2)
        br.find_element(By.ID, 'delete-book').click()
        time.sleep(2)
        br.find_element(By.ID, 'confirm-modal').click()
elif(testFunc == "6"):
    br.find_element(By.ID, 'find-friends').click()
    time.sleep(2)
    b = input("find/delete/accept friend: \n")
    if(b == "find"):
        user = input("user you wannna add: \n")
        br.find_element(By.ID, 'requestedFriend').send_keys(user)
        br.find_element(By.ID, 'add-friend').click()
    elif(b == "delete"):
        br.find_element(By.ID, 'remove-friend').click()
    elif(b == "accept"):
        br.find_element(By.ID, 'tab-received').click()
        time.sleep(1)
        br.find_element(By.ID, 'accept').click()
elif(testFunc == "7"):
    c = input("send/receive: \n")
    if(c == "send"):
        br.find_element(By.XPATH, "/html/body/div[@class='container']/div[@class='container']/div[@class='card shadow']/div[@id='library']/div[@class='container']/div[@class='row']/div[@class='book-card col-lg-6 mb-3'][1]").click()
        time.sleep(2)
        br.find_element(By.ID, 'recommend').click()
        br.find_element(By.ID, 'receiverName').send_keys("Ryan")
        br.find_element(By.ID, 'reason').send_keys("testing purpose")
        time.sleep(2)
        br.find_element(By.XPATH,"/html/body/div[@class='container']/div[@class='container py-5 h-40']/div[@class='row justify-content-center align-items-center h-100']/div[@class='col-12 col-lg-9 col-xl-7']/div[@class='card shadow card-registration']/div[@class='card-body']/div[@class='card-body']/section[@class='card-body']/div[@class='row']/div[@class='col'][2]/div[@id='popup']/div[@class='popup']/div[@class='content']/form[@id='send-recommendation']/button[@class='btn btn-primary']").click()
    elif(c == "receive"):
        br.find_element(By.ID, 'recommendations').click()





