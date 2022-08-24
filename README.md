# IT Project 2022 
A collaborative project as part of the COMP30022: IT Project capstone subject

# Features
A lightweight, simple personal library store.

- Add books to your library
- Store notes for each of your books
- label your book as part of your wishlist
- Add books to your library. You can upload pictures of your books, the title, genre and a brief description
 - Store comments for each of your books
 - label your book as part of your wishlist

 In future versions, the ability to interact with other users will be implemented, so stay tuned

 ## Getting started

 1. Install nodejs >= 16.
 2. Clone this project.
 3. Open `it-project-2022-T74` in your editor (VSCode or IntelliJ)
 4. Install prettier by running `npm install --global prettier`, formats the code so it looks neater
 5. Install IDE extensions
     1. If using VSCode
         1. Install Prettier extension
         2. Enable format on save and auto save in settings.
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
- nodejs
- expressjs
- express-handlebars
- express-flash
- express-session
- cookieParser
- handlebars
- passportjs
- bcryptjs
- mongoose
- body-parser
- bootstrap@5.2

Use `npm install <package>` to install these
All javascript code is written in CommonJS syntax

# Changelog


# Contributors

Lachlan Scholes - 830938  
Max Shapiro - 999426  
Brendan Lee - 1166409  
Chenlei Liu - 918611  
Jiaquan Wen - 1067703  
