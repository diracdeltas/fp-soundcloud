## fp soundcloud scripts

what producers/DJs are popular in the False Profit and Priceless
communities? let us seek answers.

### methodology

1. compile a list of unique followers of 3 soundcloud accounts associated with
   False Profit: https://soundcloud.com/falseprofitinc,
   https://soundcloud.com/pricelessfestival, and
   https://soundcloud.com/falseprofitrecords.
2. look at what other accounts these people are following
3. rank the accounts by most-followed-among-followers-of-false-profit-accounts

### instructions

run `node main.js`.

the results will be written to STDOUT, so you probably want to do `node main.js > results.txt` if you want the results written to a file.

### updating

`false-profit-followers.json` was pulled from
https://api-v2.soundcloud.com/users/157523163/followers?client_id=z7npDMrLmgiW4wc8pPCQkkUUtRQkWZOF&limit=200&offset=0&linked_partitioning=1&app_version=1553260698&app_locale=en.

`priceless-followers.json` was pulled from
https://api-v2.soundcloud.com/users/465157974/followers?offset=0&limit=200&client_id=z7npDMrLmgiW4wc8pPCQkkUUtRQkWZOF&app_version=1553260698&app_locale=en.

`fp-records-followers.json` was pulled from
https://api-v2.soundcloud.com/users/5348967/followers?offset=0&limit=500&client_id=z7npDMrLmgiW4wc8pPCQkkUUtRQkWZOF&app_version=1553260698&app_locale=en.

You may want to update these files periodically.
