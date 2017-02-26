# WIP: Gather GH accounts and emails from names list

Using GH search get the usernames and emails of people having only a list First and Last names.

## Usage

Prepare a CSV list called with First and Last names (combined). Run `index.js` passing `CLIENT_ID` and `CLIENT_SECRET` envs for GH API auth.

```
CLIENT_ID=xxx CLIENT_SECRET=xxx node index.js ./users.csv
```

Script can only execute 30 searches in a minute, following GH search API limitations.

## TODO

* Provide other config options
* Add output methods

## Input CVS file example

```
Adolfo Smith
Adrian Williams
```

App will only take first column, so data may have more.

```
Adolfo Smith,something
```

## Example Output

```
Adolfo Smith, gitbhuAccount1, somemail1@gmail.com
Adrian Williams, gitbhuAccount2, somemail2@gmail.com
```

And an array of emails.
