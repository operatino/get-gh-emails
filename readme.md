# WIP: Gather GH accounts and emails from names list

Using GH search get the usernames and emails of people having only a list First and Last names.

# Usage

Create a CSV list called `./users.csv` with First and Last names (combined). Run `index.js` passing `CLIENT_ID` and `CLIENT_SECRET` envs for GH API auth.

Script can only execute 30 searches in a minute, following GH search API limitations.
