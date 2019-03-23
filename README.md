## fp soundcloud scripts

helps analyze what music the followers of False Profit like

### instructions

run `node main.js`

the results will be written to STDOUT, so you probably want to do `node main.js > results.txt` if you want the results written to a file.

### updating

`false-profit-followers.json` was pulled from
https://api-v2.soundcloud.com/users/157523163/followers?client_id=z7npDMrLmgiW4wc8pPCQkkUUtRQkWZOF&limit=200&offset=0&linked_partitioning=1&app_version=1553260698&app_locale=en.

`priceless-followers.json` was pulled from
https://api-v2.soundcloud.com/users/465157974/followers?offset=0&limit=200&client_id=z7npDMrLmgiW4wc8pPCQkkUUtRQkWZOF&app_version=1553260698&app_locale=en.


You may want to update these files periodically.
