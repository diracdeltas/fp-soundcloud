const fs = require('fs')
const https = require('https')

let ids = []

const followings = JSON.parse(fs.readFileSync('azuki-following.json')).collection
followings.forEach((user) => {
  console.log(user.description)
  ids.push(user.id)
})

// sample url:
// https://api-v2.soundcloud
// .com/users/9924844/followings?client_id=geYn8eUFaQInDycVClt3oHtBO2U6uEYm&limit=20
// 0&offset=0&linked_partitioning=1&app_version=1562672047&app_locale=en

// For each user ID, go to the soundcloud API endpoint for them and get the
// list of artist profile URLs that they follow.
const MAX_LIMIT = 200 // maximum entries per collection in SC's API
const CLIENT_ID = 'z7npDMrLmgiW4wc8pPCQkkUUtRQkWZOF' // soundcloud API client id

// Helper function to fetch soundcloud URLs and parse the response into artist
// counts
function fetchSoundcloudUrl (soundcloudUrl) {
  soundcloudUrl = `${soundcloudUrl}&client_id=${CLIENT_ID}&app_version=1553260698&app_locale=en`
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
          const nextHref = parsedData.next_href
          artistsFollowed.forEach((artist) => {
            const id = artist.id
            if (!ids.includes(id)) {
              console.log(artist.description)
              ids.push(id)
            }
          })
          if (nextHref) {
            // Follow pagination link to the page of the collection
            fetchSoundcloudUrl(nextHref)
          }
        } catch (e) {
          console.error(e.message)
        }
      })
    }
  })
}

ids.forEach((id) => {
  const soundcloudUrl = `https://api-v2.soundcloud.com/users/${id}/followings?linked_partitioning=1&limit=${MAX_LIMIT}`
  // Fetch the URL
  fetchSoundcloudUrl(soundcloudUrl)
})
