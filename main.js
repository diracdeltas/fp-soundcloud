const fs = require('fs')
const https = require('https')

// List of all followers from the JSON files in this directory
let followers = []

// scan current directory for JSON files to parse
fs.readdirSync('.').forEach((filename) => {
  if (filename.endsWith('.json')) {
    const followersData = JSON.parse(fs.readFileSync(filename))
    followers = followers.concat(followersData.collection)
  }
})

// Now go through the followers and get their user IDs
// Use a Set to remove duplicates
const followerIds = new Set(followers.map((follower) => {
  return follower.id
}))

// For each user ID, go to the soundcloud API endpoint for them and get the
// list of artist profile URLs that they follow.
// Build an object which counts how many people follow a given artist.

const artistCounts = {}
const MAX_FOLLOWS = 2000 // maximum follows allowed on Soundcloud
const CLIENT_ID = 'z7npDMrLmgiW4wc8pPCQkkUUtRQkWZOF' // soundcloud API client id

// The number of accounts that we have analyzed already
let finished = 0

// Helper function to display results and quit
function logResults () {
  // JS doesn't have sortable objects but it can sort arrays
  const sortable = []
  for (let artist in artistCounts) {
    const count = artistCounts[artist]
    sortable.push([artist, count])
  }
  // Sort by the object value, which is the artist count.
  sortable.sort((a, b) => a[1] - b[1])
  sortable.reverse().forEach((artistEntry) => {
    console.log(`${artistEntry[0]}: ${artistEntry[1]}`)
  })
  process.exit()
}

// Helper function to fetch soundcloud URLs and parse the response into artist
// counts
function fetchSoundcloudUrl (soundcloudUrl) {
  https.get(soundcloudUrl, (res) => {
    if (res.statusCode !== 200) {
      console.error(`Could not complete request to ${soundcloudUrl}`)
      finished += 1
    } else {
      res.setEncoding('utf8')
      let rawData = ''
      // Now read the response data until the end. Mostly copy-pasted from
      // https://nodejs.org/api/http.html#http_http_get_options_callback
      res.on('data', (chunk) => { rawData += chunk })
      res.on('end', () => {
        try {
          // Parse the JSON data to get the followers
          const parsedData = JSON.parse(rawData)
          const artistsFollowed = parsedData.collection
          // For each artist followed, get their page URL, then increment the
          // artist count by 1
          artistsFollowed.forEach((artist) => {
            const artistUrl = artist.permalink_url
            if (artistUrl in artistCounts) {
              artistCounts[artistUrl] += 1
            } else {
              artistCounts[artistUrl] = 1
            }
          })
          // If we have finished processing all accounts, log the results
          finished += 1
          if (finished === followerIds.size) {
            logResults()
          }
        } catch (e) {
          finished += 1
          console.error(e.message)
        }
      })
    }
  })
}

followerIds.forEach((id) => {
  const soundcloudUrl = `https://api-v2.soundcloud.com/users/${id}/followings?offset=0&limit=${MAX_FOLLOWS}&client_id=${CLIENT_ID}&app_version=1553260698&app_locale=en`
  // Fetch the URL
  fetchSoundcloudUrl(soundcloudUrl)
})

// Quit in 20s if the script hasn't finished running by then so it doesn't hang
// forever
setTimeout(logResults, 20 * 1000)
