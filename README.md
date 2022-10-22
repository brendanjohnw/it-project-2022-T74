# Bookpedia 
## About This Project: 
Our group believes there is no existing application 100% dedicated to books. While people could use existing social platforms, or data storing tools to record their reading activity, we believe users would benefit from having a completely dedicated application.
Solution: Bookpedia is a web application designed for users to record and track the books that they read, or would like to read. Bookpedia also enables users to connect with friends. Friends can track other friends reading habits, as well as provide comments, and recommendations

## Features

A lightweight, simple personal library store.

- Add books to your library
- You can upload pictures of your books, the title, genre and a brief description
- Store notes for each of your books
- Label your book as part of your wishlist

The ability to interact with other users:
- Ability to add friends on the platform
- Recommend your favourite books to friends

In future versions, more interactional features may be added:
- View other users' book collections
- Mark a book as part of a private or public library
- Friends can write comments on each other's book

 ## Getting started

 1. Install nodejs >= 16.
 2. Clone this project.
 3. Open `it-project-2022-T74` in your editor (VSCode or IntelliJ)
 4. Install prettier by running `npm install --global prettier`, formats the code so it looks neater
 5. Install IDE extensions
     1. If using VSCode
     2. Install Prettier extension
     3. Enable format on save and auto save in settings.
 6. Open the integrated terminal in your editor and run `npm i`
 7. To view the site, run `npm run auto`. Then visit `localhost:3900` in your browser.

 ## Modifying styles using CSS

 * We are using the bootstrap CSS framework which includes a bunch of pre-made front-end
   components to use.
 * Link to documentation: https://getbootstrap.com/docs/5.2/getting-started/introduction/
 * It heavily uses pre-made classes to add attributes. Combining many classes together is the way to achieve a specific
   look (for those who took OOSD, this is akin to "composition-over-inheritance", where it's better for a class to be
   comprised of smaller individual component classes rather than making a really ugly inheritance tree)
 * Hence, where possible, use the documentation to find the class that does what you want. If it doesn't have the feature
   you're looking for, you can modify `/public/css/styles.css`. An example of something that had to be added was a
   multi-line button for responsive UI on smaller screens.
 * Bootstrap is a pretty popular framework so Googling `Bootstrap` with your goal should get you 90% there.


To use this application, you would need to have the following packages installed:
- bcrypt@5.0.1
- bcryptjs@2.4.3
- body-parser@1.20.0
- bootstrap@5.2.0
- cookie-parser@1.4.6
- cookieparser@0.1.0
- date-fns@2.29.3
- express-flash@0.0.2
- express-handlebars@6.0.6
- express-session@1.17.3
- express@4.17.3
- expressjs@1.0.1
- handlebars@4.7.7
- jquery@3.6.0
- mongodb@4.9.1
- mongoose@6.6.1
- multer@1.4.5-lts.1
- nodejs@0.0.0
- nodemon@2.0.19
- passport@0.6.0

Use `npm install <package>` to install these
All javascript code is written in CommonJS syntax

# Commit Rules
- Never push directly to main
- Always make changes to your own branch and then create a pull request, do not merge immediately.
- Before merging onto main, please test the code on your own computer. If everything looks good, merge to main. Notify the coding channel on Slack when you have done so.
- Do not work on the same part of the code simultaneously on different branches, this will lead to conflicts
- use `git rebase main` instead of `git pull` as the latter will mess up the commit history.
- Write meaningful commit messages

# Coding standards

- All import statements at the top of the file
- Install prettier and activate format on save.
- Avoid writing CSS and Javascript inline unless absolutely necessary
- Comment major sections of code so everyone is on the same page.

# Changelog
## Week 6
- Added secure authentication
- Added validation check message to the sign up screen
- Added new static web pages for each user dashboard
## Week 9
- Added feature to add books to library
- Added ability to write comments on books
- Added ability to edit details about a book
- Added ability to delete a book
- Added ability to change passwords
## Week 12
- Added ability for users to add other users as friends
- Added book recommendation feature
- Users can now add books to their wishlist
- Added random messages on dashboard
- Some UI tweaks
- Fixed the bug where only the friends at the top of the list would be deleted or added.


# Contributors

Lachlan Scholes - 830938  
Max Shapiro - 999426  
Brendan Lee - 1166409  
Chenlei Liu - 918611  
Jiaquan Wen - 1067703  
