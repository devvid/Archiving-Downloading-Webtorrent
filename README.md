# Archive & Download
a [Sails v1](https://sailsjs.com) application built to showcase the Webtorrent.io plugin. 
Submit urls for archiving by downloading the html content, taking a screenshot and storing the file hash files.
[App Homepage](http://www.devvid.com/webtorrent-archive-download/) - Blog post

## Installing
* Clone project to a local directory
* Install the project dependencies
* Modify the database settings to reflect local configuration
```
npm install
```
## Starting
* Start a MongoDB database instance
* Start the application using nodemon or lift
```
sails lift
```

## Built With
* [sails](https://sailsjs.co) - The web framework used
* [webtorrent](https://instant.io/) - Torrents framework used
* [Puppeteer](https://github.com/GoogleChrome/puppeteer) - Google Chrome web engine used for page rendering for screenshot and html grab

## Known issues
Application functions best when used with webRTC torrent clients such as instant.io, native desktop torrent clients do not seem to download hosted files.

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

### Version info

This app was originally generated on Sun Feb 24 2019 using Sails v1.1.0.
