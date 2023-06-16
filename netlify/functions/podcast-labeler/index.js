// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const GhostAdminAPI = require('@tryghost/admin-api');
const cheerio = require('cheerio');

const handler = async (event) => {
  console.log(process.env.GHOST_API_URL);
  const api = new GhostAdminAPI({
    url: process.env.GHOST_API_URL,
    version: "v5.0",
    key: process.env.GHOST_ADMIN_API_KEY
  });
  console.log(process.env.GHOST_API_URL);
  try {
    
    let eventbody = JSON.parse(event.body)
    let curr_post = eventbody["post"]["current"]
    let { tags, html, updated_at, id, codeinjection_foot} = curr_post
    console.log('this is a test with: ', id) ;
    const $ = cheerio.load(html);
    let audioSource = $('audio').attr('src')
    let audioLength = $('.kg-audio-duration').prop('innerText')
    let lengthString =""
    if (audioLength) {lengthString = `length="${audioLength}"`}
    let audioType = `audio/mpeg`;
    // TODO: add processing of extension instead.

    console.log('source is',  audioSource);
    if (audioSource && checkCodeInjectionBlank(codeinjection_foot) && checkTags(tags)) {
      console.log('need to process this one');
      let newobject = {id: id, updated_at: updated_at, codeinjection_foot: `<enclosure url="${audioSource}" type="${audioType}" ${lengthString} />`}
      console.log('new object is:', newobject)
      let ghostResponse = await api.posts.edit(newobject)
      //console.log('done, result was', ghostResponse)
      return {
          statusCode: 200,
          body: JSON.stringify({ message: `post edited` })
        }
    }  else {
      console.log('post needs no processing');
      return {
        statusCode: 200,
        body: JSON.stringify({ message: `No processing needed` }),
  
      }
    }

  } catch (error) {
    console.log('ERROR:', error)
    return { statusCode: 500, body: error.toString() }
  }
}

function checkTags (obj) {
  let targetTag = 'podcast'
  if (process.env.GHOST_TAG) { targetTag = process.env.GHOST_TAG}
  for (let onetag of obj) {
    if (onetag['slug'] == targetTag) {
      return true;
    }
  }
  return false;
}
function checkCodeInjectionBlank (code_string) {
  if (code_string && code_string.trim()) {
    // code_string is not empty.
    console.log('code injection is not blank, it is:', code_string)
    return false
  } else {return true}
}

module.exports = { handler }
