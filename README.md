# podcast-labeler

This is a Netlify function package that will catch a Ghost webhook and modify the post to include the <enclosure> tag required for generating 
a podcast RSS feed out of Ghost.  Use it to use Ghost as a single platform (er... ok, Netlify too) for publishing your podcast.
  
# To use:
  * Modify your theme to include an RSS feed.  I largely followed this tutorial (https://ghost.org/tutorials/custom-rss-feed/), but I store the whole value of the &lt;enclosure&gt; line in codeinjection_foot, not in the Facebook description string.
  * Install this package on Netlify.  Provide it with the three required environment variables.
  * Add web hooks for post created and post updated, directing them to the Netlify function.
  
# How it works
  * Uses built-in Ghost webhook functionality. 
  * Checks to see the the post has a specific tag (podcast by default) and that the post's codeinjection_foot is blank.
  * Parses the post content, finds the first <audio> link (won't work with iframes) and builds the enclosure line of the RSS.  
  * Uses the Ghost Admin API to update the post.
  
  # Deploy to Netlify!
  [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/cathysarisky/podcast-labeler)
  
# ToDo:
  * Improve security.  Respond to receiving a webhook call by pulling the post body from the Ghost API, instead of trusting the webhook to be correct and/or use a webhook secret (new since I wrote this).  (Reduces the webhook to a trigger, not a source of information to be acted on at the Admin level.)

# Need support?
  * You can find me over at [Spectral Web Services](https://www.spectralwebservices.com) and I'm for hire!

# Want to support me?
  * Yes, please.  Here's my [Github Sponsors Page](https://github.com/sponsors/cathysarisky)
