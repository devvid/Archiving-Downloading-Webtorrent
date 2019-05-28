module.exports = {


  friendlyName: 'Archive website',


  description: 'Perform the function of Archiving the website selected',


  inputs: {
    website: {
      type: 'string',
      description: 'The website url in string format.'
    },
    wait: {
      type: 'number',
      description: 'Tell the function to wait for a little while for the page to load.'
    }
  },


  exits: {

  },


  fn: async function (inputs, exits) {
    const version = 100;
    const puppeteer = require('puppeteer');
    const fse = require('fs-extra');
    const crypto = require('crypto');
    const sha256 =  crypto.createHash('sha256');
    const prefixDomain = 'http://localhost';
    const prefix = 'tmp'; 
    const datetime = Date.now();

    const hash = sha256.update(inputs.website).digest('hex');

    /**
     * Return if the element is empty
     */
    if(inputs.website == "") return this.res.redirect('/');

    /**
     * Check to see if the link is and actual url format
     */
    const expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    const regexURL = new RegExp(expression);
    if(!inputs.website.match(regexURL)) return this.res.redirect('/');

    /**
     * Check the input element with the list of regular expressions loaded from a local text file.
     * The list includes domains which are not allowed, or certain pages, url options, etc.
     */
    const text = fse.readFileSync("black-list.txt").toString('utf-8');
    const blacklist = text.split("\n");
    for(var i = 0; i < blacklist.length; i++){
      var exp = new RegExp(blacklist[i]);
      if(exp.test(inputs.website)) {
        console.log("URL has been blocked based on meeting the following expression");
        console.log(exp);
        return exits.success("Web address is not allowed.");
      }
    }
    /**
     * Read the website element using a html render. We will use a open source chrome plugin, no video codecs in the open source version.
     * - Raw HTML, Static files
     */
    const browser = await puppeteer.launch({defaultViewport: {width: 1920, height: 1080, isMobile: false}, headless: true});
    const page = await browser.newPage();
    await page.goto(inputs.website);
    //await fse.mkdirSync(`${prefix}/${hash}-${datetime}`)
    await fse.outputFile(`${prefix}/${hash}-${datetime}-index.html`, await page.content());
    

    /**
     * Snap a picture of the website. JPEG or PNG
     */
    await page.screenshot({path: `${prefix}/${hash}-${datetime}.png`, fullPage: true});

    /**
     * Calculating the SHA Hash of the files.
     */
    var get_hash_image = new Promise(function(resolve, reject) {
      fse.createReadStream(`${prefix}/${hash}-${datetime}.png`).pipe(crypto.createHash('sha256').setEncoding('hex')).on('finish', function () {
        resolve(this.read()); //the hash
      })
    });
    var get_hash_html  = new Promise(function(resolve, reject) {
      fse.createReadStream(`${prefix}/${hash}-${datetime}-index.html`).pipe(crypto.createHash('sha256').setEncoding('hex')).on('finish', function () {
        resolve(this.read()); //the hash
      })
    });
    //while(hash_image.length < 1 && hash_html.length < 1);
    var hash_image = await get_hash_image;
    var hash_html  = await get_hash_html;

    /**
     * Save infomation to the database.
     */
    var hostname = await sails.helpers.extractHostname(inputs.website);
    console.log(hostname);
    var createdArchive = await Archives.create({
      website_url: inputs.website,
      website_domain: hostname,
      image_name: `${hash}-${datetime}.png`,
      image_hash: hash_image,
      html_name: `${hash}-${datetime}-index.html`,
      html_hash: hash_html,
      time_to_archive: Date.now() - datetime,
      function_version: version,
      request_ip_address: this.req.ip
    }).fetch();

    /**
     * Generate/prep the META Data for the website folder.
     */
    const readme = `
${prefixDomain}/\r\n
${prefixDomain}/website/${createdArchive.id}\r\n
Url: ${inputs.website}\r\n
Created: ${new Date().toUTCString()} UTC\r\n
Screenshot File: ${hash}-${datetime}.png\r\n
Screenshot sha256: ${hash_image.toUpperCase()}\r\n
HTML File: ${hash}-${datetime}-index.html\r\n
HTML sha256: ${hash_html.toUpperCase()}\r\n
    `;
    await fse.outputFile(`${prefix}/${hash}-${datetime}-readme.txt`, readme);

    /**
     * Save infomation into containor for Torrent
     * - Save the HTML, JS, CSS & Static Content of the website
     * - PNG or JPEG Picture
     * - Readme File  
     */
    var items = [
      process.cwd()+`/${prefix}/${hash}-${datetime}.png`,
      process.cwd()+`/${prefix}/${hash}-${datetime}-index.html`,
      process.cwd()+`/${prefix}/${hash}-${datetime}-readme.txt`
    ]
    var seedFunction = new Promise(function(resolve, reject) {
      sails.webtorrent.seed(items, function (torrent) {
        resolve(torrent); //the Magnet URL
      });
    });
    var torrent = await seedFunction;
    await Archives.update({id: createdArchive.id}).set({torrent_link: torrent.magnetURI});
    await fse.writeFileSync(`./torrent/${hash}-${datetime}.torrent`, torrent.torrentFile);

    console.log(inputs.website);
    console.log('Client is seeding ' + torrent.magnetURI);

    // All done.
    await browser.close();
    return this.res.redirect(`/view/${createdArchive.id}`);

  }

};