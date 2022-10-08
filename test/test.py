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
    book_title = input("input the title of book: ")
    if(wish == "add"):
        time.sleep(3)
        br.find_element(By.ID, "6341ac983334dc39bcc4b23c").click()
        #br.find_element(By.ID, 'add-to-wish').click()





