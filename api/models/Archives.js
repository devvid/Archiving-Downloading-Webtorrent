/**
 * Archive.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    website_url: {
      type: 'string',
      description: 'The website url to archive.'
    },
    website_domain: {
      type: 'string',
      description: 'The base website domain.'
    },
    torrent_link: {
      type: 'string',
      defaultsTo: 'tbd',
      description: 'The magnet url for the torrent to download the archive.'
    },
    image_name: {
      type: 'string',
      description: 'The file name of the screenshot image.'
    },
    image_hash: {
      type: 'string',
      description: 'The Hash SHA256 of the image.'
    },
    html_name: {
      type: 'string',
      description: 'The file name of the HTML document.'
    },
    html_hash: {
      type: 'string',
      description: 'The Hash SHA256 of the html document.'
    },
    time_to_archive: {
      type: 'number',
      description: 'The delta between in miliseconds between the start and end time of archiving the website.'
    },
    function_version: {
      type: 'number',
      defaultsTo: 100,
      description: 'The version of the "archive-website" script. This will help identify when the model was saved and which code was used to make it.'
    },
    request_ip_address: {
      type: 'string',
      description: 'The IP Address of the requester(user).'
    },
    view_counter: {
      type: 'number',
      description: 'This is a simple tick which incrases on site vists.'
    }

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },

};

