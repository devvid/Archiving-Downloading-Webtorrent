/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function() {

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return;
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```
  const WebTorrent = require('webtorrent-hybrid');
  const client = new WebTorrent();
  sails.webtorrent = client;

  sails.webtorrent.on('error', function (err) {
    sails.log.error(err);
  })

  /**
   * Loading the torrent files into 'WebTorrent' ready to seed.
   * This seems not to work, might remove.
   */
  const fse = require('fs-extra');
  const prefix = `./torrent/`;
  sails.log.info(`Preparing to seed files for users. ${sails.webtorrent.torrents.length}`);
  const torrents = await fse.readdirSync(prefix);
  sails.log.info(`Please Wait...`);
  /**
   * Add the existing torrents back into the sytem.
   * This feature does not seem to work as predicted. It wont continue seeded based on the already local files.
   */
  for(var i = 0; i < torrents.length; i++) {
    if (torrents[i] == ".gitignore") return;
    sails.webtorrent.add(prefix+torrents[i]);
  }
  sails.log.info(`Avaliable seeding torrents ${sails.webtorrent.torrents.length}`);

};