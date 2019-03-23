const fs = require('fs')
const https = require('https')

// read and parse the JSON file containing a list of people who follow False
// Profit on Soundcloud
const rawFollowersData = JSON.parse(fs.readFileSync('false-profit-followers.json'))

// the data that we want is in the 'collection' property of the JSON object
const followers = rawFollowersData.collection
console.log(`False Profit has ${followers.length} followers`)

// Now go through the followers of False Profit and get their user IDs
const followerIds = followers.map((follower) => {
  return follower.id
})

// For each user ID, go to the soundcloud API endpoint for them and get the
// list of artist profile URLs that they follow.
// Build an object which counts how many people follow a given artist.

const artistCounts = {}
const MAX_FOLLOWS = 2000 // assume each user only follows at most 2000 artists
const CLIENT_ID = 'z7npDMrLmgiW4wc8pPCQkkUUtRQkWZOF' // soundcloud API client id

// Helper function to fetch soundcloud URLs and parse the response into artist
// counts
function fetchSoundcloudUrl (soundcloudUrl) {
  https.get(soundcloudUrl, (res) => {
    if (res.statusCode !== 200) {
      console.error(`Could not complete request to ${soundcloudUrl}`)
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
        } catch (e) {
          console.error(e.message)
        }
      })
    }
  })
}

followerIds.forEach((id, index) => {
  const soundcloudUrl = `https://api-v2.soundcloud.com/users/${id}/followings?offset=0&limit=${MAX_FOLLOWS}&client_id=${CLIENT_ID}&app_version=1553260698&app_locale=en`
  // Fetch the URL
  fetchSoundcloudUrl(soundcloudUrl)
})

// Wait 10 seconds for all of the requests to finish, then log the sorted results.
// TODO: This should count the requests and log when they're all finished since
// 10s is a completely arbitrary amount of time that I made up.
setTimeout(() => {
  // JS doesn't have sortable objects but it can sort arrays
  const sortable = []
  for (let artist in artistCounts) {
    // push the object key and object value into an array
    sortable.push([artist, artistCounts[artist]])
  }
  // Sort by the object value, which is the artist count.
  sortable.sort((a, b) => a[1] - b[1])
  sortable.reverse().forEach((artistEntry) => {
    console.log(`${artistEntry[0]}: ${artistEntry[1]}`)
  })
}, 10 * 1000)
